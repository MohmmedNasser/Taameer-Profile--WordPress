import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)(process.env.PW_MODULE);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto('http://localhost:5173/ar/index.html', { waitUntil: 'networkidle' });
console.log(await p.evaluate(()=>{const e=document.querySelector('.tp-stats__value'); const cs=getComputedStyle(e); return [cs.fontFamily, cs.fontWeight, getComputedStyle(document.documentElement).getPropertyValue('--tp-font-display'), [...document.fonts].map(f=>f.family+' '+f.weight+' '+f.status).join('|')]}));
await b.close();
