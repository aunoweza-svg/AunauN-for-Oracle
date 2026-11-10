"""Read-only checks for the saved AIExpo study bundle. Run from any cwd."""
import hashlib
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent
catalog = json.loads((root / 'catalog.json').read_text())
skills = json.loads((root / 'skill-reference.json').read_text())
assert len(catalog) == 21
assert len({item['slug'] for item in catalog}) == 21
assert len(skills) == len({item['name'] for item in skills}) == 52
assert len(list((root / 'lessons').glob('*.md'))) == 21
for item in catalog:
    data = (root / item['source_file']).read_bytes()
    assert len(data) == item['bytes'], item['slug']
    assert hashlib.sha256(data).hexdigest() == item['sha256'], item['slug']
    note = (root / item['note_file']).read_text()
    for heading in ['## แก่นของบท', '## สิ่งที่เรียนรู้', '## ประยุกต์กับ AunauN', '## สถานะและข้อจำกัด']:
        assert heading in note, (item['slug'], heading)
    assert item['download_url'] in note
for page in [*root.glob('*.md'), *(root / 'lessons').glob('*.md')]:
    for target in re.findall(r'\]\(([^)]+)\)', page.read_text()):
        if re.match(r'^[a-z]+://', target):
            continue
        target = target.split('#')[0]
        if target:
            assert (page.parent / target).exists(), (page.name, target)
print('PASS: 21 source hashes, 21 complete notes, 52 unique skills, and local study links')
