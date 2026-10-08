const { Router } = require("express");
const {
  getOverview,
  getClicksOverTime,
  getTopLinks,
  getTopReferrers,
  getDevices,
  getRecentClicks,
} = require("../controllers/analyticsController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = Router();

// All analytics routes require authentication
router.use(requireAuth);

router.get("/overview", getOverview);
router.get("/clicks-over-time", getClicksOverTime);
router.get("/top-links", getTopLinks);
router.get("/top-referrers", getTopReferrers);
router.get("/devices", getDevices);
router.get("/recent", getRecentClicks);

module.exports = router;
