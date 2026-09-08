import requests
import json

BASE_URL = "https://mobile-legends.fandom.com"

def test():
    url = f"{BASE_URL}/api.php"
    params = {
        "action": "query",
        "prop": "imageinfo",
        "iiprop": "url",
        "titles": "File:Hero011-portrait.png",
        "format": "json"
    }
    
    res = requests.get(url, params=params)
    data = res.json()
    
    pages = data['query']['pages']
    for page_id in pages:
        imageinfo = pages[page_id].get('imageinfo', [])
        if imageinfo:
            print(f"URL: {imageinfo[0]['url']}")

if __name__ == "__main__":
    test()
