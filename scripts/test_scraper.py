import os
import json
import time
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://mobile-legends.fandom.com"
HERO_LIST_URL = f"{BASE_URL}/wiki/List_of_heroes"

def test():
    response = requests.get(HERO_LIST_URL)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    heroes = []
    # Find the table containing heroes
    tables = soup.find_all('table', class_='wikitable')
    if not tables:
        print("No wikitable found")
        return

    table = tables[0]
    rows = table.find_all('tr')[1:] # Skip header
    for row in rows:
        cols = row.find_all(['td', 'th'])
        if len(cols) >= 2:
            a_tag = cols[1].find('a')
            if a_tag:
                name = a_tag.text.strip()
                link = a_tag['href']
                heroes.append((name, link))
                
    print(f"Found {len(heroes)} heroes. First 5: {heroes[:5]}")
    
    if heroes:
        name, link = heroes[0]
        print(f"Testing {name} at {link}")
        hero_res = requests.get(BASE_URL + link)
        hero_soup = BeautifulSoup(hero_res.content, 'html.parser')
        
        imgs = hero_soup.find_all('img')
        portrait_urls = []
        for img in imgs:
            src = img.get('src', '')
            data_src = img.get('data-src', '')
            url = data_src if data_src else src
            
            if 'portrait.png' in url.lower() and 'hero' in url.lower():
                portrait_urls.append(url)
                
        print(f"Portraits found: {portrait_urls}")

if __name__ == "__main__":
    test()
