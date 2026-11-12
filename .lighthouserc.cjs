/** Baseline-only measurements; do not use Lighthouse scores as an initial release gate. */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node scripts/serve-built-site.mjs',
      startServerReadyPattern: 'Static preview listening',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/about',
        'http://localhost:4173/projects',
        'http://localhost:4173/bytes',
        'http://localhost:4173/bytes/champion-your-team',
      ],
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true, width: 360, height: 640, deviceScaleFactor: 2, disabled: false,
        },
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.85, aggregationMethod: 'median' }],
        'categories:accessibility': ['warn', { minScore: 0.95, aggregationMethod: 'median' }],
        'categories:best-practices': ['warn', { minScore: 0.95, aggregationMethod: 'median' }],
        'categories:seo': ['warn', { minScore: 0.95, aggregationMethod: 'median' }],
      },
    },
  },
};
