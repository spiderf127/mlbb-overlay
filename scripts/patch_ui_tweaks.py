import re

def update_overlay(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update center-top-spacer height
    content = content.replace("  .center-top-spacer {\n    height: 80px;", "  .center-top-spacer {\n    height: 60px;")

    # 2. Add big-timer CSS
    if ".big-timer" not in content:
        css = """  .big-timer {
    font-size: 64px;
    font-weight: 800;
    color: var(--text-light, #FFFFFF);
    text-align: center;
    line-height: 1;
    margin-bottom: 5px;
    font-family: 'Rajdhani', sans-serif;
  }"""
        content = content.replace("  .cp-action {", css + "\n  .cp-action {")

    # 3. Insert bigTimer div above cpAction
    if 'id="bigTimer"' not in content:
        html = """      <div id="bigTimer" class="big-timer"></div>
      <div class="cp-action" id="cpAction">"""
        content = content.replace("""      <div class="cp-action" id="cpAction">""", html)

    # 4. Update timer logic to update bigTimer
    old_timer = """  const pct = Math.max(0, rem/max);
  
  const bar = document.getElementById('timerBar');"""
    new_timer = """  const pct = Math.max(0, rem/max);
  
  const bigTimer = document.getElementById('bigTimer');
  if(bigTimer) {
    if(S.status === 'running' || S.status === 'last_change') {
      bigTimer.textContent = rem;
    } else {
      bigTimer.textContent = '';
    }
  }
  
  const bar = document.getElementById('timerBar');"""
    content = content.replace(old_timer, new_timer)

    # 5. Fix No Ban icon rendering
    old_ban_icon = """        if(hero && hero.icon) {
          html += `<img src="${hero.icon}" class="hero-icon">`;
        } else {
          html += `<div class="ban-empty-x">?</div>`;
        }"""
    new_ban_icon = """        if(hero && hero.name === 'No Ban') {
          html += `<div class="ban-empty-x">?</div>`;
        } else if(hero && hero.icon) {
          html += `<img src="${hero.icon}" class="hero-icon">`;
        } else {
          html += `<div class="ban-empty-x">?</div>`;
        }"""
    content = content.replace(old_ban_icon, new_ban_icon)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_overlay('overlay.html')
try:
    update_overlay('test_overlay.js')
except:
    pass

with open('operator.html', 'r', encoding='utf-8') as f:
    op_content = f.read()

# Disable No ban in picking portrait
old_hgrid = """  if(filterKey !== lastHGridFilter) {
    grid.innerHTML='';
    hGridEls = [];
    heroes.forEach(hero=>{"""
new_hgrid = """  if(filterKey !== lastHGridFilter) {
    grid.innerHTML='';
    hGridEls = [];
    const step = S.steps?.[S.currentStep];
    const isPick = step && step.action === 'pick';
    heroes.forEach(hero=>{
      if (isPick && hero.name === 'No Ban') return;"""
op_content = op_content.replace(old_hgrid, new_hgrid)

with open('operator.html', 'w', encoding='utf-8') as f:
    f.write(op_content)

print("Applied UI tweaks.")
