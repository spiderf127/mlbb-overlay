import urllib.request
import re
import json

req = urllib.request.Request('https://mlbb.tools/audio', headers={'User-Agent': 'Mozilla/5.0'})
resp = urllib.request.urlopen(req).read().decode('utf-8')

# Try to extract Next.js __NEXT_DATA__
match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.+?)</script>', resp)
if match:
    data = json.loads(match.group(1))
    print('Found Next Data! keys:', data.keys())
    # Save the data to inspect
    with open('next_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
else:
    print('No NEXT_DATA found.')
