import crypto from "crypto";

/**
 * Extracts normalized client IP from request headers or socket
 */
export const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const ip = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : forwarded[0];
    if (ip) return ip;
  }
  return req.ip || req.socket?.remoteAddress || "127.0.0.1";
};

/**
 * Generates a deterministic HMAC-SHA256 hash of the IP address with a server salt
 * Raw IP is never stored or logged
 */
export const hashIp = (ip) => {
  const secret = process.env.IP_HASH_SECRET || "linkhub_super_secret_ip_hash_salt_2026";
  return crypto.createHmac("sha256", secret).update(ip || "127.0.0.1").digest("hex");
};
