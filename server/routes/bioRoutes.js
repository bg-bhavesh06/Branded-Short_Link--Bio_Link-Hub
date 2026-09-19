import { Router } from "express";
import { getMyBio, upsertMyBio, getPublicBio } from "../controllers/bioController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// 1. Authenticated User Routes (MUST be defined before /:username)
router.get("/me", requireAuth, getMyBio);
router.put("/me", requireAuth, upsertMyBio);

// 2. Public Bio Profile Route
router.get("/:username", getPublicBio);

export default router;
