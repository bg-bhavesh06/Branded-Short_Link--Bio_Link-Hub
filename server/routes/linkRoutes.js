const { Router } = require("express");
const {
  createShortLink,
  getUserLinks,
  deleteShortLink,
} = require("../controllers/linkController");
const { requireAuth } = require("../middleware/authMiddleware");
const { linkCreationLimiter } = require("../middleware/rateLimiters");

const router = Router();

// Protected routes (linkCreationLimiter shields creation endpoint)
router.post("/", linkCreationLimiter, requireAuth, createShortLink);
router.get("/", requireAuth, getUserLinks);
router.delete("/:id", requireAuth, deleteShortLink);

module.exports = router;
