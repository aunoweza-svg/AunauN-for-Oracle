"""Query Codex's native skills/list without creating a thread or model turn."""
import json
from pathlib import Path
import selectors
import subprocess
import time

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent / 'evidence'
NAMES = {'rrr','forward','learn','trace','where-we-are','herdr','herdr-whoami',
         'herdr-neighbors','herdr-peek','herdr-hey','herdr-structure'}


def main():
    proc = subprocess.Popen(['codex','--no-daemon','app-server','--stdio'], cwd=ROOT,
                            stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                            stderr=subprocess.DEVNULL)
    selector = selectors.DefaultSelector()
    selector.register(proc.stdout, selectors.EVENT_READ)
    buffer = b''

    def send(data):
        proc.stdin.write((json.dumps(data)+'\n').encode())
        proc.stdin.flush()

    def response(req_id):
        nonlocal buffer
        deadline=time.monotonic()+40
        while time.monotonic()<deadline:
            if b'\n' in buffer:
                line,buffer=buffer.split(b'\n',1)
                try: data=json.loads(line)
                except json.JSONDecodeError: continue
                if data.get('id')==req_id:
                    if 'error' in data: raise RuntimeError(str(data['error']))
                    return data['result']
                continue
            if proc.poll() is not None: raise RuntimeError('Codex app-server exited before response')
            if selector.select(timeout=1):
                import os
                chunk=os.read(proc.stdout.fileno(),65536)
                if not chunk: raise RuntimeError('Codex app-server closed stdout')
                buffer+=chunk
        raise TimeoutError('No native skills/list response within 40 seconds')

    try:
        send({'id':1,'method':'initialize','params':{'clientInfo':{'name':'aunaun-skills-check','version':'1'}}})
        response(1)
        send({'method':'initialized','params':{}})
        send({'id':2,'method':'skills/list','params':{'cwds':[str(ROOT)],'forceReload':True}})
        data=response(2)
        projected=[]
        errors=[]
        for group in data.get('data',[]):
            errors.extend(group.get('errors',[]))
            for skill in group.get('skills',[]):
                if skill.get('name') in NAMES and str(ROOT/'.agents/skills') in skill.get('path',''):
                    projected.append({k:skill.get(k) for k in ['name','path','enabled','scope','description']})
        result={'skills':sorted(projected,key=lambda x:x['name']),'errors':errors,
                'method':'skills/list','created_model_turns':0}
        OUT.mkdir(parents=True,exist_ok=True)
        (OUT/'codex-discovery.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
        found={s['name'] for s in projected if s.get('enabled') is not False}
        assert found==NAMES, f'Missing/disabled: {sorted(NAMES-found)}'
        assert not errors, f'Skill load errors: {errors}'
        print('PASS: native Codex skills/list discovers all 11 repo skills, enabled, no load errors; no model turns')
    finally:
        selector.close()
        proc.terminate()
        try: proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill();proc.wait()


if __name__=='__main__': main()
