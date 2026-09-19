/**
 * Lightweight User-Agent Device Type Detector
 * Detection order: Tablet -> Mobile -> Desktop
 * Returns exactly one of: "Tablet", "Mobile", "Desktop"
 */
export const detectDevice = (userAgent = "") => {
  if (!userAgent || typeof userAgent !== "string") {
    return "Desktop";
  }

  const ua = userAgent.toLowerCase();

  // 1. Tablet detection (must be before mobile to catch iPads/Android tablets)
  if (/tablet|ipad|playbook|silk|kindle|android(?!.*mobi)/i.test(ua)) {
    return "Tablet";
  }

  // 2. Mobile detection
  if (/mobile|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini|windows phone/i.test(ua)) {
    return "Mobile";
  }

  // 3. Desktop fallback
  return "Desktop";
};
