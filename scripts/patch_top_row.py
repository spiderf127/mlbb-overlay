import re
import os

# Create teams folder
os.makedirs('teams', exist_ok=True)

# 1. Update overlay.html
with open('overlay.html', 'r', encoding='utf-8') as f:
    overlay = f.read()

# CSS adjustments
old_top_row = """  .top-row {
    height: 80px;
    display: flex;
    border-bottom: var(--border-thin);
  }"""
new_top_row = """  .top-row {
    height: 60px;
    display: flex;
    border-bottom: var(--border-thin);
  }"""
overlay = overlay.replace(old_top_row, new_top_row)

old_team_name = """  .team-name {
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-dark);
    margin: 0 15px;
  }"""
new_team_name = """  .team-name {
    font-size: 18px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-dark);
    margin: 0 15px;
  }"""
overlay = overlay.replace(old_team_name, new_team_name)

# Update local teams folder path logic
old_b_logo = """<img src="${S.teams.blue.logo}" class="team-logo\""""
new_b_logo = """<img src="teams/${S.teams.blue.logo}" class="team-logo\""""
overlay = overlay.replace(old_b_logo, new_b_logo)

old_r_logo = """<img src="${S.teams.red.logo}" class="team-logo\""""
new_r_logo = """<img src="teams/${S.teams.red.logo}" class="team-logo\""""
overlay = overlay.replace(old_r_logo, new_r_logo)

with open('overlay.html', 'w', encoding='utf-8') as f:
    f.write(overlay)

# 2. Update test_overlay.js
try:
    with open('test_overlay.js', 'r', encoding='utf-8') as f:
        test_overlay = f.read()
    test_overlay = test_overlay.replace(old_b_logo, new_b_logo)
    test_overlay = test_overlay.replace(old_r_logo, new_r_logo)
    with open('test_overlay.js', 'w', encoding='utf-8') as f:
        f.write(test_overlay)
except:
    pass

# 3. Update operator.html placeholders
with open('operator.html', 'r', encoding='utf-8') as f:
    operator = f.read()

operator = operator.replace('id="bLogo" placeholder="https://..."', 'id="bLogo" placeholder="filename.png"')
operator = operator.replace('id="rLogo" placeholder="https://..."', 'id="rLogo" placeholder="filename.png"')

with open('operator.html', 'w', encoding='utf-8') as f:
    f.write(operator)

print("Applied top-row tweaks and /teams folder paths.")
