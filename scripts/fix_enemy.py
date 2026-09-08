import urllib.request, json, re

url = 'https://mobile-legends.fandom.com/api.php?action=parse&page=Announcer&format=json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
resp = urllib.request.urlopen(req).read().decode('utf-8')
data = json.loads(resp)
html = data['parse']['text']['*']

for line in html.split('<tr>'):
    if 'The enemy is picking' in line:
        m = re.search(r'<audio[^>]*src=\"([^\"]+\.ogg[^\"]*)\"', line, re.IGNORECASE)
        if m:
            print('Found enemy picking audio:', m.group(1))
            areq = urllib.request.Request(m.group(1), headers={'User-Agent': 'Mozilla/5.0'})
            audio_data = urllib.request.urlopen(areq).read()
            with open('audio/the_enemy_is_picking.ogg', 'wb') as outf:
                outf.write(audio_data)
        else:
            print('Text found, but no audio in this row:', line)
