const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const ACCESS_COOKIE_NAME = "accessToken";
const REFRESH_COOKIE_NAME = "refreshToken";

/**
 * SHA-256 hash helper for opaque tokens (verification, reset, refresh tokens)
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
 * Generate 15-minute JWT Access Token
 */
const generateAccessToken = (user) => {
  const secret = process.env.JWT_ACCESS_SECRET || "default_jwt_access_secret_linkhub_dev";
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";

  return jwt.sign(
    {
      userId: user._id ? user._id.toString() : user.id,
    },
    secret,
    { expiresIn }
  );
};

/**
 * Generate 7-day JWT Refresh Token
 */
const generateRefreshToken = (user) => {
  const secret = process.env.JWT_REFRESH_SECRET || "default_jwt_refresh_secret_linkhub_dev";
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

  return jwt.sign(
    {
      userId: user._id ? user._id.toString() : user.id,
      jti: crypto.randomUUID(),
    },
    secret,
    { expiresIn }
  );
};

/**
 * Verify Access Token
 */
const verifyAccessToken = (token) => {
  const secret = process.env.JWT_ACCESS_SECRET || "default_jwt_access_secret_linkhub_dev";
  return jwt.verify(token, secret);
};

/**
 * Verify Refresh Token
 */
const verifyRefreshToken = (token) => {
  const secret = process.env.JWT_REFRESH_SECRET || "default_jwt_refresh_secret_linkhub_dev";
  return jwt.verify(token, secret);
};

/**
 * Set httpOnly auth cookies on HTTP response
 */
const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === "production";

  // Access Token Cookie (15 mins)
  res.cookie(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 minutes in ms
  });

  // Refresh Token Cookie (7 days)
  if (refreshToken) {
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });
  }
};

/**
 * Clear httpOnly auth cookies
 */
const clearAuthCookies = (res) => {
  const isProd = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  };

  res.clearCookie(ACCESS_COOKIE_NAME, options);
  res.clearCookie(REFRESH_COOKIE_NAME, options);
};

module.exports = {
  hashToken,
  generateRandomToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
};
