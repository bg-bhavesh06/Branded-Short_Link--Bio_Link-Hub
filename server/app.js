import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import bioRoutes from "./routes/bioRoutes.js";
import { redirectShortLink } from "./controllers/linkController.js";
import { redirectLimiter } from "./middleware/rateLimiters.js";
import { errorHandler } from "./middleware/errorMiddleware.js";

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

// 2. Request parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

export default app;
