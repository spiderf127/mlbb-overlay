import re

def ensure_timer_halts(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Make sure we also save state at 0 so the overlay receives the exact 0 state immediately
    old_logic = r"""      // timer halted at zero
      return;
    \}
    saveQ\(\); rTimerUI\(\);"""
    
    new_logic = """      // timer halted at zero
      saveQ(); rTimerUI();
      return;
    }
    saveQ(); rTimerUI();"""

    content = re.sub(old_logic, new_logic, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

ensure_timer_halts('operator.html')
print("Patched save logic.")
