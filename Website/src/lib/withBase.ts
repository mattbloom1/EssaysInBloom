/**
 * Prefix a root-relative path ("/about/") with the configured base path,
 * so links work both locally (base "/") and on GitHub Pages
 * (base "/EssaysInBloom"). Use for every internal href and asset src.
 */
export const withBase = (path: string): string =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
