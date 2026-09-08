import re
import json

with open('mlbb_script.txt', 'r', encoding='utf-8') as f:
    s = f.read()

# Try to parse it as JSON or find text
import re
texts = re.findall(r'The clouds are ever-shifting', s)
print('Found text?', len(texts))
