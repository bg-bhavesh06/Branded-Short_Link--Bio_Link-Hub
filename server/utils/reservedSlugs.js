export const RESERVED_SLUGS = new Set([
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

export const isReservedSlug = (slug) => {
  return RESERVED_SLUGS.has(slug.toLowerCase().trim());
};
