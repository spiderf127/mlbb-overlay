import urllib.request, json, re
url = 'https://mobile-legends.fandom.com/api.php?action=parse&page=Announcer&format=json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
resp = urllib.request.urlopen(req).read().decode('utf-8')
data = json.loads(resp)
html = data['parse']['text']['*']

import os
targets = [
    ('your_team_is_banning', 'Your team is banning'),
    ('your_team_is_picking', 'Your team is picking'),
    ('the_enemy_is_banning', 'The enemy is banning'),
    ('the_enemy_is_picking', 'The enemy is picking'),
]

for name, text in targets:
    pattern = re.compile(text + r'.*?<audio[^>]*src=\"([^\"]+\.ogg[^\"]*)\"', re.IGNORECASE | re.DOTALL)
    m = pattern.search(html)
    if m:
        audio_url = m.group(1)
        print(f'{name} -> {audio_url}')
        areq = urllib.request.Request(audio_url, headers={'User-Agent': 'Mozilla/5.0'})
        audio_data = urllib.request.urlopen(areq).read()
        with open(f'audio/{name}.ogg', 'wb') as outf:
            outf.write(audio_data)
    else:
        print('Not found:', text)
