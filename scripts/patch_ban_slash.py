import re

def update_ban_slash(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update CSS
    old_css = r"""  \.ban-empty-x \{
    color: #cc0000;
    font-size: 32px;
    font-weight: 900;
  \}"""
    new_css = """  .ban-empty-x {
    width: 100%;
    height: 100%;
    background: linear-gradient(to top right, transparent calc(50% - 1px), #666666 calc(50% - 1px), #666666 calc(50% + 1px), transparent calc(50% + 1px));
  }"""
    
    if ".ban-empty-x" in content:
        content = re.sub(r'  \.ban-empty-x \{[^\}]+\}', new_css, content)

    # 2. Remove the "X" text from inside the div
    content = content.replace('<div class="ban-empty-x">X</div>', '<div class="ban-empty-x"></div>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_ban_slash('overlay.html')
try:
    update_ban_slash('test_overlay.js')
except:
    pass

print("Updated ban empty styling to subtle slash.")
