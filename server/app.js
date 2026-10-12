const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const linkRoutes = require("./routes/linkRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const bioRoutes = require("./routes/bioRoutes");
const { redirectShortLink } = require("./controllers/linkController");
const { redirectLimiter } = require("./middleware/rateLimiters");
const { errorHandler } = require("./middleware/errorMiddleware");
const { connectDB } = require("./config/db");

const app = express();

// Security headers (compatible with cross-origin assets/APIs)
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// 1. CORS configuration: explicit trusted allowlist only
const getAllowedOrigins = () => {
  const isProd = process.env.NODE_ENV === "production";
  const origins = new Set();
  if (process.env.CLIENT_URL) origins.add(process.env.CLIENT_URL.trim());
  if (process.env.PUBLIC_APP_URL) origins.add(process.env.PUBLIC_APP_URL.trim());
  origins.add("https://branded-linkhub.vercel.app");

  if (!isProd) {
    origins.add("http://localhost:5173");
    origins.add("http://localhost:5000");
    origins.add("http://127.0.0.1:5173");
    origins.add("http://127.0.0.1:5000");
  }
  return origins;
};

const isOriginAllowed = (origin) => {
  if (!origin) return true; // Server-to-server or non-browser requests
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd && (/^https?:\/\/localhost(:\d+)?$/.test(origin) || /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin))) {
    return true;
  }
  return getAllowedOrigins().has(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed: " + origin));
    },
    credentials: true,
  })
);

// 2. Request parsing middlewares (10mb limit for base64 avatar images)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Database connection middleware for serverless & traditional servers
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB Connection Middleware Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed. Please try again.",
    });
  }
});

// 3. Public Redirect Endpoint (Direct 302 Found with rate limiting and async telemetry)
app.get("/r/:shortCode", redirectLimiter, redirectShortLink);

// 4. API Versioning & Route Registration
app.use("/api/v1", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/links", linkRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/bio", bioRoutes);

// 4. Catch-all 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// 5. Centralized Error Handling Middleware
app.use(errorHandler);
app.isOriginAllowed = isOriginAllowed;

module.exports = app;
