import urllib.request
import json
import re
import os
import threading

def get_heroes():
    with open('operator.html', 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r'function defRoster\(\)\s*\{\s*return\s*\[(.*?)\];', content, re.DOTALL)
    if not match:
        print("Regex failed to find defRoster")
        return []
    roster_str = match.group(1)
    names = re.findall(r'name:\s*[\'"]([^\'"]+)[\'"]', roster_str)
    return list(set([n for n in names if n != 'No Ban']))

heroes = get_heroes()
if not os.path.exists('audio/heroes'):
    os.makedirs('audio/heroes')

print(f"Found {len(heroes)} heroes.")

def download_hero(hero_name):
    # Fandom wiki replaces space with _
    safe_name = hero_name.replace(' ', '_').replace("'", "%27")
    
    url = f"https://mobile-legends.fandom.com/api.php?action=parse&page={safe_name}/Audio&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        resp = urllib.request.urlopen(req).read().decode('utf-8')
        data = json.loads(resp)
        if 'error' in data:
            print(f"No audio page for {hero_name}")
            return
        
        html = data['parse']['text']['*']
        # Find Hero_selection section and first audio
        sel_match = re.search(r'id="Hero_selection".*?<audio[^>]*src="([^"]+)"', html, re.DOTALL | re.IGNORECASE)
        if not sel_match:
            # Fallback to first audio found
            sel_match = re.search(r'<audio[^>]*src="([^"]+)"', html, re.IGNORECASE)
            
        if sel_match:
            audio_url = sel_match.group(1)
            # Ensure safe filename
            safe_file = "".join(c for c in hero_name if c.isalnum())
            out_path = f"audio/heroes/{safe_file}.ogg"
            
            # Download
            areq = urllib.request.Request(audio_url, headers={'User-Agent': 'Mozilla/5.0'})
            audio_data = urllib.request.urlopen(areq).read()
            with open(out_path, 'wb') as outf:
                outf.write(audio_data)
            print(f"Downloaded {hero_name} -> {safe_file}.ogg")
        else:
            print(f"No audio URL found for {hero_name}")
            
    except Exception as e:
        print(f"Error processing {hero_name}: {e}")

# Use a semaphore to limit concurrent requests
sem = threading.Semaphore(15)

def worker(h):
    with sem:
        download_hero(h)

threads = []
for h in heroes:
    t = threading.Thread(target=worker, args=(h,))
    t.start()
    threads.append(t)

for t in threads:
    t.join()

print("All downloads complete!")
