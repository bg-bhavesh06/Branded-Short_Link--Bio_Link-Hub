const { verifyAuthToken } = require("../utils/tokens");

/**
 * Authentication Middleware
 * Validates httpOnly 7-day authToken cookie and attaches user ID to req.user
 */
const requireAuth = (req, res, next) => {
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in.",
    });
  }

  try {
    const decoded = verifyAuthToken(token);

    if (
      !decoded ||
      !decoded.userId ||
      typeof decoded.userId !== "string" ||
      !/^[0-9a-fA-F]{24}$/.test(decoded.userId.trim())
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token: missing or invalid user identity. Please log in again.",
      });
    }

    req.user = {
      userId: decoded.userId.trim(),
    };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid authentication token. Please log in again.",
    });
  }
};

module.exports = {
  requireAuth,
};
