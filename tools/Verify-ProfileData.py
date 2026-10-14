import json
import sqlite3
import sys
from pathlib import Path

backup = Path(sys.argv[1]).resolve()
manifest = json.loads((backup / 'manifest.json').read_text(encoding='utf-8-sig'))
verified = []
for root in manifest['roots']:
    source = Path(root['source'])
    snapshot = Path(root['destination'])
    for saved in snapshot.rglob('*.db'):
        relative = saved.relative_to(snapshot)
        current = source / relative
        if not current.exists():
            raise RuntimeError(f'Database missing after installation: {relative}')
        with sqlite3.connect(saved.as_uri() + '?mode=ro', uri=True) as before, sqlite3.connect(current.as_uri() + '?mode=ro', uri=True) as after:
            tables = [row[0] for row in before.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")]
            for table in tables:
                quoted = '"' + table.replace('"', '""') + '"'
                old = sorted(json.dumps(row, ensure_ascii=False, default=str) for row in before.execute('SELECT * FROM ' + quoted))
                new = sorted(json.dumps(row, ensure_ascii=False, default=str) for row in after.execute('SELECT * FROM ' + quoted))
                if old != new:
                    raise RuntimeError(f'Data changed after installation: {relative}, table {table}')
            assert after.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
            verified.append(str(relative))
    registry = snapshot / 'profiles.json'
    if registry.exists() and json.loads(registry.read_text(encoding='utf-8')) != json.loads((source / 'profiles.json').read_text(encoding='utf-8')):
        raise RuntimeError('Profile registry changed after installation')
print(f'PASS: {len(verified)} SQLite databases identical to backup; integrity and profile registry preserved.')
