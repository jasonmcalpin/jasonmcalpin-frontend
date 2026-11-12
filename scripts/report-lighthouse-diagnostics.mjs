import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const expectedRoutes = ['/', '/about', '/projects', '/bytes', '/bytes/champion-your-team'];
const numberOfRuns = 3;

export function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

export function summarizeLhr(lhr) {
  const url = new URL(lhr.finalUrl || lhr.requestedUrl);
  const audit = id => lhr.audits?.[id];
  const accessibilityRefs = new Set(
    (lhr.categories?.accessibility?.auditRefs || []).filter(x => x.weight > 0).map(x => x.id));
  const accessibilityFindings = Object.values(lhr.audits || {})
    .filter(x => accessibilityRefs.has(x.id) && typeof x.score === 'number' && x.score < 1)
    .map(x => ({
      id: x.id, title: x.title,
      selectors: (x.details?.items || []).flatMap(item =>
        Object.values(item).filter(v => v && typeof v === 'object' && v.selector)
          .map(v => v.selector)).slice(0, 5),
    }));
  const lcpNode = audit('largest-contentful-paint-element')?.details?.items?.[0]?.node;
  return {
    route: url.pathname.replace(/\/$/, '') || '/',
    scores: Object.fromEntries(['performance', 'accessibility', 'best-practices', 'seo']
      .map(key => [key, lhr.categories?.[key]?.score ?? null])),
    timings: Object.fromEntries([
      ['fcp', 'first-contentful-paint'], ['lcp', 'largest-contentful-paint'],
      ['tbt', 'total-blocking-time'], ['cls', 'cumulative-layout-shift'],
    ].map(([key, id]) => [key, audit(id)?.numericValue ?? null])),
    lcpElement: lcpNode?.snippet || lcpNode?.selector || null,
    renderBlocking: (audit('render-blocking-resources')?.details?.items || []).slice(0, 8)
      .map(x => ({ url: x.url, wastedMs: x.wastedMs })),
    accessibilityFindings,
  };
}

export function aggregate(reports) {
  const byRoute = new Map();
  for (const lhr of reports) {
    const item = summarizeLhr(lhr);
    byRoute.set(item.route, [...(byRoute.get(item.route) || []), item]);
  }
  return [...byRoute.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([route, runs]) => {
    const representative = runs.reduce((a, b) =>
      Math.abs(b.timings.lcp - median(runs.map(r => r.timings.lcp))) <
      Math.abs(a.timings.lcp - median(runs.map(r => r.timings.lcp))) ? b : a);
    return {
      route, runCount: runs.length,
      scores: Object.fromEntries(Object.keys(representative.scores).map(key =>
        [key, median(runs.map(r => r.scores[key]))])),
      timings: Object.fromEntries(Object.keys(representative.timings).map(key =>
        [key, median(runs.map(r => r.timings[key]))])),
      lcpElement: representative.lcpElement,
      renderBlocking: representative.renderBlocking,
      accessibilityFindings: representative.accessibilityFindings,
    };
  });
}

export function markdown(rows) {
  const pct = n => n == null ? 'n/a' : String(Math.round(n * 100));
  const millis = n => n == null ? 'n/a' : String(Math.round(n));
  const lines = ['## Mobile Lighthouse diagnostics (median of three runs)',
    '| Route | Performance | Accessibility | LCP (ms) | FCP (ms) | TBT (ms) | CLS |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: |'];
  for (const r of rows) {
    lines.push('| ' + r.route + ' | ' + pct(r.scores.performance) + ' | ' +
      pct(r.scores.accessibility) + ' | ' + millis(r.timings.lcp) + ' | ' +
      millis(r.timings.fcp) + ' | ' + millis(r.timings.tbt) + ' | ' +
      (r.timings.cls?.toFixed(3) ?? 'n/a') + ' |');
  }
  for (const r of rows) {
    lines.push('', '### ' + r.route, 'LCP element: ' + (r.lcpElement || 'not reported'));
    for (const item of r.renderBlocking)
      lines.push('- Render blocking: ' + (item.url || 'unknown') +
        ' (' + millis(item.wastedMs) + ' ms estimated savings)');
    for (const item of r.accessibilityFindings)
      lines.push('- Accessibility: ' + item.id + ' — ' + item.title +
        (item.selectors.length ? ' (' + item.selectors.join(', ') + ')' : ''));
  }
  return lines.join('\n') + '\n';
}

export async function main(dir = '.lighthouseci') {
  const absolute = resolve(dir);
  const filenames = (await readdir(absolute)).filter(name => /^lhr-.*\.json$/.test(name));
  if (!filenames.length) throw new Error('No LHR JSON files found in ' + absolute);
  const reports = await Promise.all(filenames.map(async name =>
    JSON.parse(await readFile(join(absolute, name), 'utf8'))));
  const rows = aggregate(reports);
  for (const route of expectedRoutes) {
    const count = rows.find(row => row.route === route)?.runCount || 0;
    if (count !== numberOfRuns)
      throw new Error('Expected ' + numberOfRuns + ' Lighthouse reports for ' + route + ', found ' + count);
  }
  const summary = markdown(rows);
  await writeFile(join(absolute, 'diagnostics.json'), JSON.stringify(rows, null, 2) + '\n');
  await writeFile(join(absolute, 'diagnostics.md'), summary);
  if (process.env.GITHUB_STEP_SUMMARY)
    await writeFile(process.env.GITHUB_STEP_SUMMARY, summary, { flag: 'a' });
  process.stdout.write(summary);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv[2]).catch(error => { console.error(error); process.exitCode = 1; });
}
