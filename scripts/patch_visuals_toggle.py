import re

# --- operator.html ---
with open('operator.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add the toggle right after mTotalMatches
old_total_matches = """      <div>
        <label style="display:block;font-size:10px;color:var(--text2);margin-bottom:4px;font-weight:700;">TOTAL MATCHES</label>
        <input type="number" id="mTotalMatches" min="0" onchange="S.meta.totalMatches=parseInt(this.value)||0; pub(); renderStatsGrid();" style="width:100px;font-size:16px;text-align:center;">
      </div>"""
new_total_matches = """      <div>
        <label style="display:block;font-size:10px;color:var(--text2);margin-bottom:4px;font-weight:700;">TOTAL MATCHES</label>
        <input type="number" id="mTotalMatches" min="0" onchange="S.meta.totalMatches=parseInt(this.value)||0; pub(); renderStatsGrid();" style="width:100px;font-size:16px;text-align:center;">
      </div>
      <div>
        <label style="display:block;font-size:10px;color:var(--text2);margin-bottom:4px;font-weight:700;">POPUP</label>
        <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:14px;font-weight:700;">
          <input type="checkbox" id="mStatsEnabled" onchange="S.meta.statsEnabled=this.checked; pub();"> ENABLED
        </label>
      </div>"""
content = content.replace(old_total_matches, new_total_matches)

# Add it to initialization
old_init = "if(document.getElementById('mTotalMatches')) document.getElementById('mTotalMatches').value = S.meta.totalMatches || 0;"
new_init = "if(document.getElementById('mTotalMatches')) document.getElementById('mTotalMatches').value = S.meta.totalMatches || 0;\n  if(document.getElementById('mStatsEnabled')) document.getElementById('mStatsEnabled').checked = S.meta.statsEnabled !== false;"
content = content.replace(old_init, new_init)

with open('operator.html', 'w', encoding='utf-8') as f:
    f.write(content)


# --- overlay.html ---
with open('overlay.html', 'r', encoding='utf-8') as f:
    overlay = f.read()

# Update CSS for .hero-stats-popup to make it prettier
old_css = """  .hero-stats-popup {
    position: absolute;
    bottom: 0; left: 0; right: 0; top: 0;
    background: #2F2F2F;
    color: white;
    z-index: 50;
    transform: translateY(100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-family: 'Rajdhani', sans-serif;
  }
  .hero-stats-popup.show-stats {
    animation: slideUpStats 3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  }
  .stat-row {
    display: flex;
    justify-content: space-between;
    width: 80%;
    font-size: 18px;
    font-weight: 600;
  }
  .stat-val {
    color: var(--gold-accent, #FFC107);
    font-weight: 700;
  }
  .debut-pick {
    font-size: 32px;
    font-weight: 800;
    color: var(--gold-accent, #FFC107);
    text-transform: uppercase;
    text-align: center;
    line-height: 1.1;
  }"""
new_css = """  .hero-stats-popup {
    position: absolute;
    bottom: 0; left: 0; right: 0; top: 0;
    background: linear-gradient(to top, rgba(20, 20, 25, 0.98), rgba(30, 30, 35, 0.95));
    border-top: 3px solid var(--gold-accent, #FFC107);
    color: white;
    z-index: 50;
    transform: translateY(100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Rajdhani', sans-serif;
    box-shadow: 0 -5px 20px rgba(0,0,0,0.5);
  }
  .hero-stats-popup.show-stats {
    animation: slideUpStats 4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 16px;
    width: 85%;
  }
  .stat-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    padding: 6px 0;
  }
  .stat-label {
    font-size: 12px;
    color: #90A4AE;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }
  .stat-val {
    font-size: 22px;
    color: var(--gold-accent, #FFC107);
    font-weight: 800;
    line-height: 1;
    margin-top: 2px;
  }
  .debut-pick {
    font-size: 34px;
    font-weight: 800;
    color: var(--gold-accent, #FFC107);
    text-transform: uppercase;
    text-align: center;
    line-height: 1.1;
    text-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
  }"""
overlay = overlay.replace(old_css, new_css)

# Update Javascript animation trigger logic in overlay.html to use the new HTML grid and toggle
old_js = """            if (picks === 0 && bans === 0) {
              statsPopup.innerHTML = `<div class="debut-pick">DEBUT<br>PICK</div>`;
            } else {
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

with open('overlay.html', 'w', encoding='utf-8') as f:
    f.write(overlay)

print("Patch applied.")
