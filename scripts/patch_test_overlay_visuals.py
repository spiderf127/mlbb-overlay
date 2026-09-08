import re

with open('test_overlay.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_js = """                statsPopup.innerHTML = `
                  <div class="stats-grid">
                    <div class="stat-box"><span class="stat-label">Pick</span> <span class="stat-val">${pRate}%</span></div>
                    <div class="stat-box"><span class="stat-label">Ban</span> <span class="stat-val">${bRate}%</span></div>
                    <div class="stat-box"><span class="stat-label">Win</span> <span class="stat-val">${wRate}%</span></div>
                    <div class="stat-box"><span class="stat-label">Contest</span> <span class="stat-val">${cRate}%</span></div>
                  </div>
                `;"""

new_js = """                statsPopup.innerHTML = `
                  <div class="stat-box"><span class="stat-label">Pick Rate</span> <span class="stat-val">${pRate}%</span></div>
                  <div class="stat-box"><span class="stat-label">Ban Rate</span> <span class="stat-val">${bRate}%</span></div>
                  <div class="stat-box"><span class="stat-label">Win Rate</span> <span class="stat-val">${wRate}%</span></div>
                  <div class="stat-box"><span class="stat-label">Contention</span> <span class="stat-val">${cRate}%</span></div>
                `;"""
content = content.replace(old_js, new_js)

with open('test_overlay.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied fix to test_overlay.js")
