import urllib.request
import re

req = urllib.request.Request('https://mlbb.tools/audio', headers={'User-Agent': 'Mozilla/5.0'})
try:
    resp = urllib.request.urlopen(req).read().decode('utf-8')
    print('Found page! Length:', len(resp))
    sora_links = re.findall(r'href=[\"\']([^\"\']*sora[^\"\']*)[\"\']', resp, re.IGNORECASE)
    print('Sora links:', list(set(sora_links)))
except Exception as e:
    print('Error:', e)
