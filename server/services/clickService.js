const Click = require("../models/Click");
const { getClientIp, hashIp } = require("../utils/ipHash");
const { detectDevice } = require("../utils/deviceDetector");

/**
 * Asynchronously logs a redirect click event to Click collection
 * Telemetry failures do not disrupt or delay the HTTP 302 redirect
 */
const recordClick = async (req, shortLinkId) => {
  try {
    const rawIp = getClientIp(req);
    const ipHash = hashIp(rawIp);
    const referrer = req.get("referer") || req.get("referrer") || "";
    const userAgent = req.get("user-agent") || "";
    const deviceType = detectDevice(userAgent);

    await Click.create({
      shortLink: shortLinkId,
      timestamp: new Date(),
      referrer: referrer.trim(),
      deviceType,
      ipHash,
    });
  } catch (error) {
    console.error("Async click telemetry error:", error.message);
  }
};

module.exports = {
  recordClick,
};
