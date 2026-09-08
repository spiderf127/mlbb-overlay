import urllib.request
import json
import re

url = 'https://mobile-legends.fandom.com/api.php?action=parse&page=Announcer&format=json'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    resp = urllib.request.urlopen(req).read().decode('utf-8')
    data = json.loads(resp)
    html = data['parse']['text']['*']
    
    targets = [
        ("Your team is banning.", "your_team_is_banning.ogg"),
        ("Your team is picking.", "your_team_is_picking.ogg"),
        ("The enemy is banning.", "the_enemy_is_banning.ogg"),
        ("The enemy is picking.", "the_enemy_is_picking.ogg"),
    ]
    
    # Split the html by <div> or similar to localize the search
    blocks = html.split('</div>')
    for target_text, out_file in targets:
        found = False
        for block in blocks:
            # removing punctuation for easier matching
            if target_text.replace('.', '').lower() in block.replace('.', '').lower():
                m = re.search(r'<audio[^>]*src=\"([^\"]+\.ogg[^\"]*)\"', block, re.IGNORECASE)
                if m:
                    audio_url = m.group(1)
                    print(f"Downloading {out_file} from {audio_url}")
                    areq = urllib.request.Request(audio_url, headers={'User-Agent': 'Mozilla/5.0'})
                    audio_data = urllib.request.urlopen(areq).read()
                    with open(f"audio/{out_file}", 'wb') as outf:
                        outf.write(audio_data)
                    found = True
                    break
        if not found:
            print(f"Could not find audio for: {target_text}")
except Exception as e:
    print('Error:', e)
