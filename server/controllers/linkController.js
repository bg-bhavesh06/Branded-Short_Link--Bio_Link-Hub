import ShortLink from "../models/ShortLink.js";
import Click from "../models/Click.js";
import { generateShortCode } from "../utils/shortCode.js";
import { isReservedSlug } from "../utils/reservedSlugs.js";
import { recordClick } from "../services/clickService.js";

const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const getBaseUrl = () => {
  return process.env.PUBLIC_APP_URL || process.env.CLIENT_URL || "http://localhost:5173";
};

/**
 * Create a new Short Link
 * POST /api/v1/links
 */
export const createShortLink = async (req, res, next) => {
  try {
    const { originalUrl, customSlug } = req.body;

    if (!originalUrl || !isValidUrl(originalUrl)) {
      return res.status(400).json({
        success: false,
        message: "A valid HTTP or HTTPS destination URL is required",
      });
    }

    let shortCode;

    if (customSlug && customSlug.trim()) {
      const normalizedSlug = customSlug.trim().toLowerCase();
      const slugRegex = /^[a-zA-Z0-9_-]{2,30}$/;

      if (!slugRegex.test(normalizedSlug)) {
        return res.status(400).json({
          success: false,
          message: "Custom slug must be 2-30 alphanumeric characters, hyphens, or underscores",
        });
      }

      if (isReservedSlug(normalizedSlug)) {
        return res.status(400).json({
          success: false,
          message: "This custom slug is reserved and cannot be used",
        });
      }

      const existing = await ShortLink.findOne({ shortCode: normalizedSlug });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "This short link is already in use",
        });
      }

      shortCode = normalizedSlug;
    } else {
      let attempts = 0;
      const MAX_ATTEMPTS = 5;

      while (attempts < MAX_ATTEMPTS) {
        const candidate = generateShortCode(6);
        const existing = await ShortLink.findOne({ shortCode: candidate });
        if (!existing && !isReservedSlug(candidate)) {
          shortCode = candidate;
          break;
        }
        attempts++;
      }

      if (!shortCode) {
        return res.status(500).json({
          success: false,
          message: "Unable to generate unique short code. Please try again.",
        });
      }
    }

    const shortLink = await ShortLink.create({
      user: req.user.userId,
      originalUrl: originalUrl.trim(),
      shortCode,
    });

    const shortUrl = `${getBaseUrl()}/r/${shortLink.shortCode}`;

    return res.status(201).json({
      success: true,
      message: "Short link created successfully",
      link: {
        id: shortLink._id,
        originalUrl: shortLink.originalUrl,
        shortCode: shortLink.shortCode,
        shortUrl,
        createdAt: shortLink.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This short link is already in use",
      });
    }
    next(error);
  }
};

/**
 * Get Authenticated User's Links with Search & Pagination
 * GET /api/v1/links?search=...&page=1&limit=10
 */
export const getUserLinks = async (req, res, next) => {
  try {
    const { search = "", page = "1", limit = "10" } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

    const filter = { user: req.user.userId };

    const trimmedSearch = search.trim();
    if (trimmedSearch) {
      const escapedSearch = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { originalUrl: { $regex: escapedSearch, $options: "i" } },
        { shortCode: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const totalItems = await ShortLink.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limitNum) || 1;
    const skip = (pageNum - 1) * limitNum;

    const links = await ShortLink.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const baseUrl = getBaseUrl();
    const linkIds = links.map((l) => l._id);

    const clickCounts = linkIds.length
      ? await Click.aggregate([
          { $match: { shortLink: { $in: linkIds } } },
          { $group: { _id: "$shortLink", clicks: { $sum: 1 } } },
        ])
      : [];
    const clickMap = new Map(clickCounts.map((c) => [c._id.toString(), c.clicks]));

    const formattedLinks = links.map((link) => ({
      id: link._id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      shortUrl: `${baseUrl}/r/${link.shortCode}`,
      clicks: clickMap.get(link._id.toString()) || 0,
      createdAt: link.createdAt,
    }));

    const pagination = {
      page: pageNum,
      limit: limitNum,
      totalItems,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPreviousPage: pageNum > 1,
    };

    return res.status(200).json({
      success: true,
      data: {
        links: formattedLinks,
        pagination,
      },
      links: formattedLinks,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Short Link and associated Click telemetry
 * DELETE /api/v1/links/:id
 */
export const deleteShortLink = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check valid ObjectId
    if (!id || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid link ID",
      });
    }

    // Secure ownership lookup and deletion
    const deleted = await ShortLink.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Short link not found",
      });
    }

    // Delete associated Click documents
    await Click.deleteMany({ shortLink: id });

    return res.status(200).json({
      success: true,
      message: "Short link deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public Redirect Route
 * GET /r/:shortCode
 */
export const redirectShortLink = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const link = await ShortLink.findOne({ shortCode });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: "Short link not found",
      });
    }

    // Asynchronously record telemetry without blocking redirect response
    recordClick(req, link._id).catch((err) =>
      console.error("Telemetry error:", err)
    );

    // 302 Found redirect as required
    return res.redirect(302, link.originalUrl);
  } catch (error) {
    next(error);
  }
};
