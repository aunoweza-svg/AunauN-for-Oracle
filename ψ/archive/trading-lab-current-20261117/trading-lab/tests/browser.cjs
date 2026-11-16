// Chromium acceptance with real chart v4.2.3; synthetic prices ONLY in this suite.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const dist=process.env.AXIOM_DIST||path.join(__dirname,'../dist'),artifacts=process.env.AXIOM_BROWSER_ARTIFACTS||'/tmp/axiom-browser-results-v2';
const KEY='axiom_lab_v2',BACKUP='axiom_lab_v2_backup',results=[],errors=[];
results.push=function(s){console.log(s);return Array.prototype.push.call(this,s)};
fs.mkdirSync(artifacts,{recursive:true});
const server=http.createServer((req,res)=>{const file=req.url==='/'?'index.html':req.url.slice(1);if(!['index.html','app.js','model.js','cdc.js','mso.js','indicators.js','indicator-view.js','journal-view.js','market-view.js','tradingview-launcher.js','own-chart.js','pine/cdc-actionzone-v3-2020.pine','pine/modified-stochastic-macd-oscillator.pine','style.css','NOTICE.txt'].includes(file)){res.writeHead(404);return res.end()};res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(path.join(dist,file)))});
(async()=>{let browser;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch({headless:true});
 const ctx=await browser.newContext({viewport:{width:1280,height:900},acceptDownloads:true});
 let mode='ok',hold=false,releaseNetwork;const providerRequests=[];
 const end=Math.floor(Date.now()/900000)*900000,base=end-90*86400000;
 const rows=Array.from({length:8640},(_,i)=>[base+i*900000,'100','120','80',i<200?'100':'110','1',base+(i+1)*900000-1]);
 await ctx.route('**/*',async route=>{const u=new URL(route.request().url());if(['fapi.binance.com','api.binance.com','s3.tradingview.com'].includes(u.hostname))providerRequests.push(u.href);if(u.hostname==='127.0.0.1')return route.continue();
  if(u.hostname==='unpkg.com')return process.env.AXIOM_CHART_BUNDLE?route.fulfill({body:fs.readFileSync(process.env.AXIOM_CHART_BUNDLE,'utf8')+';window.testCharts=[];window.originalCreateChart=window.LightweightCharts.createChart;window.LightweightCharts={...window.LightweightCharts,createChart:(...args)=>{const c=window.originalCreateChart(...args);c.testLines=[];const add=c.addLineSeries.bind(c);c.addLineSeries=o=>{const line=add(o);c.testLines.push(line);return line};c.testContainer=args[0].id;window.testCharts.push(c);return c}};',contentType:'text/javascript'}):route.continue();
  if(['fapi.binance.com','api.binance.com'].includes(u.hostname)){
   if(hold)await new Promise(r=>releaseNetwork=r);
   if(mode==='http')return route.fulfill({status:503,body:'test failure'});
   let fixture=rows;if(mode==='gap')fixture=rows.filter((_,i)=>i!==202);
   if(mode==='duplicate')fixture=[...rows.slice(0,202),rows[201],...rows.slice(202)];
   if(mode==='badClose')fixture=rows.map((r,i)=>i===201?[...r.slice(0,6),r[6]+1]:r);
   return route.fulfill({json:fixture.filter(r=>r[0]>=Number(u.searchParams.get('startTime'))).slice(0,Number(u.searchParams.get('limit')||1000))});
  }return route.abort(); // deterministic suite never claims live widget/feed success
 });
 await ctx.addInitScript(()=>{window.WebSocket=class{close(){}}});
 const page=await ctx.newPage();let confirms=0;page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>{confirms++;d.accept()});
 const click=async id=>{await page.click('#'+id);await page.waitForFunction(()=>!document.querySelector('#export').disabled)};
 const snap=()=>page.evaluate(k=>localStorage.getItem(k),KEY);
 const state=async()=>JSON.parse(await snap());
 async function load(){await page.click('#load');await page.waitForFunction(()=>!document.querySelector('#load').disabled)}
 async function importJSON(obj){await page.setInputFiles('#import-file',{name:'snapshot.json',mimeType:'application/json',buffer:Buffer.from(typeof obj==='string'?obj:JSON.stringify(obj))});await click('import')}
 await page.goto(origin);await page.waitForFunction(()=>!document.querySelector('#export').disabled);
 for(const symbol of ['SET:SET','SET:PTT','SET:ADVANC']){await page.selectOption('#symbol',symbol);assert.match(await page.locator('#market-availability').textContent(),/TradingView/);assert.equal(new URL(await page.locator('#market-link').getAttribute('href')).searchParams.get('symbol'),symbol)}
 assert.ok(providerRequests.every(url=>new URL(url).searchParams.get('limit')==='500'));assert.equal(await page.locator('#own-chart-workspace').count(),1);
 results.push('native market startup is limited to 500 closed bars, SET symbols retain TradingView links: PASS');
 await page.click('[data-view="replay"]');
 await page.fill('#qty','1');await load();await click('start');assert.equal(await snap(),null); // explicit acknowledgement
 await page.check('#ack');await click('start');
 assert.equal((await state()).runs[0].index,199);
 assert.equal(await page.evaluate(()=>series.data().length),200); // future hidden in actual chart series
 const selected=new Date(base+250*900000).toISOString().slice(0,16);
 await page.fill('#replay-date',selected);await click('start');assert.equal((await state()).runs.at(-1).startIndex,250);
 const invalid=new Date(base+251*900000+60000).toISOString().slice(0,16);await page.fill('#replay-date',invalid);const beforeDate=await snap();await click('start');assert.equal(await snap(),beforeDate);
 await page.fill('#replay-date',new Date(base+199*900000).toISOString().slice(0,16));await click('start');
 results.push('UTC start selection/exact quarter hour, acknowledgement, real chart prefix without future candles: PASS');
 await click('long');await click('next');const open=await snap(),before=await page.locator('#account').innerText();
 await page.evaluate(()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='axiom_lab_v2'&&window.failWrite)throw Error('QuotaExceededError');return window.originalSet.call(this,k,v)};window.failWrite=true});
 await click('close');await click('close');assert.equal(await snap(),open);assert.equal(await page.locator('#account').innerText(),before);
 await page.evaluate(()=>{document.querySelector('#start').onclick();document.querySelector('#load').onclick()});assert.equal(await snap(),open);
 await page.reload();await page.waitForFunction(()=>!document.querySelector('#export').disabled);await page.click('[data-view="replay"]');assert.equal(await snap(),open);assert.match(await page.locator('#account').innerText(),/Long 1 BTC/);
 await click('close');await page.evaluate(()=>document.querySelector('#close').onclick());assert.equal((await state()).runs.at(-1).trades.length,1);assert.equal((await state()).runs.at(-1).trades[0].net,9.895);
 await page.click('[data-view="journal"]');assert.match(await page.locator('.trade-pnl').first().innerText(),/กำไรสุทธิ[\s\S]*9\.895/);assert.equal(await page.locator('.journal-technical').first().evaluate(e=>e.open),false);assert.doesNotMatch(await page.locator('.journal-run>h3').first().innerText(),/ds_|[a-f0-9]{8}_/);await page.click('[data-view="replay"]');
 await page.fill('#qty','1');await click('short');await page.fill('#fee','9');await click('close');assert.equal((await state()).runs.at(-1).trades[1].net,-0.11);
 await page.click('[data-view="journal"]');assert.match(await page.locator('.trade-card[data-result=loss] .trade-pnl').first().innerText(),/ขาดทุนสุทธิ[\s\S]*0\.11/);assert.match(await page.locator('#journal-overview .pnl').innerText(),/9\.785/);await page.click('[data-view="replay"]');results.push('readable Thai journal exposes positive/negative net after both fees and hides raw run IDs in closed details: PASS');
 results.push('quota/retry/double close, reset/load open-position guards, reload preserves open position, Long/Short and frozen entry fee: PASS');
 const prior=await snap();hold=true;mode='http';await page.click('#load');await page.waitForFunction(()=>document.querySelector('#start').disabled);
 await page.evaluate(()=>{document.querySelector('#start').onclick();document.querySelector('#long').onclick();document.querySelector('#next').onclick()});assert.equal(await snap(),prior);
 while(!releaseNetwork)await new Promise(r=>setTimeout(r,10));hold=false;releaseNetwork();await page.waitForFunction(()=>!document.querySelector('#load').disabled);assert.equal(await snap(),prior);
 for(const failure of ['gap','duplicate','badClose']){mode=failure;await load();assert.match(await page.locator('#status').innerText(),/โหลดไม่สำเร็จ/);assert.equal(await snap(),prior)}
 mode='ok';await load();assert.equal(await page.locator('#long').isDisabled(),true);
 await page.check('#ack');await click('start');
 results.push('pending/failed reload guards; missing, duplicate and malformed close-time datasets rejected without replacing run: PASS');
 await page.click('[data-view="journal"]');const dl=page.waitForEvent('download');await click('export');const exported=JSON.parse(fs.readFileSync(await (await dl).path(),'utf8'));
 assert.equal(exported.schemaVersion,2);assert.ok(exported.limitations.some(s=>s.includes('liquidation')));assert.ok(exported.datasets[0].sha256);
 const beforeImport=await snap();await importJSON('{bad');assert.equal(await snap(),beforeImport);
 const invalidCases=[s=>s.schemaVersion=99,s=>s.runs[0].balance+=1,s=>s.datasets[0].candles[0].close+=1,s=>s.datasets[0].fetchedAt=s.datasets[0].end*1000-1,s=>s.datasets[0].fetchedAt=Date.now()+3600000];
 for(const edit of invalidCases){const bad=JSON.parse(JSON.stringify(exported));edit(bad);await importJSON(bad);assert.equal(await snap(),beforeImport)}
 await importJSON(exported);assert.equal(await page.evaluate(k=>localStorage.getItem(k),BACKUP),beforeImport);
 await click('restore');assert.equal(JSON.parse(await snap()).runs.length,exported.runs.length);
 results.push('JSON download has dataset/schema/limitations; invalid JSON/version/ledger/checksum/future candles rejected; validated import and pre-import backup restore: PASS');
 // Hold SHA256 to reproduce the reviewer-reported import race, then invoke handlers directly.
 await page.setInputFiles('#import-file',{name:'snapshot.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(exported))});
 await page.evaluate(()=>{window.realDigest=crypto.subtle.digest.bind(crypto.subtle);crypto.subtle.digest=async(...args)=>{await new Promise(r=>window.releaseDigest=r);return window.realDigest(...args)}});
 const preRace=await snap(),confirmsBefore=confirms;
 await page.evaluate(()=>{document.querySelector('#import').onclick()});await page.waitForFunction(()=>typeof window.releaseDigest==='function');
 await page.click('[data-view="replay"]');assert.equal(await page.locator('#long').isDisabled(),true);
 await page.evaluate(()=>{document.querySelector('#long').onclick();document.querySelector('#start').onclick();document.querySelector('#next').onclick();document.querySelector('#restore').onclick();document.querySelector('#import').onclick()});
 assert.equal(await snap(),preRace);
 await page.evaluate(()=>{crypto.subtle.digest=window.realDigest;window.releaseDigest()});await page.waitForFunction(()=>!document.querySelector('#export').disabled);
 assert.equal(confirms,confirmsBefore+1);assert.equal((await state()).runs.at(-1).position,null);
 await page.fill('#qty','1');await click('long');const held=await snap();
 await page.evaluate(()=>{document.querySelector('#import').onclick();document.querySelector('#restore').onclick()});assert.equal(await snap(),held);await click('close');
 results.push('delayed SHA256 import locks direct trade/start/next/import/restore handlers; one confirmation only; existing position blocks import/restore: PASS');
 // Multi-tab conflict uses actual Web Locks and storage events.
 const other=await ctx.newPage();other.on('pageerror',e=>errors.push(e.message));await other.goto(origin);await other.waitForFunction(()=>!document.querySelector('#export').disabled);
 await click('next');await other.waitForFunction(()=>document.querySelector('#storage-status').textContent.includes('อีกแท็บ'));
 const shared=await snap();await other.evaluate(()=>{document.querySelector('#long').onclick();document.querySelector('#start').onclick()});assert.equal(await snap(),shared);await other.close();
 results.push('second tab detects external snapshot and stale handlers cannot overwrite it: PASS');
 // File.text is async too: lock before reading, not just before digest.
 await page.click('[data-view="journal"]');
 await page.evaluate(()=>{window.realFileText=File.prototype.text;File.prototype.text=async function(){await new Promise(r=>window.releaseFileRead=r);return window.realFileText.call(this)}});
 const beforeRead=await snap();
 await page.evaluate(()=>{document.querySelector('#import').onclick()});await page.waitForFunction(()=>typeof window.releaseFileRead==='function');
 await page.evaluate(()=>{document.querySelector('#long').onclick();document.querySelector('#import').onclick();document.querySelector('#restore').onclick()});
 assert.equal(await snap(),beforeRead);
 await page.evaluate(()=>{File.prototype.text=window.realFileText;window.releaseFileRead()});await page.waitForFunction(()=>!document.querySelector('#export').disabled);
 assert.equal((await state()).runs.at(-1).position,null);
 results.push('delayed File.text also locks trading and duplicate import/restore before validation: PASS');
 // Block all writes in each account transition: no action may partially commit.
 await page.click('[data-view="replay"]');await page.check('#ack');
 await page.evaluate(()=>{window.realStorageWrite=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='axiom_lab_v2'&&window.rejectWrite)throw Error('test quota');return window.realStorageWrite.call(this,k,v)};window.rejectWrite=true});
 const noWrite=await snap();await click('start');await click('next');await click('long');assert.equal(await snap(),noWrite);
 await page.evaluate(()=>window.rejectWrite=false);
 await page.click('[data-view="journal"]');const beforeBackup=await snap();
 await page.evaluate(()=>{window.backupStorageWrite=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='axiom_lab_v2_backup')throw Error('backup quota');return window.backupStorageWrite.call(this,k,v)}});
 await importJSON(exported);assert.equal(await snap(),beforeBackup);
 await page.evaluate(()=>Storage.prototype.setItem=window.backupStorageWrite);
 results.push('start/next/open write failure and pre-import backup failure leave current snapshot untouched: PASS');
 await page.click('[data-view="replay"]');

 // Wait for resize handlers and chart layout, then assert measurable containment.
 // Screenshots are artifacts only; none are used as a layout delay.
 async function settledLayout(){
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  await page.waitForFunction(()=>{
   const chart=document.querySelector('#chart'),account=document.querySelector('#account');
   const canvas=chart.querySelector('canvas');if(!canvas)return false;
   const c=chart.getBoundingClientRect(),a=canvas.getBoundingClientRect();
   return document.documentElement.scrollWidth<=innerWidth&&account.scrollWidth<=account.clientWidth
     &&a.width>0&&a.height>0&&a.right<=c.right+1&&a.bottom<=c.bottom+1;
  },null,{polling:'raf',timeout:5000});
 }
 const layouts=[];
 for(const label of ['W'.repeat(200),'']){
  await page.setViewportSize({width:1280,height:900});
  await page.fill('#run-label',label);await click('start');
  assert.equal((await state()).runs.at(-1).label,label);
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
   await page.setViewportSize(viewport);await settledLayout();
   const box=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,accountWidth:document.querySelector('#account').clientWidth,accountScroll:document.querySelector('#account').scrollWidth,chartHeight:document.querySelector('#chart canvas').getBoundingClientRect().height}));
   assert.equal(box.scroll<=box.viewport,true);assert.equal(box.accountScroll<=box.accountWidth,true);
   assert.ok(box.chartHeight>0&&box.chartHeight<=(viewport.width===390?420:540));
   layouts.push({label:label?'200 unbroken W characters':'empty label / generated UUID',...box});
  }
 }
 fs.writeFileSync(path.join(artifacts,'layout-results.json'),JSON.stringify(layouts,null,2));
 await page.locator('#next').focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>!document.querySelector('#export').disabled);await settledLayout();
 await page.screenshot({path:path.join(artifacts,'mobile.png'),fullPage:true});
 await page.setViewportSize({width:1280,height:900});await settledLayout();
 await page.screenshot({path:path.join(artifacts,'desktop.png'),fullPage:true});
 results.push('200-character unbroken run label and empty-label UUID fit desktop/mobile after chart-filled resize settles; keyboard activation: PASS');
 // Indicator-specific acceptance; account tests above are unchanged.
 await page.click('[data-view="replay"]');await page.locator('#indicator-settings summary').click();
 await page.fill('#ind-cdc-fast','6');await page.uncheck('#ind-cdc-assist');await click('start');
 let cfg=(await state()).runs.at(-1).indicators;assert.equal(cfg.cdc.fast,6);assert.equal(cfg.cdc.assist,false);assert.equal(cfg.version,'1.0.0');assert.equal(cfg.sources.cdc.length,64);
 assert.equal(await page.locator('#cdc-assist').isVisible(),false);assert.equal(await page.locator('#cdc-assist').innerText(),'');
 await page.check('#ind-cdc-assist');await click('start');assert.equal(await page.locator('#cdc-assist').isVisible(),true);assert.match(await page.locator('#cdc-assist').innerText(),/currently in a/);
 await page.fill('#ind-cdc-fast','0');const invalidSettings=await snap();await click('start');assert.equal(await snap(),invalidSettings);await page.fill('#ind-cdc-fast','12');
 await page.fill('#ind-mso-period','30');await page.selectOption('#ind-mso-scheme','#2');await click('start');cfg=(await state()).runs.at(-1).indicators;
 await page.fill('#ind-mso-period','45');assert.equal((await state()).runs.at(-1).indicators.mso.period,30); // active config is frozen
 await page.uncheck('#display-cdc');await page.uncheck('#display-mso');assert.equal(await page.locator('#oscillator').isVisible(),false);await page.check('#display-cdc');await page.check('#display-mso');
 assert.equal(await page.locator('#oscillator').isVisible(),true);assert.deepEqual((await state()).runs.at(-1).indicators,cfg);
 await page.reload();await page.waitForFunction(()=>!document.querySelector('#export').disabled);await page.click('[data-view="replay"]');assert.deepEqual((await state()).runs.at(-1).indicators,cfg);
 results.push('indicator validated settings/frozen config, source metadata, assist option, display toggles and reload persistence: PASS');
 await page.evaluate(()=>window.testCharts.find(c=>c.testContainer==='chart').timeScale().setVisibleLogicalRange({from:100,to:150}));
 await page.waitForFunction(()=>Math.abs(window.testCharts.find(c=>c.testContainer==='chart').timeScale().getVisibleLogicalRange().from-window.testCharts.find(c=>c.testContainer==='oscillator').timeScale().getVisibleLogicalRange().from)<1e-6);
 await page.evaluate(()=>window.testCharts.find(c=>c.testContainer==='oscillator').timeScale().setVisibleLogicalRange({from:110,to:155}));
 await page.waitForFunction(()=>Math.abs(window.testCharts.find(c=>c.testContainer==='chart').timeScale().getVisibleLogicalRange().from-window.testCharts.find(c=>c.testContainer==='oscillator').timeScale().getVisibleLogicalRange().from)<1e-6);
 await page.setViewportSize({width:390,height:844});await settledLayout();
 await page.waitForFunction(()=>{const line=window.testCharts.find(c=>c.testContainer==='oscillator').testLines[0],h=document.querySelector('#oscillator').clientHeight;return [-1,1].every(v=>{const y=line.priceToCoordinate(v);return y!==null&&y>=0&&y<h})});
 assert.equal(await page.evaluate(()=>document.querySelector('#oscillator').scrollWidth<=document.querySelector('#oscillator').clientWidth),true);
 await page.screenshot({path:path.join(artifacts,'indicators-mobile.png'),fullPage:true});await page.setViewportSize({width:1280,height:900});await settledLayout();await page.screenshot({path:path.join(artifacts,'indicators-desktop.png'),fullPage:true});
 results.push('actual v4.2.3 oscillator primitives, synchronized ranges in both directions, mobile chart sizing: PASS');
 // An imported old v2 open position must remain untouched and carry no invented indicator settings.
 const legacy=await state();for(const r of legacy.runs)delete r.indicators;
 await page.click('[data-view="journal"]');await importJSON(legacy);assert.equal((await state()).runs.at(-1).indicators,undefined);await page.click('[data-view="replay"]');assert.match(await page.locator('#indicator-legend').innerText(),/v2/);
 await page.fill('#qty','1');await click('long');const legacyOpen=await snap();await page.reload();await page.waitForFunction(()=>!document.querySelector('#export').disabled);await page.click('[data-view="replay"]');assert.equal(await snap(),legacyOpen);assert.equal((await state()).runs.at(-1).indicators,undefined);await click('close');
 results.push('old v2 migration keeps config absent and open position/account byte-for-byte across reload: PASS');
 // External TradingView setup and preferences must preserve the replay ledger.
 const replayBeforeMarket=await snap();await page.click('[data-view="market"]');await page.selectOption('#symbol','BINANCE:BTCUSDT');
 await page.locator('#tv-reference summary').first().click();
 const marketLink=new URL(await page.locator('#market-link').getAttribute('href'));assert.equal(marketLink.hostname,'www.tradingview.com');assert.equal(marketLink.searchParams.get('symbol'),'BINANCE:BTCUSDT');assert.equal(marketLink.searchParams.get('interval'),'15');assert.equal(await page.locator('#market-link').getAttribute('target'),'_blank');
 assert.match(await page.locator('#market').innerText(),/ยังไม่เพิ่ม CDC\/MSO ให้อัตโนมัติ/);
 for(const value of ['https://evil.example/chart/TestLayout/','https://www.tradingview.com.evil.example/chart/TestLayout/','https://www.tradingview.com/script/TestLayout/']){await page.fill('#tv-layout',value);await page.click('#tv-layout-form button[type=submit]');assert.equal(await page.locator('#saved-layout-link').isVisible(),false);assert.equal(await page.evaluate(()=>localStorage.getItem('axiom_tv_layout_v1')),null)}
 await page.fill('#tv-layout','https://www.tradingview.com/chart/TestLayout/?tracking=test#fragment');await page.click('#tv-layout-form button[type=submit]');assert.equal(await page.locator('#saved-layout-link').getAttribute('href'),'https://www.tradingview.com/chart/TestLayout/');assert.equal(await snap(),replayBeforeMarket);
 await page.reload();await page.waitForFunction(()=>!document.querySelector('#export').disabled);assert.equal(await page.locator('#saved-layout-link').evaluate(e=>!e.classList.contains('hidden')),true);await page.locator('#tv-reference summary').first().click();assert.equal(await snap(),replayBeforeMarket);
 await page.evaluate(()=>{navigator.clipboard.writeText=async text=>{window.copiedPine=text}});
 for(const name of ['cdc-actionzone-v3-2020.pine','modified-stochastic-macd-oscillator.pine']){await page.click(`[data-copy-pine="pine/${name}"]`);await page.waitForFunction(()=>![...document.querySelectorAll('[data-copy-pine]')].some(b=>b.disabled));assert.equal(await page.evaluate(()=>window.copiedPine),fs.readFileSync(path.join(dist,'../source',name),'utf8'));assert.equal(fs.readFileSync(path.join(dist,'pine',name),'utf8'),fs.readFileSync(path.join(dist,'../source',name),'utf8'))}
 await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw Error('test denial')}});await page.click('[data-name="CDC"]');await page.waitForFunction(()=>document.querySelector('#pine-copy-status').textContent.includes('ดาวน์โหลด'));
 const pineDownload=page.waitForEvent('download');await page.click('a[download][href="pine/cdc-actionzone-v3-2020.pine"]');assert.equal(fs.readFileSync(await (await pineDownload).path(),'utf8'),fs.readFileSync(path.join(dist,'../source/cdc-actionzone-v3-2020.pine'),'utf8'));
 await page.click('#tv-layout-clear');assert.equal(await page.locator('#saved-layout-link').isVisible(),false);assert.equal(await page.evaluate(()=>localStorage.getItem('axiom_tv_layout_v1')),null);assert.equal(await snap(),replayBeforeMarket);
 await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>document.documentElement.scrollWidth<=innerWidth);await page.screenshot({path:path.join(artifacts,'tradingview-mobile.png'),fullPage:true});await page.setViewportSize({width:1280,height:900});await page.screenshot({path:path.join(artifacts,'tradingview-desktop.png'),fullPage:true});
 await page.click('[data-view="journal"]');await page.screenshot({path:path.join(artifacts,'journal-mobile.png'),fullPage:true});
 results.push('TradingView launcher, trusted saved layout reload/clear, exact Pine clipboard/download fallback and unchanged replay snapshot: PASS');
 // Fresh context with damaged originals: export raw and recover through validated import without deleting old data.
 await page.evaluate(()=>{localStorage.setItem('axiom_records','{legacy-damaged');localStorage.setItem('axiom_lab_v2','{v2-damaged')});await page.reload();await page.waitForFunction(()=>!document.querySelector('#export').disabled);
 await page.click('[data-view="journal"]');const rawDL=page.waitForEvent('download');await click('export');const recovery=JSON.parse(fs.readFileSync(await (await rawDL).path(),'utf8'));assert.equal(recovery.v2,'{v2-damaged');assert.equal(recovery.legacy,'{legacy-damaged');
 await importJSON(exported);assert.equal(await page.evaluate(()=>localStorage.getItem('axiom_records')),'{legacy-damaged');assert.equal(await page.evaluate(k=>localStorage.getItem(k),BACKUP),'{v2-damaged');
 assert.equal((await state()).schemaVersion,2);
 results.push('damaged v2/legacy originals exported exactly; validated recovery import preserves original legacy and backup of damaged snapshot: PASS');
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(artifacts,'results.json'),JSON.stringify({scope:'Chromium, actual chart, synthetic Binance fixtures, external widget/fonts blocked',results,errors},null,2));console.log(JSON.stringify({results,errors},null,2));
 }finally{if(browser)await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
