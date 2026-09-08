import re

def append_no_ban(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_text = "{name:'Zilong',role:'Fighter',img:'portrait/Zilong.png',picks:6,bans:83,wins:6},"
    new_text = "{name:'Zilong',role:'Fighter',img:'portrait/Zilong.png',picks:6,bans:83,wins:6},\n  {name:'No Ban',role:'None',img:'',picks:0,bans:0,wins:0},"
    
    # In operator.html the picks, bans, wins are different due to randomness.
    # Let's use regex instead:
    content = re.sub(r"(\{name:'Zilong'.+?\bwins:\d+\},)", r"\1\n  {name:'No Ban',role:'None',img:'',picks:0,bans:0,wins:0},", content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

append_no_ban('test.js')
append_no_ban('operator.html')

print("Added No Ban after Zilong.")
