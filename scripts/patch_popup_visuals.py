import re

with open('overlay.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace CSS
old_css = """  .hero-stats-popup {
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

new_css = """  .hero-stats-popup {
    position: absolute;
    bottom: 38px; left: 0; right: 0; top: 0; /* 38px bottom ignores the footer */
    background: #2F2F2F; /* Restored original flat theme color */
    border-top: 2px solid var(--gold-accent);
    color: var(--text-light);
    z-index: 50;
    transform: translateY(100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px; /* Vertical stack spacing */
    font-family: 'Rajdhani', sans-serif;
  }
  .hero-stats-popup.show-stats {
    animation: slideUpStats 3.5s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  }
  .stat-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  .stat-label {
    font-size: 14px;
    color: #aaaaaa;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  .stat-val {
    font-size: 26px;
    color: var(--gold-accent);
    font-weight: 700;
    line-height: 1.1;
  }
  .debut-pick {
    font-size: 28px;
    font-weight: 800;
    color: var(--gold-accent);
    text-transform: uppercase;
    text-align: center;
    line-height: 1.2;
  }"""
content = content.replace(old_css, new_css)

# Replace JS
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

with open('overlay.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied fix to overlay.html")
