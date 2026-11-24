// Runs the app's own in-page self-checks in headless Chromium and fails if any of them fail.
// The checks live in index.html and run on load; this only reads the result.
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:8080/index.html';
const browser = await chromium.launch();
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(String(e)));

const res = await page.goto(url, { waitUntil: 'load' });
const failed = res?.ok()
  ? await page.evaluate(() => (typeof FAILED === 'undefined' ? null : FAILED))
  : undefined;
await browser.close();

const die = msg => { console.error(msg); process.exit(1); };
if (failed === undefined) die(`Could not load ${url} (HTTP ${res?.status() ?? 'no response'}).`);
if (pageErrors.length) die(`The page threw before the checks finished:\n${pageErrors.join('\n')}`);
if (failed === null) die('No FAILED array on the page: the self-check harness did not run.');
if (failed.length) die(`${failed.length} self-check(s) failed:\n- ${failed.join('\n- ')}`);
console.log('All self-checks passed.');
