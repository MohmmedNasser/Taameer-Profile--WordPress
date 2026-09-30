/**
 * brand-compare.mjs — Playwright: full-page screenshots of each brand at 375/768/1280/1920 (LTR), plus RTL at
 * 375 and 1280, with console errors, horizontal overflow and first-paint brand checks.
 *
 *   python -m http.server 5173
 *   PW_MODULE=<playwright path> node scripts/brand-compare.mjs [outDir=source/screenshots/brand-compare]
 *
 * Env: BASE_URL (default http://localhost:5173/), BRANDS ("bronze,official"; "none" = no ?brand param, used to
 * shoot the v1-bronze tag, which has no switcher), HIDE_SWITCHER=1 (hide the review pill so shots are diffable).
 */
import { mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const pwPath = process.env.PW_MODULE ? pathToFileURL(path.join(process.env.PW_MODULE, 'index.mjs')).href : 'playwright';
const { chromium } = await import(pwPath);

const BASE = process.env.BASE_URL || 'http://localhost:5173/';
const outDir = process.argv[2] || 'source/screenshots/brand-compare';
const brands = (process.env.BRANDS || 'bronze,official').split(',');
const hide = process.env.HIDE_SWITCHER === '1';
mkdirSync(outDir, { recursive: true });

const runs = [375, 768, 1280, 1920].map((w) => ({ w, dir: 'ltr' })).concat([375, 1280].map((w) => ({ w, dir: 'rtl' })));
const browser = await chromium.launch();
let problems = 0;

for (const brand of brands) {
  for (const run of runs) {
    const ctx = await browser.newContext({ viewport: { width: run.w, height: run.w < 768 ? 812 : 900 } });
    const tab = await ctx.newPage();
    const errors = [];
    tab.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
    tab.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    tab.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()}`));
    tab.on('response', (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`); });
    // Record the brand attribute the instant <html> gets parsed, and the first background colour the page paints with.
    await tab.addInitScript((rtl) => {
      window.__early = null;
      new MutationObserver((_, obs) => {
        const el = document.documentElement;
        if (el) { if (rtl) el.setAttribute('dir', 'rtl'); obs.disconnect(); }
      }).observe(document, { childList: true });
      document.addEventListener('DOMContentLoaded', () => { window.__early = document.documentElement.getAttribute('data-brand'); });
    }, run.dir === 'rtl');
    const url = BASE + 'index.html' + (brand === 'none' ? '' : `?brand=${brand}`);
    await tab.goto(url, { waitUntil: 'networkidle' });
    if (hide) await tab.addStyleTag({ content: '.tp-brandswitch{display:none!important}' });
    await tab.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 2200));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));
    });
    const info = await tab.evaluate(() => {
      const doc = document.documentElement;
      return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, early: window.__early,
        bg: getComputedStyle(document.body).backgroundColor, h1: getComputedStyle(document.querySelector('h1')).fontFamily.split(',')[0] };
    });
    const name = `${brand}-${run.w}${run.dir === 'rtl' ? '-rtl' : ''}.png`;
    await tab.screenshot({ path: path.join(outDir, name), fullPage: true });
    const overflow = info.scrollWidth > info.clientWidth;
    const flash = brand !== 'none' && info.early !== brand;
    problems += errors.length + (overflow ? 1 : 0) + (flash ? 1 : 0);
    console.log(`${name}: ${errors.length} issue(s), overflow ${overflow ? 'YES ' + info.scrollWidth + '>' + info.clientWidth : 'no'}, brand@DCL=${info.early}${flash ? ' FLASH' : ''}, bg=${info.bg}, h1=${info.h1}`);
    errors.forEach((e) => console.log('   ' + e));
    await ctx.close();
  }
}
await browser.close();
console.log(problems ? `\n${problems} problem(s)` : '\nAll clean.');
process.exitCode = problems ? 1 : 0;
