import re

def refine_ban_slash(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_css = r"""  \.ban-empty-x \{
    width: 100%;
    height: 100%;
    background: linear-gradient\(to top right, transparent calc\(50% - 1px\), #666666 calc\(50% - 1px\), #666666 calc\(50% \+ 1px\), transparent calc\(50% \+ 1px\)\);
  \}"""
    
    new_css = """  .ban-empty-x {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ban-empty-x::after {
    content: '';
    position: absolute;
    width: 3px;
    height: 45%;
    background: #6a6a6a;
    transform: rotate(45deg);
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.4);
  }"""

    content = re.sub(old_css, new_css, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

refine_ban_slash('overlay.html')
try:
    refine_ban_slash('test_overlay.js')
except:
    pass

print("Refined ban empty styling.")
