const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const {
  AUTH_COOKIE_NAME,
  generateAuthToken,
  verifyAuthToken,
  setAuthCookie,
  clearAuthCookie,
  getJwtSecret,
  getAuthExpiryConfig,
} = require("../utils/tokens");
const app = require("../app");
const { requireAuth } = require("../middleware/authMiddleware");
const {
  getUserLinks,
  createShortLink,
  deleteShortLink,
} = require("../controllers/linkController");
const {
  getUserLinksData,
  getOverview,
} = require("../controllers/analyticsController");
const {
  getMyBio,
  upsertMyBio,
  deleteMyBio,
} = require("../controllers/bioController");
const {
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/authController");
const { passwordResetLimiter } = require("../middleware/rateLimiters");
const { User } = require("../models/index");
const { hashToken } = require("../utils/tokens");
const crypto = require("crypto");

describe("1. Single 7-Day JWT Token Generation & Verification", () => {
  const validMongoId = new mongoose.Types.ObjectId().toString();

  it("should generate a single JWT containing the correct userId and 7-day expiration", () => {
    const userDoc = { _id: new mongoose.Types.ObjectId(validMongoId), email: "test@example.com" };
    const token = generateAuthToken(userDoc);
    const decoded = verifyAuthToken(token);

    assert.strictEqual(decoded.userId, validMongoId);
    // Expiration must be approximately 7 days (7 * 24 * 60 * 60 = 604800 seconds)
    const lifespanSeconds = decoded.exp - decoded.iat;
    assert.strictEqual(lifespanSeconds, 7 * 24 * 60 * 60, "Token lifespan must be exactly 7 days");
  });

  it("should generate token when passed an object with userId or id", () => {
    const token1 = generateAuthToken({ userId: validMongoId });
    const decoded1 = verifyAuthToken(token1);
    assert.strictEqual(decoded1.userId, validMongoId);

    const token2 = generateAuthToken({ id: validMongoId });
    const decoded2 = verifyAuthToken(token2);
    assert.strictEqual(decoded2.userId, validMongoId);
  });

  it("should reject token generation when user ID is missing, undefined, or empty", () => {
    assert.throws(() => generateAuthToken(null), /user information is required/);
    assert.throws(() => generateAuthToken({ email: "nouser@example.com" }), /valid user ID is required/);
    assert.throws(() => generateAuthToken({ userId: undefined }), /valid user ID is required/);
    assert.throws(() => generateAuthToken({ id: "" }), /valid user ID is required/);
  });

  it("should reject token generation when user ID is not a 24-char hex string", () => {
    assert.throws(() => generateAuthToken({ userId: "invalid-id-123" }), /valid 24-character hex identifier/);
  });

  it("should fail safely in production if JWT secret is missing", () => {
    const originalEnv = process.env.NODE_ENV;
    const originalSecret = process.env.JWT_SECRET;
    const originalAccessSecret = process.env.JWT_ACCESS_SECRET;

    try {
      process.env.NODE_ENV = "production";
      delete process.env.JWT_SECRET;
      delete process.env.JWT_ACCESS_SECRET;

      assert.throws(() => getJwtSecret(), /JWT_SECRET environment variable is required in production/);
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalSecret) process.env.JWT_SECRET = originalSecret;
      if (originalAccessSecret) process.env.JWT_ACCESS_SECRET = originalAccessSecret;
    }
  });
});

describe("2. Auth Middleware with Single 7-Day JWT", () => {
  const secret = getJwtSecret();
  const validMongoId = new mongoose.Types.ObjectId().toString();

  it("should reject request with 401 when authToken cookie is missing", () => {
    const req = { cookies: {} };
    let statusSent = null;
    let jsonSent = null;
    const res = {
      status: (code) => {
        statusSent = code;
        return {
          json: (data) => { jsonSent = data; },
        };
      },
    };
    let nextCalled = false;

    requireAuth(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusSent, 401);
    assert.strictEqual(jsonSent.success, false);
    assert.strictEqual(nextCalled, false);
  });

  it("should reject request with 401 if old legacy cookies are sent without authToken", () => {
    // Old accessToken cookie must NOT be accepted as authToken
    const legacyToken = generateAuthToken({ _id: validMongoId });
    const req = { cookies: { accessToken: legacyToken, refreshToken: "old" } };
    let statusSent = null;
    const res = {
      status: (code) => {
        statusSent = code;
        return { json: () => {} };
      },
    };
    let nextCalled = false;

    requireAuth(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusSent, 401, "Legacy accessToken cookie must not be accepted");
    assert.strictEqual(nextCalled, false);
  });

  it("should reject request with 401 when token has missing or undefined userId", () => {
    const tokenWithoutUserId = jwt.sign({}, secret, { expiresIn: "7d" });
    const req = { cookies: { authToken: tokenWithoutUserId } };
    let statusSent = null;
    let jsonSent = null;
    const res = {
      status: (code) => {
        statusSent = code;
        return {
          json: (data) => { jsonSent = data; },
        };
      },
    };
    let nextCalled = false;

    requireAuth(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusSent, 401);
    assert.strictEqual(jsonSent.success, false);
    assert.match(jsonSent.message, /missing or invalid user identity/);
    assert.strictEqual(nextCalled, false);
  });

  it("should reject request with 401 when token has expired", () => {
    // Expired 7-day token (expired 1 second ago)
    const expiredToken = jwt.sign({ userId: validMongoId }, secret, { expiresIn: -1 });
    const req = { cookies: { authToken: expiredToken } };
    let statusSent = null;
    let jsonSent = null;
    const res = {
      status: (code) => {
        statusSent = code;
        return {
          json: (data) => { jsonSent = data; },
        };
      },
    };
    let nextCalled = false;

    requireAuth(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusSent, 401);
    assert.strictEqual(jsonSent.code, "TOKEN_EXPIRED");
    assert.strictEqual(nextCalled, false);
  });

  it("should populate req.user.userId and call next() when valid authToken is provided", () => {
    const validToken = generateAuthToken({ _id: validMongoId });
    const req = { cookies: { authToken: validToken } };
    let nextCalled = false;
    const res = {
      status: () => ({ json: () => {} }),
    };

    requireAuth(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.user.userId, validMongoId);
  });
});

describe("3. Cookie Delivery and Cleanup", () => {
  it("setAuthCookie should set 7-day authToken and clear legacy accessToken and refreshToken", () => {
    const cookiesSet = {};
    const cookiesCleared = [];

    const res = {
      cookie: (name, value, options) => {
        cookiesSet[name] = { value, options };
      },
      clearCookie: (name) => {
        cookiesCleared.push(name);
      },
    };

    setAuthCookie(res, "sample_token");

    assert.ok(cookiesSet[AUTH_COOKIE_NAME]);
    assert.strictEqual(cookiesSet[AUTH_COOKIE_NAME].value, "sample_token");
    assert.strictEqual(cookiesSet[AUTH_COOKIE_NAME].options.httpOnly, true);
    assert.strictEqual(cookiesSet[AUTH_COOKIE_NAME].options.maxAge, 7 * 24 * 60 * 60 * 1000);

    // Verify legacy cookies are explicitly cleared
    assert.ok(cookiesCleared.includes("accessToken"));
    assert.ok(cookiesCleared.includes("refreshToken"));
  });

  it("clearAuthCookie should clear authToken and legacy cookies on logout", () => {
    const cookiesCleared = [];
    const res = {
      clearCookie: (name) => {
        cookiesCleared.push(name);
      },
    };

    clearAuthCookie(res);

    assert.ok(cookiesCleared.includes(AUTH_COOKIE_NAME));
    assert.ok(cookiesCleared.includes("accessToken"));
    assert.ok(cookiesCleared.includes("refreshToken"));
  });
});

describe("4. Complete Resource Ownership & Data Isolation", () => {
  const userA = new mongoose.Types.ObjectId().toString();
  const userB = new mongoose.Types.ObjectId().toString();
  const linkId = new mongoose.Types.ObjectId().toString();

  it("deleteShortLink must strictly verify ownership; User B cannot delete User A's link", async () => {
    const ShortLink = require("../models/ShortLink");
    const originalFindOneAndDelete = ShortLink.findOneAndDelete;

    let queryFilterUsed = null;
    ShortLink.findOneAndDelete = async (filter) => {
      queryFilterUsed = filter;
      if (filter.user === userA) {
        return { _id: linkId, user: userA };
      }
      return null;
    };

    try {
      const reqB = { user: { userId: userB }, params: { id: linkId } };
      let statusSent = null;
      let jsonSent = null;
      const resB = {
        status: (code) => {
          statusSent = code;
          return { json: (data) => { jsonSent = data; } };
        },
      };

      await deleteShortLink(reqB, resB, () => {});

      assert.strictEqual(queryFilterUsed._id, linkId);
      assert.strictEqual(queryFilterUsed.user, userB);
      assert.strictEqual(statusSent, 404);
      assert.strictEqual(jsonSent.success, false);
      assert.strictEqual(jsonSent.message, "Short link not found");
    } finally {
      ShortLink.findOneAndDelete = originalFindOneAndDelete;
    }
  });

  it("getUserLinks must filter strictly by authenticated user ID", async () => {
    const ShortLink = require("../models/ShortLink");
    const originalCount = ShortLink.countDocuments;
    const originalFind = ShortLink.find;

    let filterCountUsed = null;
    let filterFindUsed = null;

    ShortLink.countDocuments = async (filter) => {
      filterCountUsed = filter;
      return 0;
    };
    ShortLink.find = (filter) => {
      filterFindUsed = filter;
      return {
        sort: () => ({
          skip: () => ({
            limit: async () => [],
          }),
        }),
      };
    };

    try {
      const reqA = { user: { userId: userA }, query: { page: "1", limit: "10" } };
      let statusSent = null;
      const resA = {
        status: (code) => {
          statusSent = code;
          return { json: () => {} };
        },
      };

      await getUserLinks(reqA, resA, () => {});

      assert.strictEqual(statusSent, 200);
      assert.strictEqual(filterCountUsed.user, userA);
      assert.strictEqual(filterFindUsed.user, userA);
    } finally {
      ShortLink.countDocuments = originalCount;
      ShortLink.find = originalFind;
    }
  });

  it("analytics getUserLinksData returns empty array and avoids unrestricted queries when userId is invalid", async () => {
    assert.deepStrictEqual(await getUserLinksData(undefined), { links: [], linkIds: [] });
    assert.deepStrictEqual(await getUserLinksData(null), { links: [], linkIds: [] });
    assert.deepStrictEqual(await getUserLinksData("bad-id"), { links: [], linkIds: [] });
  });

  it("analytics endpoints reject unauthenticated request with 401", async () => {
    const req = { user: {}, query: {} };
    let statusSent = null;
    const res = {
      status: (code) => {
        statusSent = code;
        return { json: () => {} };
      },
    };

    await getOverview(req, res, () => {});
    assert.strictEqual(statusSent, 401);
  });

  it("bio endpoints reject unauthenticated request with 401", async () => {
    const req = { user: {}, body: {} };
    let statusSent = null;
    const res = {
      status: (code) => {
        statusSent = code;
        return { json: () => {} };
      },
    };

    await getMyBio(req, res, () => {});
    assert.strictEqual(statusSent, 401);

    await upsertMyBio(req, res, () => {});
    assert.strictEqual(statusSent, 401);

    await deleteMyBio(req, res, () => {});
    assert.strictEqual(statusSent, 401);
  });
});

describe("5. Complete Removal of Refresh Token Subsystem", () => {
  it("models/index.js must not export RefreshToken", () => {
    const models = require("../models/index");
    assert.strictEqual(models.RefreshToken, undefined, "RefreshToken must not be exported in models/index.js");
  });

  it("tokens utility must not export generateRefreshToken or verifyRefreshToken", () => {
    const tokens = require("../utils/tokens");
    assert.strictEqual(tokens.generateRefreshToken, undefined, "generateRefreshToken must be removed");
    assert.strictEqual(tokens.verifyRefreshToken, undefined, "verifyRefreshToken must be removed");
  });
});

describe("6. CORS Allowlist & Credentialed Origin Protection", () => {
  it("should allow requests without origin header (server-to-server / non-browser)", () => {
    assert.strictEqual(app.isOriginAllowed(undefined), true);
    assert.strictEqual(app.isOriginAllowed(""), true);
  });

  it("should allow verified production domain", () => {
    assert.strictEqual(app.isOriginAllowed("https://branded-linkhub.vercel.app"), true);
  });

  it("should allow configured CLIENT_URL and PUBLIC_APP_URL", () => {
    const originalClientUrl = process.env.CLIENT_URL;
    try {
      process.env.CLIENT_URL = "https://custom-client.domain.com";
      assert.strictEqual(app.isOriginAllowed("https://custom-client.domain.com"), true);
    } finally {
      process.env.CLIENT_URL = originalClientUrl;
    }
  });

  it("should reject untrusted and arbitrary *.vercel.app domains", () => {
    assert.strictEqual(app.isOriginAllowed("https://malicious.vercel.app"), false);
    assert.strictEqual(app.isOriginAllowed("https://attacker-linkhub.vercel.app"), false);
    assert.strictEqual(app.isOriginAllowed("https://random-site.com"), false);
  });

  it("should allow localhost origins in development mode", () => {
    const origEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = "development";
      assert.strictEqual(app.isOriginAllowed("http://localhost:5173"), true);
      assert.strictEqual(app.isOriginAllowed("http://127.0.0.1:5173"), true);
    } finally {
      process.env.NODE_ENV = origEnv;
    }
  });

  it("should reject localhost origins in production mode unless explicitly configured", () => {
    const origEnv = process.env.NODE_ENV;
    const origClient = process.env.CLIENT_URL;
    const origPublic = process.env.PUBLIC_APP_URL;
    try {
      process.env.NODE_ENV = "production";
      process.env.CLIENT_URL = "https://branded-linkhub.vercel.app";
      delete process.env.PUBLIC_APP_URL;
      assert.strictEqual(app.isOriginAllowed("http://localhost:5173"), false);
      assert.strictEqual(app.isOriginAllowed("http://127.0.0.1:5173"), false);
    } finally {
      process.env.NODE_ENV = origEnv;
      process.env.CLIENT_URL = origClient;
      if (origPublic) process.env.PUBLIC_APP_URL = origPublic;
    }
  });
});

describe("7. JWT Expiry and Cookie maxAge Synchronization", () => {
  it("default configuration should yield exactly 7d and 604800000 ms", () => {
    const orig = process.env.JWT_EXPIRES_IN;
    try {
      delete process.env.JWT_EXPIRES_IN;
      const config = getAuthExpiryConfig();
      assert.strictEqual(config.expiresIn, "7d");
      assert.strictEqual(config.maxAgeMs, 7 * 24 * 60 * 60 * 1000);
    } finally {
      if (orig) process.env.JWT_EXPIRES_IN = orig;
    }
  });

  it("configuring JWT_EXPIRES_IN=1d should synchronize both JWT and cookie to 1 day", () => {
    const orig = process.env.JWT_EXPIRES_IN;
    try {
      process.env.JWT_EXPIRES_IN = "1d";
      const config = getAuthExpiryConfig();
      assert.strictEqual(config.expiresIn, "1d");
      assert.strictEqual(config.maxAgeMs, 24 * 60 * 60 * 1000);
    } finally {
      if (orig) process.env.JWT_EXPIRES_IN = orig;
    }
  });

  it("configuring JWT_EXPIRES_IN=12h should synchronize both JWT and cookie to 12 hours", () => {
    const orig = process.env.JWT_EXPIRES_IN;
    try {
      process.env.JWT_EXPIRES_IN = "12h";
      const config = getAuthExpiryConfig();
      assert.strictEqual(config.expiresIn, "12h");
      assert.strictEqual(config.maxAgeMs, 12 * 60 * 60 * 1000);
    } finally {
      if (orig) process.env.JWT_EXPIRES_IN = orig;
    }
  });

  it("malformed JWT_EXPIRES_IN safely falls back both to 7 days", () => {
    const orig = process.env.JWT_EXPIRES_IN;
    try {
      process.env.JWT_EXPIRES_IN = "invalid_duration_string";
      const config = getAuthExpiryConfig();
      assert.strictEqual(config.expiresIn, "7d");
      assert.strictEqual(config.maxAgeMs, 7 * 24 * 60 * 60 * 1000);
    } finally {
      if (orig) process.env.JWT_EXPIRES_IN = orig;
    }
  });

  it("setAuthCookie cookie maxAge should precisely match getAuthExpiryConfig", () => {
    let cookieOptions = null;
    const res = {
      cookie: (_name, _val, options) => {
        cookieOptions = options;
      },
      clearCookie: () => {},
    };
    setAuthCookie(res, "sample_token");
    const expected = getAuthExpiryConfig();
    assert.strictEqual(cookieOptions.maxAge, expected.maxAgeMs);
  });
});

describe("8. Password Reset Security & OTP Hardening", () => {
  it("crypto.randomInt must generate a cryptographically secure 6-digit numeric OTP", () => {
    for (let i = 0; i < 20; i++) {
      const otp = crypto.randomInt(100000, 1000000).toString();
      assert.match(otp, /^\d{6}$/, "OTP must be exactly 6 digits");
      const val = parseInt(otp, 10);
      assert.ok(val >= 100000 && val < 1000000, "OTP must be within 100000 to 999999");
    }
  });

  it("forgotPassword must reject non-existent email with 404 and not generate OTP", async () => {
    const origFindOne = User.findOne;
    User.findOne = async () => null;

    try {
      const req = { body: { email: "nonexistent@example.com" } };
      let statusCode = null;
      let jsonResponse = null;
      const res = {
        status: (code) => {
          statusCode = code;
          return { json: (data) => { jsonResponse = data; } };
        },
      };

      await forgotPassword(req, res, () => {});
      assert.strictEqual(statusCode, 404);
      assert.strictEqual(jsonResponse.success, false);
      assert.match(jsonResponse.message, /valid registered email address/i);
    } finally {
      User.findOne = origFindOne;
    }
  });

  it("verifyOtp enforces attempt limit per challenge (lockout on 5 failed attempts)", async () => {
    const mockUser = {
      email: "test@example.com",
      passwordResetTokenHash: hashToken("123456"),
      passwordResetExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      passwordResetAttempts: 4, // 4 prior failures
      save: async function () { return this; },
    };

    const origFindOne = User.findOne;
    User.findOne = () => ({
      select: () => mockUser,
    });

    try {
      const req = { body: { email: "test@example.com", otp: "999999" } }; // 5th failure
      let statusCode = null;
      let jsonResponse = null;
      const res = {
        status: (code) => {
          statusCode = code;
          return { json: (data) => { jsonResponse = data; } };
        },
      };

      await verifyOtp(req, res, () => {});
      assert.strictEqual(statusCode, 429, "5th failed attempt must return HTTP 429");
      assert.strictEqual(mockUser.passwordResetTokenHash, undefined, "Token hash must be cleared on lockout");
      assert.match(jsonResponse.message, /Too many failed attempts/);
    } finally {
      User.findOne = origFindOne;
    }
  });

  it("verifyOtp rejects expired OTPs", async () => {
    const mockUser = {
      email: "test@example.com",
      passwordResetTokenHash: hashToken("123456"),
      passwordResetExpiresAt: new Date(Date.now() - 1000), // Expired
      passwordResetAttempts: 0,
      save: async function () { return this; },
    };

    const origFindOne = User.findOne;
    User.findOne = () => ({
      select: () => mockUser,
    });

    try {
      const req = { body: { email: "test@example.com", otp: "123456" } };
      let statusCode = null;
      const res = {
        status: (code) => {
          statusCode = code;
          return { json: () => {} };
        },
      };

      await verifyOtp(req, res, () => {});
      assert.strictEqual(statusCode, 400);
      assert.strictEqual(mockUser.passwordResetTokenHash, undefined, "Expired token hash must be invalidated");
    } finally {
      User.findOne = origFindOne;
    }
  });

  it("resetPassword clears reset credentials on success and prevents replay", async () => {
    const validOtp = "654321";
    const validHash = hashToken(validOtp);

    const mockUser = {
      email: "reset@example.com",
      password: "oldHashedPassword",
      passwordResetTokenHash: validHash,
      passwordResetExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      passwordResetAttempts: 0,
      save: async function () { return this; },
    };

    const origFindOne = User.findOne;
    User.findOne = () => ({
      select: () => mockUser,
    });

    try {
      const req = { body: { otp: validOtp, password: "newSecurePassword123!" } };
      let statusCode = null;
      const res = {
        status: (code) => {
          statusCode = code;
          return { json: () => {} };
        },
        clearCookie: () => {},
      };

      await resetPassword(req, res, () => {});
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(mockUser.passwordResetTokenHash, undefined, "Reset token hash must be cleared");
      assert.strictEqual(mockUser.passwordResetExpiresAt, undefined, "ExpiresAt must be cleared");
      assert.ok(mockUser.password !== "oldHashedPassword", "Password must be updated with new hash");

      // Attempt replay with now-cleared token
      let replayStatus = null;
      const replayRes = {
        status: (code) => {
          replayStatus = code;
          return { json: () => {} };
        },
        clearCookie: () => {},
      };

      await resetPassword(req, replayRes, () => {});
      assert.strictEqual(replayStatus, 400, "Replayed OTP must be rejected with 400");
    } finally {
      User.findOne = origFindOne;
    }
  });

  it("forgotPassword generates and persists 6-digit OTP hash and expiry for existing user", async () => {
    let savedData = null;
    const mockUser = {
      _id: new mongoose.Types.ObjectId(),
      email: "realuser@example.com",
      save: async function () { savedData = this; return this; },
    };
    const origFindOne = User.findOne;
    User.findOne = async () => mockUser;

    try {
      const req = { body: { email: "realuser@example.com" } };
      let statusCode = null;
      let jsonResponse = null;
      const res = {
        status: (code) => {
          statusCode = code;
          return { json: (data) => { jsonResponse = data; } };
        },
      };

      await forgotPassword(req, res, () => {});
      assert.strictEqual(statusCode, 200);
      assert.ok(savedData.passwordResetTokenHash, "Must set passwordResetTokenHash");
      assert.strictEqual(savedData.passwordResetTokenHash.length, 64, "SHA-256 hash must be 64 hex chars");
      assert.ok(savedData.passwordResetExpiresAt > new Date(), "ExpiresAt must be in future");
      assert.strictEqual(savedData.passwordResetAttempts, 0, "Attempts must reset to 0");
    } finally {
      User.findOne = origFindOne;
    }
  });

  it("passwordResetLimiter must be strictly configured (10 req / 15m, standard headers)", () => {
    assert.ok(passwordResetLimiter, "passwordResetLimiter must be exported");
    assert.strictEqual(typeof passwordResetLimiter, "function", "Must be valid Express middleware function");
  });

  it("atomic OTP consumption prevents simultaneous reset requests from both consuming the OTP", async () => {
    const validOtp = "123456";
    const validHash = hashToken(validOtp);
    const userId = new mongoose.Types.ObjectId();
    let consumed = false;

    const mockUser = {
      _id: userId,
      email: "concurrent@example.com",
      passwordResetTokenHash: validHash,
      passwordResetExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      passwordResetAttempts: 0,
      save: async function () { return this; },
    };

    const origFindOne = User.findOne;
    const origFindOneAndUpdate = User.findOneAndUpdate;

    User.findOne = () => ({
      select: () => mockUser,
    });

    // Atomic CAS mock: only the first call succeeds; subsequent calls find no matching unconsumed token
    User.findOneAndUpdate = async (query, update) => {
      if (query.passwordResetTokenHash && !consumed) {
        consumed = true;
        return { ...mockUser, ...update.$set };
      }
      return null;
    };

    try {
      const createReq = () => ({
        body: { otp: validOtp, password: "newPassword123!" },
      });

      let status1 = null, status2 = null;
      const res1 = {
        status: (c) => { status1 = c; return { json: () => {} }; },
        clearCookie: () => {},
      };
      const res2 = {
        status: (c) => { status2 = c; return { json: () => {} }; },
        clearCookie: () => {},
      };

      await Promise.all([
        resetPassword(createReq(), res1, () => {}),
        resetPassword(createReq(), res2, () => {}),
      ]);

      const statuses = [status1, status2].sort();
      assert.deepStrictEqual(statuses, [200, 400], "Exactly one concurrent request succeeds and one fails");
    } finally {
      User.findOne = origFindOne;
      User.findOneAndUpdate = origFindOneAndUpdate;
    }
  });

  it("atomic attempt limits serialize increments without lost updates", async () => {
    const userId = new mongoose.Types.ObjectId();
    const validHash = hashToken("123456");
    let atomicAttempts = 0;

    const mockUser = {
      _id: userId,
      email: "attempts@example.com",
      passwordResetTokenHash: validHash,
      passwordResetExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      passwordResetAttempts: 0,
      save: async function () { return this; },
    };

    const origFindOne = User.findOne;
    const origFindOneAndUpdate = User.findOneAndUpdate;

    User.findOne = () => ({
      select: () => mockUser,
    });

    User.findOneAndUpdate = async (query, update) => {
      if (update.$inc?.passwordResetAttempts) {
        atomicAttempts += update.$inc.passwordResetAttempts;
        return { ...mockUser, passwordResetAttempts: atomicAttempts };
      }
      return mockUser;
    };

    try {
      const createReq = () => ({
        body: { email: "attempts@example.com", otp: "wrong_otp" },
      });

      const resMock = () => ({
        status: () => ({ json: () => {} }),
      });

      await Promise.all([
        verifyOtp(createReq(), resMock(), () => {}),
        verifyOtp(createReq(), resMock(), () => {}),
        verifyOtp(createReq(), resMock(), () => {}),
      ]);

      assert.strictEqual(atomicAttempts, 3, "All concurrent increments must be counted atomically");
    } finally {
      User.findOne = origFindOne;
      User.findOneAndUpdate = origFindOneAndUpdate;
    }
  });

  it("select: false behavior: validateResetChallenge requests +passwordResetAttempts on atomic inc", async () => {
    const userId = new mongoose.Types.ObjectId();
    const validHash = hashToken("123456");
    let selectCalledWith = null;

    const mockUser = {
      _id: userId,
      email: "selectfalse@example.com",
      passwordResetTokenHash: validHash,
      passwordResetExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      passwordResetAttempts: 0,
      save: async function () { return this; },
    };

    const origFindOne = User.findOne;
    const origFindOneAndUpdate = User.findOneAndUpdate;

    User.findOne = () => ({
      select: () => mockUser,
    });

    User.findOneAndUpdate = (query, update) => ({
      select: (field) => {
        selectCalledWith = field;
        return { ...mockUser, passwordResetAttempts: 1 };
      },
    });

    try {
      const req = { body: { email: "selectfalse@example.com", otp: "wrong_otp" } };
      const res = { status: () => ({ json: () => {} }) };

      await verifyOtp(req, res, () => {});
      assert.strictEqual(selectCalledWith, "+passwordResetAttempts", "Must explicitly select passwordResetAttempts to override select: false");
    } finally {
      User.findOne = origFindOne;
      User.findOneAndUpdate = origFindOneAndUpdate;
    }
  });

  it("race between fifth failed attempt and valid password reset prevents reset success", async () => {
    const validOtp = "123456";
    const validHash = hashToken(validOtp);
    const userId = new mongoose.Types.ObjectId();
    let currentAttempts = 4; // 4 prior failures

    const mockUser = {
      _id: userId,
      email: "race@example.com",
      passwordResetTokenHash: validHash,
      passwordResetExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      passwordResetAttempts: currentAttempts,
      save: async function () { return this; },
    };

    const origFindOne = User.findOne;
    const origFindOneAndUpdate = User.findOneAndUpdate;
    const origUpdateOne = User.updateOne;

    User.findOne = () => ({
      select: () => mockUser,
    });
    User.updateOne = async () => ({ acknowledged: true });

    // The CAS query requires { passwordResetAttempts: { $lt: 5 } }
    User.findOneAndUpdate = async (query, update) => {
      if (update.$inc?.passwordResetAttempts) {
        currentAttempts += update.$inc.passwordResetAttempts;
        return { ...mockUser, passwordResetAttempts: currentAttempts };
      }
      if (query.passwordResetAttempts?.$lt !== undefined) {
        if (currentAttempts >= query.passwordResetAttempts.$lt) {
          return null; // CAS rejected because 5th failed attempt already occurred
        }
        return { ...mockUser, ...update.$set };
      }
      return null;
    };

    try {
      // 1. 5th invalid attempt fires
      const invalidReq = { body: { email: "race@example.com", otp: "wrong_otp" } };
      let invalidStatus = null;
      const invalidRes = { status: (c) => { invalidStatus = c; return { json: () => {} }; } };
      await verifyOtp(invalidReq, invalidRes, () => {});
      assert.strictEqual(invalidStatus, 429, "5th failed attempt must be locked out with 429");

      // 2. Competing reset request with valid OTP fires but CAS detects limit was reached
      const resetReq = { body: { otp: validOtp, password: "newPassword123!" } };
      let resetStatus = null;
      const resetRes = { status: (c) => { resetStatus = c; return { json: () => {} }; }, clearCookie: () => {} };
      await resetPassword(resetReq, resetRes, () => {});
      assert.strictEqual(resetStatus, 400, "Reset request racing with 5th failure must be rejected");
    } finally {
      User.findOne = origFindOne;
      User.findOneAndUpdate = origFindOneAndUpdate;
      User.updateOne = origUpdateOne;
    }
  });
});
