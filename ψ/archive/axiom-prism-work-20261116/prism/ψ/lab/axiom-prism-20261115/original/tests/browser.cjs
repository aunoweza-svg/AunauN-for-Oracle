// Optional: PLAYWRIGHT_MODULE=/path/to/playwright node tests/browser.cjs
// Real Chromium + chart bundle; deterministic network fixtures, not a live-market test.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const dist=process.env.AXIOM_DIST || path.join(__dirname,'../dist');
const artifacts=process.env.AXIOM_BROWSER_ARTIFACTS || '/tmp/axiom-browser-results';
const chartBundle=process.env.AXIOM_CHART_BUNDLE;
const results=[];
fs.mkdirSync(artifacts,{recursive:true});
const server=http.createServer((req,res)=>{
  const name=req.url==='/'?'index.html':req.url.slice(1);
  if(!['index.html','app.js','style.css'].includes(name)){res.writeHead(404);res.end();return}
  res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html');
  res.end(fs.readFileSync(path.join(dist,name)));
});
(async()=>{
  let browser;
  try{
    await new Promise(r=>server.listen(0,'127.0.0.1',r));
    const origin=`http://127.0.0.1:${server.address().port}`;
    browser=await chromium.launch({headless:true});
    const context=await browser.newContext({viewport:{width:1280,height:900},acceptDownloads:true});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    let pending=null,hold=false,fail=false;
    const base=Math.floor((Date.now()-90*86400000)/900000)*900000+900000;
    const rows=Array.from({length:202},(_,i)=>[base+i*900000,'100','111','89',i<200?'100':'110','1',base+(i+1)*900000-1]);
    await context.route('**/*',async route=>{
      const u=new URL(route.request().url());
      if(u.hostname==='127.0.0.1')return route.continue();
      if(u.hostname==='unpkg.com'){
        if(chartBundle)return route.fulfill({path:chartBundle,contentType:'text/javascript'});
        return route.continue();
      }
      if(u.hostname==='fapi.binance.com'){
        if(hold)await new Promise(r=>{pending=r});
        if(fail)return route.fulfill({status:503,body:'unavailable',headers:{'access-control-allow-origin':'*'}});
        return route.fulfill({json:rows.filter(r=>r[0]>=Number(u.searchParams.get('startTime'))),headers:{'access-control-allow-origin':'*'}});
      }
      return route.abort(); // Widget/fonts intentionally outside deterministic regression scope.
    });
    await page.goto(origin);
    await page.click('[data-view="replay"]');
    await page.fill('#qty','1');
    await page.click('#load');await page.waitForFunction(()=>!document.querySelector('#start').disabled);
    await page.click('#start');await page.click('#long');await page.click('#next');
    const before=await page.locator('#account').innerText();
    await page.evaluate(()=>{
      window.originalSetItem=Storage.prototype.setItem;
      Storage.prototype.setItem=function(k,v){if(k==='axiom_records'&&window.failJournal)throw new DOMException('Storage full','QuotaExceededError');return window.originalSetItem.call(this,k,v)};
      window.failJournal=true;
    });
    await page.click('#close');await page.click('#close');
    assert.equal(await page.locator('#account').innerText(),before);
    assert.equal(await page.evaluate(()=>localStorage.getItem('axiom_records')),null);
    assert.equal(await page.locator('#load').isDisabled(),true);
    assert.equal(await page.locator('#start').isDisabled(),true);
    page.on('dialog',d=>d.dismiss());
    await page.evaluate(()=>{document.querySelector('#start').onclick();document.querySelector('#load').onclick()});
    assert.equal(await page.locator('#account').innerText(),before);
    await page.evaluate(()=>{window.failJournal=false});await page.click('#close');
    assert.match(await page.locator('#account').innerText(),/10009\.90/);
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('axiom_records')).length),1);
    results.push('quota failure/repeated close/retry and open-position reset/reload guards: PASS');

    const closedAccount=await page.locator('#account').innerText();
    hold=true;fail=true;await page.click('#load');
    await page.waitForFunction(()=>document.querySelector('#load').disabled);
    for(const id of ['start','next','long','short','close'])assert.equal(await page.locator('#'+id).isDisabled(),true,id);
    await page.evaluate(()=>{document.querySelector('#start').onclick();document.querySelector('#long').onclick();document.querySelector('#next').onclick()});
    assert.equal(await page.locator('#account').innerText(),closedAccount);
    while(!pending)await new Promise(r=>setTimeout(r,10));hold=false;pending();pending=null;
    await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('เก็บรอบเดิม'));
    assert.equal(await page.locator('#account').innerText(),closedAccount);
    fail=false;await page.click('#load');await page.waitForFunction(()=>!document.querySelector('#start').disabled);
    assert.equal(await page.locator('#long').isDisabled(),true);
    await page.click('#start');await page.click('#short');await page.click('#next');await page.click('#close');
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('axiom_records'))[0].net),-10.105);
    results.push('pending/failed/successful dataset reload and Short arithmetic: PASS');

    await page.click('[data-view="journal"]');
    const download=page.waitForEvent('download');await page.click('#export');
    const saved=await download;assert.equal(JSON.parse(fs.readFileSync(await saved.path(),'utf8')).length,2);
    await page.reload();await page.click('[data-view="journal"]');assert.equal(await page.locator('.record').count(),2);
    await page.setViewportSize({width:390,height:844});await page.click('[data-view="replay"]');
    await page.click('#load');await page.waitForFunction(()=>!document.querySelector('#start').disabled);await page.click('#start');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    const canvasHeight=await page.locator('#chart canvas').first().evaluate(e=>e.getBoundingClientRect().height);
    assert.ok(canvasHeight>0&&canvasHeight<=420);
    await page.screenshot({path:path.join(artifacts,'mobile.png'),fullPage:true});
    results.push('real localStorage reload, JSON download and mobile chart sizing: PASS');

    await context.addInitScript(()=>localStorage.setItem('axiom_records','{damaged'));
    await page.reload();await page.click('[data-view="replay"]');await page.click('#load');
    await page.waitForFunction(()=>!document.querySelector('#start').disabled);await page.click('#start');
    assert.equal(await page.locator('#long').isDisabled(),true);assert.equal(await page.locator('#next').isDisabled(),false);
    assert.equal(await page.evaluate(()=>localStorage.getItem('axiom_records')),'{damaged');
    await page.click('[data-view="journal"]');const recovery=page.waitForEvent('download');await page.click('#export');
    const raw=await recovery;assert.equal(fs.readFileSync(await raw.path(),'utf8'),'{damaged');
    assert.equal(errors.length,0,errors.join('\n'));
    results.push('corrupt journal preserves/exports raw original, replay still works; no page errors: PASS');
    console.log(JSON.stringify({scope:'Chromium with real chart library, fixture market responses; widget/fonts blocked',results},null,2));
    fs.writeFileSync(path.join(artifacts,'results.json'),JSON.stringify({results,errors},null,2));
  }finally{if(browser)await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
