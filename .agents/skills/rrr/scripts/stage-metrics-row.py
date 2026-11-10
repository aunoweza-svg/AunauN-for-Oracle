#!/usr/bin/env python3
"""Stage exactly one new metrics row, preserving the shared working file."""
import argparse
from pathlib import Path
import re
import subprocess

HEADER = b'# Oracle Session Metrics\n\n| when | session | done | stuck | win | friction | error |\n|---|---|---|---|---|---|---|\n'


def git(root, *args, data=None, check=True):
    return subprocess.run(['git', '-C', str(root), *args], input=data,
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=check)


def stage(repo, path, row_file):
    root = Path(git(repo, 'rev-parse', '--show-toplevel').stdout.decode().strip()).resolve()
    rel = Path(path)
    if rel.is_absolute() or '..' in rel.parts:
        raise ValueError('Metrics path must be repository-relative')
    workfile = (root / rel).resolve()
    if not workfile.is_relative_to(root):
        raise ValueError('Metrics resolves outside repository; do not stage a shared external vault')
    before = workfile.read_bytes()
    raw = Path(row_file).read_bytes()
    lines = raw.splitlines()
    if len(lines) != 1:
        raise ValueError('Row file must contain exactly one metrics row')
    row = lines[0]
    text = row.decode('utf-8')
    if not text.startswith('| ') or not text.endswith(' |') or len(re.findall(r'(?<!\\)\|', text)) != 8:
        raise ValueError('Expected exactly seven Markdown table cells')
    if before.splitlines().count(row) != 1:
        raise ValueError('The requested row must occur exactly once in the working file')
    relpath = rel.as_posix()
    if git(root, 'ls-files', '-u', '--', relpath).stdout:
        raise ValueError('Metrics has unresolved index entries')
    head = git(root, 'show', f'HEAD:{relpath}', check=False)
    index = git(root, 'show', f':{relpath}', check=False)
    head_data = head.stdout if head.returncode == 0 else None
    index_data = index.stdout if index.returncode == 0 else None
    if index_data != head_data:
        raise ValueError('Metrics already has staged changes; preserve them and isolate manually')
    base = head_data if head_data is not None else HEADER
    if row in base.splitlines():
        raise ValueError('This row is already committed; refusing duplicate metrics')
    newline = b'\r\n' if b'\r\n' in base else b'\n'
    staged = base + (b'' if base.endswith(b'\n') else newline) + row + newline
    if workfile.read_bytes() != before:
        raise ValueError('Working metrics changed concurrently; retry with fresh evidence')
    blob = git(root, 'hash-object', '-w', '--stdin', data=staged).stdout.decode().strip()
    mode_result = git(root, 'ls-files', '--stage', '--', relpath).stdout.decode().split()
    mode = mode_result[0] if mode_result else '100644'
    git(root, 'update-index', '--add', '--cacheinfo', f'{mode},{blob},{relpath}')
    if workfile.read_bytes() != before:
        raise ValueError('Working metrics changed concurrently; staged row requires review')
    return {'path': relpath, 'blob': blob, 'working_file_unchanged': True}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', required=True)
    parser.add_argument('--row-file', required=True)
    parser.add_argument('--path', default='ψ/memory/learnings/session-metrics.md')
    args = parser.parse_args()
    try:
        result = stage(args.repo, args.path, args.row_file)
    except (ValueError, OSError, subprocess.CalledProcessError) as exc:
        parser.exit(2, f'Metrics not staged: {type(exc).__name__}: {exc}\n')
    import json
    print(json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    main()
