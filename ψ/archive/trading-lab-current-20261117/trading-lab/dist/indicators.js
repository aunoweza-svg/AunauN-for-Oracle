(function(root,factory){if(typeof module==='object')module.exports=factory(require('./cdc.js'),require('./mso.js'));else root.LabIndicators=factory(root.CDC,root.MSO)})(globalThis,(CDC,MSO)=>{
'use strict';
const SOURCES={cdc:'17be67ca761b508386b40dec2bad4f19aec8dec9e1f561fbbf5f2428c73fd248',mso:'baad49d91d4450cb511eaf5b93b6e4e97e59fc3e0ea1dd19ef7e5bb04cf9c97a'};
const DEFAULT={version:'1.0.0',sources:SOURCES,parity:'external-unverified',cdc:{enabled:true,source:'close',fast:12,slow:26,smooth:1,paint:true,showFast:true,showSlow:true,assist:true,signals:true,ribbon:false,ribbonPosition:'Top',fixedTimeframe:false,momentum:false},mso:{enabled:true,period:45,fast:12,slow:26,signal:9,histogram:true,scheme:'#1',momentumBackground:true,lineWidth:2,crossovers:true,overbought:1,oversold:-1}};
const copy=x=>JSON.parse(JSON.stringify(x));
function defaults(){return copy(DEFAULT)}
function validate(c){
 const fail=()=>{throw Error('การตั้งค่า indicator ไม่ถูกต้องหรือเวอร์ชันไม่รองรับ')};
 if(!c||c.version!==DEFAULT.version||c.parity!=='external-unverified'||(!c.sources||c.sources.cdc!==SOURCES.cdc||c.sources.mso!==SOURCES.mso)||!c.cdc||!c.mso)fail();
 for(const [group,spec] of Object.entries({root:DEFAULT,cdc:DEFAULT.cdc,mso:DEFAULT.mso})){const value=group==='root'?c:c[group];if(Object.keys(value).length!==Object.keys(spec).length||Object.keys(value).some(k=>!Object.hasOwn(spec,k)))fail()}
 for(const [group,keys] of [['cdc',['enabled','paint','showFast','showSlow','assist','signals','ribbon','fixedTimeframe','momentum']],['mso',['enabled','histogram','momentumBackground','crossovers']]])for(const key of keys)if(typeof c[group][key]!=='boolean')fail();
 for(const [group,key,min] of [['cdc','fast',1],['cdc','slow',1],['cdc','smooth',1],['mso','period',1],['mso','fast',1],['mso','slow',2],['mso','signal',2]])if(!Number.isInteger(c[group][key])||c[group][key]<min||c[group][key]>1000)fail();
 if(!['close','open','high','low','hl2','hlc3','ohlc4'].includes(c.cdc.source)||!['Top','Bottom'].includes(c.cdc.ribbonPosition)||c.cdc.fixedTimeframe||c.cdc.momentum||!['#1','#2'].includes(c.mso.scheme)||![1,2].includes(c.mso.lineWidth)||!Number.isFinite(c.mso.overbought)||c.mso.overbought<0.5||!Number.isFinite(c.mso.oversold)||c.mso.oversold>-.5)fail();
 return c;
}
function calculate(candles,config){validate(config);const c=CDC.calculate(candles,config.cdc),m=MSO.calculate(candles,config.mso);return candles.map((bar,i)=>({...c[i],...m[i],warmup:i+1<Math.max(config.cdc.fast,config.cdc.slow,config.cdc.smooth,config.mso.period,config.mso.fast,config.mso.slow,config.mso.signal)}))}
return {defaults,validate,calculate,SOURCES};
});
