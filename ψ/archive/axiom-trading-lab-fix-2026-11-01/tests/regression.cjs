const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(process.env.AXIOM_APP || path.join(__dirname, '../dist/app.js'), 'utf8');

// Stub only browser/service boundaries; drive actual click handlers and visible output.
function browser(stored = '[]', options = {}) {
  const nodes = new Map(), alerts = [], blobs = [];
  const values = {capital:'10000', qty:'1', fee:'0.05', reason:'regression', symbol:'BINANCE:BTCUSDT.P'};
  function node(id) {
    if (!nodes.has(id)) nodes.set(id, {value:values[id] || '', textContent:'', disabled:['start','next','long','short','close'].includes(id), clientWidth:800, style:{}, children:[], classList:{toggle(){}}, append(c){this.children.push(c)}, replaceChildren(){this.children=[]}, click(){this.clicked=true}});
    return nodes.get(id);
  }
  let saved=stored, failWrite=false, failRead=!!options.failRead, fetches=0;
  const now=Date.now(), base=Math.floor((now-90*86400000)/900000)*900000+900000;
  const rows=Array.from({length:202},(_,i)=>[base+i*900000,'100','111','89',i<200?'100':'110','1',base+(i+1)*900000-1]);
  const nav={dataset:{view:'journal'},classList:{toggle(){}}};
  const chart={remove(){},applyOptions(){},timeScale(){return {fitContent(){}}},addCandlestickSeries(){return {setData(){},update(){}}}};
  const URLStub=class extends URL {};
  URLStub.createObjectURL=b=>{blobs.push(b);return 'blob:fixture'};URLStub.revokeObjectURL=()=>{};
  const ctx={URL:URLStub,URLSearchParams,Blob,console,window:{LightweightCharts:{},addEventListener(){}},document:{querySelector:s=>node(s.slice(1)),querySelectorAll:s=>s==='nav button'?[nav]:[],createElement:tag=>node('created-'+tag)},LightweightCharts:{createChart:()=>chart},localStorage:{getItem(){if(failRead)throw Error('SecurityError');return saved},setItem(k,v){if(failWrite)throw Error('QuotaExceededError');saved=v}},alert:m=>alerts.push(m),fetch:async u=>{fetches++;return {ok:true,json:async()=>rows.filter(r=>r[0]>=Number(new URL(u).searchParams.get('startTime')))}}};
  function boot(){vm.runInNewContext(source,ctx)}
  boot();
  return {node,ctx,alerts,blobs,nav,boot,stored:()=>saved,fetches:()=>fetches,failWrite:v=>{failWrite=v},failRead:v=>{failRead=v},async load(){await node('load').onclick()},click:id=>node(id).onclick(),async start(){await this.load();this.click('start')},account:()=>node('account').textContent};
}

test('journal write failure keeps account unchanged; retry closes once',async()=>{
  const b=browser();await b.start();b.click('long');b.click('next');const before=b.account();
  b.failWrite(true);assert.doesNotThrow(()=>b.click('close'));assert.doesNotThrow(()=>b.click('close'));
  assert.equal(b.account(),before);assert.equal(b.stored(),'[]');assert.equal(b.node('close').disabled,false);
  b.failWrite(false);b.click('close');assert.match(b.account(),/10009\.90/);assert.equal(JSON.parse(b.stored()).length,1);
  b.click('close');assert.equal(JSON.parse(b.stored()).length,1);
});
test('new round and reload cannot discard an open position',async()=>{
  const b=browser();await b.start();b.click('long');const before=b.account(), count=b.fetches();
  b.click('start');await b.load();assert.equal(b.account(),before);assert.equal(b.fetches(),count);
  b.click('close');assert.equal(JSON.parse(b.stored()).length,1);
});
test('loading blocks controls and handlers; failed reload restores the previous run',async()=>{
  const b=browser();await b.start();const before=b.account();let resolve;
  b.ctx.fetch=()=>new Promise(r=>{resolve=r});const pending=b.load();
  for(const id of ['start','next','long','short','close'])assert.equal(b.node(id).disabled,true,id);
  b.click('start');b.click('long');b.click('next');assert.equal(b.account(),before);
  resolve({ok:false,status:503});await pending;assert.equal(b.account(),before);assert.equal(b.node('long').disabled,false);
  b.click('long');b.click('close');assert.equal(JSON.parse(b.stored()).length,1);
});
test('successful reload requires starting a new run before trading',async()=>{
  const b=browser();await b.start();await b.load();assert.equal(b.node('start').disabled,false);
  for(const id of ['next','long','short','close'])assert.equal(b.node(id).disabled,true,id);
  b.click('long');assert.equal(b.stored(),'[]');b.click('start');b.click('short');b.click('next');b.click('close');
  assert.equal(JSON.parse(b.stored())[0].net,-10.105);
});
for(const damaged of ['{bad','{}','null','[null]','[{"side":"Long","net":"invalid"}]']){
  test(`invalid journal ${damaged} keeps original and lets user export recovery`,async()=>{
    let b;assert.doesNotThrow(()=>{b=browser(damaged)});await b.start();b.nav.onclick();
    assert.match(b.node('storage-status').textContent,/บันทึก/);assert.equal(b.node('long').disabled,true);
    b.click('long');assert.equal(b.stored(),damaged);b.click('export');assert.equal(await b.blobs[0].text(),damaged);
  });
}
test('unavailable localStorage does not abort startup or allow unsafe journal writes',async()=>{
  let b;assert.doesNotThrow(()=>{b=browser('[]',{failRead:true})});await b.start();assert.equal(b.node('long').disabled,true);
});
test('valid historical journal remains readable and new trades retain it',async()=>{
  const b=browser();await b.start();b.click('long');b.click('next');b.click('close');const saved=b.stored();
  const restored=browser(saved);restored.nav.onclick();assert.equal(restored.node('records').children.length,1);
  await restored.start();restored.click('short');restored.click('close');assert.equal(JSON.parse(restored.stored()).length,2);
});
test('first load failure leaves trading disabled and retry recovers',async()=>{
  const b=browser(),fetch=b.ctx.fetch;b.ctx.fetch=async()=>({ok:false,status:503});await b.load();
  for(const id of ['start','next','long','short','close'])assert.equal(b.node(id).disabled,true,id);
  assert.doesNotThrow(()=>{b.click('start');b.click('long');b.click('close')});
  b.ctx.fetch=fetch;await b.start();assert.equal(b.node('long').disabled,false);
});
test('another tab changing storage is preserved when closing',async()=>{
  const b=browser();await b.start();b.click('long');const before=b.account();
  b.ctx.localStorage.setItem('axiom_records','{external');b.click('close');
  assert.equal(b.stored(),'{external');assert.equal(b.account(),before);assert.equal(b.node('close').disabled,false);
});
