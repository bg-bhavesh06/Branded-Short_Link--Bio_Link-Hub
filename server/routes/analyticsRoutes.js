import { Router } from "express";
import {
  getOverview,
  getClicksOverTime,
  getTopLinks,
  getTopReferrers,
  getDevices,
  getRecentClicks,
} from "../controllers/analyticsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

// All analytics routes require authentication
router.use(requireAuth);

router.get("/overview", getOverview);
router.get("/clicks-over-time", getClicksOverTime);
router.get("/top-links", getTopLinks);
router.get("/top-referrers", getTopReferrers);
router.get("/devices", getDevices);
router.get("/recent", getRecentClicks);

export default router;
