import os
import json
import time
import requests
import argparse
import re

BASE_URL = "https://mobile-legends.fandom.com"

def get_heroes():
    url = f"{BASE_URL}/api.php"
    params = {
        "action": "query",
        "list": "categorymembers",
        "cmtitle": "Category:Heroes",
        "cmlimit": "500",
        "format": "json"
    }
    
    try:
        res = requests.get(url, params=params, timeout=15)
        res.raise_for_status()
        data = res.json()
        
        heroes = []
        for member in data['query']['categorymembers']:
            title = member['title']
            if ':' not in title and 'Heroes' not in title and 'Upcoming' not in title and title != "Mobile Legends: Bang Bang Wiki":
                heroes.append(title)
        return heroes
    except Exception as e:
        print(f"Error fetching heroes: {e}")
        return []

def get_hero_portrait_url(hero):
    url = f"{BASE_URL}/api.php"
    params = {
        "action": "query",
        "prop": "images",
        "titles": hero,
        "imlimit": "500",
        "format": "json"
    }
    
    try:
        res = requests.get(url, params=params, timeout=15)
        res.raise_for_status()
        data = res.json()
        
        pages = data['query']['pages']
        candidates = []
        for page_id in pages:
            images = pages[page_id].get('images', [])
            for img in images:
                title = img['title']
                if re.match(r'^File:Hero\d+-portrait\.png$', title, re.IGNORECASE):
                    candidates.append(title)
                    
        # Fallback to broader search if strict match fails
        if not candidates:
            for page_id in pages:
                images = pages[page_id].get('images', [])
                for img in images:
                    title = img['title']
                    if 'portrait' in title.lower() and 'hero' in title.lower() and title.lower().endswith('.png'):
                        if 'skin' not in title.lower() and 'old' not in title.lower():
                            candidates.append(title)
                            
        if not candidates:
            return None, None
            
        # Get the first matching candidate
        target_file = candidates[0]
        
        # Get image URL
        params_info = {
            "action": "query",
            "prop": "imageinfo",
            "iiprop": "url",
            "titles": target_file,
            "format": "json"
        }
        res_info = requests.get(url, params=params_info, timeout=15)
        res_info.raise_for_status()
        data_info = res_info.json()
        
        pages_info = data_info['query']['pages']
        for page_id in pages_info:
            imageinfo = pages_info[page_id].get('imageinfo', [])
            if imageinfo:
                img_url = imageinfo[0]['url']
                # Clean URL (remove ?cb=...)
                if '?' in img_url:
                    img_url = img_url.split('?')[0]
                return target_file, img_url
                
        return None, None
    except Exception as e:
        print(f"Error fetching portrait for {hero}: {e}")
        return None, None

def download_image(hero, url, file_path, force=False):
    if not force and os.path.exists(file_path):
        print(f"[{hero}] Already exists: {file_path}. Skipping.")
        return True

    if "-portrait" not in url.lower():
        print(f"[{hero}] Rejecting URL (missing '-portrait'): {url}")
        return False

    max_retries = 3
    for attempt in range(max_retries):
        try:
            res = requests.get(url, stream=True, timeout=15)
            res.raise_for_status()
            
            with open(file_path, 'wb') as f:
                for chunk in res.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            return True
        except Exception as e:
            print(f"[{hero}] Attempt {attempt + 1} failed: {e}")
            time.sleep(2)
            
    return False

def main():
    parser = argparse.ArgumentParser(description="Download MLBB Hero Portraits")
    parser.add_argument("--force", action="store_true", help="Force redownload existing files")
    args = parser.parse_args()

    out_dir = "portrait"
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    print("Fetching hero list...")
    heroes = get_heroes()
    print(f"Found {len(heroes)} heroes.")

    index_data = {}
    index_file = os.path.join(out_dir, "index.json")
    
    if os.path.exists(index_file) and not args.force:
        try:
            with open(index_file, 'r') as f:
                index_data = json.load(f)
        except:
            pass

    for i, hero in enumerate(heroes):
        # Format hero name for file
        clean_hero = hero.replace('/', '-').replace('\\', '-')
        file_path = os.path.join(out_dir, f"{clean_hero}.png")
        
        # Skip if we already have it and not forcing
        if not args.force and os.path.exists(file_path):
            print(f"\nProcessing {i+1}/{len(heroes)}: {hero}")
            print(f"[{hero}] Already exists: {file_path}. Skipping.")
            if clean_hero not in index_data:
                # Add to index if missing but file exists
                pass # We can't easily get source URL without hitting API, let's just skip updating index
            continue
            
        print(f"\nProcessing {i+1}/{len(heroes)}: {hero}")
        file_name, url = get_hero_portrait_url(hero)
        
        if not url:
            print(f"[{hero}] Could not find a portrait image matching the criteria.")
            continue
            
        print(f"[{hero}]")
        print(f"File: {file_name.replace('File:', '')}")
        print(f"URL: {url}")
        
        success = download_image(hero, url, file_path, args.force)
        if success:
            index_data[clean_hero] = {
                "file": f"portrait/{clean_hero}.png",
                "source": url
            }
            
            # Save index incrementally
            with open(index_file, 'w') as f:
                json.dump(index_data, f, indent=2)
            
            # small delay to prevent rate limiting
            time.sleep(0.5)

    print("\nDownload complete.")

if __name__ == "__main__":
    main()
