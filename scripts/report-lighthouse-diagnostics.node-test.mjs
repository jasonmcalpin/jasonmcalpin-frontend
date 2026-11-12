import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeLhr, aggregate, markdown } from './report-lighthouse-diagnostics.mjs';

const lhr = (route, lcp, accessibility = 0.92) => ({
  requestedUrl: 'http://localhost:4173' + route,
  categories: {
    performance: { score: 0.94 },
    accessibility: { score: accessibility, auditRefs: [{ id: 'list', weight: 1 }] },
    'best-practices': { score: 1 },
    seo: { score: 1 },
  },
  audits: {
    'largest-contentful-paint': { numericValue: lcp },
    'first-contentful-paint': { numericValue: 900 },
    'total-blocking-time': { numericValue: 20 },
    'cumulative-layout-shift': { numericValue: 0.002 },
    'largest-contentful-paint-element': {
      details: { items: [
        { type: 'table', items: [{ node: { snippet: '<h1>About</h1>' } }] },
        { type: 'table', items: [
          { phase: 'TTFB', timing: 450 },
          { phase: 'Load Delay', timing: 800 },
          { phase: 'Load Time', timing: 10 },
          { phase: 'Render Delay', timing: 340 },
        ] },
      ] },
    },
    'render-blocking-resources': {
      details: { items: [{ url: '/assets/main.css', wastedMs: 80 }] },
    },
    list: {
      id: 'list', title: 'Lists have invalid structure', score: 0,
      details: { items: [{ node: { selector: '.logos' } }] },
    },
  },
});

test('report maps route and actionable audit evidence', () => {
  const result = summarizeLhr(lhr('/about', 1600));
  assert.equal(result.route, '/about');
  assert.equal(result.lcpElement, '<h1>About</h1>');
  assert.equal(result.lcpPhases['Load Delay'], 800);
  assert.equal(result.accessibilityFindings[0].selectors[0], '.logos');
  assert.equal(result.renderBlocking[0].wastedMs, 80);
});

test('aggregate takes median metrics across runs and retains a representative audit', () => {
  const rows = aggregate([lhr('/about', 1400), lhr('/about', 1600), lhr('/about', 3000)]);
  assert.equal(rows[0].runCount, 3);
  assert.equal(rows[0].timings.lcp, 1600);
  assert.match(markdown(rows), /1600/);
  assert.match(markdown(rows), /Load Delay 800 ms/);
});

test('missing optional audits remain reportable', () => {
  const report = lhr('/', 1300, 1);
  delete report.audits.list;
  delete report.audits['render-blocking-resources'];
  delete report.audits['largest-contentful-paint-element'];
  const result = summarizeLhr(report);
  assert.deepEqual(result.accessibilityFindings, []);
  assert.deepEqual(result.renderBlocking, []);
  assert.equal(result.lcpElement, null);
});
