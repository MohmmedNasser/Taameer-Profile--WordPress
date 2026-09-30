/**
 * interaction-test.mjs — keyboard/ARIA checks for header menu, skip link and before/after slider.
 *   python -m http.server 5173 ; PW_MODULE=<playwright path> node scripts/interaction-test.mjs
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const pwPath = process.env.PW_MODULE ? pathToFileURL(path.join(process.env.PW_MODULE, 'index.mjs')).href : 'playwright';
const { chromium } = await import(pwPath);
const BASE = process.env.BASE_URL || 'http://localhost:5173/index.html';
const results = [];
const check = (name, ok, detail = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);

const browser = await chromium.launch();

// Mobile: skip link + menu
{
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const skipHidden = await page.$eval('.tp-skip-link', (el) => el.getBoundingClientRect().bottom <= 0);
  check('skip link hidden until focused', skipHidden);
  await page.keyboard.press('Tab');
  const skipShown = await page.$eval('.tp-skip-link', (el) => document.activeElement === el && el.getBoundingClientRect().top >= 0);
  check('skip link is first Tab stop and visible', skipShown);
  await page.screenshot({ path: 'source/screenshots/phase-1/interaction-375-skip.png' });

  await page.click('[data-tp-menu-toggle]');
  await page.waitForTimeout(500);
  const open = await page.evaluate(() => ({
    expanded: document.querySelector('[data-tp-menu-toggle]').getAttribute('aria-expanded'),
    hidden: document.querySelector('[data-tp-menu]').hidden,
    focusInMenu: !!document.activeElement.closest('[data-tp-menu]'),
    locked: document.body.classList.contains('tp-is-locked'),
    // visual check: the panel must cover the viewport, not be trapped inside the header bar
    covers: document.querySelector('[data-tp-menu]').getBoundingClientRect().height > window.innerHeight * 0.8,
  }));
  check('menu opens (aria-expanded, visible, scroll locked)', open.expanded === 'true' && !open.hidden && open.locked);
  check('menu panel covers the viewport', open.covers);
  check('focus moves into menu', open.focusInMenu);
  await page.screenshot({ path: 'source/screenshots/phase-1/interaction-375-menu.png' });
  for (let i = 0; i < 15; i++) await page.keyboard.press('Tab');
  const trapped = await page.evaluate(() => !!document.activeElement.closest('[data-tp-menu]') || document.activeElement.matches('[data-tp-menu-toggle]'));
  check('focus trapped after 15 Tabs', trapped);
  await page.keyboard.press('Escape');
  const closed = await page.evaluate(() => ({
    hidden: document.querySelector('[data-tp-menu]').hidden,
    focusOnToggle: document.activeElement.matches('[data-tp-menu-toggle]'),
  }));
  check('Esc closes menu and returns focus to toggle', closed.hidden && closed.focusOnToggle);
  await page.close();
}

// Before/after in LTR and RTL
for (const dir of ['ltr', 'rtl']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  if (dir === 'rtl') {
    await page.addInitScript(() => new MutationObserver((_, o) => { if (document.documentElement) { document.documentElement.dir = 'rtl'; o.disconnect(); } }).observe(document, { childList: true }));
  }
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const handle = page.locator('.tp-ba__handle');
  await handle.scrollIntoViewIfNeeded();
  await handle.focus();
  await page.keyboard.press('ArrowRight');
  const afterRight = Number(await handle.getAttribute('aria-valuenow'));
  check(`${dir}: ArrowRight moves divider visually right`, dir === 'ltr' ? afterRight === 52 : afterRight === 48, `value ${afterRight}`);
  await page.keyboard.press('Home');
  check(`${dir}: Home → 0`, (await handle.getAttribute('aria-valuenow')) === '0');
  await page.keyboard.press('End');
  check(`${dir}: End → 100`, (await handle.getAttribute('aria-valuenow')) === '100');
  // Pointer: click at 25% from the left edge.
  const box = await page.locator('.tp-ba').boundingBox();
  await page.mouse.click(box.x + box.width * 0.25, box.y + box.height / 2);
  const v = Number(await handle.getAttribute('aria-valuenow'));
  check(`${dir}: pointer click at 25% from left`, dir === 'ltr' ? Math.abs(v - 25) <= 1 : Math.abs(v - 75) <= 1, `value ${v}`);
  // Visual: handle centre sits at the click point.
  const hb = await handle.boundingBox();
  check(`${dir}: handle follows pointer`, Math.abs(hb.x + hb.width / 2 - (box.x + box.width * 0.25)) < 3);
  await page.close();
}

await browser.close();
console.log(results.join('\n'));
process.exitCode = results.some((r) => r.startsWith('FAIL')) ? 1 : 0;
