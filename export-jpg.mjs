import { chromium } from 'playwright-core';
import { pathToFileURL } from 'url';
import path from 'path';

const files = ['brand.html'];
const root = process.cwd();

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({
  viewport: { width: 920, height: 1200 },
  deviceScaleFactor: 2, // crisp output
});

for (const f of files) {
  const url = pathToFileURL(path.join(root, f)).href;
  await page.goto(url, { waitUntil: 'networkidle' });
  // ensure web fonts have loaded
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const out = f.replace(/\.html$/, '.jpg');
  await page.screenshot({ path: out, fullPage: true, type: 'jpeg', quality: 92 });
  console.log('saved', out);
}

await browser.close();
