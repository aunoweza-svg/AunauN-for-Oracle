"""Create synthetic footage, run installed edit scripts and verify rendered media."""
from pathlib import Path
import hashlib
import json
import subprocess
import tempfile

ROOT=Path(__file__).resolve().parents[3];LAB=Path(__file__).resolve().parent
LUMINA=ROOT/'oracles/lumina-oracle';RUN=LUMINA/'tools/media.py'
FFMPEG=LUMINA/'tools/ffmpeg/bin/ffmpeg';FFPROBE=LUMINA/'tools/ffmpeg/bin/ffprobe'


def command(args):
    result=subprocess.run([str(x) for x in args],capture_output=True,text=True,timeout=90)
    if result.returncode:raise RuntimeError(result.stdout[-3500:]+'\n'+result.stderr[-3500:])
    return result.stdout


doctor=json.loads(command(['python3',RUN,'_contract','doctor','--json']))
assert doctor['ok'] and not doctor['missing']
assert doctor['fonts']['scripts']['th']['status']=='available',doctor['fonts']['scripts']['th']
(LAB/'evidence/media-doctor.json').write_text(json.dumps(doctor,ensure_ascii=False,indent=2)+'\n')
with tempfile.TemporaryDirectory(prefix='aunaun-fleet-media-') as directory:
    directory=Path(directory);source=directory/'input.mp4';vertical=directory/'vertical.mp4'
    command([FFMPEG,'-hide_banner','-loglevel','error','-f','lavfi','-i','testsrc2=size=640x360:rate=24',
             '-f','lavfi','-i','sine=frequency=440:sample_rate=48000','-t','2','-c:v','libx264','-pix_fmt','yuv420p',
             '-c:a','aac','-shortest',source])
    source_hash=hashlib.sha256(source.read_bytes()).hexdigest()
    fit=json.loads(command(['python3',RUN,'fit',source,'--aspect','9:16','--fit','pad','--width','360',
                            '-o',vertical,'--fast','--json-brief']))
    final=LAB/'evidence/lumina-render-thai.mp4'
    if final.exists():raise RuntimeError('Refusing to overwrite previous rendered evidence')
    captions=directory/'thai.srt';captions.write_text('1\n00:00:00,000 --> 00:00:02,000\nทดสอบ\nLumina\n')
    caption=json.loads(command(['python3',RUN,'caption',vertical,'--srt',captions,'--position','top',
          '--font','Noto Sans Thai','--fonts-dir',LUMINA/'tools/fonts','--size','18','--box','-o',final,'--fast','--json-brief']))
    probe=json.loads(command([FFPROBE,'-v','error','-show_streams','-show_format','-of','json',final]))
    video=next(s for s in probe['streams'] if s['codec_type']=='video')
    audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
    assert (video['width'],video['height'])==(360,640)
    assert video['codec_name']=='h264' and audio['codec_name']=='aac'
    assert abs(float(probe['format']['duration'])-2)<.15
    assert hashlib.sha256(source.read_bytes()).hexdigest()==source_hash
    look=command(['python3',RUN,'look',final,'--tiles','3x2'])
    result={'source':'synthetic lavfi test only','input_unchanged':True,'fit':fit,'caption':caption,
            'probe':probe,'look_output':look,'thai_font':'Noto Sans Thai (OFL)'}
    (LAB/'evidence/media-smoke.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print('PASS: 360x640 H.264/AAC 2-second render, Thai overlay, source preserved; '+look.strip())
