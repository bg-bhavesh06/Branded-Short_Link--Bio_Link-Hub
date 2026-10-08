const { Router } = require("express");

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Branded linkHub API is running",
  });
});

module.exports = router;
