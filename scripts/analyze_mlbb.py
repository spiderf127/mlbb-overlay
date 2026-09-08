import re

with open('mlbbtools.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Try to find Next.js build ID or API routes
build_id_match = re.search(r'"buildId":"([^"]+)"', content)
if build_id_match:
    print('Build ID:', build_id_match.group(1))

# Search for any string containing 'sora' in the JS
sora_matches = re.findall(r'[^\"\']*sora[^\"\']*', content, re.IGNORECASE)
print('Sora in HTML:', list(set(sora_matches))[:10])

# Search for API endpoints
api_matches = re.findall(r'/api/[a-zA-Z0-9_/-]+', content)
print('API links:', list(set(api_matches)))
