import os
import cloudscraper
from bs4 import BeautifulSoup
import re
import urllib.parse
from concurrent.futures import ThreadPoolExecutor

# Constants
BASE_URL = "https://mobile-legends.fandom.com"
LIST_URL = f"{BASE_URL}/wiki/List_of_heroes"
OUTPUT_DIR = "splash"

# Create a global cloudscraper instance to handle Cloudflare
scraper = cloudscraper.create_scraper()
CUSTOM_URLS = {
    "Aldous": "https://static.wikia.nocookie.net/mobile-legends/images/5/51/Soul_Contractor_wall.png/revision/latest?cb=20180816134944",
    "Alice": "https://static.wikia.nocookie.net/mobile-legends/images/c/cd/Alice_Queen_of_Blood.jpg/revision/latest?cb=20251208095826",
    "Argus": "https://static.wikia.nocookie.net/mobile-legends/images/2/2d/Argus_Dark_Angel.png/revision/latest?cb=20251208102146",
    "Atlas": "https://static.wikia.nocookie.net/mobile-legends/images/e/ea/Atlas_%28Ocean_Gladiator%29.jpg/revision/latest?cb=20200528124541",
    "Kimmy": "https://static.wikia.nocookie.net/mobile-legends/images/3/3e/Kimmy_Hoverjet_Outrider.jpg/revision/latest?cb=20251208100002",
    "Zhuxin": "https://static.wikia.nocookie.net/mobile-legends/images/b/b5/Zhuxin_Beacon_of_Spirits.jpg/revision/latest?cb=20251208095315",
    "X.Borg": "https://static.wikia.nocookie.net/mobile-legends/images/9/9f/X.Borg_Firaga_Armor.png/revision/latest?cb=20251208223019"
}

def setup_directory():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

def clean_filename(name):
    # Remove invalid characters for Windows filenames
    return re.sub(r'[<>:"/\\|?*]', '', name)

def get_hero_links():
    print(f"Fetching hero list from {LIST_URL}...")
    response = scraper.get(LIST_URL)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.text, 'html.parser')
    hero_links = []
    
    # The heroes are in a table. The second column contains the icon, the third contains the name.
    tables = soup.find_all('table', class_='wikitable')
    for table in tables:
        rows = table.find_all('tr')
        for row in rows[1:]: # Skip header
            cols = row.find_all(['td', 'th'])
            if len(cols) > 2:
                # The hero link is available in the icon cell (index 1) and name cell (index 2)
                # Let's use the icon cell to get the link and the name cell to get the name
                icon_a_tag = cols[1].find('a')
                if icon_a_tag and 'href' in icon_a_tag.attrs:
                    hero_url = BASE_URL + icon_a_tag['href']
                    if icon_a_tag['href'].startswith('http'):
                        hero_url = icon_a_tag['href']
                        
                    # Extract name from the 3rd column (index 2)
                    name_text = cols[2].get_text(separator=' ', strip=True)
                    # Clean up "Miya, the Moonlight Archer" -> "Miya"
                    hero_name = name_text.split(',')[0].strip()
                    
                    if hero_name and not hero_name.startswith("File:"):
                        hero_links.append((hero_name, hero_url))
                    
    unique_heroes = {name: url for name, url in hero_links}
    return unique_heroes

def download_splash_art(hero_info):
    hero_name, hero_url = hero_info
    clean_name = clean_filename(hero_name)
    
    if hero_name in CUSTOM_URLS:
        image_url = CUSTOM_URLS[hero_name]
    else:
        try:
            response = scraper.get(hero_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            image_url = None
            hero_name_url = hero_name.replace(' ', '_')
            
            a_tags = soup.find_all('a', href=True)
            candidates = []
            for a in a_tags:
                href = urllib.parse.unquote(a['href'])
                if '/wiki/File:' in href and hero_name_url in href and ('.jpg' in href or '.png' in href or '.webp' in href):
                    img = a.find('img')
                    if img:
                        src = img.get('data-src') or img.get('src')
                        if src:
                            candidates.append((href, src))
            
            if candidates:
                parenthesis_candidates = [c for c in candidates if '(' in c[0] or '%28' in c[0]]
                image_url = parenthesis_candidates[0][1] if parenthesis_candidates else candidates[0][1]
        except Exception as e:
            print(f"[{hero_name}] Error scraping: {e}")
            return False

    if not image_url:
        print(f"[{hero_name}] Could not find 16:9 splash art.")
        return False
        
    if '/revision/' in image_url:
        image_url = image_url.split('/revision/')[0]
    elif '/scale-to-width-down/' in image_url:
        image_url = image_url.split('/scale-to-width-down/')[0]
            
    if image_url.startswith('/'):
        image_url = "https:" + image_url
        
    parsed_url = urllib.parse.urlparse(image_url)
    ext = os.path.splitext(parsed_url.path)[1] or '.jpg'
    output_path = os.path.join(OUTPUT_DIR, f"{clean_name}{ext}")
    
    if os.path.exists(output_path):
        print(f"[{hero_name}] Already exists, skipping.")
        return True

    try:
        img_response = scraper.get(image_url, stream=True)
        img_response.raise_for_status()
        with open(output_path, 'wb') as f:
            for chunk in img_response.iter_content(1024):
                f.write(chunk)
        print(f"[{hero_name}] Successfully downloaded.")
        return True
    except Exception as e:
        print(f"[{hero_name}] Error downloading: {e}")
        return False

def main():
    setup_directory()
    
    try:
        heroes = get_hero_links()
        print(f"Found {len(heroes)} heroes.")
        
        # Download concurrently to speed things up
        with ThreadPoolExecutor(max_workers=5) as executor:
            list(executor.map(download_splash_art, heroes.items()))
            
        print("Finished downloading splash arts!")
        
    except Exception as e:
        print(f"Fatal error: {e}")

if __name__ == "__main__":
    main()
