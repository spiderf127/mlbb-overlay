import re

with open('overlay.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add CSS
css_to_add = """
  @keyframes slideUpStats {
    0% { transform: translateY(100%); }
    10% { transform: translateY(0); }
    90% { transform: translateY(0); }
    100% { transform: translateY(100%); }
  }
  .hero-stats-popup {
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
  }
"""

content = content.replace('  @keyframes blinkArrowText {', css_to_add + '\n  @keyframes blinkArrowText {')

# Add HTML to pick card template
new_pick_html = """
        <div class="active-indicator" id="${side}PickActive${idx}"></div>
        <div class="pick-portrait" id="${side}PickPortrait${idx}"></div>
        <div class="top-role-badge ${side}-role-badge" id="${side}TopRole${idx}"></div>
        <div class="pick-footer" id="${side}PickIGN${idx}">—</div>
        <div class="hero-stats-popup" id="${side}StatsPopup${idx}"></div>
"""
content = re.sub(
    r'<div class="active-indicator" id="\$\{side\}PickActive\$\{idx\}"></div>\s*<div class="pick-portrait" id="\$\{side\}PickPortrait\$\{idx\}"></div>\s*<div class="top-role-badge \$\{side\}-role-badge" id="\$\{side\}TopRole\$\{idx\}"></div>\s*<div class="pick-footer" id="\$\{side\}PickIGN\$\{idx\}">(-|—)</div>',
    new_pick_html.strip(),
    content
)

with open('overlay.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected overlay CSS and DOM.")
