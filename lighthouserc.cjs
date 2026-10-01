module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      // Deterministic, indexable pages that render without redirecting. The
      // locale roots (/, /pt/, /es/) only redirect to a random variant, and
      // variants are noindex by design — auditing them measured the draw.
      url: [
        'http://localhost/privacy/index.html',
        'http://localhost/notices/index.html',
        'http://localhost/pt/notices/index.html',
      ],
      // Median of three runs: one run let cold-start noise on the first URL fail the gate.
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          cpuSlowdownMultiplier: 4,
          rttMs: 150,
          throughputKbps: 1638.4,
          requestLatencyMs: 562.5,
          downloadThroughputKbps: 1474.56,
          uploadThroughputKbps: 675,
        },
        skipAudits: ['canonical', 'uses-http2'],
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'interaction-to-next-paint': ['warn', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
