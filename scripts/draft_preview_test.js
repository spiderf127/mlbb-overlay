
const SK = 'mplDraft_v4';
const ROLE_ORDER = ['EXP Lane', 'Jungle', 'Mid Lane', 'Gold Lane', 'Roam'];
const ROLE_ICONS = {
  'EXP Lane': 'imgs/exp.png',
  'Jungle': 'imgs/jungler.png',
  'Mid Lane': 'imgs/mid.png',
  'Gold Lane': 'imgs/gold.png',
  'Roam': 'imgs/Roamer.png'
};

let S = null;
let slideshowTimeout1 = null;
let slideshowTimeout2 = null;
let slideshowActive = false;

function getState() {
  try {
    const raw = localStorage.getItem(SK);
    if(raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

function buildHTML() {
  if(!S) return;
  
  const blueRow = document.getElementById('blueTeamRow');
  const redRow = document.getElementById('redTeamRow');
  const centerRow = document.getElementById('centerRow');
  
  blueRow.innerHTML = '';
  redRow.innerHTML = '';
  centerRow.innerHTML = '';

  // Get picks mapped to roles
  const bPicks = {};
  const rPicks = {};

  for(let i = 0; i < (S.numPlayers || 5); i++) {
    const bHero = S.bluePicks?.[i];
    const bRole = S.roles?.blue?.[i] || ROLE_ORDER[i];
    bPicks[bRole] = bHero;

    const rHero = S.redPicks?.[i];
    const rRole = S.roles?.red?.[i] || ROLE_ORDER[i];
    rPicks[rRole] = rHero;
  }

  // Create columns based on ROLE_ORDER
  ROLE_ORDER.forEach((role, i) => {
    // BLUE CARD
    const bHero = bPicks[role];
    let bImg = bHero && bHero.portrait ? bHero.portrait : '';
    
    const bCard = document.createElement('div');
    bCard.className = 'hero-card card-top';
    bCard.id = 'blueCard' + i;
    bCard.innerHTML = `
      ${bImg ? `<img src="${bImg}" class="hero-portrait">` : '<div class="hero-portrait" style="background:#222"></div>'}
    `;
    blueRow.appendChild(bCard);

    // CENTER ROLE ICON
    const cSlot = document.createElement('div');
    cSlot.className = 'role-slot';
    cSlot.innerHTML = `
      <img src="${ROLE_ICONS[role]}" class="role-icon">
    `;
    centerRow.appendChild(cSlot);

    // RED CARD
    const rHero = rPicks[role];
    let rImg = rHero && rHero.portrait ? rHero.portrait : '';

    const rCard = document.createElement('div');
    rCard.className = 'hero-card card-bottom';
    rCard.id = 'redCard' + i;
    rCard.innerHTML = `
      ${rImg ? `<img src="${rImg}" class="hero-portrait">` : '<div class="hero-portrait" style="background:#222"></div>'}
    `;
    redRow.appendChild(rCard);
  });
}

function playAnimation() {
  const container = document.getElementById('previewContainer');
  const slideshow = document.getElementById('slideshow');
  const slideWrapper = document.getElementById('slideWrapper');
  
  // Clear any existing timeouts
  clearTimeout(slideshowTimeout1);
  clearTimeout(slideshowTimeout2);
  slideshowActive = true;
  slideWrapper.innerHTML = ''; // Clear previous images
  
  // Reset classes
  container.classList.remove('hide-anim', 'play-anim');
  container.classList.add('hidden');
  
  const bluePicks = [];
  const redPicks = [];
  for(let i=0; i < (S.numPlayers || 5); i++) {
    if(S.bluePicks?.[i]?.name) bluePicks.push(S.bluePicks[i]);
  }
  for(let i=0; i < (S.numPlayers || 5); i++) {
    if(S.redPicks?.[i]?.name) redPicks.push(S.redPicks[i]);
  }

  // If no picks exist to show, go straight to 5v5
  if(bluePicks.length === 0 && redPicks.length === 0) {
    slideshow.classList.add('hidden');
    container.classList.remove('hidden');
    void container.offsetWidth;
    container.classList.add('play-anim');
    return;
  }

  // Handle Background
  const mainBg = document.getElementById('mainBg');
  mainBg.classList.remove('hidden');
  void mainBg.offsetWidth; // Reflow
  mainBg.classList.add('bg-show');

  slideshow.classList.remove('hidden');

  function playAccordion(picks, teamColor, callback) {
    if(picks.length === 0) { callback(); return; }
    
    slideWrapper.innerHTML = '';
    const slices = [];
    
    picks.forEach((p, i) => {
      const slice = document.createElement('div');
      slice.className = 'accordion-slice';
      if(i < picks.length - 1) {
        slice.style.borderRight = `4px solid var(--${teamColor}-team)`;
      }
      
      const img = document.createElement('img');
      img.src = 'splash/' + p.name + '.jpg';
      img.onerror = function() {
        if(img.src.endsWith('.jpg')) img.src = 'splash/' + p.name + '.png';
      };
      
      slice.appendChild(img);
      slideWrapper.appendChild(slice);
      slices.push(slice);
    });
    
    slideWrapper.classList.remove('fade-in', 'fade-out');
    void slideWrapper.offsetWidth;
    slideWrapper.classList.add('fade-in');
    
    let activeIdx = 0;
    slices[activeIdx].classList.add('active');
    
    function nextSlice() {
      if(!slideshowActive) return;
      
      slideshowTimeout1 = setTimeout(() => {
        if(!slideshowActive) return;
        
        slices[activeIdx].classList.remove('active');
        activeIdx++;
        
        if(activeIdx >= slices.length) {
          slideWrapper.classList.remove('fade-in');
          slideWrapper.classList.add('fade-out');
          
          slideshowTimeout2 = setTimeout(() => {
            if(!slideshowActive) return;
            callback();
          }, 600); // Wait for fade-out
        } else {
          slices[activeIdx].classList.add('active');
          nextSlice();
        }
      }, 1800); // 1.8 seconds per hero
    }
    
    nextSlice();
  }

  // Play Blue, then Red, then show 5v5
  playAccordion(bluePicks, 'blue', () => {
    if(!slideshowActive) return;
    playAccordion(redPicks, 'red', () => {
      if(!slideshowActive) return;
      slideshow.classList.add('hidden');
      container.classList.remove('hidden');
      void container.offsetWidth;
      container.classList.add('play-anim');
      slideWrapper.innerHTML = '';
    });
  });
}

function hideAnimation() {
  slideshowActive = false;
  clearTimeout(slideshowTimeout1);
  clearTimeout(slideshowTimeout2);
  
  const container = document.getElementById('previewContainer');
  const slideshow = document.getElementById('slideshow');
  const mainBg = document.getElementById('mainBg');
  
  slideshow.classList.add('hidden');
  
  // Start hide animation for the 5v5 cards
  container.classList.remove('hidden'); // Ensure it's not hidden
  container.classList.remove('play-anim', 'hide-anim');
  void container.offsetWidth; // force reflow
  container.classList.add('hide-anim');
  
  // Fade out the main background at the same time
  mainBg.classList.remove('bg-show');
  
  // Wait for animations to finish before totally hiding
  setTimeout(() => {
    mainBg.classList.add('hidden');
    container.classList.add('hidden');
  }, 2600); // the longest hide delay is 2.0s + 0.6s duration = 2.6s
}

// Initial build
S = getState();
if(S) {
  buildHTML();
}

// Broadcast Channel setup
try {
  const bc = new BroadcastChannel('mplDraft_bc');
  bc.onmessage = (e) => {
    if(e.data.t === 'STATE') {
      S = e.data.d;
      buildHTML();
    } else if(e.data.t === 'PLAY_PREVIEW') {
      playAnimation();
    } else if(e.data.t === 'HIDE_PREVIEW') {
      hideAnimation();
    }
  };
} catch(e) {}

// Listen to local storage changes just in case
window.addEventListener('storage', e => {
  if(e.key === SK && e.newValue) {
    try { S = JSON.parse(e.newValue); buildHTML(); } catch(err){}
  }
});

let lastStr = '';
let currentPreviewState = false;
let lastRenderStr = '';

function checkPreviewState() {
  if (S && S.previewPlaying !== undefined && S.previewPlaying !== currentPreviewState) {
    currentPreviewState = S.previewPlaying;
    if (currentPreviewState) {
      playAnimation();
    } else {
      hideAnimation();
    }
  }
}

function checkAndRender(newData) {
  if(!newData) return;
  const cloneNew = JSON.parse(JSON.stringify(newData));
  delete cloneNew.timer;
  const newStr = JSON.stringify(cloneNew);
  
  if (newStr !== lastRenderStr) {
    lastRenderStr = newStr;
    S = newData;
    buildHTML();
  } else {
    if(!S) S = {};
    if(newData.timer) S.timer = newData.timer;
  }
  
  if(newData.previewPlaying !== undefined) {
    S.previewPlaying = newData.previewPlaying;
    checkPreviewState();
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
}, 800);

