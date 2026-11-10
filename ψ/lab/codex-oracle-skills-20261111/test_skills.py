"""Offline behavioral checks. Git writes and pushes stay in disposable /tmp repos."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

ROOT=Path(__file__).resolve().parents[3]
SKILLS=ROOT/'.agents/skills'
INSPECT=SKILLS/'herdr/scripts/herdr_inspect.py'
METRICS=SKILLS/'rrr/scripts/stage-metrics-row.py'
NAMES=['rrr','forward','learn','trace','where-we-are','herdr','herdr-whoami',
       'herdr-neighbors','herdr-peek','herdr-hey','herdr-structure']


def load(path,name):
    spec=importlib.util.spec_from_file_location(name,path)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module


def git(repo,*args,env=None,data=None):
    return subprocess.run(['git','-C',str(repo),*args],env=env,input=data,
                          stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True).stdout


class SkillChecks(unittest.TestCase):
    def test_01_all_installed_and_valid(self):
        validator=Path('/home/aunaun/.codex/skills/.system/skill-creator/scripts/quick_validate.py')
        for name in NAMES:
            with self.subTest(name=name):
                r=subprocess.run(['python3',str(validator),str(SKILLS/name)],capture_output=True,text=True)
                self.assertEqual(r.returncode,0,r.stdout+r.stderr)

    def test_02_outside_herdr_never_queries_socket(self):
        env=os.environ.copy();env.pop('HERDR_ENV',None)
        with tempfile.TemporaryDirectory(prefix='aunaun-no-socket-') as directory:
            marker=Path(directory)/'queried'
            fake=Path(directory)/'herdr';fake.write_text('#!/bin/sh\ntouch "'+str(marker)+'"\nexit 1\n');fake.chmod(0o755)
            env['PATH']=directory+os.pathsep+env['PATH']
            r=subprocess.run(['python3',str(INSPECT),'whoami'],env=env,capture_output=True,text=True)
            self.assertEqual(r.returncode,2)
            self.assertIn('Outside Herdr',json.loads(r.stdout)['error'])
            self.assertFalse(marker.exists())

    def test_03_neighbors_missing_key_and_stale_env(self):
        m=load(INSPECT,'aunaun_herdr_inspection_test')
        pane={'pane_id':'w7:p2','workspace_id':'w7','tab_id':'w7:t1','agent':'codex','cwd':'/tmp'}
        calls=[]
        def call(*args):
            calls.append(args)
            if args[:2]==('pane','current'):return {'pane':pane}
            if args[:2]==('pane','list'):return {'panes':[pane,{'pane_id':'w7:p3','workspace_id':'w7','tab_id':'w7:t2'}]}
            if args[:2]==('pane','neighbor'):return {'neighbor':{'pane_id':'w7:p2'}}
            raise AssertionError(args)
        with patch.dict(os.environ,{'HERDR_ENV':'1','HERDR_PANE_ID':'w1:pSTALE'}),patch.object(m,'call',side_effect=call):
            result=m.inspect('neighbors')
        self.assertEqual(result['geometric_neighbors'],dict.fromkeys(['left','right','up','down']))
        self.assertEqual(result['workspace_panes'][1]['kind'],'shell')
        self.assertTrue(all('w7:p2' in args for args in calls if args[:2]==('pane','neighbor')))

    def test_04_ambiguous_target_and_caller_excluded(self):
        m=load(INSPECT,'aunaun_herdr_resolution_test')
        pane={'pane_id':'w1:p1','cwd':'/tmp/source'}
        agents=[dict(pane,agent='codex'),{'pane_id':'w1:p2','cwd':'/tmp/target','agent':'codex'},
                {'pane_id':'w1:p3','cwd':'/tmp/target','agent':'codex'}]
        def call(*args):return {'pane':pane} if args[:2]==('pane','current') else {'agents':agents}
        with patch.dict(os.environ,{'HERDR_ENV':'1'}),patch.object(m,'call',side_effect=call):
            with self.assertRaisesRegex(m.InspectionError,'2 live candidates'):m.inspect('resolve',repo='/tmp/target')
            with self.assertRaisesRegex(m.InspectionError,'0 live candidates'):m.inspect('resolve',target='w1:p1')
            result=m.inspect('resolve',target='w1:p2')
            self.assertEqual(result['target']['pane_id'],'w1:p2')

    def test_05_rrr_scoped_commit_push_preserves_shared_work(self):
        with tempfile.TemporaryDirectory(prefix='aunaun-rrr-integration-') as directory:
            base=Path(directory);repo=base/'oracle';repo.mkdir();remote=base/'remote.git'
            git(repo,'init','-b','main');git(repo,'config','user.name','AunauN skill fixture')
            git(repo,'config','user.email','fixture@example.invalid');git(repo,'config','commit.gpgsign','false')
            git(repo,'config','core.hooksPath',str(base/'no-hooks'))
            metric_path=Path('ψ/memory/learnings/session-metrics.md');metric=repo/metric_path;metric.parent.mkdir(parents=True)
            baseline=b'# Oracle Session Metrics\r\n\r\n| when | session | done | stuck | win | friction | error |\r\n|---|---|---|---|---|---|---|\r\n'
            metric.write_bytes(baseline);(repo/'other.txt').write_text('baseline\n')
            git(repo,'add','.');git(repo,'commit','-m','fixture baseline')
            git(base,'init','--bare',str(remote));git(repo,'remote','add','origin',str(remote))
            git(repo,'push','origin','main');git(repo,'fetch','origin')
            # Someone else's staged and unstaged edits must survive our commit.
            (repo/'other.txt').write_text('someone else staged\n');git(repo,'add','other.txt')
            other_staged=git(repo,'show',':other.txt')
            (repo/'other.txt').write_text('someone else working after staging\n')
            foreign=b'| 2026-11-11 | other-session | unrelated work | none | yes | none | none |'
            ours=b'| 2026-11-11 | fixture-session | tested rrr | none | scoped sync | none | none |'
            working_metrics=baseline+foreign+b'\r\n'+ours+b'\r\n';metric.write_bytes(working_metrics)
            retro=repo/'ψ/memory/retrospectives/2026-11/11/fixture.md';retro.parent.mkdir(parents=True)
            retro.write_text('# Session Retrospective\n\n'
                             '**Session**: fixture-session (synthetic test identity)\n'
                             '**Start / End**: unknown / unknown\n'
                             '**Duration**: unknown\n'
                             '**Evidence Source**: fixture Git state; mode light\n\n'
                             '## Timeline\n\n- Prepared an isolated rrr sync fixture.\n\n'
                             '## Session Summary\n\nTest selective metrics staging with other sessions present.\n\n'
                             '## Lessons Learned\n\nKeep unrelated rows and staged work out of the task commit.\n')
            (repo/'unrelated-untracked.txt').write_text('keep me\n')
            rowfile=base/'row.txt';rowfile.write_bytes(ours+b'\n')
            env=os.environ.copy();env['GIT_INDEX_FILE']=str(base/'task.index')
            git(repo,'read-tree','HEAD',env=env)
            git(repo,'add','--',str(retro.relative_to(repo)),env=env)
            r=subprocess.run(['python3',str(METRICS),'--repo',str(repo),'--row-file',str(rowfile)],env=env,capture_output=True,text=True)
            self.assertEqual(r.returncode,0,r.stderr)
            staged=git(repo,'show',':'+metric_path.as_posix(),env=env)
            self.assertIn(ours,staged);self.assertNotIn(foreign,staged)
            self.assertIn(b'\r\n',staged);self.assertEqual(metric.read_bytes(),working_metrics)
            allow={metric_path.as_posix(),retro.relative_to(repo).as_posix()}
            self.assertEqual(set(git(repo,'diff','--cached','--name-only','-z',env=env).decode().strip('\0').split('\0')),allow)
            git(repo,'commit','-m','fixture: scoped rrr only',env=env)
            # Reconcile only our committed entries; do not reset the real index.
            tree=git(repo,'ls-tree','-z','HEAD','--',*sorted(allow))
            index_records=[]
            for entry in tree.split(b'\0'):
                if entry:
                    meta,path=entry.split(b'\t',1);mode,kind,sha=meta.split()
                    index_records.append(mode+b' '+sha+b'\t'+path+b'\0')
            git(repo,'update-index','-z','--index-info',data=b''.join(index_records))
            self.assertEqual(git(repo,'show',':other.txt'),other_staged)
            self.assertEqual((repo/'other.txt').read_text(),'someone else working after staging\n')
            self.assertEqual(metric.read_bytes(),working_metrics)
            self.assertEqual((repo/'unrelated-untracked.txt').read_text(),'keep me\n')
            git(repo,'push','origin','main')
            head=git(repo,'rev-parse','HEAD').strip()
            remote_head=git(repo,'ls-remote','origin','refs/heads/main').split()[0]
            self.assertEqual(head,remote_head)
            self.assertNotIn(foreign,git(remote,'show','main:'+metric_path.as_posix()))
            self.assertEqual(git(remote,'show','main:other.txt'),b'baseline\n')
            # Duplicate execution refuses to add the row again.
            r=subprocess.run(['python3',str(METRICS),'--repo',str(repo),'--row-file',str(rowfile)],capture_output=True,text=True)
            self.assertEqual(r.returncode,2);self.assertIn('already committed',r.stderr)
            # Existing staged changes to the shared file are preserved, not silently included.
            newrow=b'| 2026-11-11 | another-test | not staged by us | none | yes | none | none |'
            metric.write_bytes(working_metrics+newrow+b'\r\n');git(repo,'add','--',str(metric_path))
            rowfile.write_bytes(newrow+b'\n');prior=git(repo,'show',':'+metric_path.as_posix())
            r=subprocess.run(['python3',str(METRICS),'--repo',str(repo),'--row-file',str(rowfile)],capture_output=True,text=True)
            self.assertEqual(r.returncode,2);self.assertIn('already has staged changes',r.stderr)
            self.assertEqual(git(repo,'show',':'+metric_path.as_posix()),prior)
            evidence={'test':'rrr scoped local sync','remote_type':'disposable local bare repository',
                      'production_github_push':False,'remote_head_equals_commit':True,
                      'task_paths':sorted(allow),'unrelated_staged_preserved':True,
                      'working_files_preserved':True,'foreign_metrics_excluded':True,
                      'crlf_preserved':True,'duplicate_row_refused':True,
                      'preexisting_metrics_staging_refused':True,
                      'commit':head.decode()}
            output=Path(__file__).resolve().parent/'evidence/rrr-integration.json'
            output.write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n')


if __name__=='__main__':unittest.main(verbosity=2)
