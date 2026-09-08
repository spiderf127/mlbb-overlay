import re

def disable_popup_last_change(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_js = """              // Trigger animation
              statsPopup.classList.remove('show-stats');
              void statsPopup.offsetWidth; // Force reflow
              statsPopup.classList.add('show-stats');"""

    new_js = """              // Trigger animation
              if (S.status !== 'last_change') {
                statsPopup.classList.remove('show-stats');
                void statsPopup.offsetWidth; // Force reflow
                statsPopup.classList.add('show-stats');
              }"""

    content = content.replace(old_js, new_js)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

disable_popup_last_change('overlay.html')
try:
    disable_popup_last_change('test_overlay.js')
except:
    pass

print("Disabled popup during last change.")
