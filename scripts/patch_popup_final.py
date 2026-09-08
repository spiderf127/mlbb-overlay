import re

def fix_popup(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update the CSS for hero-stats-popup and animations
    old_css_popup = """  .hero-stats-popup {
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
  }"""
    
    new_css_popup = """  .hero-stats-popup {
    position: absolute;
    bottom: 38px; left: 0; right: 0; top: 0; /* 38px bottom ignores the footer */
    background: #2F2F2F; /* Restored original flat theme color */
    border-top: 2px solid var(--gold-accent);
    color: var(--text-light);
    z-index: 50;
    transform: translateY(100%);
    opacity: 0; /* Hidden by default */
    pointer-events: none; /* Never intercept clicks */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px; /* Reduced gap */
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
    font-size: 11px; /* Smaller to prevent wrapping */
    color: #aaaaaa;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  .stat-val {
    font-size: 20px; /* Scaled down slightly */
    color: var(--gold-accent);
    font-weight: 700;
    line-height: 1.1;
  }"""
    content = content.replace(old_css_popup, new_css_popup)

    # 2. Update the keyframes to include opacity fading
    old_keyframes = """  @keyframes slideUpStats {
    0% { transform: translateY(100%); }
    10% { transform: translateY(0); }
    90% { transform: translateY(0); }
    100% { transform: translateY(100%); }
  }"""
    new_keyframes = """  @keyframes slideUpStats {
    0% { transform: translateY(100%); opacity: 0; }
    5% { transform: translateY(0); opacity: 1; }
    90% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }"""
    content = content.replace(old_keyframes, new_keyframes)

    # 3. Update JS label 'Contention' -> 'Contest' and 'Rate' -> 'Rt' to save space
    old_js = """                statsPopup.innerHTML = `
                  <div class="stat-box"><span class="stat-label">Pick Rate</span> <span class="stat-val">${pRate}%</span></div>
                  <div class="stat-box"><span class="stat-label">Ban Rate</span> <span class="stat-val">${bRate}%</span></div>
                  <div class="stat-box"><span class="stat-label">Win Rate</span> <span class="stat-val">${wRate}%</span></div>
                  <div class="stat-box"><span class="stat-label">Contention</span> <span class="stat-val">${cRate}%</span></div>
                `;"""
    new_js = """                statsPopup.innerHTML = `
                  <div class="stat-box"><span class="stat-label">Pick</span> <span class="stat-val">${pRate}%</span></div>
                  <div class="stat-box"><span class="stat-label">Ban</span> <span class="stat-val">${bRate}%</span></div>
                  <div class="stat-box"><span class="stat-label">Win</span> <span class="stat-val">${wRate}%</span></div>
                  <div class="stat-box"><span class="stat-label">Contest</span> <span class="stat-val">${cRate}%</span></div>
                `;"""
    content = content.replace(old_js, new_js)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_popup('overlay.html')
try:
    fix_popup('test_overlay.js')
except:
    pass

print("Fixed IGN hiding, opacity animation, and stat text size.")
