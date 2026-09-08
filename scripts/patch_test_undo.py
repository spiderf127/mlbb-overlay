import re

with open('test.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update undoAction
old_undo = """  S.currentStep=sn.currentStep;
  const idx=S.history.lastIndexOf(last);
  S.history=S.history.slice(0,idx);
  S.status='running';beginStep();toast('Undone','info');
}"""

new_undo = """  S.currentStep=sn.currentStep;
  const idx=S.history.lastIndexOf(last);
  S.history=S.history.slice(0,idx);
  S.status='running';
  S.skipNextPopup = true; // Added flag to suppress popup on next repick
  beginStep();toast('Undone','info');
}"""
content = content.replace(old_undo, new_undo)


# 2. Update applyHero
old_apply = """function applyHero(hero,step){
  const snap={blueBans:[...S.blueBans],redBans:[...S.redBans],bluePicks:[...S.bluePicks],redPicks:[...S.redPicks],blueBanIdx:S.blueBanIdx,redBanIdx:S.redBanIdx,bluePickIdx:S.bluePickIdx,redPickIdx:S.redPickIdx,currentStep:S.currentStep};
  logH(`${step.action==='ban'?'??':'?'} ${step.side==='blue'?'Blue':'Red'} ${step.action}: ${hero.name}`,snap);
  if(step.action==='ban'){
    if(step.side==='blue'){S.blueBans.push(hero);S.blueBanIdx++;}
    else{S.redBans.push(hero);S.redBanIdx++;}
  } else {
    if(step.side==='blue'){S.bluePicks.push(hero);S.bluePickIdx++;}
    else{S.redPicks.push(hero);S.redPickIdx++;}
  }
  // Publish state BEFORE advancing step so overlay updates immediately
  pub();
  advStep();
}"""

new_apply = """function applyHero(hero,step){
  const snap={blueBans:[...S.blueBans],redBans:[...S.redBans],bluePicks:[...S.bluePicks],redPicks:[...S.redPicks],blueBanIdx:S.blueBanIdx,redBanIdx:S.redBanIdx,bluePickIdx:S.bluePickIdx,redPickIdx:S.redPickIdx,currentStep:S.currentStep};
  logH(`${step.action==='ban'?'??':'?'} ${step.side==='blue'?'Blue':'Red'} ${step.action}: ${hero.name}`,snap);
  
  const heroObj = {...hero};
  if (S.skipNextPopup) {
    heroObj.suppressPopup = true;
    S.skipNextPopup = false;
  }
  
  if(step.action==='ban'){
    if(step.side==='blue'){S.blueBans.push(heroObj);S.blueBanIdx++;}
    else{S.redBans.push(heroObj);S.redBanIdx++;}
  } else {
    if(step.side==='blue'){S.bluePicks.push(heroObj);S.bluePickIdx++;}
    else{S.redPicks.push(heroObj);S.redPickIdx++;}
  }
  // Publish state BEFORE advancing step so overlay updates immediately
  pub();
  advStep();
}"""
content = content.replace(old_apply, new_apply)

with open('test.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched test.js")
