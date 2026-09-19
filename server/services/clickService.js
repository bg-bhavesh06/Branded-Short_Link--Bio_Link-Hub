import Click from "../models/Click.js";
import { getClientIp, hashIp } from "../utils/ipHash.js";
import { detectDevice } from "../utils/deviceDetector.js";

/**
 * Asynchronously logs a redirect click event to Click collection
 * Telemetry failures do not disrupt or delay the HTTP 302 redirect
 */
export const recordClick = async (req, shortLinkId) => {
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
