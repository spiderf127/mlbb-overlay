import urllib.request
import json
import re

url = 'https://mobile-legends.fandom.com/api.php?action=parse&page=Sora/Quotes&format=json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    resp = urllib.request.urlopen(req).read().decode('utf-8')
    data = json.loads(resp)
    if 'error' not in data:
        print('Found Quotes page! Length:', len(data['parse']['text']['*']))
        html = data['parse']['text']['*']
        if 'steadfast' in html.lower() or 'shifting' in html.lower():
            print('Found the text in quotes!')
            # try to find audio nearby
            lines = html.split('</audio>')
            for block in lines:
                if 'steadfast' in block.lower():
                    m = re.search(r'<audio[^>]*src=\"([^\"]+)\"', block, re.IGNORECASE)
                    if m:
                        print('Audio link:', m.group(1))
    else:
        print('No Quotes page.')
except Exception as e:
    print('Error:', e)
