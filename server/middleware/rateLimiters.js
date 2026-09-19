import rateLimit from "express-rate-limit";

/**
 * Rate limiter for short link creation (POST /api/v1/links)
 * 30 requests per 15 minutes per IP
 */
export const linkCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many link creation requests. Please try again later.",
  },
});

/**
 * Rate limiter for public short link redirects (GET /r/:shortCode)
 * 100 requests per 1 minute per IP
 */
export const redirectLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many redirect requests. Please try again later.",
  },
});

/**
 * Modest rate limiter for authentication endpoints
 * 50 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication requests. Please try again later.",
  },
});
