import { Router } from "express";
import {
  createShortLink,
  getUserLinks,
  deleteShortLink,
} from "../controllers/linkController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { linkCreationLimiter } from "../middleware/rateLimiters.js";

const router = Router();

// Protected routes (linkCreationLimiter shields creation endpoint)
router.post("/", linkCreationLimiter, requireAuth, createShortLink);
router.get("/", requireAuth, getUserLinks);
router.delete("/:id", requireAuth, deleteShortLink);

export default router;
