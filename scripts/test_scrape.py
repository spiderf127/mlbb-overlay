import urllib.request
import re
import json

def fetch_html(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        return urllib.request.urlopen(req).read().decode('utf-8')
    except Exception as e:
        print("Error fetching", url, e)
        return ""

html = fetch_html('https://mobile-legends.fandom.com/wiki/Layla/Audio')
# Find the hero selection audio link
# Typically it's in an audio tag or a link to .ogg file
# Example: <audio src="https://static.wikia.nocookie.net/.../Layla_Select.ogg..."></audio>
# Or maybe the wiki uses a table.
links = re.findall(r'href="(https://[^"]+\.ogg[^"]*)"', html)
print("Found ogg links href:", len(links))
srcs = re.findall(r'src="(https://[^"]+\.ogg[^"]*)"', html)
print("Found ogg links src:", len(srcs))

if len(srcs) > 0:
    print("First src:", srcs[0])
