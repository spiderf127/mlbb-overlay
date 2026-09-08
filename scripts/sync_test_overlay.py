import re

with open('test_overlay.js', 'r', encoding='utf-8') as f:
    overlay = f.read()

old_js = """            if (picks === 0 && bans === 0) {
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
            }
            
            // Trigger animation
            statsPopup.classList.remove('show-stats');
            void statsPopup.offsetWidth; // Force reflow
            statsPopup.classList.add('show-stats');"""

new_js = """            if (S.meta.statsEnabled !== false) {
              if (picks === 0 && bans === 0) {
                statsPopup.innerHTML = `<div class="debut-pick">DEBUT<br>PICK</div>`;
              } else {
                const wins = hero.wins || 0;
                const pRate = total > 0 ? ((picks / total) * 100).toFixed(1) : 0;
                const bRate = total > 0 ? ((bans / total) * 100).toFixed(1) : 0;
                const cRate = total > 0 ? (((picks + bans) / total) * 100).toFixed(1) : 0;
                const wRate = picks > 0 ? ((wins / picks) * 100).toFixed(1) : 0;
                
                statsPopup.innerHTML = `
                  <div class="stats-grid">
                    <div class="stat-box"><span class="stat-label">Pick</span> <span class="stat-val">${pRate}%</span></div>
                    <div class="stat-box"><span class="stat-label">Ban</span> <span class="stat-val">${bRate}%</span></div>
                    <div class="stat-box"><span class="stat-label">Win</span> <span class="stat-val">${wRate}%</span></div>
                    <div class="stat-box"><span class="stat-label">Contest</span> <span class="stat-val">${cRate}%</span></div>
                  </div>
                `;
              }
              
              // Trigger animation
              statsPopup.classList.remove('show-stats');
              void statsPopup.offsetWidth; // Force reflow
              statsPopup.classList.add('show-stats');
            }"""

overlay = overlay.replace(old_js, new_js)

with open('test_overlay.js', 'w', encoding='utf-8') as f:
    f.write(overlay)

print("test_overlay.js synced")
