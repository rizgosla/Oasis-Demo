// Master switch for search-engine visibility.
//
// Kept false while the client's WordPress site is still live at
// oasisdentalcarehb.com — indexing this build too would put two sites for the
// same practice in competition with each other. All other SEO (canonical tags,
// Open Graph, structured data, sitemap) is fully wired and testable regardless.
//
// AT LAUNCH: flip this to true. It drives both the robots meta tag in
// Layout.astro and the generated robots.txt, so this is the only edit needed.
export const SITE_INDEXABLE = false;
