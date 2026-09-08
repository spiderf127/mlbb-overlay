import requests
import json

BASE_URL = "https://mobile-legends.fandom.com"

def test():
    hero = "Miya"
    url = f"{BASE_URL}/api.php"
    params = {
        "action": "query",
        "prop": "images",
        "titles": hero,
        "imlimit": "500",
        "format": "json"
    }
    
    res = requests.get(url, params=params)
    data = res.json()
    
    pages = data['query']['pages']
    for page_id in pages:
        images = pages[page_id].get('images', [])
        print(f"Total images found: {len(images)}")
        portraits = [img['title'] for img in images if 'portrait' in img['title'].lower()]
        print(f"Portraits: {portraits}")

if __name__ == "__main__":
    test()
