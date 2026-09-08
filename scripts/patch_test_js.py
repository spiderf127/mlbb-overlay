import os
import json
import re
import requests
from bs4 import BeautifulSoup

def get_hero_role(hero_name):
    # Fandom URLs use underscores
    url_name = hero_name.replace(" ", "_")
    url = f"https://mobile-legends.fandom.com/wiki/{url_name}"
    
    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, 'html.parser')
        
        # In Fandom MLBB, the role is usually found in an aside data-source="class"
        # <div data-source="class" class="pi-item pi-data pi-item-spacing pi-border-color">
        #   <h3 class="pi-data-label pi-secondary-font">Class</h3>
        #   <div class="pi-data-value pi-font">... <a title="Fighter">Fighter</a> ...</div>
        # </div>
        
        class_div = soup.find('div', {'data-source': 'class'})
        if class_div:
            val_div = class_div.find('div', class_='pi-data-value')
            if val_div:
                links = val_div.find_all('a')
                if links:
                    role = links[0].text.strip()
                    # Some roles are dual, we just pick the first one for simplicity
                    return role
    except Exception as e:
        print(f"Error fetching role for {hero_name}: {e}")
        
    return "Fighter" # Fallback

def main():
    with open('portrait/index.json', 'r') as f:
        portraits = json.load(f)
        
    with open('test.js', 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Extract existing heroes
    roster_match = re.search(r'function defRoster\(\)\{return\[(.*?)\]\.map', content, re.DOTALL)
    if not roster_match:
        print("Could not find defRoster in test.js")
        return
        
    existing_roster_str = roster_match.group(1)
    
    # Parse existing heroes into a dictionary mapping name to role
    existing_heroes = {}
    for line in existing_roster_str.split('\n'):
        if '{name:' in line:
            name_match = re.search(r"name:'([^']+)'", line)
            if not name_match:
                name_match = re.search(r'name:"([^"]+)"', line)
            
            role_match = re.search(r"role:'([^']+)'", line)
            if not role_match:
                role_match = re.search(r'role:"([^"]+)"', line)
                
            if name_match and role_match:
                existing_heroes[name_match.group(1)] = role_match.group(1)
                
    print(f"Found {len(existing_heroes)} existing heroes.")
    
    new_roster_lines = []
    
    for hero, data in portraits.items():
        name = hero.replace("-", " ") # restore spaces
        
        # Fix some names if needed
        if name == "Yi Sun shin": name = "Yi Sun-shin"
        if name == "Popol and Kupa": name = "Popol and Kupa"
        if name == "X.Borg": name = "X.Borg"
        
        # Skip special pages that aren't heroes
        if name in ["Assassin", "Fighter", "Mage", "Marksman", "Support", "Tank", "Roamer", "Gold Laner", "EXP Laner", "Side Laner", "Oriental Fighters", "The Exorcists/Member Introduction", "S.A.B.E.R.", "V.E.N.O.M."]:
            continue
            
        role = existing_heroes.get(name)
        if not role:
            print(f"Hero {name} is missing. Fetching role...")
            role = get_hero_role(name)
            print(f"-> Role: {role}")
            
        # Clean path
        img_path = data['file'].replace('\\', '/')
        
        # Build new line
        # {name:'Alucard',role:'Fighter',img:'portrait/Alucard.png',banRate:0,pickRate:0,contestRate:0},
        new_roster_lines.append(f"  {{name:'{name}',role:'{role}',img:'{img_path}',banRate:0,pickRate:0,contestRate:0}},")
        
    new_roster_str = "\n".join(new_roster_lines) + "\n"
    
    # Replace in content
    new_content = content[:roster_match.start(1)] + "\n" + new_roster_str + content[roster_match.end(1):]
    
    with open('test.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("test.js successfully updated!")

if __name__ == "__main__":
    main()
