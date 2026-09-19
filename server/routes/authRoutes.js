import { Router } from "express";
import {
  signup,
  verifyEmail,
  login,
  refresh,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiters.js";

const router = Router();

// Apply auth rate limiter to all auth routes
router.use(authLimiter);

// Public Authentication Routes
router.post("/signup", signup);
router.get("/verify-email", verifyEmail);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected Authentication Routes
router.get("/me", requireAuth, getMe);

export default router;
