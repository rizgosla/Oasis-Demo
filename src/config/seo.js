// Master switch for search-engine visibility.
//
// Drives both the robots meta tag in Layout.astro and the generated
// robots.txt, so this one constant is the only edit needed either way.
//
// Now true: this build is the live site at oasisdentalcarehb.com and the
// WordPress install it replaced is gone. The 301 map in public/_redirects
// carries the old URLs across.
//
// Set back to false only if this build is ever served from a staging domain
// while the real site is live elsewhere — two indexable copies of the same
// practice would compete with each other.
export const SITE_INDEXABLE = true;
