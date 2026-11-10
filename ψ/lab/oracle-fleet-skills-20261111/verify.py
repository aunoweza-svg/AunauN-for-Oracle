"""Verify installed bytes, backups, frontmatter and native Codex discovery."""
from pathlib import Path
import hashlib
import json
import subprocess

ROOT=Path(__file__).resolve().parents[3];LAB=Path(__file__).resolve().parent
plan=json.loads((LAB/'install-plan.json').read_text())
installed=json.loads((LAB/'installed.json').read_text())
native=json.loads((LAB/'evidence/discovery-after.json').read_text())
counts={}
for item in installed:
    p=Path(item['destination'])
    assert hashlib.sha256(p.read_bytes()).hexdigest()==item['new_sha256'],p
    if item['backup']:
        assert hashlib.sha256((ROOT/item['backup']).read_bytes()).hexdigest()==item['old_sha256']
for role,cwd in plan['roots'].items():
    root=Path(cwd);group=native[role]
    assert not group['errors'],(role,group['errors'])
    expected=set(plan['common']+plan['extras'][role])
    enabled=[s for s in group['skills'] if s['enabled'] is not False]
    canonical={s['name'].split(':')[-1] for s in enabled}
    assert expected<=canonical,(role,sorted(expected-canonical))
    assert 'imagegen' in canonical,(role,'missing system imagegen')
    local=[s for s in enabled if Path(s['path']).is_relative_to(root/'.agents/skills')]
    assert len(local)==len({s['name'].split(':')[-1] for s in local}),role
    for skill in local:
        result=subprocess.run(['python3','/home/aunaun/.codex/skills/.system/skill-creator/scripts/quick_validate.py',
                               str(Path(skill['path']).parent)],capture_output=True,text=True)
        assert result.returncode==0,(role,skill['name'],result.stdout,result.stderr)
    counts[role]={'required_role_skills':len(expected),'repo_discovered':len(local),
                  'total_enabled':len(enabled),'system_imagegen':True,'discovery_errors':0}
(LAB/'evidence/verification.json').write_text(json.dumps({'files_verified':len(installed),'roles':counts},indent=2)+'\n')
print('PASS:',len(installed),'installed file hashes and original backups; all required skills discovered and valid')
for role,data in counts.items():print(role,data)
