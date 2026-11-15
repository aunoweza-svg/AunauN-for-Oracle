#!/usr/bin/env python3
"""Reviewable, hash-guarded local installation. Dry run unless --apply is explicit.
Run by AXIOM from its authorized workspace; PRISM does not write across repos.
"""
import argparse
import hashlib
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--target', type=Path, required=True, help='Exact trading-lab directory')
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    target = args.target.resolve()
    if target.name != 'trading-lab' or not (target / 'PRISM-BRIEF.md').is_file():
        raise SystemExit('Refusing target without trading-lab/PRISM-BRIEF.md')
    manifest = json.loads((ROOT / 'manifest.json').read_text())
    for item in manifest['files']:
        rel = item['path']
        if Path(rel).is_absolute() or '..' in Path(rel).parts:
            raise SystemExit('Unsafe manifest path')
        staged = ROOT / 'staged' / rel
        dest = target / rel
        if dest.is_symlink() or not dest.resolve().is_relative_to(target):
            raise SystemExit(f'Refusing symlink/outside target: {dest}')
        if digest(staged) != item['after']:
            raise SystemExit(f'Staged changed after review: {rel}')
        actual = digest(dest)
        if actual != item['before']:
            raise SystemExit(f'Target changed or already installed; review manually: {rel}')
    print(json.dumps({'mode': 'apply' if args.apply else 'dry-run', 'target': str(target),
                      'files': [x['path'] for x in manifest['files']]}, indent=2))
    if not args.apply:
        return
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
    backup = target / '.prism-backups' / ('AXIOM-PRISM-20261115-' + stamp)
    backup.mkdir(parents=True, exist_ok=False)
    (backup / 'manifest.json').write_text(json.dumps(manifest, indent=2))
    # Preserve every old file before writing any replacement. New files have before=null.
    for item in manifest['files']:
        rel = item['path']
        if item['before'] is not None:
            dest = backup / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(target / rel, dest)
    for item in manifest['files']:
        rel = item['path']
        dest = target / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / 'staged' / rel, dest)
        if digest(dest) != item['after']:
            raise SystemExit(f'Post-write hash mismatch: {rel}; original backup: {backup}')
    print(json.dumps({'installed': len(manifest['files']), 'backup': str(backup)}, indent=2))

if __name__ == '__main__':
    main()
