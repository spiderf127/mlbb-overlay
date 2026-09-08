import requests
import json

BASE_URL = "https://mobile-legends.fandom.com"

def test():
    # Get list of heroes
    url = f"{BASE_URL}/api.php"
    params = {
        "action": "query",
        "list": "categorymembers",
        "cmtitle": "Category:Heroes",
        "cmlimit": "500",
        "format": "json"
    }
    
    res = requests.get(url, params=params)
    data = res.json()
    
    heroes = [member['title'] for member in data['query']['categorymembers'] if ':' not in member['title'] and 'Heroes' not in member['title'] and 'Upcoming' not in member['title']]
    print(f"Found {len(heroes)} heroes. First 5: {heroes[:5]}")
    
    # Check Miya
    hero = "Miya"
    print(f"Testing {hero}")
    page_res = requests.get(f"{BASE_URL}/wiki/{hero}")
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(page_res.content, 'html.parser')
    
    imgs = soup.find_all('img')
    portrait_urls = []
    for img in imgs:
        src = img.get('src', '')
        data_src = img.get('data-src', '')
        url = data_src if data_src else src
        
        if '-portrait.png' in url.lower() and 'hero' in url.lower():
            # sometimes url has /revision/latest
            portrait_urls.append(url)
            
    print(f"Portraits found: {portrait_urls}")

if __name__ == "__main__":
    test()
