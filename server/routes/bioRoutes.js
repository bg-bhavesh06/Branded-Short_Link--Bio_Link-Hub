const { Router } = require("express");
const { getMyBio, upsertMyBio, deleteMyBio, getPublicBio } = require("../controllers/bioController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

// 1. Authenticated User Routes (MUST be defined before /:username)
router.get("/me", requireAuth, getMyBio);
router.put("/me", requireAuth, upsertMyBio);
router.delete("/me", requireAuth, deleteMyBio);
router.delete("/", requireAuth, deleteMyBio);
router.post("/delete", requireAuth, deleteMyBio);

// 2. Public Bio Profile Route
router.get("/:username", getPublicBio);

module.exports = router;
