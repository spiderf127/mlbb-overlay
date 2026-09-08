
window.onerror = function(m, s, l, c, e) { 
  document.body.innerHTML += '<div style="color:red; background:white; position:fixed; top:0; left:0; padding:20px; z-index:9999;">' + m + ' at ' + l + ':' + c + '<br>' + e?.stack + '</div>'; 
};

const SK = 'mplDraft_v4';
const LANES = ['EXP Lane','Jungle','Mid Lane','Gold Lane','Roam'];
const LANE_ICONS = {
  'EXP Lane': 'imgs/exp.png',
  'Jungle': 'imgs/jungler.png',
  'Mid Lane': 'imgs/mid.png',
  'Gold Lane': 'imgs/gold.png',
  'Roam': 'imgs/Roamer.png'
};

let S = null;
let lastStr = '';
let builtBans = 0, builtPicks = 0, builtFormat = '';
let lastRenderedPicks = { blue: [], red: [] };

// BroadcastChannel setup
let bc = null;
try {
  bc = new BroadcastChannel('mplDraft_bc');
  bc.onmessage = (e) => {
    if(e.data.t === 'STATE') {
      checkAndRender(e.data.d);
    } else if(e.data.t === 'TICK') {
      if(S) {
        if(!S.timer) S.timer = {remaining: 30, max: 30};
        S.timer.remaining = e.data.remaining;
        S.timer.max = e.data.max;
        renderTimer();
      }
    }
  };
} catch(e) {}

function getState() {
  try { const r=localStorage.getItem(SK); return r?JSON.parse(r):null; } catch(e){return null;}
}

let lastRenderStr = '';

function checkAndRender(newData) {
  if(!newData) return;
  const cloneNew = JSON.parse(JSON.stringify(newData));
  delete cloneNew.timer;
  const newStr = JSON.stringify(cloneNew);
  
  if (newStr !== lastRenderStr) {
    lastRenderStr = newStr;
    S = newData;
    render();
  } else {
    // Only timer changed
    if(newData.timer) {
      if(!S) S = {};
      S.timer = newData.timer;
      renderTimer();
    }
  }
}

setInterval(() => {
  // Cross-browser sync via PHP (for OBS CEF)
  fetch('sync.php')
    .then(r => r.json())
    .then(data => {
      if(data && !data.error) {
        const str = JSON.stringify(data);
        if(str !== lastStr) {
          lastStr = str;
          checkAndRender(data);
        }
      }
    }).catch(()=>{});
}, 300);

window.addEventListener('storage', e => {
  if(e.key === SK && e.newValue) {
    try { S = JSON.parse(e.newValue); render(); } catch(e){}
  }
});

function buildStructure(state) {
  const bansN = state.format === '5ban' ? 5 : 3;
  const picksN = state.numPlayers || 5;
  const needRebuild = builtBans !== bansN || builtPicks !== picksN || builtFormat !== state.format;
  if(!needRebuild) return;
  builtBans = bansN; builtPicks = picksN; builtFormat = state.format;

  ['blue','red'].forEach(side => {
    // Bans
    const banCont = document.getElementById(`${side}Bans`);
    banCont.innerHTML = '';
    for(let i=0;i<bansN;i++) {
      const idx = side === 'red' ? bansN - 1 - i : i;
      const sl=document.createElement('div');
      sl.className='ban-card';
      sl.id=`${side}Ban${idx}`;
      sl.innerHTML='<div class="active-indicator"></div><div class="ban-empty-x"></div>';
      banCont.appendChild(sl);
    }
    
    // Picks
    const pickCont = document.getElementById(`${side}Picks`);
    pickCont.innerHTML = '';
    for(let i=0;i<picksN;i++) {
      const idx = side === 'red' ? picksN - 1 - i : i;
      const pc=document.createElement('div');
      pc.className='pick-card';
      pc.id=`${side}PickDOM${idx}`; // Use logical index for correct targeting
      pc.innerHTML=`
        <div class="active-indicator" id="${side}PickActive${idx}"></div>
        <div class="pick-portrait" id="${side}PickPortrait${idx}"></div>
        <div class="top-role-badge ${side}-role-badge" id="${side}TopRole${idx}"></div>
        <div class="pick-footer" id="${side}PickIGN${idx}">—</div>
        <div class="hero-stats-popup" id="${side}StatsPopup${idx}"></div>
      `;
      pickCont.appendChild(pc);
    }
  });
}

function renderTimer() {
  if(!S) return;
  const rem = S.timer?.remaining || 0;
  const max = S.timer?.max || 30;
  const pct = Math.max(0, rem/max);
  const newWidth = Math.round(pct * 100) + '%';
  
  const bigTimer = document.getElementById('bigTimer');
  if(bigTimer) {
    if(S.status === 'running' || S.status === 'last_change') {
      if(bigTimer.textContent !== String(rem)) bigTimer.textContent = rem;
    } else {
      if(bigTimer.textContent !== '') bigTimer.textContent = '';
    }
  }
  
  const bar = document.getElementById('timerBar');
  const lcBar = document.getElementById('timerBarLC');
  
  if (S.status === 'last_change') {
    if (bar && bar.style.display !== 'none') bar.style.display = 'none';
    if (lcBar) {
      if (lcBar.style.display !== 'block') lcBar.style.display = 'block';
      if (lcBar.style.width !== newWidth) lcBar.style.width = newWidth;
    }
  } else {
    if (lcBar && lcBar.style.display !== 'none') lcBar.style.display = 'none';
    if (bar && bar.style.display !== 'block') bar.style.display = 'block';
    if (bar && bar.style.width !== newWidth) bar.style.width = newWidth;
    
    const step = S.steps?.[S.currentStep];
    const isRed = step && step.side === 'red';
    if(isRed) {
      if (bar.style.backgroundColor !== 'var(--red-team)') bar.style.backgroundColor = 'var(--red-team)';
      if (bar.style.float !== 'right') bar.style.float = 'right';
    } else {
      if (bar.style.backgroundColor !== 'var(--blue-team)') bar.style.backgroundColor = 'var(--blue-team)';
      if (bar.style.float !== 'left') bar.style.float = 'left';
    }
  }
}

function render() {
  if(!S) return;
  
  if(S.overlayVisible) {
    document.body.classList.remove('hide-overlay');
    document.body.classList.add('show-overlay');
  } else {
    document.body.classList.remove('show-overlay');
    document.body.classList.add('hide-overlay');
  }

  document.getElementById('overlayContainer').style.display = 'flex';
  
  const dcOverlay = document.getElementById('draftCompletedOverlay');
  if(S.status === 'complete') {
    dcOverlay.classList.add('active');
  } else {
    dcOverlay.classList.remove('active');
  }
  
  buildStructure(S);

  // Meta
  document.getElementById('cpTourney').textContent = S.meta?.tournament || '';
  document.getElementById('cpMatch').textContent = `${S.meta?.match||''} | ${S.meta?.bo||'BO3'}`;
  // Score Bars
  const boText = S.meta?.bo || 'BO3';
  const totalGames = parseInt(boText.replace(/\D/g, '')) || 3;
  const nBars = Math.ceil(totalGames / 2);
  const bScore = S.meta?.blueWins || 0;
  const rScore = S.meta?.redWins || 0;

  const bGroup = document.getElementById('blueBars');
  const rGroup = document.getElementById('redBars');
  if (bGroup && rGroup) {
    let bHtml = '';
    let rHtml = '';
    for(let i=0; i<nBars; i++) {
      bHtml += '<div class="score-bar' + (i < bScore ? ' blue-fill' : '') + '"></div>';
      rHtml += '<div class="score-bar' + (i < rScore ? ' red-fill' : '') + '"></div>';
    }
    if (bGroup.innerHTML !== bHtml) bGroup.innerHTML = bHtml;
    if (rGroup.innerHTML !== rHtml) rGroup.innerHTML = rHtml;
  }

  // Teams
  const bLogo = document.getElementById('blueLogo');
  const rLogo = document.getElementById('redLogo');
  document.getElementById('blueName').textContent = S.teams?.blue?.name||'Blue Side';
  document.getElementById('redName').textContent = S.teams?.red?.name||'Red Side';
  
  if(S.teams?.blue?.logo) {
    const lg = `<img src="teams/${S.teams.blue.logo}" class="team-logo" onerror="this.innerHTML='<div class=\\'team-logo-fallback\\'>B</div>'">`;
    if (bLogo.innerHTML !== lg) bLogo.innerHTML = lg;
  } else { 
    const fl = `<div class='team-logo-fallback'>B</div>`;
    if (bLogo.innerHTML !== fl) bLogo.innerHTML = fl; 
  }
  
  if(S.teams?.red?.logo) {
    const lg = `<img src="teams/${S.teams.red.logo}" class="team-logo" onerror="this.innerHTML='<div class=\\'team-logo-fallback\\'>R</div>'">`;
    if (rLogo.innerHTML !== lg) rLogo.innerHTML = lg;
  } else { 
    const fl = `<div class='team-logo-fallback'>R</div>`;
    if (rLogo.innerHTML !== fl) rLogo.innerHTML = fl; 
  }

  // Bans
  const bansN = S.format==='5ban'?5:3;
  for(let i=0;i<bansN;i++) {
    ['blue','red'].forEach(side => {
      const hero = side==='blue' ? S.blueBans?.[i] : S.redBans?.[i];
      const sl = document.getElementById(`${side}Ban${i}`);
        if(sl) {
          if (sl.className !== 'ban-card') sl.className = 'ban-card'; // reset active class
          let html = '<div class="active-indicator"></div>';
          if(hero && hero.name === 'No Ban') {
            html += `<div class="ban-empty-x"></div>`;
          } else if(hero && hero.icon) {
            html += `<img src="${hero.icon}" class="hero-icon">`;
          } else {
            html += `<div class="ban-empty-x"></div>`;
          }
          if (sl.innerHTML !== html) sl.innerHTML = html;
        }
    });
  }

  // Picks
  const picksN = S.numPlayers||5;
  for(let i=0;i<picksN;i++) {
    ['blue','red'].forEach(side => {
      const hero = side==='blue' ? S.bluePicks?.[i] : S.redPicks?.[i];
      const ign = (side==='blue' ? S.players?.blue?.[i] : S.players?.red?.[i]) || '—';
      const role = (side==='blue' ? S.roles?.blue?.[i] : S.roles?.red?.[i]) || LANES[i];
      const roleImgSrc = role ? LANE_ICONS[role] : '';
      
      const pt = document.getElementById(`${side}PickPortrait${i}`);
      const ignEl = document.getElementById(`${side}PickIGN${i}`);
      const pc = document.getElementById(`${side}PickDOM${i}`);
      const topRoleEl = document.getElementById(`${side}TopRole${i}`);

      const statsPopup = document.getElementById(`${side}StatsPopup${i}`);
      
      if(hero && hero.name) {
        if(lastRenderedPicks[side][i] !== hero.name) {
          lastRenderedPicks[side][i] = hero.name;
          
          if(statsPopup) {
            const picks = hero.picks || 0;
            const bans = hero.bans || 0;
            const wins = hero.wins || 0;
            const total = S.meta?.totalMatches || 0;
            
            if (S.meta.statsEnabled !== false) {
              if (picks === 0 && bans === 0) {
                statsPopup.innerHTML = `<div class="debut-pick">DEBUT<br>PICK</div>`;
              } else {
                const pRate = total > 0 ? ((picks / total) * 100).toFixed(1) : 0;
                const bRate = total > 0 ? ((bans / total) * 100).toFixed(1) : 0;
                const cRate = total > 0 ? (((picks + bans) / total) * 100).toFixed(1) : 0;
                const wRate = picks > 0 ? ((wins / picks) * 100).toFixed(1) : 0;
                
                statsPopup.innerHTML = `
                  <div class="stat-box"><span class="stat-label">Pick</span> <span class="stat-val">${pRate}%</span></div>
                  <div class="stat-box"><span class="stat-label">Ban</span> <span class="stat-val">${bRate}%</span></div>
                  <div class="stat-box"><span class="stat-label">Win</span> <span class="stat-val">${wRate}%</span></div>
                  <div class="stat-box"><span class="stat-label">Contest</span> <span class="stat-val">${cRate}%</span></div>
                `;
              }
              
              // Trigger animation
              if (S.status !== 'last_change') {
                statsPopup.classList.remove('show-stats');
                void statsPopup.offsetWidth; // Force reflow
                statsPopup.classList.add('show-stats');
              }
            }
          }
        }
      } else {
        lastRenderedPicks[side][i] = null;
        if(statsPopup) statsPopup.classList.remove('show-stats');
      }

      
      if(pc) {
        if(pc.classList.contains('active-slot')) pc.classList.remove('active-slot');
      }
      
      const newPt = (hero && hero.portrait) ? `<img src="${hero.portrait}" class="hero-img">` : (roleImgSrc ? `<img src="${roleImgSrc}" class="role-icon">` : '');
      if(pt && pt.innerHTML !== newPt) pt.innerHTML = newPt;
      
      const newRole = roleImgSrc ? `<img src="${roleImgSrc}" class="top-role-icon">` : '';
      if(topRoleEl && topRoleEl.innerHTML !== newRole) topRoleEl.innerHTML = newRole;
      
      if(ignEl) {
        if(hero && hero.name) {
          ignEl.innerHTML = `
            <div class="pick-ign">${ign}</div>
            <div class="pick-hero-text">${hero.name}</div>
          `;
        } else {
          ignEl.innerHTML = `<div class="pick-ign">${ign}</div>`;
        }
      }
    });
  }

  // Active Highlight & Action Text
  const step = S.steps?.[S.currentStep];
  let actionText = 'LAST CHANGE';
  let bArrow = false;
  let rArrow = false;
  let cpColor = '#2F2F2F';
  let isDrafting = false;

  if(S.status === 'running' && step) {
    isDrafting = true;
    const isBlue = step.side === 'blue';
    const action = step.action === 'ban' ? 'BANNING' : 'PICKING';
    const tName = isBlue ? 'BLUE TEAM' : 'RED TEAM';
    actionText = `${tName} ${action}`;
    if (isBlue) { bArrow = true; cpColor = 'var(--blue-team)'; }
    else { rArrow = true; cpColor = 'var(--red-team)'; }
    
    // Highlight active slot
    if(step.action === 'ban') {
      const idx = isBlue ? S.blueBanIdx : S.redBanIdx;
      const el = document.getElementById(`${step.side}Ban${idx}`);
      if(el) el.classList.add('active-slot');
    } else {
      const idx = isBlue ? S.bluePickIdx : S.redPickIdx;
      const pc = document.getElementById(`${step.side}PickDOM${idx}`);
      if(pc) pc.classList.add('active-slot');
      
      // Double pick lookahead: highlight the next slot as well if it's a back-to-back pick for the same team
      const nextStep = S.steps?.[S.currentStep + 1];
      if (nextStep && nextStep.side === step.side && nextStep.action === 'pick') {
        const nextIdx = idx + 1;
        const nextPc = document.getElementById(`${step.side}PickDOM${nextIdx}`);
        if(nextPc) nextPc.classList.add('active-slot');
      }
    }
  } else if (S.status === 'last_change') {
    actionText = 'LAST CHANGE';
    cpColor = '#D4AF37'; // gold
  } else if (S.status === 'complete') {
    actionText = 'DRAFT COMPLETE';
  }

  document.getElementById('actionText').textContent = actionText;
  
  const cpActionEl = document.getElementById('cpAction');
  cpActionEl.style.color = cpColor;
  if(isDrafting) {
    cpActionEl.classList.add('blink-action');
  } else {
    cpActionEl.classList.remove('blink-action');
  }

  document.getElementById('arrowLeft').style.display = bArrow ? 'inline' : 'none';
  document.getElementById('arrowRight').style.display = rArrow ? 'inline' : 'none';

  renderTimer();
}

const init = getState();
S = init || {
  status: 'idle', format: '3ban', numPlayers: 5,
  teams: {blue:{name:''}, red:{name:''}},
  meta: {tournament:'MPL', match:'Draft', bo:'BO3'}
};
render();
