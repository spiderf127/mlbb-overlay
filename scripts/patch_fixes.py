import re

with open('overlay.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Move bigTimer to center-top-spacer
# First, remove it from cpAction area
content = content.replace("""      <div id="bigTimer" class="big-timer"></div>
      <div class="cp-action" id="cpAction">""", """      <div class="cp-action" id="cpAction">""")

# Now insert it into center-top-spacer
content = content.replace("""    <div class="center-top-spacer"></div>""", """    <div class="center-top-spacer">
      <div id="bigTimer" class="big-timer"></div>
    </div>""")

# Update big-timer CSS
old_css = """  .big-timer {
    font-size: 64px;
    font-weight: 800;
    color: var(--text-light, #FFFFFF);
    text-align: center;
    line-height: 1;
    margin-bottom: 5px;
    font-family: 'Rajdhani', sans-serif;
  }"""
new_css = """  .big-timer {
    font-size: 42px;
    font-weight: 800;
    color: var(--text-light, #FFFFFF);
    text-align: center;
    line-height: 60px;
    margin: 0;
    font-family: 'Rajdhani', sans-serif;
  }"""
if old_css in content:
    content = content.replace(old_css, new_css)
else:
    # Handle if it's already updated or slightly different
    content = re.sub(r'\.big-timer\s*\{[^\}]+\}', new_css, content)

# 2. Change ban-empty-x from ? to X
content = content.replace('<div class="ban-empty-x">?</div>', '<div class="ban-empty-x">X</div>')

with open('overlay.html', 'w', encoding='utf-8') as f:
    f.write(content)

# 3. Update operator.html filterKey to rebuild grid on phase change
with open('operator.html', 'r', encoding='utf-8') as f:
    op_content = f.read()

old_filter = "  const filterKey = rfilt + '|' + search + '|' + S.roster.length;"
new_filter = "  const stepAction = S.steps?.[S.currentStep]?.action || '';\n  const filterKey = rfilt + '|' + search + '|' + S.roster.length + '|' + stepAction;"
op_content = op_content.replace(old_filter, new_filter)

with open('operator.html', 'w', encoding='utf-8') as f:
    f.write(op_content)

print("Applied fixes.")
