import BioProfile from "../models/BioProfile.js";

const VALID_THEMES = new Set(["Minimal Light", "Dark Slate", "Gradient"]);

const normalizeTheme = (theme) => {
  if (!theme) return "Minimal Light";
  if (theme === "minimal" || theme === "Minimal Light") return "Minimal Light";
  if (theme === "dark" || theme === "Dark Slate") return "Dark Slate";
  if (theme === "gradient" || theme === "Gradient") return "Gradient";
  return theme;
};

const isValidHttpUrl = (urlString) => {
  if (!urlString || typeof urlString !== "string") return false;
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const VALID_TEMPLATES = new Set(["creator", "professional", "portfolio", "minimal"]);

/**
 * GET /api/v1/bio/me
 * Retrieves the authenticated user's BioProfile
 */
export const getMyBio = async (req, res, next) => {
  try {
    const profile = await BioProfile.findOne({ user: req.user.userId });

    if (!profile) {
      return res.status(200).json({
        success: true,
        data: { profile: null },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        profile: {
          id: profile._id,
          username: profile.username,
          avatar: profile.avatar,
          displayName: profile.displayName,
          bio: profile.bio,
          socialLinks: profile.socialLinks,
          bioLinks: profile.bioLinks,
          theme: profile.theme,
          templateId: profile.templateId || "creator",
          jobTitle: profile.jobTitle || "",
          company: profile.company || "",
          pronouns: profile.pronouns || "",
          coverImage: profile.coverImage || "",
          resumeUrl: profile.resumeUrl || "",
          statusBadge: profile.statusBadge || "Open to work",
          highlights: profile.highlights || [],
          contactMethods: profile.contactMethods || [],
          customization: profile.customization || {
            buttonStyle: "rounded",
            layoutVariant: "standard",
            backgroundStyle: "solid",
            headerColor: "",
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/bio/me
 * Upserts the authenticated user's BioProfile
 */
export const upsertMyBio = async (req, res, next) => {
  try {
    const {
      username,
      avatar = "",
      displayName = "",
      bio = "",
      socialLinks = [],
      bioLinks = [],
      theme = "Minimal Light",
      templateId = "creator",
      jobTitle = "",
      company = "",
      pronouns = "",
      coverImage = "",
      resumeUrl = "",
      statusBadge = "Open to work",
      highlights = [],
      contactMethods = [],
      customization = {},
    } = req.body;

    // 1. Username validation
    if (!username || typeof username !== "string") {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    if (!usernameRegex.test(normalizedUsername)) {
      return res.status(400).json({
        success: false,
        message: "Username must be 3-30 alphanumeric characters, hyphens, or underscores",
      });
    }

    // Check username uniqueness
    const existing = await BioProfile.findOne({
      username: normalizedUsername,
      user: { $ne: req.user.userId },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken",
      });
    }

    // 2. Theme validation
    const normalizedTheme = normalizeTheme(theme);
    if (!VALID_THEMES.has(normalizedTheme)) {
      return res.status(400).json({
        success: false,
        message: "Theme must be one of: 'Minimal Light', 'Dark Slate', 'Gradient'",
      });
    }

    // 3. Template validation
    const normalizedTemplate = VALID_TEMPLATES.has(templateId) ? templateId : "creator";

    // 4. Social Links validation
    if (!Array.isArray(socialLinks)) {
      return res.status(400).json({
        success: false,
        message: "Social links must be an array",
      });
    }

    const cleanedSocialLinks = [];
    for (const item of socialLinks) {
      if (!item.url || !isValidHttpUrl(item.url)) {
        return res.status(400).json({
          success: false,
          message: `Invalid social link URL: ${item.url || "empty"}`,
        });
      }
      cleanedSocialLinks.push({
        platform: (item.platform || "").trim(),
        url: item.url.trim(),
      });
    }

    // 5. Bio Links validation
    if (!Array.isArray(bioLinks)) {
      return res.status(400).json({
        success: false,
        message: "Bio links must be an array",
      });
    }

    if (bioLinks.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Maximum 20 bio links allowed",
      });
    }

    const cleanedBioLinks = [];
    for (const link of bioLinks) {
      if (!link.title || typeof link.title !== "string" || !link.title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Bio link title is required",
        });
      }
      if (!link.url || !isValidHttpUrl(link.url)) {
        return res.status(400).json({
          success: false,
          message: `Invalid destination URL: ${link.url || "empty"}`,
        });
      }
      cleanedBioLinks.push({
        title: link.title.trim().slice(0, 80),
        url: link.url.trim(),
      });
    }

    // 6. Clean contact methods
    const cleanedContactMethods = Array.isArray(contactMethods)
      ? contactMethods.map((cm) => ({
          type: (cm.type || "phone").trim(),
          label: (cm.label || "").trim(),
          value: (cm.value || "").trim(),
        }))
      : [];

    // 7. Clean highlights
    const cleanedHighlights = Array.isArray(highlights)
      ? highlights.map((h) => ({
          title: (h.title || "").trim().slice(0, 60),
          subtitle: (h.subtitle || "").trim().slice(0, 100),
        }))
      : [];

    // 8. Clean customization
    const cleanedCustomization = {
      buttonStyle: ["rounded", "soft-card", "outline"].includes(customization?.buttonStyle)
        ? customization.buttonStyle
        : "rounded",
      layoutVariant: typeof customization?.layoutVariant === "string" ? customization.layoutVariant : "standard",
      backgroundStyle: typeof customization?.backgroundStyle === "string" ? customization.backgroundStyle : "solid",
      headerColor: typeof customization?.headerColor === "string" ? customization.headerColor : "",
    };

    // 9. Upsert BioProfile in MongoDB
    const profile = await BioProfile.findOneAndUpdate(
      { user: req.user.userId },
      {
        username: normalizedUsername,
        avatar: (avatar || "").trim(),
        displayName: (displayName || "").trim().slice(0, 60),
        bio: (bio || "").trim().slice(0, 300),
        socialLinks: cleanedSocialLinks,
        bioLinks: cleanedBioLinks,
        theme: normalizedTheme,
        templateId: normalizedTemplate,
        jobTitle: (jobTitle || "").trim().slice(0, 60),
        company: (company || "").trim().slice(0, 60),
        pronouns: (pronouns || "").trim().slice(0, 30),
        coverImage: (coverImage || "").trim(),
        resumeUrl: (resumeUrl || "").trim(),
        statusBadge: (statusBadge || "Open to work").trim().slice(0, 30),
        highlights: cleanedHighlights,
        contactMethods: cleanedContactMethods,
        customization: cleanedCustomization,
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Bio profile saved successfully",
      data: {
        profile: {
          id: profile._id,
          username: profile.username,
          avatar: profile.avatar,
          displayName: profile.displayName,
          bio: profile.bio,
          socialLinks: profile.socialLinks,
          bioLinks: profile.bioLinks,
          theme: profile.theme,
          templateId: profile.templateId,
          jobTitle: profile.jobTitle,
          company: profile.company,
          pronouns: profile.pronouns,
          coverImage: profile.coverImage,
          resumeUrl: profile.resumeUrl,
          statusBadge: profile.statusBadge,
          highlights: profile.highlights,
          contactMethods: profile.contactMethods,
          customization: profile.customization,
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken",
      });
    }
    next(error);
  }
};

/**
 * GET /api/v1/bio/:username
 * Public Endpoint: Returns public bio profile without exposing sensitive information
 */
export const getPublicBio = async (req, res, next) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username parameter is required",
      });
    }

    const normalized = username.trim().toLowerCase();
    const profile = await BioProfile.findOne({ username: normalized });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Bio profile not found",
      });
    }

    // Public response: strictly only public fields
    return res.status(200).json({
      success: true,
      data: {
        username: profile.username,
        avatar: profile.avatar,
        displayName: profile.displayName,
        bio: profile.bio,
        socialLinks: profile.socialLinks,
        bioLinks: profile.bioLinks,
        theme: profile.theme,
        templateId: profile.templateId || "creator",
        jobTitle: profile.jobTitle || "",
        company: profile.company || "",
        pronouns: profile.pronouns || "",
        coverImage: profile.coverImage || "",
        resumeUrl: profile.resumeUrl || "",
        statusBadge: profile.statusBadge || "Open to work",
        highlights: profile.highlights || [],
        contactMethods: profile.contactMethods || [],
        customization: profile.customization || {
          buttonStyle: "rounded",
          layoutVariant: "standard",
          backgroundStyle: "solid",
          headerColor: "",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
