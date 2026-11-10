"""Read-only public-provider connectivity smoke test. No portfolio/account data."""
import importlib.util
import json
from pathlib import Path
import subprocess
from datetime import datetime,timezone
import yfinance as yf

ROOT=Path(__file__).resolve().parents[3];LAB=Path(__file__).resolve().parent
results={}
try:
    prices=yf.download('SPY',period='5d',interval='1d',progress=False,threads=False,timeout=15)
    if prices.empty:raise RuntimeError('Yahoo returned no rows')
    results['yfinance']={'status':'passed','provider':'Yahoo Finance','test_ticker':'SPY',
                         'rows':len(prices),'last_observation':str(prices.index[-1])}
except Exception as exc:results['yfinance']={'status':'unavailable','error':type(exc).__name__,'message':str(exc)[:400]}
adapter=ROOT/'oracles/axiom-oracle/.agents/skills/hyperliquid-reader/scripts/public_info.py'
try:
    result=subprocess.run(['python3',str(adapter),'mids','--coin','BTC'],capture_output=True,text=True,timeout=35)
    data=json.loads(result.stdout)
    if result.returncode or not float(data['data']['BTC'])>0:raise RuntimeError(str(data)[:400])
    results['hyperliquid']={'status':'passed','endpoint':data['source'],'request_type':'allMids',
                            'retrieved_at':data['retrieved_at'],'test_coin':'BTC','positive_mid_received':True}
except Exception as exc:results['hyperliquid']={'status':'unavailable','error':type(exc).__name__,'message':str(exc)[:400]}
results['checked_at']=datetime.now(timezone.utc).isoformat()
(LAB/'evidence/providers.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results,indent=2))
