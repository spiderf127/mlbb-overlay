import re
import random

def add_dummy_stats(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def repl(m):
        picks = random.randint(5, 40)
        bans = random.randint(0, 100 - picks)
        wins = random.randint(0, picks)
        return f"picks:{picks},bans:{bans},wins:{wins}"

    content = re.sub(r'picks:\d+,bans:\d+,wins:\d+', repl, content)
    
    # Also set default totalMatches:100,statsEnabled:true
    content = content.replace('totalMatches:0}', 'totalMatches:100,statsEnabled:true}')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

add_dummy_stats('operator.html')
add_dummy_stats('test.js')
print("Added dummy stats.")
