const { Router } = require("express");
const {
  signup,
  verifyEmail,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const { authLimiter, passwordResetLimiter } = require("../middleware/rateLimiters");

const router = Router();

// Apply auth rate limiter to all auth routes
router.use(authLimiter);

// Public Authentication Routes
router.post("/signup", signup);
router.get("/verify-email", verifyEmail);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/verify-otp", passwordResetLimiter, verifyOtp);
router.post("/reset-password", passwordResetLimiter, resetPassword);

// Protected Authentication Routes
router.get("/me", requireAuth, getMe);

module.exports = router;
