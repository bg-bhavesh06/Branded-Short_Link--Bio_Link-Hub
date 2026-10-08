const bcrypt = require("bcryptjs");
const { User, BioProfile, RefreshToken } = require("../models/index");
const { sendPasswordResetOtpEmail } = require("../utils/emailService");
const {
  generateAccessToken,
  generateRefreshToken,
  generateRandomToken,
  hashToken,
  verifyRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} = require("../utils/tokens");

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new user and generate simulated email verification token
 * @access  Public
 */
const signup = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    // 1. Basic validation
    if (!name?.trim() || !username?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, username, email, and password.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.toLowerCase().trim().replace(/\s+/g, "");

    // 2. Check duplicate email
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // 3. Check duplicate username
    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken. Please choose another username.",
      });
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Generate simulated email verification token (valid for 24h)
    const rawVerificationToken = generateRandomToken(32);
    const hashedVerificationToken = hashToken(rawVerificationToken);
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 6. Create user record
    const user = await User.create({
      name: name.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationTokenHash: hashedVerificationToken,
      emailVerificationExpiresAt: verificationExpiresAt,
    });

    // 7. Automatically provision default BioProfile for user
    await BioProfile.create({
      user: user._id,
      username: user.username,
      displayName: user.name,
      bio: "Welcome to my Branded linkHub bio page! 🚀",
      socialLinks: [],
      bioLinks: [],
      theme: "Minimal Light",
      templateId: "creator",
      jobTitle: "",
      company: "",
      pronouns: "",
      contactMethods: [],
      customization: {
        buttonStyle: "rounded",
        layoutVariant: "standard",
        backgroundStyle: "solid",
        headerColor: "",
      },
    });

    // 8. Generate JWT Access & Refresh Tokens for automatic login
    const tokenPayload = { userId: user._id, email: user.email, username: user.username };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // 9. Save refresh token to DB
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({
      user: user._id,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshTokenExpiresAt,
    });

    // 10. Set HTTP-Only cookies
    setAuthCookies(res, accessToken, refreshToken);

    // 11. Return safe response with authenticated user
    return res.status(201).json({
      success: true,
      message: "User registered and logged in successfully.",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
      simulatedVerificationToken: rawVerificationToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/auth/verify-email
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify email address using verification token (Simulated flow)
 * @access  Public
 */
const verifyEmail = async (req, res, next) => {
  try {
    const token = req.query.token || req.body.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required.",
      });
    }

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      emailVerificationTokenHash: hashedToken,
      emailVerificationExpiresAt: { $gt: new Date() },
    }).select("+emailVerificationTokenHash +emailVerificationExpiresAt");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired email verification token.",
      });
    }

    // Mark verified and clear tokens
    user.isEmailVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpiresAt = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user, generate JWT access/refresh tokens in httpOnly cookies
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Find user and explicitly select password
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 3. Generate Access (15m) & Refresh (7d) Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 4. Store hashed refresh token in database for rotation tracking
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({
      user: user._id,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshExpiresAt,
    });

    // 5. Set httpOnly cookies
    setAuthCookies(res, accessToken, refreshToken);

    // 6. Return safe response without tokens in JSON body
    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh expired access token using httpOnly refresh token cookie (with rotation)
 * @access  Public (Cookie-based)
 */
const refresh = async (req, res, next) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;

    if (!rawRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required.",
      });
    }

    // 1. Verify JWT signature & lifetime
    let decoded;
    try {
      decoded = verifyRefreshToken(rawRefreshToken);
    } catch {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token. Please log in again.",
      });
    }

    // 2. Look up refresh session in database
    const tokenHash = hashToken(rawRefreshToken);
    const existingSession = await RefreshToken.findOne({
      tokenHash,
      user: decoded.userId,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!existingSession) {
      // Possible token reuse attempt: invalidate session and clear cookies
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        message: "Session expired or revoked. Please log in again.",
      });
    }

    // 3. Revoke previous refresh token (Rotation)
    existingSession.revokedAt = new Date();
    await existingSession.save();

    // 4. Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        message: "User account no longer exists.",
      });
    }

    // 5. Generate NEW access token and NEW refresh token
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // 6. Save new refresh token in DB
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({
      user: user._id,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: newExpiresAt,
    });

    // 7. Update cookies
    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({
      success: true,
      message: "Session refreshed successfully.",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Revoke current refresh session and clear authentication cookies
 * @access  Public
 */
const logout = async (req, res, next) => {
  try {
    const rawRefreshToken = req.cookies?.refreshToken;

    if (rawRefreshToken) {
      const tokenHash = hashToken(rawRefreshToken);
      await RefreshToken.findOneAndUpdate(
        { tokenHash, revokedAt: null },
        { revokedAt: new Date() }
      );
    }

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get currently authenticated user
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Generate simulated password reset token
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email?.trim()) return res.status(400).json({ success: false, message: "Email address is required." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ success: false, message: "Email Not Found!." });

    const realOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.passwordResetTokenHash = hashToken(realOtp);
    user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    try { await sendPasswordResetOtpEmail(user.email, realOtp); } catch (err) { console.error("SMTP error:", err.message); }

    return res.status(200).json({ success: true, message: "A 6-digit OTP verification code has been sent to your Gmail address." });
  } catch (error) { next(error); }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email?.trim() || !otp?.trim()) return res.status(400).json({ success: false, message: "Email and 6-digit OTP code are required." });

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      passwordResetTokenHash: hashToken(otp.toString().trim()),
      passwordResetExpiresAt: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired OTP code. Please check your Gmail." });
    return res.status(200).json({ success: true, message: "OTP code verified successfully." });
  } catch (error) { next(error); }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, otp, password } = req.body;
    const otpToVerify = (otp || token || "").toString().trim();
    if (!otpToVerify || !password) return res.status(400).json({ success: false, message: "OTP code and new password are required." });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });

    const user = await User.findOne({
      passwordResetTokenHash: hashToken(otpToVerify),
      passwordResetExpiresAt: { $gt: new Date() },
    }).select("+passwordResetTokenHash +passwordResetExpiresAt");

    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired OTP code." });

    user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    await RefreshToken.updateMany({ user: user._id, revokedAt: null }, { revokedAt: new Date() });
    clearAuthCookies(res);

    return res.status(200).json({ success: true, message: "Password reset successfully. Please log in with your new password." });
  } catch (error) { next(error); }
};

module.exports = {
  signup,
  verifyEmail,
  login,
  refresh,
  logout,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
