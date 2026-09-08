import re

def fix_ban_icon(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the ban rendering block and manually construct the correct one.
    old_block = r"""        if\(hero && hero\.icon\) \{
          html \+\= `<img src="\$\{hero\.icon\}" class="hero-icon">`;
        \} else \{
          html \+\= `<div class="ban-empty-x">[\?X]</div>`;
        \}"""
    
    new_block = """        if(hero && hero.name === 'No Ban') {
          html += `<div class="ban-empty-x">X</div>`;
        } else if(hero && hero.icon) {
          html += `<img src="${hero.icon}" class="hero-icon">`;
        } else {
          html += `<div class="ban-empty-x">X</div>`;
        }"""
    
    content = re.sub(old_block, new_block, content)

    # Also make sure to change the default empty ban initialization
    old_init = r"""<div class="active-indicator"></div><div class="ban-empty-x">[\?X]</div>"""
    new_init = """<div class="active-indicator"></div><div class="ban-empty-x">X</div>"""
    content = re.sub(old_init, new_init, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_ban_icon('overlay.html')
try:
    fix_ban_icon('test_overlay.js')
except:
    pass

print("Fixed No Ban icon rendering.")
