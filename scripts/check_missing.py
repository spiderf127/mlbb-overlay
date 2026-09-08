import re
import os

def get_heroes():
    with open('operator.html', 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r'function defRoster\(\)\s*\{\s*return\s*\[(.*?)\];', content, re.DOTALL)
    if not match: return []
    # robust extraction ignoring internal quotes
    names = re.findall(r'name:\s*(?:\"([^\"]+)\"|\'([^\']+)\')', match.group(1))
    return list(set([n[0] or n[1] for n in names if (n[0] or n[1]) != 'No Ban']))

heroes = get_heroes()
missing = []
for h in heroes:
    safe_file = ''.join(c for c in h if c.isalnum())
    path = f'audio/heroes/{safe_file}.ogg'
    if not os.path.exists(path):
        missing.append(h)

print('Missing:', missing)
