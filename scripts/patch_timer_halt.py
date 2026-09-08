import re

def fix_timer(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match the advStep() part of the timer expiration logic
    content = re.sub(r"else\s*\{\s*logH\('[^']+'\);\s*advStep\(\);\s*\}", "// timer halted at zero", content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_timer('operator.html')
try:
    fix_timer('test.js')
except:
    pass

print("Timer advance removed.")
