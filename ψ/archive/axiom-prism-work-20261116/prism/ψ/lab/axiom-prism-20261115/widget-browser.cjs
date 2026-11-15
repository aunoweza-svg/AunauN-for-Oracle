// Live third-party widget check. Data/symbol availability is observed, not guaranteed.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'/tmp/axiom-browser-ready/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const dist=process.env.AXIOM_DIST||path.join(__dirname,'staged/dist'),out=process.env.AXIOM_WIDGET_ARTIFACTS||path.join(__dirname,'widget');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const n=req.url==='/'?'index.html':req.url.slice(1);if(!['index.html','app.js','model.js','style.css','NOTICE.txt'].includes(n)){res.writeHead(404);return res.end()};res.setHeader('Content-Type',n.endsWith('.js')?'text/javascript':n.endsWith('.css')?'text/css':n.endsWith('.txt')?'text/plain':'text/html');res.end(fs.readFileSync(path.join(dist,n)))});
(async()=>{let b;const results=[],errors=[],failures=[];try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));b=await chromium.launch({headless:true});const p=await b.newPage({viewport:{width:1360,height:960}});p.on('pageerror',e=>errors.push({message:e.message,stack:e.stack}));p.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure()?.errorText}));
 await p.goto('http://127.0.0.1:'+server.address().port,{waitUntil:'domcontentloaded'});await p.evaluate(()=>document.fonts.ready);
 for(const symbol of ['BINANCE:BTCUSDT.P','SET:SET','SET:PTT','SET:ADVANC']){
  await p.setViewportSize({width:1360,height:960});await p.selectOption('#symbol',symbol);
  if(symbol.startsWith('SET:')){assert.match(await p.locator('#market-availability').innerText(),/ไม่รองรับ/);assert.equal(new URL(await p.locator('#market-link').getAttribute('href')).searchParams.get('symbol'),symbol)}
  await p.waitForSelector('#tv iframe',{timeout:30000});
  const frame=await (await p.$('#tv iframe')).contentFrame();
  await frame.waitForFunction(()=>document.querySelectorAll('canvas').length>0||document.body&&/Invalid symbol|only available|symbol not found|สัญลักษณ์ไม่ถูกต้อง/i.test(document.body.innerText),{},{timeout:30000}).catch(()=>{});
  await p.waitForTimeout(4000);
  for(const viewport of [{width:1360,height:960},{width:390,height:844}]){
   await p.setViewportSize(viewport);await p.waitForTimeout(500);
   const boxes=await p.evaluate(()=>{const bounds=e=>{const r=e.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};return {outer:bounds(document.querySelector('#tv')),iframe:bounds(document.querySelector('#tv iframe')),scroll:document.documentElement.scrollWidth,width:innerWidth}});
   const {outer,iframe}=boxes;assert.ok(iframe.top>=outer.top&&iframe.bottom<=outer.bottom+1,'iframe must fit vertically inside fixed outer');assert.ok(iframe.left>=outer.left&&iframe.right<=outer.right+1,'iframe must fit horizontally');assert.ok(iframe.height>=outer.height-5,'iframe fills available widget height');assert.equal(boxes.scroll<=boxes.width,true,'no mobile overflow');
   const text=await frame.locator('body').innerText(),canvas=await frame.locator('canvas').count();const record={symbol,viewport,...boxes,canvas,text};results.push(record);console.log(JSON.stringify({symbol,viewport,height:iframe.height,canvas,text:text.slice(0,250)}));
   await p.screenshot({path:path.join(out,symbol.replaceAll(':','_')+'-'+viewport.width+'.png'),fullPage:true});
  }
 }
 assert.deepEqual(errors,[]);
 }finally{fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checkedAt:new Date().toISOString(),scope:'actual TradingView iframe/layout and visible text; not price validation against second feed',results,errors,failures},null,2));await b?.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
