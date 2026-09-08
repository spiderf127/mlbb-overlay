import re

def reduce_popup_time(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_css = "animation: slideUpStats 3.5s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;"
    new_css = "animation: slideUpStats 2.2s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;"
    
    content = content.replace(old_css, new_css)

    # Let's also adjust the keyframes slightly to ensure it doesn't drop down too fast relative to the new shorter time.
    # 5% of 2.2s = 0.11s slide up
    # 85% of 2.2s = 1.87s wait
    old_keyframes = """  @keyframes slideUpStats {
    0% { transform: translateY(100%); opacity: 0; }
    5% { transform: translateY(0); opacity: 1; }
    90% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }"""
    new_keyframes = """  @keyframes slideUpStats {
    0% { transform: translateY(100%); opacity: 0; }
    8% { transform: translateY(0); opacity: 1; }
    85% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }"""
    content = content.replace(old_keyframes, new_keyframes)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

reduce_popup_time('overlay.html')
try:
    reduce_popup_time('test_overlay.js')
except:
    pass

print("Popup duration reduced.")
