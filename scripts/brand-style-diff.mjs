import { pathToFileURL } from 'node:url';
const R=s=>s.replace(/(d+.d+)px/g,(m,n)=>Math.round(n)+'px');
const { chromium } = await import(pathToFileURL(process.env.PW_MODULE + '/index.mjs').href);
const b = await chromium.launch();
async function dump(url){
  const ctx = await b.newContext({viewport:{width:1280,height:900}, reducedMotion:'reduce'});
  const p = await ctx.newPage(); await p.goto(url,{waitUntil:'networkidle'});
  const r = await p.evaluate(()=>[...document.querySelectorAll('body *:not(.tp-brandswitch):not(.tp-brandswitch *)')].map(e=>{const c=getComputedStyle(e);return [e.tagName+'.'+e.className, ['color','backgroundColor','borderTopColor','fontFamily','fontWeight','fontSize','letterSpacing','borderRadius','boxShadow','fill','stroke','width','height'].map(k=>c[k].replace(/(d+.d+)px/g,(m,n)=>Math.round(n)+'px')).join('|')]}));
  await ctx.close(); return r;
}
const a = await dump('http://localhost:5174/index.html'), c = await dump('http://localhost:5173/index.html?brand=bronze');
let d=0; console.log(a.length,c.length);
a.forEach((x,i)=>{ if(!c[i]||R(x[1])!==R(c[i][1])){ if(d++<8) console.log(x[0],'\n ',x[1],'\n ',c[i]&&c[i][1]);}});
console.log('diffs',d); await b.close();
