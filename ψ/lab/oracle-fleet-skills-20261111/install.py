"""Install the prepared allowlisted files; back up replacements and reject concurrent edits."""
from pathlib import Path
import argparse
import hashlib
import json
import shutil

LAB=Path(__file__).resolve().parent
ROOT=LAB.parents[2]
ROOTS={'aunaun':ROOT,'prism':ROOT/'oracles/prism-oracle',
       'lumina':ROOT/'oracles/lumina-oracle','axiom':ROOT/'oracles/axiom-oracle'}


def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()


def paths(plan,entry):
    role=entry['role'];rel=Path(entry['path'])
    if role not in ROOTS or rel.is_absolute() or '..' in rel.parts:raise ValueError('Invalid install entry')
    src=Path(plan['stage'])/role/rel;dst=ROOTS[role]/'.agents/skills'/rel
    if not dst.resolve().is_relative_to((ROOTS[role]/'.agents/skills').resolve()):raise ValueError('Target escapes skill root')
    return src,dst


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--finalize-plan',action='store_true');args=parser.parse_args()
    plan_path=LAB/'install-plan.json';plan=json.loads(plan_path.read_text())
    if args.finalize_plan:
        # Include helper files added after the initial preparation.
        baseline={(e['role'],e['path']):e for e in plan['changes']}
        changes=[]
        for role,root in ROOTS.items():
            for src in sorted((Path(plan['stage'])/role).rglob('*')):
                if not src.is_file():continue
                rel=src.relative_to(Path(plan['stage'])/role);dst=root/'.agents/skills'/rel
                if dst.exists() and dst.read_bytes()==src.read_bytes():continue
                key=(role,str(rel));old=baseline[key]['old_sha256'] if key in baseline else (digest(dst) if dst.exists() else None)
                changes.append({'role':role,'path':str(rel),'old_sha256':old,'new_sha256':digest(src)})
        plan['changes']=changes;plan_path.write_text(json.dumps(plan,ensure_ascii=False,indent=2)+'\n')
        print('Finalized',len(changes),'file edits/additions');return
    for e in plan['changes']:
        src,dst=paths(plan,e)
        if digest(src)!=e['new_sha256']:raise SystemExit('Staged source changed: '+str(src))
        if (digest(dst) if dst.exists() else None)!=e['old_sha256']:raise SystemExit('Destination changed since planning: '+str(dst))
    backup=LAB/'backups';result=[]
    for e in plan['changes']:
        src,dst=paths(plan,e);saved=None
        if dst.exists():
            saved=backup/e['role']/e['path']
            if saved.exists():raise SystemExit('Refusing backup overwrite: '+str(saved))
            saved.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(dst,saved)
        dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dst)
        if digest(dst)!=e['new_sha256']:raise SystemExit('Install mismatch: '+str(dst))
        result.append(dict(e,destination=str(dst),backup=str(saved.relative_to(ROOT)) if saved else None))
    (LAB/'installed.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print('Installed and verified',len(result),'files; replacements backed up; unrelated files untouched')


if __name__=='__main__':main()
