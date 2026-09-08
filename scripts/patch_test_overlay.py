import re

with open('test_overlay.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add lastRenderedPicks global
content = content.replace('let builtBans = 0, builtPicks = 0, builtFormat = \'\';', "let builtBans = 0, builtPicks = 0, builtFormat = '';\nlet lastRenderedPicks = { blue: [], red: [] };")

# Add the animation logic inside the render loop
animation_logic = """
      const statsPopup = document.getElementById(`${side}StatsPopup${i}`);
      
      if(hero && hero.name) {
        if(lastRenderedPicks[side][i] !== hero.name) {
          lastRenderedPicks[side][i] = hero.name;
          
          if(statsPopup) {
            const picks = hero.picks || 0;
            const bans = hero.bans || 0;
            const total = S.meta?.totalMatches || 0;
            
            if (picks === 0 && bans === 0) {
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
            }
            
            // Trigger animation
            statsPopup.classList.remove('show-stats');
            void statsPopup.offsetWidth; // Force reflow
            statsPopup.classList.add('show-stats');
          }
        }
      } else {
        lastRenderedPicks[side][i] = null;
        if(statsPopup) statsPopup.classList.remove('show-stats');
      }
"""

content = content.replace("const topRoleEl = document.getElementById(`${side}TopRole${i}`);", "const topRoleEl = document.getElementById(`${side}TopRole${i}`);\n" + animation_logic)

with open('test_overlay.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected test_overlay.js logic.")
