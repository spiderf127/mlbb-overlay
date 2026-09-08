import re

with open('overlay.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Replace any garbled text inside ban-empty-x with X
content = re.sub(r'<div class="ban-empty-x">.*?</div>', '<div class="ban-empty-x">X</div>', content)

# Fix the render loop logic
old_logic = r"""        if\(hero && hero\.icon\) \{
          html \+\= `<img src="\$\{hero\.icon\}" class="hero-icon">`;
        \} else \{
          html \+\= `<div class="ban-empty-x">X</div>`;
        \}"""

new_logic = """        if(hero && hero.name === 'No Ban') {
          html += `<div class="ban-empty-x">X</div>`;
        } else if(hero && hero.icon) {
          html += `<img src="${hero.icon}" class="hero-icon">`;
        } else {
          html += `<div class="ban-empty-x">X</div>`;
        }"""

content = re.sub(old_logic, new_logic, content)

with open('overlay.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed No Ban render logic.")
