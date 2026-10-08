const RESERVED_SLUGS = new Set([
  "api",
  "login",
  "signup",
  "logout",
  "settings",
  "analytics",
  "links",
  "bio",
  "r",
  "forgot-password",
  "reset-password",
  "health",
  "features",
  "pricing",
  "blog",
  "about",
]);

const isReservedSlug = (slug) => {
  return RESERVED_SLUGS.has(slug.toLowerCase().trim());
};

module.exports = {
  RESERVED_SLUGS,
  isReservedSlug,
};
