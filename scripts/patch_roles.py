import re
import requests
from bs4 import BeautifulSoup
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
}

def get_hero_role(hero_name):
    url_name = hero_name.replace(" ", "_")
    url = f"https://mobile-legends.fandom.com/wiki/{url_name}"
    
    try:
        res = requests.get(url, headers=headers, timeout=10)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            class_div = soup.find('div', {'data-source': 'class'})
            if class_div:
                val_div = class_div.find('div', class_='pi-data-value')
                if val_div:
                    links = val_div.find_all('a')
                    if links:
                        return links[0].text.strip()
            
            # fallback: look for string "Role(s)"
            # ...
    except Exception as e:
        print(f"Error fetching role for {hero_name}: {e}")
        
    return None

def main():
    with open('test.js', 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Extract existing heroes
    roster_match = re.search(r'function defRoster\(\)\{return\[(.*?)\]\.map', content, re.DOTALL)
    if not roster_match:
        print("Could not find defRoster in test.js")
        return
        
    existing_roster_str = roster_match.group(1)
    
    heroes_to_fix = [
        "Alpha", "Arlott", "Aulus", "Bane", "Belerick", "Chip", "Cici", "Dyrroth", "Fredrinn", "Gatotkaca", "Grock", "Harley", 
        "Hirara", "Julian", "Kaja", "Kalea", "Khaleed", "Lapu-Lapu", "Layla", "Lukas", "Marcel", "Minsitthar", "Nolan", 
        "Novaria", "Obsidia", "Paquito", "Popol and Kupa", "Selena", "Silvanna", "Sora", "Suyou", "Vexana", "Yin", "Zetian", "Zhuxin"
    ]
    
    lines = existing_roster_str.split('\n')
    for i, line in enumerate(lines):
        for hero in heroes_to_fix:
            if f"name:'{hero}'" in line:
                print(f"Fetching {hero}...")
                role = get_hero_role(hero)
                if role:
                    # replace role:'Fighter' with role:'{role}'
                    lines[i] = re.sub(r"role:'[^']+'", f"role:'{role}'", line)
                    print(f"Updated {hero} -> {role}")
                time.sleep(1) # prevent rate limit
                
    new_roster_str = "\n".join(lines)
    new_content = content[:roster_match.start(1)] + new_roster_str + content[roster_match.end(1):]
    
    with open('test.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("Roles patched!")

if __name__ == "__main__":
    main()
