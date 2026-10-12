const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const AUTH_COOKIE_NAME = "authToken";
const LEGACY_COOKIES = ["accessToken", "refreshToken"];

/**
 * Resolve JWT Secret securely.
 * Fails safely if required production secret is missing. Never uses a hardcoded fallback in production.
 */
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
  if (process.env.NODE_ENV === "production" && !secret) {
    throw new Error(
      "FATAL: JWT_SECRET environment variable is required in production mode. Refusing to run without a secret."
    );
  }
  return secret || "default_jwt_secret_linkhub_dev";
};

/**
 * SHA-256 hash helper for opaque tokens (verification, reset tokens)
 */
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Generate cryptographically secure random token string
 */
const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

/**
 * Extract and validate MongoDB user ID from user document or object
 */
const extractUserId = (user) => {
  if (!user) {
    throw new Error("Cannot generate token: user information is required");
  }

  const rawId =
    typeof user === "string" || user instanceof String
      ? user.toString()
      : user._id
      ? user._id.toString()
      : user.userId
      ? user.userId.toString()
      : user.id
      ? user.id.toString()
      : null;

  if (!rawId || typeof rawId !== "string" || !rawId.trim()) {
    throw new Error("Cannot generate token: valid user ID is required");
  }

  const trimmedId = rawId.trim();
  if (!/^[0-9a-fA-F]{24}$/.test(trimmedId)) {
    throw new Error("Cannot generate token: user ID must be a valid 24-character hex identifier");
  }

  return trimmedId;
};

const DEFAULT_EXPIRY_DAYS = 7;
const DEFAULT_EXPIRES_IN = `${DEFAULT_EXPIRY_DAYS}d`;
const DEFAULT_MAX_AGE_MS = DEFAULT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

/**
 * Resolve unified JWT expiresIn string and cookie maxAge in ms.
 * Ensures JWT expiry and cookie maxAge are always in sync.
 */
const getAuthExpiryConfig = () => {
  const configured = (process.env.JWT_EXPIRES_IN || "").trim();
  if (!configured) {
    return { expiresIn: DEFAULT_EXPIRES_IN, maxAgeMs: DEFAULT_MAX_AGE_MS };
  }

  // Parse supported time formats: e.g. "7d", "1d", "12h", "30m"
  const match = configured.match(/^(\d+)([dhm])$/i);
  if (!match) {
    return { expiresIn: DEFAULT_EXPIRES_IN, maxAgeMs: DEFAULT_MAX_AGE_MS };
  }

  const count = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multiplier = unit === "d" ? 86400000 : unit === "h" ? 3600000 : 60000;
  return {
    expiresIn: configured,
    maxAgeMs: count * multiplier,
  };
};

/**
 * Generate single 7-day JWT Authentication Token
 */
const generateAuthToken = (user) => {
  const secret = getJwtSecret();
  const { expiresIn } = getAuthExpiryConfig();
  const userId = extractUserId(user);

  return jwt.sign(
    {
      userId,
    },
    secret,
    { expiresIn }
  );
};

/**
 * Verify 7-day JWT Authentication Token
 */
const verifyAuthToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};

/**
 * Set single httpOnly 7-day auth cookie on HTTP response.
 * Clears legacy accessToken and refreshToken cookies so obsolete cookies cannot collide.
 */
const setAuthCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === "production";
  const { maxAgeMs } = getAuthExpiryConfig();

  // Unified HTTP-Only Auth Cookie
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeMs,
  });

  // Clear legacy tokens if present
  const clearOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  };
  LEGACY_COOKIES.forEach((cookieName) => {
    res.clearCookie(cookieName, clearOptions);
  });
};

/**
 * Clear httpOnly auth cookie and any legacy cookies
 */
const clearAuthCookie = (res) => {
  const isProd = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  };

  res.clearCookie(AUTH_COOKIE_NAME, options);
  LEGACY_COOKIES.forEach((cookieName) => {
    res.clearCookie(cookieName, options);
  });
};

module.exports = {
  AUTH_COOKIE_NAME,
  hashToken,
  generateRandomToken,
  extractUserId,
  getJwtSecret,
  generateAuthToken,
  verifyAuthToken,
  setAuthCookie,
  clearAuthCookie,
  getAuthExpiryConfig,
  // Alias for backward compatibility if imported by legacy name
  setAuthCookies: setAuthCookie,
  clearAuthCookies: clearAuthCookie,
};
