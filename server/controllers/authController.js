const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { User, BioProfile } = require("../models/index");
const { sendPasswordResetOtpEmail } = require("../utils/emailService");
const {
  generateAuthToken,
  generateRandomToken,
  hashToken,
  setAuthCookie,
  clearAuthCookie,
} = require("../utils/tokens");

const MAX_OTP_ATTEMPTS = 5;

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new user, provision bio profile, and issue 7-day JWT auth cookie
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

    // 4. Hash password with bcryptjs (10 rounds)
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

    // 8. Generate single 7-day JWT Authentication Token
    const authToken = generateAuthToken(user);

    // 9. Set single HTTP-Only cookie (7 days)
    setAuthCookie(res, authToken);

    // 10. Return safe response with authenticated user
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
 * @desc    Authenticate user, generate single 7-day JWT in httpOnly cookie
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

    // 2. Compare password with bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // 3. Generate single 7-day JWT Authentication Token
    const authToken = generateAuthToken(user);

    // 4. Set single httpOnly cookie
    setAuthCookie(res, authToken);

    // 5. Return safe response without tokens in JSON body
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
 * @route   POST /api/v1/auth/logout
 * @desc    Clear authentication cookie
 * @access  Public
 */
const logout = async (req, res, next) => {
  try {
    clearAuthCookie(res);

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
    const userId = req.user?.userId;
    if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: valid user identity required.",
      });
    }

    const user = await User.findById(userId);

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
/**
 * Validate reset OTP with expiry, atomic attempt limiting, timing safety, and replay protection
 */
const clearResetChallenge = async (user) => {
  if (user._id && typeof User.updateOne === "function") {
    await User.updateOne(
      { _id: user._id },
      { $unset: { passwordResetTokenHash: 1, passwordResetExpiresAt: 1, passwordResetAttempts: 1 } }
    );
  }
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  user.passwordResetAttempts = undefined;
};

const validateResetChallenge = async (user, otp) => {
  if (!user || !user.passwordResetTokenHash || !user.passwordResetExpiresAt) {
    return { valid: false, status: 400, message: "Invalid or expired OTP code." };
  }

  if (user.passwordResetExpiresAt < new Date()) {
    await clearResetChallenge(user);
    return { valid: false, status: 400, message: "OTP code has expired. Please request a new one." };
  }

  if ((user.passwordResetAttempts || 0) >= MAX_OTP_ATTEMPTS) {
    await clearResetChallenge(user);
    return { valid: false, status: 429, message: "Too many failed attempts. This verification code has been invalidated. Please request a new one." };
  }

  const providedHash = hashToken(otp.toString().trim());
  const targetHash = user.passwordResetTokenHash;
  const isMatch =
    providedHash.length === targetHash.length &&
    crypto.timingSafeEqual(Buffer.from(providedHash), Buffer.from(targetHash));

  if (!isMatch) {
    let attempts = (user.passwordResetAttempts || 0) + 1;
    if (user._id && typeof User.findOneAndUpdate === "function") {
      const query = User.findOneAndUpdate(
        {
          _id: user._id,
          passwordResetTokenHash: targetHash,
          passwordResetExpiresAt: { $gt: new Date() },
          passwordResetAttempts: { $lt: MAX_OTP_ATTEMPTS },
        },
        { $inc: { passwordResetAttempts: 1 } },
        { new: true }
      );
      const updated = typeof query?.select === "function"
        ? await query.select("+passwordResetAttempts")
        : await query;

      if (updated && updated.passwordResetAttempts !== undefined) {
        attempts = updated.passwordResetAttempts;
      } else if (!updated) {
        await clearResetChallenge(user);
        return { valid: false, status: 429, message: "Too many failed attempts. This verification code has been invalidated. Please request a new one." };
      }
    }
    user.passwordResetAttempts = attempts;
    if (attempts >= MAX_OTP_ATTEMPTS) {
      await clearResetChallenge(user);
      return { valid: false, status: 429, message: "Too many failed attempts. This verification code has been invalidated. Please request a new one." };
    }
    return { valid: false, status: 400, message: "Invalid OTP code. Please check your email." };
  }

  return { valid: true };
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email?.trim()) return res.status(400).json({ success: false, message: "Email address is required." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Please enter a valid registered email address.",
      });
    }

    const realOtp = crypto.randomInt(100000, 1000000).toString();
    user.passwordResetTokenHash = hashToken(realOtp);
    user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    user.passwordResetAttempts = 0;
    await user.save();

    try {
      await sendPasswordResetOtpEmail(user.email, realOtp);
    } catch (err) {
      console.error("SMTP error:", err.message);
    }

    return res.status(200).json({
      success: true,
      message: "A 6-digit OTP verification code has been sent to your Gmail address.",
    });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email?.trim() || !otp?.trim()) return res.status(400).json({ success: false, message: "Email and 6-digit OTP code are required." });

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select("+passwordResetTokenHash +passwordResetExpiresAt +passwordResetAttempts");

    const check = await validateResetChallenge(user, otp);
    if (!check.valid) return res.status(check.status).json({ success: false, message: check.message });

    return res.status(200).json({ success: true, message: "OTP code verified successfully." });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, otp, password, email } = req.body;
    const otpToVerify = (otp || token || "").toString().trim();
    if (!otpToVerify || !password) return res.status(400).json({ success: false, message: "Verification code and new password are required." });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters long." });

    const query = email?.trim()
      ? { email: email.toLowerCase().trim() }
      : { passwordResetTokenHash: hashToken(otpToVerify) };

    const user = await User.findOne(query)
      .select("+passwordResetTokenHash +passwordResetExpiresAt +passwordResetAttempts");

    const check = await validateResetChallenge(user, otpToVerify);
    if (!check.valid) return res.status(check.status).json({ success: false, message: check.message });

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

    // Atomic Compare-And-Swap (CAS): Consumes token and updates password in a single atomic DB operation
    let consumedUser = null;
    if (user._id && typeof User.findOneAndUpdate === "function") {
      consumedUser = await User.findOneAndUpdate(
        {
          _id: user._id,
          passwordResetTokenHash: user.passwordResetTokenHash,
          passwordResetExpiresAt: { $gt: new Date() },
          passwordResetAttempts: { $lt: MAX_OTP_ATTEMPTS },
        },
        {
          $set: { password: hashedPassword },
          $unset: {
            passwordResetTokenHash: 1,
            passwordResetExpiresAt: 1,
            passwordResetAttempts: 1,
          },
        },
        { new: true }
      );
    } else {
      user.password = hashedPassword;
      await clearResetChallenge(user);
      consumedUser = user;
    }

    if (!consumedUser) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP code." });
    }

    clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please log in with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  verifyEmail,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
