import re

def update_files(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Timer Logic (halt on 0 instead of skipTurn)
    old_timer = """    if(S.timer.remaining<=0){
      stopTimer();
      if(S.status==='last_change'){finishDraft();}
      else{logH('? Timer expired - skipped');advStep();}
      return;
    }"""
    new_timer = """    if(S.timer.remaining<=0){
      stopTimer();
      if(S.status==='last_change'){finishDraft();}
      // Removed advStep() so timer halts at 0
      return;
    }"""
    content = content.replace(old_timer, new_timer)

    # 2. isUsed function (No Ban exemption)
    old_isUsed = "function isUsed(n){return S.blueBans.some(h=>h.name===n)||S.redBans.some(h=>h.name===n)||S.bluePicks.some(h=>h.name===n)||S.redPicks.some(h=>h.name===n);}"
    new_isUsed = "function isUsed(n){if(n==='No Ban')return false;return S.blueBans.some(h=>h.name===n)||S.redBans.some(h=>h.name===n)||S.bluePicks.some(h=>h.name===n)||S.redPicks.some(h=>h.name===n);}"
    content = content.replace(old_isUsed, new_isUsed)

    # 3. selHero logic (reject No Ban on picks)
    old_selHero = """function selHero(hero){
  if(S.status!=='running')return;"""
    new_selHero = """function selHero(hero){
  if(S.status!=='running')return;
  const step=S.steps[S.currentStep];
  if(hero.name==='No Ban' && step.action==='pick'){toast('Cannot pick "No Ban"','error');return;}"""
    content = content.replace(old_selHero, new_selHero)

    # 4. Hide "No Ban" from Stats grid (operator.html only)
    if 'renderStatsGrid' in content:
        old_stats_grid = """S.roster.forEach((h,i)=>{
    const row=document.createElement('div');"""
        new_stats_grid = """S.roster.forEach((h,i)=>{
    if(h.name==='No Ban')return;
    const row=document.createElement('div');"""
        content = content.replace(old_stats_grid, new_stats_grid)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_files('test.js')
update_files('operator.html')

# Add "No Ban" to the roster array inside defRoster() just before the closing bracket of the return statement
def add_no_ban_roster(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We find the end of defRoster
    # The last hero is usually Zhuxin or Zilong. Let's just do a regex replace to insert before `];`
    
    # Match the end of the roster array inside defRoster
    # It looks like: } \n  ]; \n}
    content = re.sub(r'\}\s*\];\s*\}', r'},\n    {name:"No Ban", role:"None", portrait:"", icon:"", picks:0, bans:0, wins:0}\n  ];\n}', content, count=1)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

add_no_ban_roster('test.js')
add_no_ban_roster('operator.html')

print("Patched timer logic, No Ban roster, selHero validation, and stats grid exclusion.")
