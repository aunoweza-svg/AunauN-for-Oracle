#!/usr/bin/env python3
"""Read-only Herdr TUI inspection. Never sets caller context or sends input."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys


class InspectionError(Exception):
    pass


def call(*args):
    try:
        result = subprocess.run(['herdr', *args], capture_output=True, text=True, timeout=20)
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise InspectionError(f'Herdr unavailable: {type(exc).__name__}') from exc
    if result.returncode:
        hint = 'permission denied; request host approval for this command' if any(
            x in result.stderr.lower() for x in ['permission', 'not permitted']
        ) else 'inspect installed CLI help and live state before retrying'
        raise InspectionError(f'herdr {args[0]} {args[1]} failed ({result.returncode}); {hint}')
    try:
        payload = json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise InspectionError('Herdr returned non-JSON; cannot verify live state') from exc
    if 'error' in payload or 'result' not in payload:
        raise InspectionError('Herdr returned an API error; no verified result')
    return payload['result']


def record(pane):
    return {
        'pane_id': pane.get('pane_id'), 'workspace_id': pane.get('workspace_id'),
        'tab_id': pane.get('tab_id'), 'kind': pane.get('agent') or 'shell',
        'status': pane.get('agent_status') or 'unknown', 'cwd': pane.get('cwd'),
        'conversation_id': (pane.get('agent_session') or {}).get('value'),
    }


def git_info(cwd):
    info = {}
    if not cwd or not Path(cwd).is_dir():
        return info
    for key, args in [('root', ['rev-parse', '--show-toplevel']),
                      ('branch', ['symbolic-ref', '--quiet', '--short', 'HEAD'])]:
        result = subprocess.run(['git', '-C', cwd, *args], capture_output=True, text=True, timeout=10)
        info[key] = result.stdout.strip() if result.returncode == 0 else None
    return info


def inspect(mode, repo=None, target=None):
    if os.environ.get('HERDR_ENV') != '1':
        raise InspectionError('Outside Herdr: HERDR_ENV is not inherited as 1; no socket queried')
    current = call('pane', 'current', '--current').get('pane')
    if not current or not current.get('pane_id'):
        raise InspectionError('Cannot resolve the caller pane')
    me = record(current)
    if mode == 'whoami':
        return {'caller': me, 'executor_cwd': os.getcwd(), 'git': git_info(me['cwd'])}
    if mode == 'resolve':
        if bool(repo) == bool(target):
            raise InspectionError('Select exactly one of --repo or --target')
        if repo and not Path(repo).is_absolute():
            raise InspectionError('--repo must be an absolute path')
        agents = call('agent', 'list').get('agents')
        if not isinstance(agents, list):
            raise InspectionError('Missing live agent inventory')
        candidates = [a for a in agents if a.get('agent') and a.get('pane_id') != me['pane_id']]
        if repo:
            resolved = Path(repo).resolve()
            candidates = [a for a in candidates if a.get('cwd') and Path(a['cwd']).resolve() == resolved]
        else:
            candidates = [a for a in candidates if a.get('pane_id') == target]
        if len(candidates) != 1:
            raise InspectionError(f'Target is not unique: {len(candidates)} live candidates; no target selected')
        return {'caller': me['pane_id'], 'target': record(candidates[0])}
    panes = call('pane', 'list').get('panes')
    if not isinstance(panes, list):
        raise InspectionError('Missing live pane inventory')
    if mode == 'neighbors':
        neighbors = {}
        for direction in ['left', 'right', 'up', 'down']:
            data = call('pane', 'neighbor', '--pane', me['pane_id'], '--direction', direction)
            if not isinstance(data.get('neighbor'), dict):
                raise InspectionError(f'Unrecognized neighbor response for {direction}')
            neighbors[direction] = data['neighbor'].get('neighbor_pane_id')
        return {'caller': me, 'geometric_neighbors': neighbors,
                'workspace_panes': [record(p) for p in panes if p.get('workspace_id') == me['workspace_id']]}
    workspaces = call('workspace', 'list').get('workspaces')
    if not isinstance(workspaces, list):
        raise InspectionError('Missing live workspace inventory')
    tree = []
    for ws in workspaces:
        tabs = {}
        for pane in panes:
            if pane.get('workspace_id') == ws.get('workspace_id'):
                entry = record(pane)
                entry['is_caller'] = entry['pane_id'] == me['pane_id']
                tabs.setdefault(entry['tab_id'], []).append(entry)
        tree.append({'workspace_id': ws.get('workspace_id'), 'label': ws.get('label'),
                     'worktree_repo': (ws.get('worktree') or {}).get('repo_root'), 'tabs': tabs})
    return {'caller': me['pane_id'], 'workspaces': tree}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['whoami', 'neighbors', 'structure', 'resolve'])
    parser.add_argument('--repo')
    parser.add_argument('--target')
    args = parser.parse_args()
    if args.mode != 'resolve' and (args.repo or args.target):
        parser.error('--repo and --target are only valid with resolve')
    try:
        data = inspect(args.mode, args.repo, args.target)
    except InspectionError as exc:
        print(json.dumps({'error': str(exc)}, ensure_ascii=False))
        return 2
    print(json.dumps(data, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    sys.exit(main())
