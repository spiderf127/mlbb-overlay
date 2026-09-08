import os
import urllib.parse
import cloudscraper
from bs4 import BeautifulSoup

# ------------------------------------------------------------------
# Mapping of hero name → replacement URL (the ones you gave)
# ------------------------------------------------------------------
REPLACEMENTS = {
    "Aldous":   "https://static.wikia.nocookie.net/mobile-legends/images/5/51/Soul_Contractor_wall.png/revision/latest?cb=20180816134944",
    "Alice":    "https://static.wikia.nocookie.net/mobile-legends/images/c/cd/Alice_Queen_of_Blood.jpg/revision/latest?cb=20251208095826",
    "Argus":    "https://static.wikia.nocookie.net/mobile-legends/images/2/2d/Argus_Dark_Angel.png/revision/latest?cb=20251208102146",
    "Atlas":    "https://static.wikia.nocookie.net/mobile-legends/images/e/ea/Atlas_%28Ocean_Gladiator%29.jpg/revision/latest?cb=20200528124541",
    "Cecilion": "https://mobile-legends.fandom.com/wiki/Cecilion?file=Cecilion_%28Embrace_of_Night%29.jpg",
    "Kimmy":    "https://static.wikia.nocookie.net/mobile-legends/images/3/3e/Kimmy_Hoverjet_Outrider.jpg/revision/latest?cb=20251208100002",
    "Minsitthar":"https://mobile-legends.fandom.com/wiki/Minsitthar?file=4f953145b4acdeb3fb4fa4ecea59c8b9.png",
    "Zhuxin":   "https://static.wikia.nocookie.net/mobile-legends/images/b/b5/Zhuxin_Beacon_of_Spirits.jpg/revision/latest?cb=20251208095315",
    "X.Borg":   "https://static.wikia.nocookie.net/mobile-legends/images/9/9f/X.Borg_Firaga_Armor.png/revision/latest?cb=20251208223019",
    # No URL supplied for Yve → leave its current splash untouched.
}

def resolve_image_url(url: str) -> str:
    """Return a direct image URL.
    Handles Mobile Legends Fandom `?file=` URLs by converting them to the proper file page
    and extracting the real image link.
    """
    # If the URL is a Fandom wiki page with ?file=, rewrite to the file page
    if "?file=" in url:
        # Build the /wiki/File: URL
        base = "https://mobile-legends.fandom.com/wiki/File:"
        file_part = urllib.parse.unquote(url.split("?file=")[1])
        file_part = file_part.lstrip("/")
        file_page_url = base + file_part
    else:
        file_page_url = url

    scraper = cloudscraper.create_scraper()
    # Try fetching the URL – it may already be a direct image
    resp = scraper.get(file_page_url, timeout=30)
    resp.raise_for_status()
    content_type = resp.headers.get("Content-Type", "")
    if "image" in content_type:
        # Direct image URL
        return file_page_url
    # Otherwise we need to parse the HTML to find the actual image link
    soup = BeautifulSoup(resp.text, "html.parser")
    # Look for the full image link (class fullImageLink) inside an <a>
    a_tag = soup.find("a", class_="fullImageLink")
    if a_tag and a_tag.get("href"):
        img_url = a_tag["href"]
    else:
        # Fallback: any <a> linking to /wiki/File:
        a_tag = soup.find("a", href=lambda x: x and "/wiki/File:" in x)
        if a_tag and a_tag.get("href"):
            img_url = a_tag["href"]
        else:
            raise Exception("Unable to locate image URL on page")
    # Ensure absolute URL
    if img_url.startswith("//"):
        img_url = "https:" + img_url
    elif img_url.startswith("/"):
        img_url = "https://mobile-legends.fandom.com" + img_url
    return img_url

def download_and_save(hero: str, url: str, out_dir: str):
    try:
        img_url = resolve_image_url(url)
        scraper = cloudscraper.create_scraper()
        resp = scraper.get(img_url, stream=True, timeout=30)
        resp.raise_for_status()
        # Verify we got an image
        if "image" not in resp.headers.get("Content-Type", ""):
            raise Exception("Fetched content is not an image")
        # Determine file extension
        parsed = urllib.parse.urlparse(resp.url)
        _, ext = os.path.splitext(parsed.path)
        if ext.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            ext = ".jpg"
        filename = f"{hero}{ext}"
        out_path = os.path.join(out_dir, filename)
        # Overwrite any existing file
        with open(out_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        size = os.path.getsize(out_path)
        print(f"[{hero}] saved as {filename} ({size} bytes)")
    except Exception as e:
        print(f"[{hero}] ERROR: {e}")

def main():
    splash_dir = os.path.abspath("splash")
    os.makedirs(splash_dir, exist_ok=True)
    for hero, url in REPLACEMENTS.items():
        download_and_save(hero, url, splash_dir)

if __name__ == "__main__":
    main()
