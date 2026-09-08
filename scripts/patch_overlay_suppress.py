import re

def update_overlay(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    old_js = """            if (S.meta.statsEnabled !== false) {
              if (S.status !== 'last_change') {
                statsPopup.classList.remove('show-stats');
                void statsPopup.offsetWidth; // Force reflow
                statsPopup.classList.add('show-stats');
              }
            }"""

    new_js = """            if (S.meta.statsEnabled !== false) {
              if (S.status !== 'last_change' && !hero.suppressPopup) {
                statsPopup.classList.remove('show-stats');
                void statsPopup.offsetWidth; // Force reflow
                statsPopup.classList.add('show-stats');
              }
            }"""

    content = content.replace(old_js, new_js)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_overlay('overlay.html')
try:
    update_overlay('test_overlay.js')
except:
    pass

print("Updated overlays to honor suppressPopup")
