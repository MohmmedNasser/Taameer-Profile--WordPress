import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)(process.env.PW_MODULE);
const [,, page, w, y, h, out] = process.argv;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: 900 } });
await p.goto('http://localhost:5173/' + page, { waitUntil: 'networkidle' });
await p.evaluate(async()=>{ document.querySelectorAll('.tp-reveal,.tp-stagger,.tp-img-reveal,.tp-split,.tp-counter').forEach(e=>e.classList.add('is-visible')); document.documentElement.classList.remove('tp-js'); await document.fonts.ready;});
await p.waitForTimeout(1200);
await p.screenshot({ path: out, fullPage: true, clip: { x: 0, y: +y, width: +w, height: +h } }); await b.close();
