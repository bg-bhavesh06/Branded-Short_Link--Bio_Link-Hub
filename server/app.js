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

// 1. CORS configuration
const clientUrl = process.env.CLIENT_URL;
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        !clientUrl ||
        origin === clientUrl ||
        origin.endsWith(".vercel.app") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1")
      ) {
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

module.exports = app;
