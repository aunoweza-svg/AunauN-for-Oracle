"""Synthetic finance examples only; no investment recommendations or account access."""
import importlib.metadata as metadata
import importlib.util
import json
import math
from pathlib import Path
import numpy as np
import pandas as pd
from scipy.stats import norm
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import yfinance

ROOT=Path(__file__).resolve().parents[3];LAB=Path(__file__).resolve().parent

# DCF: a level perpetuity worth 100 at 10%, shown with an explicit finite forecast.
cashflows=np.full(3,10.0);discount=.10
dcf=sum(cashflows/(1+discount)**np.arange(1,4))+(10/discount)/(1+discount)**3
assert math.isclose(dcf,100.0,rel_tol=1e-12)
surprise=(2.2/2-1)*100;assert math.isclose(surprise,10.0)
prices=pd.DataFrame({'a':[100,110,99,108.9,119.79],'b':[50,55,49.5,54.45,59.895]})
returns=prices.pct_change().dropna();correlation=returns.corr().loc['a','b']
assert math.isclose(correlation,1.0,rel_tol=1e-12)
spread_bps=(101-99)/((101+99)/2)*10000;assert spread_bps==200
spots=np.array([90,100,110]);payoff=(np.maximum(spots-100,0)-5)*100
assert payoff.tolist()==[-500,-500,500]
premium=(102/100-1)*100;assert math.isclose(premium,2.0)
trend=pd.Series(np.arange(1,261,dtype=float))
assert trend.iloc[-1]>trend.rolling(50).mean().iloc[-1]>trend.rolling(150).mean().iloc[-1]>trend.rolling(200).mean().iloc[-1]
assert math.isclose(norm.cdf(0),.5)

adapter=ROOT/'oracles/axiom-oracle/.agents/skills/hyperliquid-reader/scripts/public_info.py'
spec=importlib.util.spec_from_file_location('axiom_public_info',adapter);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
for unsupported in ['userState','order','withdraw','spotClearinghouseState']:
    try:module.request_body(unsupported,'BTC',now_ms=1000000000000)
    except ValueError:pass
    else:raise AssertionError('A non-market request was accepted')
assert module.request_body('mids','BTC')=={'type':'allMids'}
assert module.request_body('candles','BTC',limit=10,now_ms=1000000000000)['req']['startTime']==999964000000

fig,ax=plt.subplots();ax.plot(spots,payoff);ax.axhline(0,color='black',linewidth=.7)
ax.set(xlabel='Hypothetical spot',ylabel='Expiry P&L',title='Synthetic option example — not market data')
fig.savefig(LAB/'evidence/finance-synthetic.png');plt.close(fig)
versions={name:metadata.version(name) for name in ['yfinance','numpy','pandas','scipy','matplotlib']}
result={'data':'synthetic fixtures only','versions':versions,'dcf':float(dcf),'earnings_surprise_pct':surprise,
        'return_correlation':float(correlation),'spread_bps':spread_bps,'call_expiry_payoff':payoff.tolist(),
        'etf_premium_pct':premium,'trend_ma_order':True,'account_and_write_api_requests_rejected':True}
(LAB/'evidence/finance-smoke.json').write_text(json.dumps(result,indent=2)+'\n')
lock='\n'.join(sorted(d.metadata['Name']+'=='+d.version for d in metadata.distributions()))+'\n'
(ROOT/'oracles/axiom-oracle/tools/finance/requirements.lock.txt').write_text(lock)
print('PASS: isolated finance imports, numeric examples, chart rendering, public-only request guards')
