// Adsterra ad unit keys. One entry per unique unit — the duplicate 468x60
// code the two snippets both used (c243b09ea2db65a8b7c5bb2b095fc806) is only
// listed once here.
//
// Currently placed on /jobs and job detail pages: TOP_BANNER_DESKTOP,
// TOP_BANNER_MOBILE, RECTANGLE_300x250, NATIVE. SKYSCRAPER_160x600,
// SKYSCRAPER_160x300, and BANNER_468x60 aren't in use yet — there's no
// sidebar in the current /jobs layout to put the skyscrapers in — but are
// left here in case a future layout adds one, or another page wants them.

export const ADSTERRA = {
  RECTANGLE_300x250: { adKey: '14a5e6902f465e9bb13c618ea719978c', width: 300, height: 250 },
  MOBILE_BANNER_320x50: { adKey: 'ba9eda152cc4aabce02876418a7aaaa6', width: 320, height: 50 },
  LEADERBOARD_728x90: { adKey: '274521fef82795d545831fdba9457d36', width: 728, height: 90 },
  BANNER_468x60: { adKey: 'c243b09ea2db65a8b7c5bb2b095fc806', width: 468, height: 60 },
  SKYSCRAPER_160x600: { adKey: '31c9ff4de42d5e930ab1d9d88d96fa75', width: 160, height: 600 },
  RECTANGLE_160x300: { adKey: 'b99c3302c09f3e3042a99880b900eb08', width: 160, height: 300 },
} as const;

export const ADSTERRA_NATIVE_KEY = '1e2aa34112d35cbf5a5c237b9d086461';
