"""Read native Codex skills/list for all four Oracle cwds. No model turns."""
import argparse
import json
import os
from pathlib import Path
import selectors
import subprocess
import time

ROOT=Path(__file__).resolve().parents[3]
ROOTS={'aunaun':ROOT,'prism':ROOT/'oracles/prism-oracle',
       'lumina':ROOT/'oracles/lumina-oracle','axiom':ROOT/'oracles/axiom-oracle'}


def discover():
    proc=subprocess.Popen(['codex','--no-daemon','app-server','--stdio'],cwd=ROOT,
                          stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.DEVNULL)
    selector=selectors.DefaultSelector();selector.register(proc.stdout,selectors.EVENT_READ)
    buffer=b''
    def send(obj):
        proc.stdin.write((json.dumps(obj)+'\n').encode());proc.stdin.flush()
    def receive(i):
        nonlocal buffer
        until=time.monotonic()+45
        while time.monotonic()<until:
            if b'\n' in buffer:
                line,buffer=buffer.split(b'\n',1)
                try:d=json.loads(line)
                except json.JSONDecodeError:continue
                if d.get('id')==i:
                    if 'error' in d:raise RuntimeError(str(d['error']))
                    return d['result']
            elif selector.select(timeout=1):
                chunk=os.read(proc.stdout.fileno(),65536)
                if not chunk:raise RuntimeError('app-server closed stdout')
                buffer+=chunk
            elif proc.poll() is not None:raise RuntimeError('app-server exited')
        raise TimeoutError('skills/list timeout')
    try:
        send({'id':1,'method':'initialize','params':{'clientInfo':{'name':'aunaun-fleet-skill-check','version':'1'}}})
        receive(1);send({'method':'initialized','params':{}})
        send({'id':2,'method':'skills/list','params':{'cwds':[str(p) for p in ROOTS.values()],'forceReload':True}})
        data=receive(2);result={}
        for group in data.get('data',[]):
            cwd=group.get('cwd');name=next((n for n,p in ROOTS.items() if str(p)==cwd),cwd)
            result[name]={'cwd':cwd,'errors':group.get('errors',[]),'skills':[
                {k:s.get(k) for k in ['name','path','enabled','scope','description']}
                for s in group.get('skills',[])]}
        return result
    finally:
        selector.close();proc.terminate()
        try:proc.wait(timeout=5)
        except subprocess.TimeoutExpired:proc.kill();proc.wait()


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--output',required=True);args=p.parse_args()
    data=discover();Path(args.output).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    for name,group in data.items():
        print(name,'skills=',len(group['skills']),'errors=',len(group['errors']))
        print('  '+', '.join(s['name'] for s in group['skills'] if '/AunauN Oracle/' in s['path']))
