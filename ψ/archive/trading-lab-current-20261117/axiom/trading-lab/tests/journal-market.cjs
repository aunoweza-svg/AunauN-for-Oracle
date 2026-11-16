const {test}=require('node:test'),assert=require('node:assert/strict');
const J=require('../dist/journal-view.js'),Market=require('../dist/market-view.js');
const t=(gross,entryFee,exitFee)=>({gross,entryFee,exitFee,net:gross-entryFee-exitFee});
test('journal summarizes closed net after both fees, never uses cash/UUID as profit',()=>{const trades=[t(10,.05,.055),t(-10,.05,.055)];const before=JSON.stringify(trades),sum=J.totals(trades);assert.equal(sum.count,2);assert.ok(Math.abs(sum.net+.21)<1e-12);assert.equal(sum.gross,0);assert.ok(Math.abs(sum.fees-.21)<1e-12);assert.equal(JSON.stringify(trades),before)});
test('empty journal is zero; mixed winning, losing, flat and legacy records add without extra fee deduction',()=>{assert.deepEqual(J.totals([]),{count:0,net:0,gross:0,fees:0});const all=[t(10,0,0),t(0,.1,.1),t(0,0,0)];assert.equal(J.totals(all).net,9.8);assert.equal(J.totals(all).count,3)});
const step=900000,end=1800000000000/step%1===0?1800000000000:Math.floor(1800000000000/step)*step,begin=end-500*step;
const rows=()=>Array.from({length:500},(_,i)=>[begin+i*step,'100','111','90','110','1',begin+(i+1)*step-1]);
test('market validates exactly500 closed continuous 15m bars',()=>{const result=Market.validateRows(rows(),begin,end);assert.equal(result.length,500);assert.equal(result.at(-1).time+900,end/1000);assert.equal(result[0].close,110)});
test('market rejects missing, duplicate, future/incomplete, malformed or inverted price data',()=>{for(const edit of [r=>r.pop(),r=>r[10]=r[9],r=>r[0][6]+=1,r=>r[0][0]+=1,r=>r[20][4]='NaN',r=>r[20][2]='95',r=>r[20][3]='120']){const r=rows();edit(r);assert.throws(()=>Market.validateRows(r,begin,end))}});
