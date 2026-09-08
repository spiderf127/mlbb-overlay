import re

with open('test_overlay.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add hero-stats-popup to buildStructure
old_html = """      pc.innerHTML=`
        <div class="active-indicator" id="${side}PickActive${idx}"></div>
        <div class="pick-portrait" id="${side}PickPortrait${idx}"></div>
        <div class="top-role-badge ${side}-role-badge" id="${side}TopRole${idx}"></div>
        <div class="pick-footer" id="${side}PickIGN${idx}">-</div>
      `;"""
new_html = """      pc.innerHTML=`
        <div class="active-indicator" id="${side}PickActive${idx}"></div>
        <div class="pick-portrait" id="${side}PickPortrait${idx}"></div>
        <div class="top-role-badge ${side}-role-badge" id="${side}TopRole${idx}"></div>
        <div class="pick-footer" id="${side}PickIGN${idx}">-</div>
        <div class="hero-stats-popup" id="${side}StatsPopup${idx}"></div>
      `;"""
content = content.replace(old_html, new_html)

# 2. Update popup logic to calculate Win Rate
old_logic = """            if (picks === 0 && bans === 0) {
              statsPopup.innerHTML = `<div class="debut-pick">DEBUT<br>PICK</div>`;
            } else {
              const pRate = total > 0 ? ((picks / total) * 100).toFixed(1) : 0;
              const bRate = total > 0 ? ((bans / total) * 100).toFixed(1) : 0;
              const cRate = total > 0 ? (((picks + bans) / total) * 100).toFixed(1) : 0;
              
              statsPopup.innerHTML = `
                <div class="stat-row"><span>Pick rate:</span> <span class="stat-val">${pRate}%</span></div>
                <div class="stat-row"><span>Ban rate:</span> <span class="stat-val">${bRate}%</span></div>
                <div class="stat-row"><span>Contention:</span> <span class="stat-val">${cRate}%</span></div>
              `;
            }"""
new_logic = """            if (picks === 0 && bans === 0) {
              statsPopup.innerHTML = `<div class="debut-pick">DEBUT<br>PICK</div>`;
            } else {
              const wins = hero.wins || 0;
              const pRate = total > 0 ? ((picks / total) * 100).toFixed(1) : 0;
              const bRate = total > 0 ? ((bans / total) * 100).toFixed(1) : 0;
              const cRate = total > 0 ? (((picks + bans) / total) * 100).toFixed(1) : 0;
              const wRate = picks > 0 ? ((wins / picks) * 100).toFixed(1) : 0;
              
              statsPopup.innerHTML = `
                <div class="stat-row"><span>Pick rate:</span> <span class="stat-val">${pRate}%</span></div>
                <div class="stat-row"><span>Ban rate:</span> <span class="stat-val">${bRate}%</span></div>
                <div class="stat-row"><span>Win rate:</span> <span class="stat-val">${wRate}%</span></div>
                <div class="stat-row"><span>Contention:</span> <span class="stat-val">${cRate}%</span></div>
              `;
            }"""
content = content.replace(old_logic, new_logic)

with open('test_overlay.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected Win Rate logic and fixed popup bug.")
