> <script>
  // ═══════════════════════════════════════════════════
  //  CONSTANTS
  // ═══════════════════════════════════════════════════
  const SK = 'mplDraft_v4';
  const SK_ROSTER = 'mplDraft_roster_v1'; // separate key for persistent roster
  const BCAST = 'mplDraft_bc';
  const ROLES = ['Fighter','Mage','Assassin','Marksman','Tank','Support'];
  const RI = {Fighter:'⚔',Mage:'🔮',Assassin:'🗡',Marksman:'🏹',Tank:'🛡',Support:'💚'};
  const LANES = ['EXP Lane','Jungle','Mid Lane','Gold Lane','Roam'];
  const RC = {Fighter:'#E53935',Mage:'#7B1FA2',Assassin:'#1A237E',Marksman:'#E65100',Tank:'#1565C0',Support:'#2E7D32'};
  
  // BGM Variables
  let bgmAudio = new Audio('assets/audio/mlbbbg.wav');
  bgmAudio.loop = true;
  bgmAudio.volume = 0.5;
  let bgmFadeInt = null;
  
  function bgmPlay() {
    if (bgmFadeInt) { clearInterval(bgmFadeInt); bgmFadeInt = null; }
    bgmAudio.volume = S.settings?.audio?.bgm ?? 0.5;
    bgmAudio.play().catch(()=>{});
    updateBgmUI();
  }
  
  function bgmPause() {
    if (bgmFadeInt) { clearInterval(bgmFadeInt); bgmFadeInt = null; }
    bgmAudio.pause();
    updateBgmUI();
  }
  
  function bgmFadeOut() {
    if (bgmAudio.paused) return;
    if (bgmFadeInt) { clearInterval(bgmFadeInt); }
    let vol = bgmAudio.volume;
    bgmFadeInt = setInterval(() => {
      vol -= 0.05;
      if (vol <= 0) {
        bgmAudio.pause();
        bgmAudio.volume = S.settings?.audio?.bgm ?? 0.5;
        clearInterval(bgmFadeInt);
        bgmFadeInt = null;
        updateBgmUI();
      } else {
        bgmAudio.volume = vol;
      }
    }, 150);
  }
  
  function bgmRestart() {
    if (bgmFadeInt) { clearInterval(bgmFadeInt); bgmFadeInt = null; }
    bgmAudio.volume = S.settings?.audio?.bgm ?? 0.5;
    bgmAudio.currentTime = 0;
    bgmAudio.pause();
    updateBgmUI();
  }
  
  function bgmToggleLoop() {
    bgmAudio.loop = !bgmAudio.loop;
    updateBgmUI();
  }
  
  function bgmSetVol(val) {
    if (bgmFadeInt) { clearInterval(bgmFadeInt); bgmFadeInt = null; }
    bgmAudio.volume = val;
  }
  
  function updateBgmUI() {
    const pBtn = document.getElementById('bgmPlayBtn');
    if (pBtn) {
      if (bgmAudio.paused) {
        pBtn.innerHTML = "<i class='bx bx-play'></i> Play";
      } else {
        pBtn.innerHTML = "<i class='bx bx-pause'></i> Pause";
      }
    }
    const lBtn = document.getElementById('bgmLoopBtn');
    if (lBtn) {
      lBtn.innerHTML = bgmAudio.loop ? "<i class='bx bx-repeat'></i> Loop: ON" : "<i class='bx bx-right-arrow-alt'></i> Loop: OFF";
    }
  }
  
  // ═══════════════════════════════════════════════════
  //  DEFAULT STATE
  // ═══════════════════════════════════════════════════
  function defState() {
    return {
      status:'idle',format:'5ban',numPlayers:5,
      teams:{blue:{name:'',logo:''},red:{name:'',logo:''}},
      players:{blue:[],red:[]},
      playerImages:{blue:[],red:[]},
      basePlayerImages:{blue:[],red:[]},
      roles:{blue:[],red:[]},
      basePlayers:{blue:[],red:[]},
      baseRoles:{blue:[],red:[]},
      meta:{tournament:'MPL Season 15',match:'Upper Bracket Finals',bo:'BO3',game:1,blueWins:0,redWins:0,totalMatches:100,statsEnabled:true},
      timerConfig:{ban:30,pick:30,lastChange:30},
      timer:{remaining:30,max:30},
      streamTimer:{remaining:0,max:0,running:false},
      overlayVisible:true,
      steps:[],currentStep:0,
      blueBans:[],redBans:[],bluePicks:[],redPicks:[],
      blueBanIdx:0,redBanIdx:0,bluePickIdx:0,redPickIdx:0,
      phase:1,history:[],
      hud:{visible:false,lowerThird:{visible:false,text:'',subtext:''}},
      settings:{draft:{banTimer:30,pickTimer:30,lastChangeTimer:30,banFormat:'5ban',rosterSize:5},broadcast:{playerPopups:true,autoShowOverlay:true,defaultHUD:false,heroStats:true},audio:{bgm:0.5,sfx:1,voice:1}},
      roster:loadRoster(),
    };
  }
  
  function defRoster(){return[
    {name:'Aamon',role:'Assassin',img:'assets/portrait/Aamon.png',picks:38,bans:17,wins:17},
    {name:'Akai',role:'Tank',img:'assets/portrait/Akai.png',picks:58,bans:56,wins:30},
    {name:'Aldous',role:'Fighter',img:'assets/portrait/Aldous.png',picks:50,bans:29,wins:25},
    {name:'Alice',role:'Mage',img:'assets/portrait/Alice.png',picks:77,bans:7,wins:48},
    {name:'Alpha',role:'Fighter',img:'assets/portrait/Alpha.png',picks:51,bans:39,wins:25},
    {name:'Alucard',role:'Fighter',img:'assets/portrait/Alucard.png',picks:71,bans:52,wins:31},
    {name:'Angela',role:'Support',img:'assets/portrait/Angela.png',picks:57,bans:54,wins:31},
    {name:'Argus',role:'Fighter',img:'assets/portrait/Argus.png',picks:78,bans:50,wins:35},
    {name:'Arlott',role:'Fighter',img:'assets/portrait/Arlott.png',picks:25,bans:38,wins:10},
    {name:'Atlas',role:'Tank',img:'assets/portrait/Atlas.png',picks:30,bans:27,wins:12},
    {name:'Aulus',role:'Fighter',img:'assets/portrait/Aulus.png',picks:40,bans:64,wins:18},
    {name:'Aurora',role:'Mage',img:'assets/portrait/Aurora.png',picks:70,bans:30,wins:39},
    {name:'Badang',role:'Fighter',img:'assets/portrait/Badang.png',picks:70,bans:70,wins:41},
    {name:'Balmond',role:'Fighter',img:'assets/portrait/Balmond.png',picks:62,bans:70,wins:27},
    {name:'Bane',role:'Fighter',img:'assets/portrait/Bane.png',picks:77,bans:40,wins:42},
    {name:'Barats',role:'Tank',img:'assets/portrait/Barats.png',picks:26,bans:37,wins:14},
    {name:'Baxia',role:'Tank',img:'assets/portrait/Baxia.png',picks:21,bans:36,wins:10},
    {name:'Beatrix',role:'Marksman',img:'assets/portrait/Beatrix.png',picks:34,bans:13,wins:22},
    {name:'Belerick',role:'Tank',img:'assets/portrait/Belerick.png',picks:55,bans:58,wins:29},
    {name:'Benedetta',role:'Assassin',img:'assets/portrait/Benedetta.png',picks:36,bans:40,wins:16},
    {name:'Brody',role:'Marksman',img:'assets/portrait/Brody.png',picks:42,bans:33,wins:19},
    {name:'Bruno',role:'Marksman',img:'assets/portrait/Bruno.png',picks:27,bans:43,wins:12},
    {name:'Carmilla',role:'Support',img:'assets/portrait/Carmilla.png',picks:35,bans:34,wins:15},
    {name:'Cecilion',role:'Mage',img:'assets/portrait/Cecilion.png',picks:78,bans:42,wins:44},
    {name:"Chang'e",role:'Mage',img:"assets/portrait/Chang'e.png",picks:54,bans:33,wins:32},
    {name:'Chip',role:'Support',img:'assets/portrait/Chip.png',picks:51,bans:45,wins:24},
    {name:'Chou',role:'Fighter',img:'assets/portrait/Chou.png',picks:47,bans:49,wins:28},
    {name:'Cici',role:'Fighter',img:'assets/portrait/Cici.png',picks:48,bans:18,wins:19},
    {name:'Claude',role:'Marksman',img:'assets/portrait/Claude.png',picks:42,bans:31,wins:23},
    {name:'Clint',role:'Marksman',img:'assets/portrait/Clint.png',picks:35,bans:64,wins:15},
    {name:'Cyclops',role:'Mage',img:'assets/portrait/Cyclops.png',picks:63,bans:69,wins:32},
    {name:'Diggie',role:'Support',img:'assets/portrait/Diggie.png',picks:55,bans:22,wins:29},
    {name:'Dyrroth',role:'Fighter',img:'assets/portrait/Dyrroth.png',picks:22,bans:66,wins:9},
    {name:'Edith',role:'Tank',img:'assets/portrait/Edith.png',picks:71,bans:69,wins:31},
    {name:'Esmeralda',role:'Tank',img:'assets/portrait/Esmeralda.png',picks:67,bans:17,wins:29},
    {name:'Estes',role:'Support',img:'assets/portrait/Estes.png',picks:39,bans:22,wins:17},
    {name:'Eudora',role:'Mage',img:'assets/portrait/Eudora.png',picks:49,bans:24,wins:25},
    {name:'Fanny',role:'Assassin',img:'assets/portrait/Fanny.png',picks:64,bans:36,wins:35},
    {name:'Faramis',role:'Support',img:'assets/portrait/Faramis.png',picks:79,bans:59,wins:40},
    {name:'Floryn',role:'Support',img:'assets/portrait/Floryn.png',picks:63,bans:69,wins:33},
    {name:'Franco',role:'Tank',img:'assets/portrait/Franco.png',picks:19,bans:36,wins:7},
    {name:'Fredrinn',role:'Tank',img:'assets/portrait/Fredrinn.png',picks:67,bans:68,wins:33},
    {name:'Freya',role:'Fighter',img:'assets/portrait/Freya.png',picks:16,bans:38,wins:8},
    {name:'Gatotkaca',role:'Tank',img:'assets/portrait/Gatotkaca.png',picks:27,bans:65,wins:11},
    {name:'Gloo',role:'Tank',img:'assets/portrait/Gloo.png',picks:70,bans:29,wins:43},
    {name:'Gord',role:'Mage',img:'assets/portrait/Gord.png',picks:51,bans:61,wins:27},
    {name:'Granger',role:'Marksman',img:'assets/portrait/Granger.png',picks:62,bans:24,wins:34},
    {name:'Grock',role:'Tank',img:'assets/portrait/Grock.png',picks:61,bans:61,wins:29},
    {name:'Guinevere',role:'Fighter',img:'assets/portrait/Guinevere.png',picks:43,bans:64,wins:26},
    {name:'Gusion',role:'Assassin',img:'assets/portrait/Gusion.png',picks:51,bans:21,wins:31},
    {name:'Hanabi',role:'Marksman',img:'assets/portrait/Hanabi.png',picks:51,bans:48,wins:30},
    {name:'Hanzo',role:'Assassin',img:'assets/portrait/Hanzo.png',picks:45,bans:23,wins:19},
    {name:'Harith',role:'Mage',img:'assets/portrait/Harith.png',picks:22,bans:14,wins:13},
    {name:'Harley',role:'Mage',img:'assets/portrait/Harley.png',picks:61,bans:28,wins:28},
    {name:'Hayabusa',role:'Assassin',img:'assets/portrait/Hayabusa.png',picks:18,bans:23,wins:7},
    {name:'Helcurt',role:'Assassin',img:'assets/portrait/Helcurt.png',picks:44,bans:70,wins:19},
    {name:'Hilda',role:'Fighter',img:'assets/portrait/Hilda.png',picks:70,bans:67,wins:42},
    {name:'Hirara',role:'Fighter',img:'assets/portrait/Hirara.png',picks:40,bans:34,wins:24},
    {name:'Hylos',role:'Tank',img:'assets/portrait/Hylos.png',picks:37,bans:5,wins:21},
    {name:'Irithel',role:'Marksman',img:'assets/portrait/Irithel.png',picks:53,bans:38,wins:29},
    {name:'Ixia',role:'Marksman',img:'assets/portrait/Ixia.png',picks:73,bans:70,wins:33},
    {name:'Jawhead',role:'Fighter',img:'assets/portrait/Jawhead.png',picks:46,bans:28,wins:23},
    {name:'Johnson',role:'Tank',img:'assets/portrait/Johnson.png',picks:45,bans:30,wins:25},
    {name:'Joy',role:'Assassin',img:'assets/portrait/Joy.png',picks:77,bans:23,wins:39},
    {name:'Julian',role:'Fighter',img:'assets/portrait/Julian.png',picks:32,bans:43,wins:15},
    {name:'Kadita',role:'Mage',img:'assets/portrait/Kadita.png',picks:48,bans:19,wins:22},
    {name:'Kagura',role:'Mage',img:'assets/portrait/Kagura.png',picks:43,bans:40,wins:20},
    {name:'Kaja',role:'Support',img:'assets/portrait/Kaja.png',picks:44,bans:49,wins:25},
    {name:'Kalea',role:'Fighter',img:'assets/portrait/Kalea.png',picks:42,bans:69,wins:20},
    {name:'Karina',role:'Assassin',img:'assets/portrait/Karina.png',picks:58,bans:33,wins:36},
    {name:'Karrie',role:'Marksman',img:'assets/portrait/Karrie.png',picks:35,bans:17,wins:22},
    {name:'Khaleed',role:'Fighter',img:'assets/portrait/Khaleed.png',picks:80,bans:38,wins:33},
    {name:'Khufra',role:'Tank',img:'assets/portrait/Khufra.png',picks:63,bans:63,wins:36},
    {name:'Kimmy',role:'Mage',img:'assets/portrait/Kimmy.png',picks:54,bans:45,wins:26},
    {name:'Lancelot',role:'Assassin',img:'assets/portrait/Lancelot.png',picks:67,bans:27,wins:38},
    {name:'Lapu Lapu',role:'Fighter',img:'assets/portrait/Lapu-Lapu.png',picks:55,bans:37,wins:26},
    {name:'Layla',role:'Marksman',img:'assets/portrait/Layla.png',picks:20,bans:41,wins:10},
    {name:'Leomord',role:'Fighter',img:'assets/portrait/Leomord.png',picks:61,bans:37,wins:32},
    {name:'Lesley',role:'Marksman',img:'assets/portrait/Lesley.png',picks:33,bans:30,wins:15},
    {name:'Ling',role:'Assassin',img:'assets/portrait/Ling.png',picks:64,bans:19,wins:27},
    {name:'Lolita',role:'Tank',img:'assets/portrait/Lolita.png',picks:63,bans:14,wins:36},
    {name:'Lukas',role:'Fighter',img:'assets/portrait/Lukas.png',picks:78,bans:46,wins:41},
    {name:'Lunox',role:'Mage',img:'assets/portrait/Lunox.png',picks:21,bans:27,wins:8},
    {name:'Luo Yi',role:'Mage',img:'assets/portrait/Luo Yi.png',picks:32,bans:69,wins:17},
    {name:'Lylia',role:'Mage',img:'assets/portrait/Lylia.png',picks:63,bans:31,wins:26},
    {name:'Marcel',role:'Fighter',img:'assets/portrait/Marcel.png',picks:35,bans:41,wins:17},
    {name:'Martis',role:'Fighter',img:'assets/portrait/Martis.png',picks:50,bans:42,wins:27},
    {name:'Masha',role:'Fighter',img:'assets/portrait/Masha.png',picks:48,bans:58,wins:27},
    {name:'Mathilda',role:'Support',img:'assets/portrait/Mathilda.png',picks:37,bans:63,wins:18},
    {name:'Melissa',role:'Marksman',img:'assets/portrait/Melissa.png',picks:64,bans:29,wins:40},
    {name:'Minotaur',role:'Tank',img:'assets/portrait/Minotaur.png',picks:65,bans:10,wins:32},
    {name:'Minsitthar',role:'Fighter',img:'assets/portrait/Minsitthar.png',picks:59,bans:58,wins:35},
    {name:'Miya',role:'Marksman',img:'assets/portrait/Miya.png',picks:77,bans:37,wins:38},
    {name:'Moskov',role:'Marksman',img:'assets/portrait/Moskov.png',picks:31,bans:45,wins:14},
    {name:'Nana',role:'Mage',img:'assets/portrait/Nana.png',picks:68,bans:67,wins:37},
    {name:'Natalia',role:'Assassin',img:'assets/portrait/Natalia.png',picks:80,bans:57,wins:40},
    {name:'Natan',role:'Marksman',img:'assets/portrait/Natan.png',picks:67,bans:9,wins:32},
    {name:'Nolan',role:'Assassin',img:'assets/portrait/Nolan.png',picks:78,bans:70,wins:32},
    {name:'Novaria',role:'Mage',img:'assets/portrait/Novaria.png',picks:33,bans:34,wins:16},
    {name:'Obsidia',role:'Fighter',img:'assets/portrait/Obsidia.png',picks:45,bans:23,wins:26},
    {name:'Odette',role:'Mage',img:'assets/portrait/Odette.png',picks:41,bans:59,wins:25},
    {name:'Paquito',role:'Fighter',img:'assets/portrait/Paquito.png',picks:64,bans:55,wins:35},
    {name:'Pharsa',role:'Mage',img:'assets/portrait/Pharsa.png',picks:65,bans:37,wins:41},
    {name:'Phoveus',role:'Fighter',img:'assets/portrait/Phoveus.png',picks:52,bans:33,wins:32},
    {name:'Popol and Kupa',role:'Marksman',img:'assets/portrait/Popol and Kupa.png',picks:48,bans:28,wins:19},
    {name:'Rafaela',role:'Support',img:'assets/portrait/Rafaela.png',picks:51,bans:6,wins:32},
    {name:'Roger',role:'Fighter',img:'assets/portrait/Roger.png',picks:60,bans:61,wins:28},
    {name:'Ruby',role:'Fighter',img:'assets/portrait/Ruby.png',picks:80,bans:68,wins:33},
    {name:'Saber',role:'Assassin',img:'assets/portrait/Saber.png',picks:71,bans:40,wins:36},
    {name:'Selena',role:'Assassin',img:'assets/portrait/Selena.png',picks:39,bans:34,wins:20},
    {name:'Silvanna',role:'Fighter',img:'assets/portrait/Silvanna.png',picks:66,bans:34,wins:37},
    {name:'Sora',role:'Fighter',img:'assets/portrait/Sora.png',picks:62,bans:14,wins:27},
    {name:'Sun',role:'Fighter',img:'assets/portrait/Sun.png',picks:50,bans:61,wins:26},
    {name:'Suyou',role:'Assassin',img:'assets/portrait/Suyou.png',picks:44,bans:50,wins:20},
    {name:'Terizla',role:'Fighter',img:'assets/portrait/Terizla.png',picks:44,bans:6,wins:21},
    {name:'Thamuz',role:'Fighter',img:'assets/portrait/Thamuz.png',picks:67,bans:42,wins:34},
    {name:'Tigreal',role:'Tank',img:'assets/portrait/Tigreal.png',picks:58,bans:44,wins:29},
    {name:'Uranus',role:'Tank',img:'assets/portrait/Uranus.png',picks:63,bans:26,wins:26},
    {name:'Vale',role:'Mage',img:'assets/portrait/Vale.png',picks:22,bans:40,wins:13},
    {name:'Valentina',role:'Mage',img:'assets/portrait/Valentina.png',picks:18,bans:57,wins:10},
    {name:'Valir',role:'Mage',img:'assets/portrait/Valir.png',picks:30,bans:37,wins:14},
    {name:'Vexana',role:'Mage',img:'assets/portrait/Vexana.png',picks:26,bans:34,wins:12},
    {name:'Wanwan',role:'Marksman',img:'assets/portrait/Wanwan.png',picks:47,bans:46,wins:30},
    {name:'X.Borg',role:'Fighter',img:'assets/portrait/X.Borg.png',picks:43,bans:53,wins:25},
    {name:'Xavier',role:'Mage',img:'assets/portrait/Xavier.png',picks:52,bans:65,wins:29},
    {name:'Yi Sun-shin',role:'Assassin',img:'assets/portrait/Yi Sun-shin.png',picks:73,bans:50,wins:34},
    {name:'Yin',role:'Fighter',img:'assets/portrait/Yin.png',picks:75,bans:54,wins:32},
    {name:'Yu Zhong',role:'Fighter',img:'assets/portrait/Yu Zhong.png',picks:73,bans:27,wins:40},
    {name:'Yve',role:'Mage',img:'assets/portrait/Yve.png',picks:47,bans:48,wins:25},
    {name:'Zetian',role:'Fighter',img:'assets/portrait/Zetian.png',picks:19,bans:66,wins:9},
    {name:'Zhask',role:'Mage',img:'assets/portrait/Zhask.png',picks:61,bans:39,wins:37},
    {name:'Zhuxin',role:'Mage',img:'assets/portrait/Zhuxin.png',picks:74,bans:50,wins:35},
    {name:'Zilong',role:'Fighter',img:'assets/portrait/Zilong.png',picks:22,bans:69,wins:9}
  ].map(h => ({...h, portrait: h.img, icon: 'assets/icon/' + h.name.toLowerCase() + '.jpg'}));}
  
  // ═══════════════════════════════════════════════════
  //  PERSISTENT ROSTER — saved separately so images/stats survive full reset
  // ═══════════════════════════════════════════════════
  function loadRoster() {
    const def = defRoster();
    try {
      const r = localStorage.getItem(SK_ROSTER);
      if(r) {
        let arr = JSON.parse(r);
        arr.forEach(h => {
          const d = def.find(dh => dh.name === h.name);
          if (d) {
            // Force update image paths from the canonical defRoster to fix any corrupted cache
            h.img = d.img;
            h.portrait = d.portrait;
            h.icon = d.icon;
            
            if (!h.picks && !h.bans && !h.wins) {
              h.picks = d.picks;
              h.bans = d.bans;
              h.wins = d.wins;
            }
          }
        });
        return arr.filter(h => h.name !== 'No Ban');
      }
    } catch(e) {}
    return def;
  }
  
  function saveRoster() {
    try { localStorage.setItem(SK_ROSTER, JSON.stringify(S.roster)); } catch(e){}
  }
  
  // ═══════════════════════════════════════════════════
  //  STATE
  // ═══════════════════════════════════════════════════
  let S = defState();
  let timerInt = null;
  let timerAudioTimeout = null;
  let timerAudio = null;
  let rfilt = 'all';
  let actCb = null;
  let modIdx = null, modHero = null;
  let modifyAllHeroes = []; // cached for filtering
  let rosterSortKey = 'name';
  let rosterSortDir = 1; // 1 asc, -1 desc
  let statsHeroIdx = null;
  
  // BroadcastChannel — best for same-origin multi-tab sync
  let bc = null;
  try { bc = new BroadcastChannel(BCAST); } catch(e){}
  
  let previewPlaying = false;
  function togglePreview() {
    previewPlaying = !previewPlaying;
    
    if(S) {
      S.previewPlaying = previewPlaying;
      saveQ(); // Sync to OBS via PHP
    }
  
    const btn = document.getElementById('btnPlayPreview');
    if(previewPlaying) {
      if(bc) bc.postMessage({t:'PLAY_PREVIEW'});
      if(btn) btn.innerHTML = "<i class='bx bx-hide'></i> Hide Draft Preview";
    } else {
      if(bc) bc.postMessage({t:'HIDE_PREVIEW'});
      if(btn) btn.innerHTML = "<i class='bx bx-play'></i> Play Draft Preview";
    }
  }
  
  function pub() {
    const json = JSON.stringify(S);
    try { localStorage.setItem(SK, json); } catch(e){}
    if(bc) try { bc.postMessage({t:'STATE',d:S}); } catch(e){}
    fetch('sync.php', { method: 'POST', body: json }).catch(()=>{});
    saveRoster();
    renderUI();
  }
  
  function saveQ() {
    const json = JSON.stringify(S);
    try { localStorage.setItem(SK, json); } catch(e){}
    if(bc) try { bc.postMessage({t:'STATE',d:S}); } catch(e){}
    fetch('sync.php', { method: 'POST', body: json }).catch(()=>{});
    saveRoster();
  }
  
  function load() { console.log('Starting load');
    try {
      const r = localStorage.getItem(SK);
      if(r) {
        const p = JSON.parse(r);
        S = {...defState(),...p}; S.numPlayers = 5; S.steps = buildSteps(S.format);
          // Purge massive base64 images from history to prevent memory leaks and slow refreshes
          if(S.history) {
              S.history.forEach(h => {
                  if(h.snap) {
                      delete h.snap.playerImages;
                      delete h.snap.basePlayerImages;
                  }
              });
          }
        // Always load roster from the dedicated key (preserves images/stats across resets)
        S.roster = loadRoster();
        if(!S.roles) S.roles={blue:[],red:[]};
        if(!S.playerImages) S.playerImages={blue:[],red:[]};
        if(!S.basePlayerImages) S.basePlayerImages={blue:[],red:[]};
        if(!p.basePlayers) S.basePlayers = JSON.parse(JSON.stringify(S.players || {blue:[],red:[]}));
        if(!p.baseRoles) S.baseRoles = JSON.parse(JSON.stringify(S.roles || {blue:[],red:[]}));
        if(!p.timerConfig) S.timerConfig={ban:30,pick:30,lastChange:30};
        if(S.timerConfig.lastChange===undefined) S.timerConfig.lastChange=30;
        if(!S.hud) S.hud={visible:false,lowerThird:{visible:false,text:'',subtext:''}};
        if(!S.streamTimer) S.streamTimer={remaining:0,max:0,running:false};
        if(!S.settings) S.settings=defState().settings;
        
        const fixH = (h) => {
          const ro = S.roster.find(r => r.name === h.name);
          if (ro) {
            h.img = ro.img;
            h.portrait = ro.portrait;
            h.icon = ro.icon;
          } else {
            if(h.img && !h.img.startsWith('assets/')) h.img = 'assets/' + h.img;
            if(h.portrait && !h.portrait.startsWith('assets/')) h.portrait = 'assets/' + h.portrait;
            if(h.icon && !h.icon.startsWith('assets/')) h.icon = 'assets/' + h.icon;
          }
        };
        if(S.blueBans) S.blueBans.forEach(fixH);
        if(S.redBans) S.redBans.forEach(fixH);
        if(S.bluePicks) S.bluePicks.forEach(fixH);
        if(S.redPicks) S.redPicks.forEach(fixH);
      }
    } catch(e) { S=defState(); }
  }
  
  // ═══════════════════════════════════════════════════
  //  STEP BUILDER
  // ═══════════════════════════════════════════════════
  function buildSteps(fmt) {
    const b5 = fmt==='5ban';
    const b4 = fmt==='4ban';
    const st = [];
    const p1b = b5?6:4;
    for(let i=0;i<p1b;i++) st.push({phase:1,action:'ban',side:i%2===0?'blue':'red'});
    ['blue','red','red','blue','blue','red'].forEach(s=>st.push({phase:1,action:'pick',side:s}));
    const p2b = b5?4:(b4?4:2);
    for(let i=0;i<p2b;i++) st.push({phase:2,action:'ban',side:i%2===0?'red':'blue'});
    ['red','blue','blue','red'].forEach(s=>st.push({phase:2,action:'pick',side:s}));
    return st;
  }
  
  // ═══════════════════════════════════════════════════
  //  SEGMENT CONTROLS
  // ═══════════════════════════════════════════════════
  function setSeg(type, val, el) {
    Array.from(el.parentElement.children).forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    if(type==='fmt') { S.format=val; pub(); }
    
    if(type==='bo') { S.meta.bo=val; updateGameOptions(); pub(); }
  }
  
  function updateGameOptions(){
    const select=document.getElementById('mGame');
    if(!select)return;
    const max={BO1:1,BO3:3,BO5:5,BO7:7}[S.meta.bo]||3;
    const current=Math.min(Math.max(1,Number(S.meta.game)||1),max);
    select.innerHTML=Array.from({length:max},(_,i)=>`<option value="${i+1}">G${i+1}</option>`).join('');
    select.value=String(current);
    const segment=document.getElementById('segGame');
    if(segment){
      segment.innerHTML=Array.from({length:max},(_,i)=>`<div class="seg-btn${i+1===current?' active':''}" onclick="setGameOption(${i+1},this)">G${i+1}</div>`).join('');
    }
    S.meta.game=current;
  }
  
  function updateSetupStartButton(){
    const button=document.getElementById('btnStartSetup');
    if(!button)return;
    const blue=document.getElementById('dbBlueTeamSelect')?.value;
    const red=document.getElementById('dbRedTeamSelect')?.value;
    button.disabled = blue==='' || red==='';
  }
  
  function setGameOption(value,el){
    document.querySelectorAll('#segGame .seg-btn').forEach(button=>button.classList.remove('active'));
    el.classList.add('active');
    S.meta.game=value;
    const select=document.getElementById('mGame');
    if(select)select.value=String(value);
    pub();
  }
  
  function renderSettings(){
      const settings=S.settings||defState().settings;
      const def = defState().settings;
      const draft = settings.draft || def.draft;
      const broadcast = settings.broadcast || def.broadcast;
      const audio = settings.audio || def.audio;
      
      // Draft Settings
      const elBan = document.getElementById('setBanTimer'); if(elBan) elBan.value=draft.banTimer;
      const elPick = document.getElementById('setPickTimer'); if(elPick) elPick.value=draft.pickTimer;
      const elFormat = document.getElementById('setBanFormat'); if(elFormat) elFormat.value=draft.banFormat;
      const elAdv = document.getElementById('setAutoAdvance'); if(elAdv) elAdv.checked=draft.autoAdvance || false;
      
      // Broadcast Settings
      const elPop = document.getElementById('setPlayerPopups'); if(elPop) elPop.checked=broadcast.playerPopups;
      const elOverlay = document.getElementById('setAutoOverlay'); if(elOverlay) elOverlay.checked=broadcast.autoShowOverlay;
      const elStats = document.getElementById('setHeroStats'); if(elStats) elStats.checked=broadcast.heroStats;
      const elTourney = document.getElementById('setTourneyMode'); if(elTourney) elTourney.checked=broadcast.tourneyMode || false;
      
      // Audio Settings
      const elBgm = document.getElementById('setBgmVolume'); if(elBgm) elBgm.value=audio.bgm;
      bgmAudio.volume = audio.bgm !== undefined ? audio.bgm : 0.5;
      const elSfx = document.getElementById('setSfxVolume'); if(elSfx) elSfx.value=audio.sfx;
      const elVoice = document.getElementById('setVoiceVolume'); if(elVoice) elVoice.value=audio.voice;
      const elAutoVoice = document.getElementById('setAutoVoice'); if(elAutoVoice) elAutoVoice.checked=audio.autoVoice || false;
    }
  
  function updateSetting(group,key,value){
    if(!S.settings) S.settings=defState().settings;
    S.settings[group][key]=value;
    if(group==='broadcast'&&key==='playerPopups') S.meta.playerPopupEnabled=value;
    if(group==='broadcast'&&key==='heroStats') S.meta.statsEnabled=value;
    if(group==='broadcast'&&key==='defaultHUD') S.hud.visible=value;
    if(group==='audio'&&key==='bgm') bgmAudio.volume=value;
    saveQ();
  }
  
  function applyDraftDefaults(){
    const draft=S.settings.draft;
    S.timerConfig={ban:draft.banTimer,pick:draft.pickTimer,lastChange:draft.lastChangeTimer || 30};
    S.format=draft.banFormat;
    S.numPlayers=5;
    S.meta.bo=S.meta.bo||'BO3';
    syncSegUI();
    updateGameOptions();
    pub();
    toast('Draft defaults applied','success');
  }
  
  function clearLocalRecords(){
    if(!confirm('Clear all locally stored match records?'))return;
    localStorage.removeItem('mplMatchRecords_v1');
    toast('Match records cleared','info');
  }
  
  function clearLocalDraft(){
    if(!confirm('Clear the current locally stored draft?'))return;
    localStorage.removeItem(SK);
    location.reload();
  }
  function setSegTimer(type, val, el) {
    Array.from(el.parentElement.children).forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    const inp = document.getElementById(type+'T');
    if(val==='custom') {
      inp.style.display='block';
      if(type==='ban') S.timerConfig.ban=+inp.value;
      if(type==='pick') S.timerConfig.pick=+inp.value;
      if(type==='lc') S.timerConfig.lastChange=+inp.value;
    } else {
      inp.style.display='none';
      inp.value=val;
      if(type==='ban') S.timerConfig.ban=val;
      if(type==='pick') S.timerConfig.pick=val;
      if(type==='lc') S.timerConfig.lastChange=val;
    }
  }
  function syncSegUI() {
    const setA = (id, v) => {
      const parent = document.getElementById(id);
      if(!parent) return;
      Array.from(parent.children).forEach(c=>{
        const label=c.textContent.trim();
        if(label == String(v) || label.startsWith(String(v)+' ') || label.startsWith(String(v)+'v') || (v==='custom' && label==='Other')) c.classList.add('active');
        else c.classList.remove('active');
      });
    };
    setA('segFmt', S.format.replace('ban',''));
    
    setA('segBo', S.meta.bo);
    
    const st = (id, val) => {
      const inp = document.getElementById(id+'T');
      if(!inp) return;
      if(val!==30 && val!==45) {
        setA('seg'+id.charAt(0).toUpperCase()+id.slice(1)+'T', 'custom');
        inp.style.display='block';
        inp.value = val;
      } else {
        setA('seg'+id.charAt(0).toUpperCase()+id.slice(1)+'T', val);
        inp.style.display='none';
      }
    };
    st('ban', S.timerConfig.ban);
    st('pick', S.timerConfig.pick);
    st('lc', S.timerConfig.lastChange);
  }
  
  // ═══════════════════════════════════════════════════
  //  TIMER
  // ═══════════════════════════════════════════════════
  function stopTimer(){
    if(timerInt){clearInterval(timerInt);timerInt=null;}
    if(timerAudioTimeout){clearTimeout(timerAudioTimeout);timerAudioTimeout=null;}
    if(timerAudio){timerAudio.pause();timerAudio.currentTime=0;timerAudio=null;}
  }
  function startTimer(secs){
    stopTimer();
    S.timer.remaining=secs; S.timer.max=secs;
    timerInt=setInterval(()=>{
      if(S.status!=='running' && S.status!=='last_change')return;
      S.timer.remaining=Math.max(0,S.timer.remaining-1);
      if(S.timer.remaining===11){
        timerAudioTimeout = setTimeout(()=>{
          try { 
            timerAudio = new Audio('assets/audio/mlbb10timer.wav');
            timerAudio.play().catch(()=>{}); 
          } catch(e){}
        }, 850); // 850ms delay means it plays 150ms before the timer flips to 10
      }
      if(S.timer.remaining<=0){
        stopTimer();
        if(S.status==='last_change'){finishDraft();}
        // timer halted at zero
        saveQ(); rTimerUI();
        return;
      }
      saveQ(); rTimerUI();
    },1000);
  }
  function addTime(n){S.timer.remaining=Math.min(S.timer.remaining+n,999);rTimerUI();saveQ();}
  
  // ═══════════════════════════════════════════════════
  //  DRAFT ENGINE
  // ═══════════════════════════════════════════════════
  function startDraft(){
    if(S.status!=='idle'){toast('Reset first','error');return;}
  
    // Flush all Match Setup form values into S before starting
    const vTour = document.getElementById('mTour')?.value;
    if(vTour !== undefined) S.meta.tournament = vTour;
    const vMatch = document.getElementById('mMatch')?.value;
    if(vMatch !== undefined) S.meta.match = vMatch;
    const vGame = document.getElementById('mGame')?.value;
    if(vGame !== undefined) S.meta.game = +vGame || 1;
    const vBWins = document.getElementById('bWins')?.value;
    if(vBWins !== undefined) S.meta.blueWins = +vBWins || 0;
    const vRWins = document.getElementById('rWins')?.value;
    if(vRWins !== undefined) S.meta.redWins = +vRWins || 0;
    const vBanT = document.getElementById('banT');
    if(vBanT) S.timerConfig.ban = +vBanT.value || 30;
    const vPickT = document.getElementById('pickT');
    if(vPickT) S.timerConfig.pick = +vPickT.value || 30;
    const vLcT = document.getElementById('lcT');
    if(vLcT) S.timerConfig.lastChange = +vLcT.value || 30;
  
    S.steps=buildSteps(S.format);
    S.currentStep=0;
    S.blueBans=[];S.redBans=[];S.bluePicks=[];S.redPicks=[];
    S.blueBanIdx=0;S.redBanIdx=0;S.bluePickIdx=0;S.redPickIdx=0;
    S.history=[];S.status='running';S.phase=1;
    if(S.settings?.broadcast?.autoShowOverlay) S.overlayVisible=true;
    beginStep();sw('live');
    toast('Draft started!','success');logH('🚀 Draft started');
    bgmPlay();
  }
  function beginStep(){
    if(S.currentStep>=S.steps.length){completeDraft();return;}
    const step=S.steps[S.currentStep];
    S.phase=step.phase;
  
    const dur=step.action==='ban'?S.timerConfig.ban:S.timerConfig.pick;
    startTimer(dur); pub();
  }
  function completeDraft(){
    stopTimer();
    if(S.status !== 'last_change') {
      S.status = 'last_change';
      startTimer(S.timerConfig.lastChange || 30);
      logH('Last Change Phase');
      toast('Last Change Phase Started!','info');
      openLCModal();
      pub();
    } else {
      finishDraft();
    }
  }
  function finishDraft() {
    stopTimer();
    S.status='complete';
    S.timer.remaining=0;
    logH('Draft complete');
    toast('Draft Complete!','success');
    cLCModal();
    pub();
    bgmFadeOut();
  }
  function pauseDraft(){if(S.status!=='running')return;stopTimer();S.status='paused';logH('⏸ Paused');toast('Paused','info');pub();bgmPause();}
  function resumeDraft(){if(S.status!=='paused')return;S.status='running';startTimer(S.timer.remaining>0?S.timer.remaining:S.timerConfig.ban);logH('▶ Resumed');toast('Resumed','success');pub();bgmPlay();}
  function skipTurn(){
    if(S.status!=='running'&&S.status!=='paused')return;
    const step=S.steps[S.currentStep];
    if(step) {
      const snap={blueBans:[...S.blueBans],redBans:[...S.redBans],bluePicks:[...S.bluePicks],redPicks:[...S.redPicks],blueBanIdx:S.blueBanIdx,redBanIdx:S.redBanIdx,bluePickIdx:S.bluePickIdx,redPickIdx:S.redPickIdx,currentStep:S.currentStep};
      logH(`⏭ Skipped ${step.side==='blue'?'Blue':'Red'} ${step.action}`, snap);
      if(step.action==='ban'){
        if(step.side==='blue'){S.blueBans.push(null);S.blueBanIdx++;}
        else{S.redBans.push(null);S.redBanIdx++;}
      } else {
        if(step.side==='blue'){S.bluePicks.push(null);S.bluePickIdx++;}
        else{S.redPicks.push(null);S.redPickIdx++;}
      }
    } else {
      logH('⏭ Skipped');
    }
    S.status='running';
    pub();
    advStep();
  }
  function advStep(){S.currentStep++;beginStep();}
  function toggleOverlay() {
    S.overlayVisible = !S.overlayVisible;
    const btn = document.getElementById('btnToggleOverlay');
    if(btn) btn.textContent = S.overlayVisible ? 'Hide Overlay' : 'Show Overlay';
    saveRoster();
    pub();
  }
  function togglePlayerPopup() {
    if (!S.meta) S.meta = {};
    S.meta.playerPopupEnabled = S.meta.playerPopupEnabled === false ? true : false;
    saveRoster();
    pub();
    updatePlayerPopupBtn();
    toast('Player Photo Popup: ' + (S.meta.playerPopupEnabled ? 'ON' : 'OFF'), 'info');
  }
  function updatePlayerPopupBtn() {
    const btn = document.getElementById('btnTogglePlayerPopup');
    const isEnabled = S.meta?.playerPopupEnabled !== false;
    if (btn) {
      btn.innerHTML = `<i class='bx bx-user'></i> Player Photo Popup: ${isEnabled ? 'ON' : 'OFF'}`;
      btn.className = `btn ${isEnabled ? 'bg2' : 'bw'} bsm bf`;
    }
  }
  function undoAction(){
    const last=[...S.history].reverse().find(h=>h.snap);
    if(!last){toast('Nothing to undo','error');return;}
    const sn=last.snap;
    S.blueBans=[...sn.blueBans];S.redBans=[...sn.redBans];
    S.bluePicks=[...sn.bluePicks];S.redPicks=[...sn.redPicks];
    S.blueBanIdx=sn.blueBanIdx;S.redBanIdx=sn.redBanIdx;
    S.bluePickIdx=sn.bluePickIdx;S.redPickIdx=sn.redPickIdx;
    S.currentStep=sn.currentStep;
  
    if (sn.players) S.players = JSON.parse(JSON.stringify(sn.players));
    if (sn.roles) S.roles = JSON.parse(JSON.stringify(sn.roles));
    
    if (sn.basePlayers) S.basePlayers = JSON.parse(JSON.stringify(sn.basePlayers));
    if (sn.baseRoles) S.baseRoles = JSON.parse(JSON.stringify(sn.baseRoles));
    
  
    const idx=S.history.lastIndexOf(last);
    S.history=S.history.slice(0,idx);
    S.status='running';
    S.skipNextPopup = true; // Added flag to suppress popup on next repick
    saveRoster();
    rebuildPInputs();
    renderUI();
    pub();
    beginStep();toast('Undone','info');
  }
  
  // ═══════════════════════════════════════════════════
  //  RESET — FIXED: properly resets status and re-enables Start Draft
  // ═══════════════════════════════════════════════════
  function cSoftReset(){openAct('Soft Reset','Clear picks/bans/timer. Team info is kept.',null,softReset,'bw','Soft Reset');}
  function cHardReset(){openAct('Full Reset','Clear EVERYTHING including teams, players and scores.',null,hardReset,'bd','Full Reset');}
  
  function softReset(){
    stopTimer();
    bgmFadeOut();
    const keep={roster:S.roster,teams:S.teams,basePlayers:S.basePlayers,baseRoles:S.baseRoles,playerImages:S.playerImages,basePlayerImages:S.basePlayerImages,meta:S.meta,timerConfig:S.timerConfig,format:S.format,numPlayers: 5};
    S=defState();
    // Overwrite the roster that defState() loaded with the current kept roster
    Object.assign(S, keep);
    S.players = JSON.parse(JSON.stringify(S.basePlayers || {blue:[],red:[]}));
    S.playerImages = JSON.parse(JSON.stringify(S.basePlayerImages || {blue:[],red:[]}));
    S.roles = JSON.parse(JSON.stringify(S.baseRoles || {blue:[],red:[]}));
    S.status='idle';
    S.steps=[];S.currentStep=0;
    S.blueBans=[];S.redBans=[];S.bluePicks=[];S.redPicks=[];
    S.blueBanIdx=0;S.redBanIdx=0;S.bluePickIdx=0;S.redPickIdx=0;
    S.history=[];
    S.timer={remaining:S.timerConfig.ban||30,max:S.timerConfig.ban||30};
    
    toast('Soft reset done — team data kept','info');logH('↺ Soft reset');
    pub();
  }
  
  function hardReset(){
    stopTimer();
    bgmFadeOut();
    const roster=S.roster; // always keep roster (images/stats persist)
    S=defState();
    S.roster=roster;
    S.status='idle';
    // Reset all form inputs
    const fields = {
      bTeam:'',rTeam:'',bLogo:'',rLogo:'',
      bWins:0,rWins:0,
      mTour:'MPL Season 15',mMatch:'Upper Bracket Finals',
    };
    Object.entries(fields).forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.value=v;});
    if(document.getElementById('mBo')) document.getElementById('mBo').value='BO3';
    if(document.getElementById('mGame')) document.getElementById('mGame').value=1;
    if(document.getElementById('selFmt')) document.getElementById('selFmt').value='3ban';
    if(document.getElementById('selP')) document.getElementById('selP').value=5;
    if(document.getElementById('banT')) document.getElementById('banT').value=30;
    if(document.getElementById('pickT')) document.getElementById('pickT').value=30;
    if(document.getElementById('lcT')) document.getElementById('lcT').value=30;
    
    toast('Full reset complete','info');logH('⚠ Full reset');
    pub();
  }
  
  // ═══════════════════════════════════════════════════
  //  SWAP SIDES
  // ═══════════════════════════════════════════════════
  function swapSides(){
    if(S.status==='running'){if(!confirm('Draft running. Swap anyway?'))return;}
    [S.teams.blue,S.teams.red]=[S.teams.red,S.teams.blue];
    [S.players.blue,S.players.red]=[S.players.red,S.players.blue];
    [S.playerImages.blue,S.playerImages.red]=[S.playerImages.red,S.playerImages.blue];
    [S.roles.blue,S.roles.red]=[S.roles.red,S.roles.blue];
    [S.basePlayers.blue,S.basePlayers.red]=[S.basePlayers.red,S.basePlayers.blue];
    [S.basePlayerImages.blue,S.basePlayerImages.red]=[S.basePlayerImages.red,S.basePlayerImages.blue];
    [S.baseRoles.blue,S.baseRoles.red]=[S.baseRoles.red,S.baseRoles.blue];
    [S.meta.blueWins,S.meta.redWins]=[S.meta.redWins,S.meta.blueWins];
  
    [S.bluePicks,S.redPicks]=[S.redPicks,S.bluePicks];
    [S.blueBans,S.redBans]=[S.redBans,S.blueBans];
    [S.bluePickIdx,S.redPickIdx]=[S.redPickIdx,S.bluePickIdx];
    [S.blueBanIdx,S.redBanIdx]=[S.redBanIdx,S.blueBanIdx];
    if(S.steps) S.steps.forEach(st => st.side = (st.side === 'blue' ? 'red' : 'blue'));
    if(S.history) S.history.forEach(h => {
      if(h.snap) {
        let sn = h.snap;
        let tb = sn.blueBans, tp = sn.bluePicks, tbi = sn.blueBanIdx, tpi = sn.bluePickIdx;
        sn.blueBans = sn.redBans; sn.redBans = tb;
        sn.bluePicks = sn.redPicks; sn.redPicks = tp;
        sn.blueBanIdx = sn.redBanIdx; sn.redBanIdx = tbi;
        sn.bluePickIdx = sn.redPickIdx; sn.redPickIdx = tpi;
  
        if(sn.players) [sn.players.blue, sn.players.red] = [sn.players.red, sn.players.blue];
        if(sn.roles) [sn.roles.blue, sn.roles.red] = [sn.roles.red, sn.roles.blue];
        if(sn.playerImages) [sn.playerImages.blue, sn.playerImages.red] = [sn.playerImages.red, sn.playerImages.blue];
        if(sn.basePlayers) [sn.basePlayers.blue, sn.basePlayers.red] = [sn.basePlayers.red, sn.basePlayers.blue];
        if(sn.baseRoles) [sn.baseRoles.blue, sn.baseRoles.red] = [sn.baseRoles.red, sn.baseRoles.blue];
        if(sn.basePlayerImages) [sn.basePlayerImages.blue, sn.basePlayerImages.red] = [sn.basePlayerImages.red, sn.basePlayerImages.blue];
      }
    });
  
    
    if(document.getElementById('mTotalMatches')) document.getElementById('mTotalMatches').value = S.meta.totalMatches || 0;
    if(document.getElementById('mStatsEnabled')) document.getElementById('mStatsEnabled').checked = S.meta.statsEnabled !== false;
    document.getElementById('bTag').value=S.teams.blue.tag||'';
    document.getElementById('rTag').value=S.teams.red.tag||'';
    if(document.getElementById('bWins')) document.getElementById('bWins').value=S.meta.blueWins;
    if(document.getElementById('rWins')) document.getElementById('rWins').value=S.meta.redWins;
    toast('Sides swapped','success');logH('⇄ Sides swapped');pub();
  }
  
  //  LAST CHANGE PHASE
  // ═══════════════════════════════════════════════════
  let lcSource = null; // {side:'blue', idx:0}
  function openLCModal(){
    if(S.status !== 'last_change') return;
    renderLCModal();
    document.getElementById('lcModal').classList.add('show');
  }
  function cLCModal(){
    document.getElementById('lcModal').classList.remove('show');
    lcSource = null;
  }
  function renderLCModal(){
    ['blue','red'].forEach(side => {
      const div = document.getElementById(side === 'blue' ? 'lcBlueTeam' : 'lcRedTeam');
      div.innerHTML = '';
      const picks = side === 'blue' ? S.bluePicks : S.redPicks;
      const players = side === 'blue' ? S.players.blue : S.players.red;
      const roles = side === 'blue' ? S.roles.blue : S.roles.red;
      const iconMapLC = {'EXP Lane':'assets/imgs/exp.png', 'Jungle':'assets/imgs/jungler.png', 'Mid Lane':'assets/imgs/mid.png', 'Gold Lane':'assets/imgs/gold.png', 'Roam':'assets/imgs/Roamer.png'};
      for(let i=0; i<S.numPlayers; i++){
        const h = picks[i];
        const p = players[i] || `Player ${i+1}`;
        const r = roles[i] || LANES[i];
        const card = document.createElement('div');
        card.className = 'lc-card';
        if(lcSource && lcSource.side === side && lcSource.idx === i) card.classList.add('selected');
        const img = (h && (h.portrait || h.img)) ? `<img src="${h.portrait||h.img}" class="lc-img" onerror="this.style.display='none'">` : `<div class="lc-img" style="display:flex;align-items:center;justify-content:center;font-size:24px;">${RI[r]||'⚔'}</div>`;
        const iconHTML = iconMapLC[r] ? `<img src="${iconMapLC[r]}" style="width:14px;height:14px;filter:invert(1);mix-blend-mode:multiply;opacity:0.8;">` : `<span>${RI[r]||'⚔'}</span>`;
        card.innerHTML = `
          ${img}
          <div class="lc-role">${iconHTML} <span style="font-size:11px;">${r}</span></div>
          <div class="lc-ign">${p}</div>
        `;
        card.onclick = () => {
          lcSource = {side, idx: i, hero: h, player: p, role: r};
          openLCSwapModal();
        };
        div.appendChild(card);
      }
    });
  }
  function openLCSwapModal(){
    if(!lcSource) return;
    const picks = lcSource.side === 'blue' ? S.bluePicks : S.redPicks;
    const players = lcSource.side === 'blue' ? S.players.blue : S.players.red;
    const roles = lcSource.side === 'blue' ? S.roles.blue : S.roles.red;
    const iconMapLC = {'EXP Lane':'assets/imgs/exp.png', 'Jungle':'assets/imgs/jungler.png', 'Mid Lane':'assets/imgs/mid.png', 'Gold Lane':'assets/imgs/gold.png', 'Roam':'assets/imgs/Roamer.png'};
    
    document.getElementById('lcSwapSub').innerHTML = `Swapping <b>${lcSource.hero ? lcSource.hero.name : 'None'}</b> for <b>${lcSource.player}</b>.`;
    const list = document.getElementById('lcSwapList');
    list.innerHTML = '';
    
    for(let i=0; i<S.numPlayers; i++){
      if(i === lcSource.idx) continue;
      const h = picks[i];
      const p = players[i] || `Player ${i+1}`;
      const r = roles[i] || LANES[i];
      const card = document.createElement('div');
      card.className = 'lc-card';
      const img = (h && (h.portrait || h.img)) ? `<img src="${h.portrait||h.img}" class="lc-img" onerror="this.style.display='none'">` : `<div class="lc-img" style="display:flex;align-items:center;justify-content:center;font-size:24px;">${RI[r]||'⚔'}</div>`;
      const iconHTML = iconMapLC[r] ? `<img src="${iconMapLC[r]}" style="width:14px;height:14px;filter:invert(1);mix-blend-mode:multiply;opacity:0.8;">` : `<span>${RI[r]||'⚔'}</span>`;
      card.innerHTML = `
        ${img}
        <div class="lc-role">${iconHTML} <span style="font-size:11px;">${r}</span></div>
        <div class="lc-ign">${p}</div>
      `;
      card.onclick = () => {
        const tempHero = picks[lcSource.idx];
        picks[lcSource.idx] = picks[i];
        picks[i] = tempHero;
        logH(`Last Change: Swapped heroes between ${lcSource.player} and ${p}`);
        toast('Heroes swapped!', 'success');
        cLCSwapModal();
        renderLCModal();
        pub();
      };
      list.appendChild(card);
    }
    document.getElementById('lcSwapModal').classList.add('show');
  }
  function cLCSwapModal(){
    document.getElementById('lcSwapModal').classList.remove('show');
    lcSource = null;
    renderLCModal();
  }
  
  // ═══════════════════════════════════════════════════
  //  HERO SELECTION — FIXED: directly applies and calls pub() to sync overlay
  // ═══════════════════════════════════════════════════
  function isUsed(n){if(n==='No Ban')return false;return S.blueBans.some(h=>h&&h.name===n)||S.redBans.some(h=>h&&h.name===n)||S.bluePicks.some(h=>h&&h.name===n)||S.redPicks.some(h=>h&&h.name===n);}
  let flexHero = null;
  let flexStep = null;
  
  function selHero(hero){
    if(S.status!=='running'){toast('Draft not running','error');return;}
    if(isUsed(hero.name)){toast(`${hero.name} already used`,'error');return;}
    const step=S.steps[S.currentStep];if(!step)return;
    
    if(step.action === 'pick') {
      openFlexModal(hero, step);
    } else {
      openAct(
        `BAN — ${hero.name}`,
        `${step.side==='blue'?'🔵 Blue':'🔴 Red'} Side · Phase ${step.phase}`,
        hero, ()=>applyHero(hero,step),
        'bd', 'BAN'
      );
    }
  }
  
  function openFlexModal(hero, step) {
    flexHero = hero;
    flexStep = step;
    
    document.getElementById('fmName').textContent = hero.name;
    document.getElementById('fmRole').textContent = `${RI[hero.role]||'⚔'} ${hero.role}`;
    const imgEl=document.getElementById('fmImg');
    imgEl.innerHTML=(hero.portrait||hero.img)?`<img src="${hero.portrait||hero.img}" style="width:38px;height:38px;border-radius:6px;object-fit:cover;">`:'';
    
    const list = document.getElementById('fmList');
    list.innerHTML = '';
    
    const players = S.players[step.side] || ['Player 1','Player 2','Player 3','Player 4','Player 5'];
    const roles = S.roles[step.side] || ['EXP Lane','Jungle','Mid Lane','Gold Lane','Roam'];
    const currentIdx = step.side === 'blue' ? S.bluePickIdx : S.redPickIdx;
    
    const iconMap = {'EXP Lane':'assets/imgs/exp.png', 'Jungle':'assets/imgs/jungler.png', 'Mid Lane':'assets/imgs/mid.png', 'Gold Lane':'assets/imgs/gold.png', 'Roam':'assets/imgs/Roamer.png'};
    
    const picksList = step.side === 'blue' ? S.bluePicks : S.redPicks;
    
    for(let i=0; i<5; i++) {
      const isCurrent = i === currentIdx;
      const hasPicked = !!picksList[i];
      const btn = document.createElement('div');
      
      if (hasPicked && !isCurrent) {
        btn.className = 'flex-btn';
        btn.style.opacity = '0.4';
        btn.style.cursor = 'not-allowed';
      } else {
        btn.className = 'flex-btn' + (isCurrent ? ' current' : '');
        btn.onclick = () => doFlexPick(i);
      }
      
      const roleName = roles[i] || LANES[i];
      const iconSrc = iconMap[roleName] || '';
      
      btn.innerHTML = `
        ${isCurrent ? '<div style="position:absolute;top:-8px;background:var(--blue);color:#fff;font-size:9px;font-weight:700;padding:2px 8px;border-radius:12px;letter-spacing:1px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">DEFAULT</div>' : ''}
        <img src="${iconSrc}" class="flex-role-icon" onerror="this.style.display='none'">
        <div class="flex-pn">${players[i] || 'Player '+(i+1)}</div>
        <div class="flex-pr">${roleName}</div>
      `;
      list.appendChild(btn);
    }
    
    document.getElementById('flexPickModal').classList.add('show');
  }
  
  function cFlex() {
    document.getElementById('flexPickModal').classList.remove('show');
    flexHero = null;
    flexStep = null;
  }
  
  function doFlexPick(targetIdx) {
    if(!flexHero || !flexStep) return;
    
    const currentIdx = flexStep.side === 'blue' ? S.bluePickIdx : S.redPickIdx;
    
    // Capture roster snapshot BEFORE any flex pick swap is applied
    const preFlexSnap = {
      players: JSON.parse(JSON.stringify(S.players || {blue:[],red:[]})),
      roles: JSON.parse(JSON.stringify(S.roles || {blue:[],red:[]})),
      basePlayers: JSON.parse(JSON.stringify(S.basePlayers || {blue:[],red:[]})),
      baseRoles: JSON.parse(JSON.stringify(S.baseRoles || {blue:[],red:[]})),
      /* basePlayerImages removed */
    };
  
    if (targetIdx !== currentIdx) {
      const side = flexStep.side;
      
      if(!S.players[side]) S.players[side] = [];
      if(!S.roles[side]) S.roles[side] = [];
      if(!S.playerImages[side]) S.playerImages[side] = [];
      if(!S.basePlayers[side]) S.basePlayers[side] = [];
      if(!S.baseRoles[side]) S.baseRoles[side] = [];
      if(!S.basePlayerImages[side]) S.basePlayerImages[side] = [];
      
      // Swap Players with fallbacks
      const currentPlayer = S.players[side][currentIdx] || '';
      const targetPlayer = S.players[side][targetIdx] || '';
      S.players[side][currentIdx] = targetPlayer;
      S.players[side][targetIdx] = currentPlayer;
  
      const currentBasePlayer = S.basePlayers[side][currentIdx] || '';
      const targetBasePlayer = S.basePlayers[side][targetIdx] || '';
      S.basePlayers[side][currentIdx] = targetBasePlayer;
      S.basePlayers[side][targetIdx] = currentBasePlayer;
      
      // Swap Roles with fallbacks
      const currentRole = S.roles[side][currentIdx] || LANES[currentIdx];
      const targetRole = S.roles[side][targetIdx] || LANES[targetIdx];
      S.roles[side][currentIdx] = targetRole;
      S.roles[side][targetIdx] = currentRole;
  
      const currentBaseRole = S.baseRoles[side][currentIdx] || LANES[currentIdx];
      const targetBaseRole = S.baseRoles[side][targetIdx] || LANES[targetIdx];
      S.baseRoles[side][currentIdx] = targetBaseRole;
      S.baseRoles[side][targetIdx] = currentBaseRole;
  
      // Swap Player Images with fallbacks
      const currentImg = S.playerImages[side][currentIdx] || '';
      const targetImg = S.playerImages[side][targetIdx] || '';
      S.playerImages[side][currentIdx] = targetImg;
      S.playerImages[side][targetIdx] = currentImg;
  
      const currentBaseImg = S.basePlayerImages[side][currentIdx] || '';
      const targetBaseImg = S.basePlayerImages[side][targetIdx] || '';
      S.basePlayerImages[side][currentIdx] = targetBaseImg;
      S.basePlayerImages[side][targetIdx] = currentBaseImg;
      
      saveRoster();
      
    }
    
    applyHero(flexHero, flexStep, preFlexSnap);
    cFlex();
  }
  function applyHero(hero,step,preFlexSnap=null){
    const snap={
      blueBans:[...S.blueBans],
      redBans:[...S.redBans],
      bluePicks:[...S.bluePicks],
      redPicks:[...S.redPicks],
      blueBanIdx:S.blueBanIdx,
      redBanIdx:S.redBanIdx,
      bluePickIdx:S.bluePickIdx,
      redPickIdx:S.redPickIdx,
      currentStep:S.currentStep,
      players: preFlexSnap ? preFlexSnap.players : JSON.parse(JSON.stringify(S.players || {blue:[],red:[]})),
      roles: preFlexSnap ? preFlexSnap.roles : JSON.parse(JSON.stringify(S.roles || {blue:[],red:[]})),
      basePlayers: preFlexSnap ? preFlexSnap.basePlayers : JSON.parse(JSON.stringify(S.basePlayers || {blue:[],red:[]})),
      baseRoles: preFlexSnap ? preFlexSnap.baseRoles : JSON.parse(JSON.stringify(S.baseRoles || {blue:[],red:[]})),
      /* basePlayerImages removed */
    };
    logH(`${step.action==='ban'?'🚫':'✅'} ${step.side==='blue'?'Blue':'Red'} ${step.action}: ${hero.name}`,snap);
    const heroSafe = hero.name.replace(/[^a-zA-Z0-9]/g, '');
    if(step.action==='ban'){
      try { new Audio('assets/audio/mlbbban.wav').play().catch(()=>{}); } catch(e){}
      try { new Audio(`assets/audio/heroes/${heroSafe}.ogg`).play().catch(()=>{}); } catch(e){}
      if(step.side==='blue'){S.blueBans.push(hero);S.blueBanIdx++;}
      else{S.redBans.push(hero);S.redBanIdx++;}
    } else {
      try { new Audio('assets/audio/mlbbpick.wav').play().catch(()=>{}); } catch(e){}
      try { new Audio(`assets/audio/heroes/${heroSafe}.ogg`).play().catch(()=>{}); } catch(e){}
      if(step.side==='blue'){S.bluePicks.push(hero);S.bluePickIdx++;}
      else{S.redPicks.push(hero);S.redPickIdx++;}
    }
    // Publish state BEFORE advancing step so overlay updates immediately
    pub();
    advStep();
  }
  
  // ═══════════════════════════════════════════════════
  //  MODIFY (ADMIN OVERRIDE) — with search bar + edit on done steps
  // ═══════════════════════════════════════════════════
  function openModify(idx){
    modIdx=idx;modHero=null;
    const step=S.steps[idx];
    document.getElementById('mmt').textContent=`Override Step ${idx+1}`;
    document.getElementById('mms').textContent=`${step.side==='blue'?'Blue':'Red'} Side · ${step.action.toUpperCase()} · Phase ${step.phase}`;
    document.getElementById('mmsel').textContent='None';
    document.getElementById('modifySearch').value='';
    // Build hero list
    modifyAllHeroes = S.roster.map(h => ({...h, used: isUsedExcept(h.name, idx, step)}));
    renderModifyGrid('');
    document.getElementById('modifyModal').classList.add('show');
  }
  
  // Check if hero is used, except in the step being modified
  function isUsedExcept(name, stepIdx, step) {
    // Get which position this step would assign
    const steps = S.steps;
    let usedNames = [...S.blueBans, ...S.redBans, ...S.bluePicks, ...S.redPicks].filter(Boolean).map(h=>h.name);
    // Find what this step currently has assigned, exclude it from "used"
    let curHeroName = null;
    if(step.action==='ban') {
      const sideSteps=steps.slice(0,stepIdx+1).filter(st=>st.action==='ban'&&st.side===step.side);
      const bi=sideSteps.length-1;
      const src=step.side==='blue'?S.blueBans:S.redBans;
      if(src[bi]) curHeroName = src[bi].name;
    } else {
      const sideSteps=steps.slice(0,stepIdx+1).filter(st=>st.action==='pick'&&st.side===step.side);
      const pi=sideSteps.length-1;
      const src=step.side==='blue'?S.bluePicks:S.redPicks;
      if(src[pi]) curHeroName = src[pi].name;
    }
    if(name === curHeroName) return false; // allow re-selecting what's already assigned
    return usedNames.includes(name);
  }
  
  function renderModifyGrid(search) {
    const grid=document.getElementById('mmg');grid.innerHTML='';
    const q = search.toLowerCase();
    const filtered = modifyAllHeroes.filter(h => !q || h.name.toLowerCase().includes(q));
    filtered.forEach(h=>{
      const u=h.used;
      const el=document.createElement('div');
      el.className=`hcard mhc${u?' hu mu':''}`;
      el.innerHTML=`<div class="hci">${(h.portrait||h.img)?`<img src="${h.portrait||h.img}" onerror="this.style.display='none'">`:`<span class="hph">${RI[h.role]||'⚔'}</span>`}<div class="hrd" style="background:${RC[h.role]||'#546E7A'}"></div></div><div class="hcn">${h.name}</div>`;
      if(!u){
        el.onclick=()=>{
          document.getElementById('mmg').querySelectorAll('.mhc').forEach(c=>c.classList.remove('msel'));
          el.classList.add('msel');
          modHero=h;
          document.getElementById('mmsel').textContent=h.name;
        };
      }
      grid.appendChild(el);
    });
  }
  
  function filterModifyGrid(){
    const q = document.getElementById('modifySearch').value;
    renderModifyGrid(q);
  }
  
  function cModify(){document.getElementById('modifyModal').classList.remove('show');modIdx=null;modHero=null;}
  function doModify(){
    if(!modHero){toast('Select a hero','error');return;}
    const step=S.steps[modIdx];
    const steps=S.steps;
    if(step.action==='ban'){
      const sideSteps=steps.slice(0,modIdx+1).filter(st=>st.action==='ban'&&st.side===step.side);
      const bi=sideSteps.length-1;
      if(step.side==='blue'){
        while(S.blueBans.length<=bi)S.blueBans.push(null);
        S.blueBans[bi]=modHero;
        if(bi>=S.blueBanIdx)S.blueBanIdx=bi+1;
      } else {
        while(S.redBans.length<=bi)S.redBans.push(null);
        S.redBans[bi]=modHero;
        if(bi>=S.redBanIdx)S.redBanIdx=bi+1;
      }
    } else {
      const sideSteps=steps.slice(0,modIdx+1).filter(st=>st.action==='pick'&&st.side===step.side);
      const pi=sideSteps.length-1;
      if(step.side==='blue'){
        while(S.bluePicks.length<=pi)S.bluePicks.push(null);
        S.bluePicks[pi]=modHero;
        if(pi>=S.bluePickIdx)S.bluePickIdx=pi+1;
      } else {
        while(S.redPicks.length<=pi)S.redPicks.push(null);
        S.redPicks[pi]=modHero;
        if(pi>=S.redPickIdx)S.redPickIdx=pi+1;
      }
    }
    if(modIdx>=S.currentStep)S.currentStep=modIdx+1;
    logH(`✏️ Override step ${modIdx+1}: ${step.side} ${step.action} → ${modHero.name}`);
    cModify();toast(`Override: ${modHero.name}`,'success');pub();
  }
  
  // ═══════════════════════════════════════════════════
  //  ESPORTS SETTINGS
  // ═══════════════════════════════════════════════════
  function openEsports() {
    document.getElementById('emTotalMatches').value = S.meta.totalMatches || 0;
    document.getElementById('emStatsEnabled').checked = S.meta.statsEnabled !== false;
    document.getElementById('esportsModal').classList.add('show');
  }
  function cEsports() { document.getElementById('esportsModal').classList.remove('show'); }
  function doEsports() {
    S.meta.totalMatches = parseInt(document.getElementById('emTotalMatches').value) || 0;
    S.meta.statsEnabled = document.getElementById('emStatsEnabled').checked;
    cEsports();
    toast('Esports settings saved','success');
    pub(); renderRoster();
  }
  
  // ═══════════════════════════════════════════════════
  //  HERO ROSTER & EDIT MODAL
  // ═══════════════════════════════════════════════════
  let editHeroIdx = null;
  
  
  function openAddHero() {
    editHeroIdx = -1; // -1 means new
    document.getElementById('hemTitle').textContent = "Add New Hero";
    document.getElementById('hemName').value = '';
    document.getElementById('hemRole').value = 'Fighter';
    document.getElementById('hemIcon').value = '';
    document.getElementById('hemPortrait').value = '';
    document.getElementById('hemPicks').value = 0;
    document.getElementById('hemBans').value = 0;
    document.getElementById('hemWins').value = 0;
    document.getElementById('hemDelBtn').style.display = 'none';
    updHemRates();
    document.getElementById('heroEditModal').classList.add('show');
  }
  
  function openHeroEdit(idx) {
    editHeroIdx = idx;
    const h = S.roster[idx];
    document.getElementById('hemTitle').textContent = `Edit Hero: ${h.name}`;
    document.getElementById('hemName').value = h.name || '';
    document.getElementById('hemRole').value = h.role || 'Fighter';
    document.getElementById('hemIcon').value = h.icon || '';
    document.getElementById('hemPortrait').value = h.portrait || h.img || '';
    document.getElementById('hemPicks').value = h.picks || 0;
    document.getElementById('hemBans').value = h.bans || 0;
    document.getElementById('hemWins').value = h.wins || 0;
    
    if (h.name === 'No Ban') {
      document.getElementById('hemRole').disabled = true;
      document.getElementById('hemIcon').disabled = true;
      document.getElementById('hemPortrait').disabled = true;
      document.getElementById('hemPicks').disabled = true;
      document.getElementById('hemBans').disabled = true;
      document.getElementById('hemWins').disabled = true;
      document.getElementById('hemDelBtn').style.display = 'none';
    } else {
      document.getElementById('hemRole').disabled = false;
      document.getElementById('hemIcon').disabled = false;
      document.getElementById('hemPortrait').disabled = false;
      document.getElementById('hemPicks').disabled = false;
      document.getElementById('hemBans').disabled = false;
      document.getElementById('hemWins').disabled = false;
      document.getElementById('hemDelBtn').style.display = 'block';
    }
    
    updHemRates();
    document.getElementById('heroEditModal').classList.add('show');
  }
  
  function cHeroEdit() { document.getElementById('heroEditModal').classList.remove('show'); editHeroIdx = null; }
  
  function updHemRates() {
    let pInp = document.getElementById('hemPicks');
    let bInp = document.getElementById('hemBans');
    let wInp = document.getElementById('hemWins');
    
    let p = parseInt(pInp.value) || 0;
    let b = parseInt(bInp.value) || 0;
    let w = parseInt(wInp.value) || 0;
    const t = S.meta.totalMatches || 0;
    
    if (t > 0 && p + b > t) {
      if (p > t) p = t;
      b = t - p;
      pInp.value = p;
      bInp.value = b;
      toast(`Picks + Bans cannot exceed Total Matches (${t})`, 'error');
    }
    if (w > p) {
      w = p;
      wInp.value = w;
      toast(`Wins cannot exceed Picks (${p})`, 'error');
    }
    
    const pr = t>0 ? ((p/t)*100).toFixed(1) : 0;
    const br = t>0 ? ((b/t)*100).toFixed(1) : 0;
    const cr = t>0 ? (((p+b)/t)*100).toFixed(1) : 0;
    const wr = p>0 ? ((w/p)*100).toFixed(1) : 0;
    
    document.getElementById('hemPR').textContent = pr + '%';
    document.getElementById('hemBR').textContent = br + '%';
    document.getElementById('hemCR').textContent = cr + '%';
    document.getElementById('hemWR').textContent = wr + '%';
  }
  
  function doHeroEdit() {
    const n = document.getElementById('hemName').value.trim();
    if(!n) { toast('Enter name','error'); return; }
    
    const hData = {
      name: n,
      role: document.getElementById('hemRole').value,
      icon: document.getElementById('hemIcon').value.trim(),
      portrait: document.getElementById('hemPortrait').value.trim(),
      picks: parseInt(document.getElementById('hemPicks').value) || 0,
      bans: parseInt(document.getElementById('hemBans').value) || 0,
      wins: parseInt(document.getElementById('hemWins').value) || 0,
    };
    
    if (editHeroIdx === -1) {
      if(S.roster.find(h=>h.name.toLowerCase()===n.toLowerCase())){ toast('Already exists','error'); return; }
      S.roster.push(hData);
      toast(`${n} added`,'success');
    } else {
      S.roster[editHeroIdx] = { ...S.roster[editHeroIdx], ...hData };
      toast(`${n} updated`,'success');
    }
    
    cHeroEdit();
    saveRoster(); pub(); renderRoster(); renderHGrid();
  }
  
  function doDeleteHero() {
    if (editHeroIdx === null || editHeroIdx === -1) return;
    const n = S.roster[editHeroIdx].name;
    if(confirm(`Are you sure you want to delete ${n}?`)) {
      S.roster.splice(editHeroIdx, 1);
      toast(`${n} removed`,'info');
      cHeroEdit();
      saveRoster(); pub(); renderRoster(); renderHGrid();
    }
  }
  
  function exportRoster(){
    const b=new Blob([JSON.stringify(S.roster,null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='roster.json';a.click();
  }
  
  function importRoster(input) {
    const file = input.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if(Array.isArray(data)) {
          S.roster = data;
          saveRoster(); pub(); renderRoster(); renderHGrid();
          toast('Roster imported','success');
        } else { toast('Invalid JSON format','error'); }
      } catch(err) { toast('Error parsing JSON','error'); }
      input.value = '';
    };
    reader.readAsText(file);
  }
  
  function setRosterSort(key, el) {
    Array.from(el.parentElement.children).forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    if(rosterSortKey===key) rosterSortDir*=-1;
    else { rosterSortKey=key; rosterSortDir=1; }
    document.getElementById('rosterSortDirBtn').textContent = rosterSortDir===1 ? '↓' : '↑';
    renderRoster();
  }
  
  function toggleRosterSortDir() {
    rosterSortDir*=-1;
    document.getElementById('rosterSortDirBtn').textContent = rosterSortDir===1 ? '↓' : '↑';
    renderRoster();
  }
  
  function renderRoster(){
    const div=document.getElementById('rosterList');div.innerHTML='';
    const q=(document.getElementById('rosterSearch').value||'').toLowerCase();
    let heroes = [...S.roster].filter(h=>h.name!=='No Ban');
    if(q) heroes = heroes.filter(h=>h.name.toLowerCase().includes(q)||h.role.toLowerCase().includes(q));
    heroes.sort((a,b)=>{
      let av=a[rosterSortKey]??'',bv=b[rosterSortKey]??'';
      if(rosterSortKey==='contestRate') {
        const t = S.meta.totalMatches || 1;
        av = ((a.picks||0)+(a.bans||0))/t;
        bv = ((b.picks||0)+(b.bans||0))/t;
      }
      if(typeof av==='string') av=av.toLowerCase();
      if(typeof bv==='string') bv=bv.toLowerCase();
      return av<bv?-rosterSortDir:av>bv?rosterSortDir:0;
    });
    
    heroes.forEach(h=>{
      const i=S.roster.indexOf(h);
      const el=document.createElement('div');
      el.className='hcard';
      el.innerHTML=`<div class="hci">${(h.portrait||h.img)?`<img src="${h.portrait||h.img}" onerror="this.style.display='none'">`:`<span class="hph">${RI[h.role]||'⚔'}</span>`}<div class="hrd" style="background:${RC[h.role]||'#546E7A'}"></div></div><div class="hcn">${h.name}</div>`;
      el.onclick=()=>openHeroEdit(i);
      div.appendChild(el);
    });
  }
  
  // ═══════════════════════════════════════════════════
  //  RENDER: HERO GRID
  // ═══════════════════════════════════════════════════
  let lastHGridFilter = '';
  let hGridEls = [];
  
  function renderHGrid(){ console.log('Starting renderHGrid');
    const grid=document.getElementById('hgrid');
    const search=document.getElementById('hsearch').value.toLowerCase();
    let heroes=S.roster.filter(h=>(h.name!=='No Ban')&&(rfilt==='all'||h.role===rfilt)&&(!search||h.name.toLowerCase().includes(search)));
    
    const step = S.steps?.[S.currentStep];
    const isBan = step && step.action === 'ban';
    
    const noBan = S.roster.find(h=>h.name==='No Ban');
    if(noBan && isBan) heroes.unshift(noBan);
    
    if(document.getElementById('hcntNum')) document.getElementById('hcntNum').textContent=heroes.length;
    
    const stepAction = S.steps?.[S.currentStep]?.action || '';
    const filterKey = rfilt + '|' + search + '|' + S.roster.length + '|' + stepAction;
    if(filterKey !== lastHGridFilter) {
      grid.innerHTML='';
      hGridEls = [];
      heroes.forEach(hero=>{
        const el=document.createElement('div');
        el.innerHTML=`<div class="hci">${(hero.portrait||hero.img)?`<img src="${hero.portrait||hero.img}" onerror="this.style.display='none'">`:`<span class="hph">${RI[hero.role]||'⚔'}</span>`}<div class="hrd" style="background:${RC[hero.role]||'#546E7A'}"></div></div><div class="hcn">${hero.name}</div>`;
        grid.appendChild(el);
        hGridEls.push({hero, el});
      });
      lastHGridFilter = filterKey;
    }
    
    hGridEls.forEach(({hero, el}) => {
      const isNoBan = hero.name === 'No Ban';
      const u=isUsed(hero.name);
      const ban=!isNoBan && (S.blueBans.some(h=>h&&h.name===hero.name)||S.redBans.some(h=>h&&h.name===hero.name));
      const pick=!isNoBan && (S.bluePicks.some(h=>h&&h.name===hero.name)||S.redPicks.some(h=>h&&h.name===hero.name));
      el.className=`hcard${u?' hu':''}${ban&&!pick?' hbn':''}${pick?' hpk':''}`;
      el.onclick=u?null:()=>selHero(hero);
    });
  }
  
  
  function renderRChips(){
    const div=document.getElementById('rchips');div.innerHTML='';
    ['all',...ROLES].forEach(r=>{
      const el=document.createElement('div');el.className=`chip${r===rfilt?' active':''}`;el.textContent=r==='all'?'All':r;
      el.onclick=()=>{rfilt=r;document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));el.classList.add('active');renderHGrid();};
      div.appendChild(el);
    });
  }
  
  // ═══════════════════════════════════════════════════
  //  RENDER: SEQUENCE — all steps have Edit button
  // ═══════════════════════════════════════════════════
  function renderSeqList(){
    const list=document.getElementById('seqList');list.innerHTML='';
    const steps=S.steps.length?S.steps:buildSteps(S.format);
    let curPhase = -1;
    steps.forEach((step,i)=>{
      if(step.phase !== curPhase) {
        curPhase = step.phase;
        const ph = document.createElement('div');
        ph.innerHTML = `<div style="font-size:12px;font-weight:800;color:var(--text3);margin:8px 0 2px 0;">PHASE ${curPhase}</div>`;
        list.appendChild(ph);
      }
      let ah='';
      if(step.action==='ban'){
        const ss=steps.slice(0,i+1).filter(st=>st.action==='ban'&&st.side===step.side);
        const bi=ss.length-1;
        const src=step.side==='blue'?S.blueBans:S.redBans;
        if(src[bi])ah=src[bi]?src[bi].name:'';
      } else {
        const ss=steps.slice(0,i+1).filter(st=>st.action==='pick'&&st.side===step.side);
        const pi=ss.length-1;
        const src=step.side==='blue'?S.bluePicks:S.redPicks;
        if(src[pi])ah=src[pi]?src[pi].name:'';
      }
      const done=i<S.currentStep;
      const cur=i===S.currentStep&&(S.status==='running'||S.status==='paused');
      const row=document.createElement('div');
      row.className=`seq-row${done?' seq-done':''}${cur?' seq-cur':''}`;
      const sc=step.side==='blue'?'#1565C0':'#C62828';
      // ALL steps (including done ones) get an Edit button for error correction
      row.innerHTML=`<span class="sn">${i+1}</span><span class="sbg sb${step.action}">${step.action.toUpperCase()}</span><span style="font-weight:700;font-size:12px;color:${sc};">${step.side==='blue'?'Blue':'Red'}</span><span style="font-size:11px;color:var(--text2);">${ah||'<span style="color:var(--text3);">—</span>'}</span>${done?'<i class="bx bx-check" style="color:var(--green)"></i>':'<span></span>'}<button class="btn ${done?'bgo':'bg2'} bxs" onclick="openModify(${i})" style="white-space:nowrap;padding:2px 4px;font-size:10px;"><i class='bx bx-pencil'></i> ${done?'Edit':'Modify'}</button>`;
      list.appendChild(row);
    });
  }
  
  // ═══════════════════════════════════════════════════
  //  RENDER: HORIZONTAL DRAFTBOARD
  // ═══════════════════════════════════════════════════
  function renderHDraft(){ console.log('Starting renderHDraft');
      const bc=S.format==='5ban'?5:(S.format==='4ban'?4:3);
      const mkItems=(id,items,total,type)=>{
          const d=document.getElementById(id);if(!d)return;d.innerHTML='';
          const side = id.includes('B') ? 'blue' : 'red';
          for(let i=0;i<total;i++){
            const h=items[i];
            const el=document.createElement('div');
            el.className=`hd-slot hd-${type}`;
            
            if(type==='pick') {
                const pName = S.players?.[side]?.[i] || '';
                let pRole = S.roles?.[side]?.[i] || i;
                const roleMap = {'EXP Lane':0, 'Jungle':1, 'Mid Lane':2, 'Gold Lane':3, 'Roam':4};
                if(typeof pRole === 'string' && roleMap[pRole] !== undefined) pRole = roleMap[pRole];
                
                const roleIcons = ['assets/imgs/black_exp.png', 'assets/imgs/black_core.png', 'assets/imgs/black_mid.png', 'assets/imgs/black_gold.png', 'assets/imgs/black_roam.png'];
                const rIcon = roleIcons[pRole] || roleIcons[i];
                
                if(h && (h.portrait||h.img)) {
                    el.innerHTML = `<img src="${h.portrait||h.img}" class="pick-img" onerror="this.style.display='none'">`;
                    if(pName) el.innerHTML += `<div class="player-name" style="color:white; text-shadow:0 1px 2px black;">${pName}</div>`;
                    else el.innerHTML += `<div class="bottom-dash" style="background:white; box-shadow:0 1px 2px black;"></div>`;
                } else {
                    if (h === null) {
                        el.innerHTML = `<div style="width:100%; height:100%; background:#d32f2f; display:flex; align-items:center; justify-content:center; color:white; font-size:24px; font-weight:bold;">X</div>`;
                    } else {
                        el.innerHTML = `<img src="${rIcon}" class="role-icon">`;
                        if(pName) el.innerHTML += `<div class="player-name">${pName}</div>`;
                        else el.innerHTML += `<div class="bottom-dash"></div>`;
                    }
                }
            } else {
                if(h && (h.icon||h.img||h.portrait)) {
                    el.innerHTML = `<img src="${h.icon||h.img||h.portrait}" onerror="this.style.display='none'">`;
                } else {
                    if (h === null) {
                        el.innerHTML = `<div style="width:100%; height:100%; background:#d32f2f; display:flex; align-items:center; justify-content:center; color:white; font-size:18px; font-weight:bold;">X</div>`;
                    } else {
                        el.classList.add('empty-ban');
                    }
                }
            }
            
            if(S.status==='running' && S.currentStep<S.steps.length) {
              const step=S.steps[S.currentStep];
              if(step.side+step.action.toUpperCase()===id.replace('hd','') && i===items.length) el.classList.add('active');
            }
            d.appendChild(el);
          }
        };
        mkItems('hdBB',S.blueBans,bc,'ban');mkItems('hdBP',S.bluePicks,S.numPlayers,'pick');
        mkItems('hdRB',S.redBans,bc,'ban');mkItems('hdRP',S.redPicks,S.numPlayers,'pick');
        
        // Update Teams Data
        const updateTeamUI = (side) => {
            const team = S.teams?.[side] || {};
            const isB = side === 'blue';
            
            const logoEl = document.getElementById(isB ? 'blueTeamLogo' : 'redTeamLogo');
            if(logoEl) logoEl.src = team.logo && team.logo.includes('/') ? team.logo : (team.logo ? `assets/teams/${team.logo}` : 'assets/imgs/placeholder.png');
            
            const tagText = document.getElementById(isB ? 'blueTeamTag' : 'redTeamTag');
            if(tagText) tagText.textContent = team.tag || '';
        };
        updateTeamUI('blue');
        updateTeamUI('red');
  }
  
  // ═══════════════════════════════════════════════════
  //  RENDER: HISTORY
  // ═══════════════════════════════════════════════════
  function logH(msg,snap=null){
    const t=new Date().toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});
    S.history.push({msg,snap,time:t});if(S.history.length>60)S.history.shift();
  }
  function renderHist(){
    const list=document.getElementById('hlog');list.innerHTML='';
    if(!S.history || S.history.length===0){
      list.innerHTML=`<div style="padding:10px;text-align:center;color:var(--text3);font-size:12px;">No actions recorded yet.</div>`;
      return;
    }
    [...S.history].reverse().slice(0,22).forEach(e=>{
      const d=document.createElement('div');d.className='hli';
      d.innerHTML=`<span>${e.msg}</span><span class="hlt">${e.time}</span>`;list.appendChild(d);
    });
  }
  
  // ═══════════════════════════════════════════════════
  //  RENDER: TIMER + STATUS
  // ═══════════════════════════════════════════════════
  function rTimerUI(){
      const t = document.getElementById('liveDraftTimer');
      if(t) {
          if(S.status==='idle' || S.status==='complete') {
              t.textContent = '--';
              t.style.color = 'white';
          } else {
              t.textContent = String(S.timer.remaining).padStart(2, '0');
              if(S.timer.remaining <= 10 && (S.status==='running'||S.status==='last_change')) {
                  t.style.color = '#ffb3b3';
              } else {
                  t.style.color = 'white';
              }
          }
      }
    }
  function rStatusUI(){
      const bStart = document.getElementById('btnStart'); if(bStart) bStart.disabled=S.status!=='idle';
      const bPause = document.getElementById('btnPause'); if(bPause) bPause.disabled=S.status!=='running';
      const bResume = document.getElementById('btnResume'); if(bResume) bResume.disabled=S.status!=='paused';
      const bSkip = document.getElementById('btnSkip'); if(bSkip) bSkip.disabled=S.status!=='running'&&S.status!=='paused';
      const bUndo = document.getElementById('btnUndo'); if(bUndo) bUndo.disabled=!S.history.some(h=>h.snap);
  
      const blStart = document.getElementById('btnLiveStart'); if(blStart) blStart.disabled=S.status!=='idle';
      const blToggle = document.getElementById('btnLiveTogglePause'); 
      if(blToggle) {
          blToggle.disabled = (S.status!=='running' && S.status!=='paused');
          if(S.status==='paused') {
              blToggle.innerHTML = "<i class=\'bx bx-play\' style=\'font-size:24px;\'></i>";
              blToggle.title = 'Resume';
              blToggle.className = 'btn bp';
          } else {
              blToggle.innerHTML = "<i class=\'bx bx-pause\' style=\'font-size:24px;\'></i>";
              blToggle.title = 'Pause';
              blToggle.className = 'btn bw';
          }
      }
      const blSkip = document.getElementById('btnLiveSkip'); if(blSkip) blSkip.disabled=S.status!=='running'&&S.status!=='paused';
      const blUndo = document.getElementById('btnLiveUndo'); if(blUndo) blUndo.disabled=!S.history.some(h=>h.snap);
      
      const ph = document.getElementById('liveDraftPhase');
      const tn = document.getElementById('liveDraftTurn');
      if(ph && tn) {
          if(S.status==='idle') {
              ph.textContent = 'STANDBY';
              tn.textContent = 'Waiting for match start';
              ph.parentElement.style.background = '#64748b';
          } else if(S.status==='complete') {
              ph.textContent = 'FINISHED';
              tn.textContent = 'Draft complete';
              ph.parentElement.style.background = '#10b981';
          } else if(S.status==='paused') {
              ph.textContent = 'PAUSED';
              tn.textContent = 'Draft is paused';
              ph.parentElement.style.background = '#f59e0b';
          } else if(S.status==='last_change') {
              ph.textContent = 'LAST CHANGE';
              tn.textContent = 'Final roster adjustments';
              ph.parentElement.style.background = '#8b5cf6';
          } else {
              const step = S.steps[S.currentStep];
              if(step) {
                  ph.textContent = `PHASE ${step.phase} - ${step.action.toUpperCase()}`;
                  const team = step.side==='blue' ? S.teams?.blue?.name || 'Blue Team' : S.teams?.red?.name || 'Red Team';
                  const action = step.action==='ban' ? 'banning' : 'picking';
                  tn.textContent = `${team} is ${action}...`;
                  ph.parentElement.style.background = step.side==='blue' ? 'var(--blue-team)' : 'var(--red-team)';
              }
          }
      }
      updateSetupStartButton();
  }
  
  // ═══════════════════════════════════════════════════
  //  RENDER: FULL UI
  // ═══════════════════════════════════════════════════
  const ROLE_ICONS = {
    'EXP Lane':'assets/imgs/exp.png',
    'Jungle':'assets/imgs/jungler.png',
    'Mid Lane':'assets/imgs/mid.png',
    'Gold Lane':'assets/imgs/gold.png',
    'Roam':'assets/imgs/Roamer.png',
    'Fighter':'assets/imgs/exp.png',
    'Assassin':'assets/imgs/jungler.png',
    'Mage':'assets/imgs/mid.png',
    'Marksman':'assets/imgs/gold.png',
    'Tank':'assets/imgs/Roamer.png',
    'Support':'assets/imgs/Roamer.png'
  };
  
  let currentHUDEvent = '';
  let currentHUDIsObj = false;
  
  function openEventPlayerModal(eventName, isObjective) {
    currentHUDEvent = eventName;
    currentHUDIsObj = isObjective;
    document.getElementById('epmTitle').textContent = `Select Target for ${eventName}`;
    
    const bCont = document.getElementById('epmBluePlayers');
    const rCont = document.getElementById('epmRedPlayers');
    bCont.innerHTML = '';
    rCont.innerHTML = '';
    
    if (eventName === 'ACE') {
      const bTeam = S.teams?.blue?.name || 'Blue Team';
      const bLogo = S.teams?.blue?.logo || 'assets/imgs/placeholder.png';
      bCont.appendChild(createTeamCard('blue', bTeam, bLogo));
  
      const rTeam = S.teams?.red?.name || 'Red Team';
      const rLogo = S.teams?.red?.logo || 'assets/imgs/placeholder.png';
      rCont.appendChild(createTeamCard('red', rTeam, rLogo));
    } else {
      for(let i=0; i<5; i++) {
        const bHero = S.bluePicks?.[i] || {};
        const bPlayer = S.players?.blue?.[i] || `Player ${i+1}`;
        const bRole = S.roles?.blue?.[i] || LANES[i] || 'Jungle';
        bCont.appendChild(createEpmBtn('blue', i, bPlayer, bRole, bHero));
        
        const rHero = S.redPicks?.[i] || {};
        const rPlayer = S.players?.red?.[i] || `Player ${i+1}`;
        const rRole = S.roles?.red?.[i] || LANES[i] || 'Jungle';
        rCont.appendChild(createEpmBtn('red', i, rPlayer, rRole, rHero));
      }
    }
    document.getElementById('eventPlayerModal').classList.add('show');
  }
  
  function createTeamCard(side, teamName, teamLogo) {
    const btn = document.createElement('div');
    btn.className = `epm-card ${side}`;
    let imgUrl = 'assets/imgs/placeholder.png';
    if (teamLogo) {
      imgUrl = teamLogo.includes('/') ? teamLogo : `assets/teams/${teamLogo}`;
    }
    btn.innerHTML = `
      <img src="${imgUrl}" class="epm-portrait" style="border-radius:8px; border:none;" onerror="this.src='assets/imgs/placeholder.png'">
      <div class="epm-info">
        <div class="epm-ign">${teamName}</div>
        <div class="epm-hero">Team</div>
      </div>
    `;
    btn.onclick = () => { triggerHUDEvent(side, -1, teamName, '', {icon: imgUrl, name: 'Team Wipe'}); closeEventPlayerModal(); };
    return btn;
  }
  
  function createEpmBtn(side, idx, player, role, hero) {
    const btn = document.createElement('div');
    btn.className = `epm-card ${side}`;
    
    let pImg = hero.icon || hero.portrait || hero.img || 'assets/imgs/placeholder.png';
    let rImg = ROLE_ICONS[role] || '';
    if(!rImg && role) {
       const base = role.split(' ')[0];
       rImg = ROLE_ICONS[base] || '';
    }
  
    btn.innerHTML = `
      <img src="${pImg}" class="epm-portrait" onerror="this.src='assets/imgs/placeholder.png'">
      <div class="epm-info">
        <div class="epm-ign">${player}</div>
        <div class="epm-hero">${hero.name || 'No Pick'}</div>
      </div>
      <img src="${rImg}" class="epm-role" onerror="this.style.display='none'">
    `;
    btn.onclick = () => { triggerHUDEvent(side, idx, player, role, hero); closeEventPlayerModal(); };
    return btn;
  }
  
  function closeEventPlayerModal() {
    document.getElementById('eventPlayerModal').classList.remove('show');
  }
  
  let hudHideTimeout = null;
  
  function triggerHUDEvent(side, idx, player, role, hero) {
    if(!S.hud) S.hud={visible:false,lowerThird:{}};
    const tName = side==='blue' ? S.teams?.blue?.name : S.teams?.red?.name;
    
    S.hud.lowerThird = {
      visible: true,
      eventType: currentHUDEvent,
      side: side,
      ign: player,
      role: role,
      portrait: hero.icon || hero.portrait || hero.img || '',
      teamName: tName || '',
      isObjective: currentHUDIsObj,
      triggerTime: Date.now()
    };
    pub();
    
    if(hudHideTimeout) clearTimeout(hudHideTimeout);
    hudHideTimeout = setTimeout(() => {
      hideLowerThird();
    }, 4000);
  }
  
  function hideLowerThird(){
    if(!S.hud) S.hud={visible:false,lowerThird:{}};
    S.hud.lowerThird.visible=false;
    pub();
  }
  
  function renderHUDPreview(){
    // Deprecated
  }
  
  function renderUI(){ console.log('Starting renderUI');
    rTimerUI();rStatusUI();renderHGrid();renderHDraft();renderRoster();renderStreamTimerUI();
    updateHUDBtns();updatePlayerPopupBtn();
  }
  
  // ═══════════════════════════════════════════════════
  //  PLAYER INPUTS
  // ═══════════════════════════════════════════════════
  function rebuildPInputs(){
    const n=S.numPlayers;
    ['blue','red'].forEach(side=>{
      const div=document.getElementById(side==='blue'?'bPInputs':'rPInputs'); if(div) div.innerHTML='';
      for(let i=0;i<n;i++){
        const row=document.createElement('div');row.className='player-row';
        const nm=(side==='blue'?S.players.blue:S.players.red)[i]||'';
        const rl=(side==='blue'?S.roles.blue:S.roles.red)[i]||LANES[i];
        row.innerHTML=`<span class="pn">${i+1}</span>
          <input type="text" placeholder="IGN ${i+1}" value="${nm}" oninput="S.basePlayers.${side}[${i}]=this.value; S.players.${side}[${i}]=this.value; pub();">
          <select onchange="S.baseRoles.${side}[${i}]=this.value; S.roles.${side}[${i}]=this.value; pub();">${LANES.map(l=>`<option${l===rl?' selected':''}>${l}</option>`).join('')}</select>`;
        div.appendChild(row);
      }
    });
  }
  
  // ═══════════════════════════════════════════════════
  //  ACTION MODAL
  // ═══════════════════════════════════════════════════
  function openAct(title,sub,hero,cb,btnCls='bp',btnLabel='Confirm'){
    document.getElementById('amTitle').textContent=title;
    document.getElementById('amSub').textContent=sub;
    const badge=document.getElementById('amBadge');
    if(hero){
      badge.style.display='flex';
      document.getElementById('amName').textContent=hero.name;
      document.getElementById('amRole').textContent=`${RI[hero.role]||'⚔'} ${hero.role}`;
      const imgEl=document.getElementById('amImg');
      imgEl.innerHTML=(hero.portrait||hero.img)?`<img src="${hero.portrait||hero.img}" style="width:38px;height:38px;border-radius:6px;object-fit:cover;" onerror="this.style.display='none'">`:`<div style="width:38px;height:38px;border-radius:6px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:20px;">${RI[hero.role]||'⚔'}</div>`;
    } else { badge.style.display='none'; }
    const ok=document.getElementById('amOk');ok.className=`btn ${btnCls}`;ok.textContent=btnLabel;
    actCb=cb;document.getElementById('actModal').classList.add('show');
  }
  function cAct(){document.getElementById('actModal').classList.remove('show');actCb=null;}
  function doAct(){const cb=actCb; cAct(); if(cb)cb();}
  
  // ═══════════════════════════════════════════════════
  //  TABS
  // ═══════════════════════════════════════════════════
  function sw(id,el){
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
    const t=el||document.querySelector(`[data-tab="${id}"]`);if(t)t.classList.add('active');
    const p=document.getElementById(`tab-${id}`);if(p)p.classList.add('active');
    if(id==='records')renderMatchRecords();
    if(id==='live')renderHGrid();
    if(id==='heroes')renderRoster();
    if(id==='sequence')renderSeqList();
    if(id==='roster')renderRoster();
    if(id==='stats')renderStatsGrid();
    if(id==='broadcast'){updateHUDBtns();renderHUDPreview();renderStreamTimerUI();}
    if(id==='settings')renderSettings();
  }
  
  // ═══════════════════════════════════════════════════
  //  MATCH RECORDS MANAGEMENT
  // ═══════════════════════════════════════════════════
  function loadMatchRecords() {
    try {
      const raw = localStorage.getItem('mplMatchRecords_v1');
      return raw ? JSON.parse(raw) : [];
    } catch(e) {
      return [];
    }
  }
  
  function saveMatchRecordsArray(arr) {
    try {
      localStorage.setItem('mplMatchRecords_v1', JSON.stringify(arr));
    } catch(e) {}
  }
  
  function saveMatchRecord() {
    const records = loadMatchRecords();
    
    const record = {
      id: 'match_' + Date.now(),
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      tournament: S.meta?.tournament || 'MPL Season',
      match: S.meta?.match || 'Match',
      game: S.meta?.game || 1,
      bo: S.meta?.bo || 'BO3',
      format: S.format || '3ban',
      status: S.status,
      blue: {
        name: S.teams?.blue?.name || 'Blue Team',
        tag: S.teams?.blue?.tag || 'BLUE',
        logo: S.teams?.blue?.logo || '',
        wins: S.meta?.blueWins || 0,
        bans: JSON.parse(JSON.stringify(S.blueBans || [])),
        picks: JSON.parse(JSON.stringify(S.bluePicks || [])),
        players: JSON.parse(JSON.stringify(S.players?.blue || [])),
        roles: JSON.parse(JSON.stringify(S.roles?.blue || [])),
        playerImages: JSON.parse(JSON.stringify(S.playerImages?.blue || []))
      },
      red: {
        name: S.teams?.red?.name || 'Red Team',
        tag: S.teams?.red?.tag || 'RED',
        logo: S.teams?.red?.logo || '',
        wins: S.meta?.redWins || 0,
        bans: JSON.parse(JSON.stringify(S.redBans || [])),
        picks: JSON.parse(JSON.stringify(S.redPicks || [])),
        players: JSON.parse(JSON.stringify(S.players?.red || [])),
        roles: JSON.parse(JSON.stringify(S.roles?.red || [])),
        playerImages: JSON.parse(JSON.stringify(S.playerImages?.red || []))
      }
    };
  
    records.unshift(record);
    saveMatchRecordsArray(records);
    toast('Match record saved!', 'success');
    logH('💾 Match Record Saved');
    renderMatchRecords();
  }
  
  function renderMatchRecords() {
    const container = document.getElementById('tab-records');
    if (!container) return;
  
    const records = loadMatchRecords();
  
    if (records.length === 0) {
      container.innerHTML = `
        <div style="padding:40px; text-align:center; color:var(--text3);">
          <i class='bx bx-folder-open' style="font-size:48px; opacity:0.4; margin-bottom:10px;"></i>
          <div style="font-size:16px; font-weight:700; color:var(--text2);">No Match Records Found</div>
          <div style="font-size:12px; margin-top:5px;">Click <b>💾 Save Match</b> under Draft Controls to save the current match state.</div>
        </div>
      `;
      return;
    }
  
    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
        <div>
          <h3 style="margin:0; font-size:16px; font-weight:700;">Recorded Matches (${records.length})</h3>
          <div style="font-size:11px; color:var(--text3);">View, export, or manage saved match draft records</div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn bp bsm" onclick="exportAllMatchRecords()"><i class='bx bx-download'></i> Export All (JSON)</button>
          <button class="btn bd bsm" onclick="clearAllMatchRecords()"><i class='bx bx-trash'></i> Clear All</button>
        </div>
      </div>
      <div style="display:flex; flex-direction:column; gap:15px;">
    `;
  
    records.forEach(rec => {
      const bName = rec.blue.name || rec.blue.tag || 'Blue Team';
      const rName = rec.red.name || rec.red.tag || 'Red Team';
      const bLogo = rec.blue.logo ? `<img src="${rec.blue.logo}" style="width:24px;height:24px;object-fit:contain;">` : '';
      const rLogo = rec.red.logo ? `<img src="${rec.red.logo}" style="width:24px;height:24px;object-fit:contain;">` : '';
  
      html += `
        <div style="background:var(--panel); border:1px solid var(--border); border-radius:var(--rs); padding:14px; position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:8px; margin-bottom:10px;">
            <div>
              <span style="font-weight:700; color:var(--blue); font-size:13px;">${rec.tournament}</span> · 
              <span style="font-size:12px; color:var(--text2);">${rec.match} (${rec.bo} - Game ${rec.game})</span>
              <span style="font-size:10px; background:var(--panel2); padding:2px 6px; border-radius:4px; margin-left:6px; border:1px solid var(--border);">${rec.format.toUpperCase()}</span>
            </div>
            <div style="font-size:11px; color:var(--text3); display:flex; align-items:center; gap:8px;">
              <span><i class='bx bx-time'></i> ${rec.timestamp}</span>
              <button class="btn bg2 bsm" onclick="copySingleRecord('${rec.id}')" title="Copy Record JSON"><i class='bx bx-copy'></i></button>
              <button class="btn bd bsm" onclick="deleteSingleRecord('${rec.id}')" title="Delete Record"><i class='bx bx-trash'></i></button>
            </div>
          </div>
  
          <!-- TEAM SCORE HEADER -->
          <div style="display:grid; grid-template-columns:1fr auto 1fr; gap:15px; align-items:center; margin-bottom:12px; background:var(--panel2); padding:10px 15px; border-radius:var(--rs);">
            <!-- Blue Team -->
            <div style="display:flex; align-items:center; gap:10px;">
              ${bLogo}
              <div>
                <div style="font-weight:700; color:var(--blue); font-size:14px;">${bName}</div>
                <div style="font-size:10px; color:var(--text3);">${rec.blue.tag || ''}</div>
              </div>
            </div>
            <!-- Score -->
            <div style="font-size:18px; font-weight:900; letter-spacing:2px; text-align:center;">
              <span style="color:var(--blue);">${rec.blue.wins}</span> : <span style="color:var(--red);">${rec.red.wins}</span>
            </div>
            <!-- Red Team -->
            <div style="display:flex; align-items:center; justify-content:flex-end; gap:10px; text-align:right;">
              <div>
                <div style="font-weight:700; color:var(--red); font-size:14px;">${rName}</div>
                <div style="font-size:10px; color:var(--text3);">${rec.red.tag || ''}</div>
              </div>
              ${rLogo}
            </div>
          </div>
  
          <!-- BANS SUMMARY -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin-bottom:12px;">
            <div>
              <div style="font-size:10px; font-weight:700; color:var(--text3); margin-bottom:4px;">BLUE BANS</div>
              <div style="display:flex; gap:5px; flex-wrap:wrap;">
                ${rec.blue.bans.map(h => `
                  <div style="display:flex; align-items:center; gap:4px; background:var(--panel2); border:1px solid var(--border); padding:2px 6px; border-radius:4px; font-size:11px;">
                    ${h.icon ? `<img src="${h.icon}" style="width:16px;height:16px;object-fit:cover;border-radius:2px;filter:grayscale(100%);">` : ''}
                    <span>${h.name}</span>
                  </div>
                `).join('') || '<span style="font-size:11px;color:var(--text3);">None</span>'}
              </div>
            </div>
            <div>
              <div style="font-size:10px; font-weight:700; color:var(--text3); margin-bottom:4px;">RED BANS</div>
              <div style="display:flex; gap:5px; flex-wrap:wrap;">
                ${rec.red.bans.map(h => `
                  <div style="display:flex; align-items:center; gap:4px; background:var(--panel2); border:1px solid var(--border); padding:2px 6px; border-radius:4px; font-size:11px;">
                    ${h.icon ? `<img src="${h.icon}" style="width:16px;height:16px;object-fit:cover;border-radius:2px;filter:grayscale(100%);">` : ''}
                    <span>${h.name}</span>
                  </div>
                `).join('') || '<span style="font-size:11px;color:var(--text3);">None</span>'}
              </div>
            </div>
          </div>
  
          <!-- PICKS AND ROSTER -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
            <!-- Blue Picks -->
            <div>
              <div style="font-size:10px; font-weight:700; color:var(--blue); margin-bottom:4px;">BLUE ROSTER & PICKS</div>
              <div style="display:flex; flex-direction:column; gap:4px;">
                ${rec.blue.players.map((p, i) => {
                  const r = rec.blue.roles[i] || '';
                  const h = rec.blue.picks[i];
                  return `
                    <div style="display:flex; align-items:center; justify-content:space-between; background:var(--panel2); border:1px solid var(--border); padding:4px 8px; border-radius:4px; font-size:11px;">
                      <div>
                        <span style="font-weight:700;">${p || 'Player '+(i+1)}</span>
                        <span style="font-size:9px; color:var(--text3); margin-left:4px;">(${r})</span>
                      </div>
                      ${h ? `
                        <div style="display:flex; align-items:center; gap:5px;">
                          ${h.portrait || h.img ? `<img src="${h.portrait || h.img}" style="width:20px;height:20px;object-fit:cover;border-radius:2px;">` : ''}
                          <span style="font-weight:700; color:var(--gold-accent);">${h.name}</span>
                        </div>
                      ` : '<span style="color:var(--text3);">No Pick</span>'}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
  
            <!-- Red Picks -->
            <div>
              <div style="font-size:10px; font-weight:700; color:var(--red); margin-bottom:4px;">RED ROSTER & PICKS</div>
              <div style="display:flex; flex-direction:column; gap:4px;">
                ${rec.red.players.map((p, i) => {
                  const r = rec.red.roles[i] || '';
                  const h = rec.red.picks[i];
                  return `
                    <div style="display:flex; align-items:center; justify-content:space-between; background:var(--panel2); border:1px solid var(--border); padding:4px 8px; border-radius:4px; font-size:11px;">
                      <div>
                        <span style="font-weight:700;">${p || 'Player '+(i+1)}</span>
                        <span style="font-size:9px; color:var(--text3); margin-left:4px;">(${r})</span>
                      </div>
                      ${h ? `
                        <div style="display:flex; align-items:center; gap:5px;">
                          ${h.portrait || h.img ? `<img src="${h.portrait || h.img}" style="width:20px;height:20px;object-fit:cover;border-radius:2px;">` : ''}
                          <span style="font-weight:700; color:var(--gold-accent);">${h.name}</span>
                        </div>
                      ` : '<span style="color:var(--text3);">No Pick</span>'}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
  
        </div>
      `;
    });
  
    html += `</div>`;
    container.innerHTML = html;
  }
  
  function exportAllMatchRecords() {
    const records = loadMatchRecords();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `mpl_match_records_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    toast('Exported match records JSON', 'success');
  }
  
  function clearAllMatchRecords() {
    if (confirm('Are you sure you want to delete ALL saved match records?')) {
      saveMatchRecordsArray([]);
      renderMatchRecords();
      toast('All match records cleared', 'info');
    }
  }
  
  function deleteSingleRecord(id) {
    let records = loadMatchRecords();
    records = records.filter(r => r.id !== id);
    saveMatchRecordsArray(records);
    renderMatchRecords();
    toast('Match record deleted', 'info');
  }
  
  function copySingleRecord(id) {
    const records = loadMatchRecords();
    const rec = records.find(r => r.id === id);
    if (rec) {
      navigator.clipboard.writeText(JSON.stringify(rec, null, 2)).then(() => {
        toast('Copied match JSON to clipboard', 'success');
      });
    }
  }
  
  // ═══════════════════════════════════════════════════
  //  TOAST
  // ═══════════════════════════════════════════════════
  function toast(msg,type='info'){
    const w=document.getElementById('tw');
    const el=document.createElement('div');el.className=`toast t${type[0]}`;el.textContent=msg;
    w.appendChild(el);setTimeout(()=>el.remove(),3200);
  }
  
  // ═══════════════════════════════════════════════════
  //  HUD CONTROLS
  // ═══════════════════════════════════════════════════
  function toggleHUD(){
    if(!S.hud) S.hud={visible:false,lowerThird:{visible:false,text:'',subtext:''}};
    S.hud.visible=!S.hud.visible;
    updateHUDBtns();toast('HUD '+(S.hud.visible?'visible':'hidden'),S.hud.visible?'success':'info');pub();
  }
  
  function ensureStreamTimer(){
    if(!S.streamTimer) S.streamTimer={remaining:0,max:0,running:false};
    return S.streamTimer;
  }
  
  function formatStreamTimer(seconds){
    const total=Math.max(0,Math.floor(seconds||0));
    return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
  }
  
  function renderStreamTimerUI(){
    const timer=ensureStreamTimer();
    const display=document.getElementById('streamTimerDisplay');
    if(display) display.textContent=formatStreamTimer(timer.remaining);
  }
  
  function setStreamTimer(minutes){
    const value=Math.max(1,Math.floor(Number(minutes)||1));
    const timer=ensureStreamTimer();
    timer.remaining=value*60;
    timer.max=timer.remaining;
    timer.running=false;
    renderStreamTimerUI();
    pub();
  }
  
  function setStreamTimerFromInput(){
    setStreamTimer(document.getElementById('streamTimerCustom')?.value);
  }
  
  function startStreamTimer(){
    const timer=ensureStreamTimer();
    if(timer.remaining<=0) setStreamTimerFromInput();
    ensureStreamTimer().running=true;
    pub();
  }
  
  function pauseStreamTimer(){
    ensureStreamTimer().running=false;
    pub();
  }
  
  function resetStreamTimer(){
    const timer=ensureStreamTimer();
    timer.remaining=timer.max;
    timer.running=false;
    renderStreamTimerUI();
    pub();
  }
  
  function updateHUDBtns(){
    const v=S.hud?.visible;
    const icon=v?"<i class='bx bx-show'></i>":"<i class='bx bx-hide'></i>";
    const label=v?'HUD: VISIBLE':'HUD: HIDDEN';
    ['btnToggleHUD','btnHUDVisibleMain'].forEach(id=>{
      const btn=document.getElementById(id);
      if(!btn)return;
      btn.innerHTML=icon+' '+label;
      btn.className=`btn ${v?'bs':'bg2'} ${id==='btnToggleHUD'?'bsm bf':'bf'}`;
    });
  }
  
  function showLowerThird(){
    if(!S.hud) S.hud={visible:false,lowerThird:{visible:false,text:'',subtext:''}};
    if(!S.hud.lowerThird) S.hud.lowerThird={};
    const txt=document.getElementById('hudLtText');
    const sub=document.getElementById('hudLtSub');
    S.hud.lowerThird.text=txt?txt.value:'';
    S.hud.lowerThird.subtext=sub?sub.value:'';
    S.hud.lowerThird.visible=true;
    toast('Lower third shown','success');pub();
  }
  
  function hideLowerThird(){
    if(!S.hud) S.hud={visible:false,lowerThird:{visible:false,text:'',subtext:''}};
    if(!S.hud.lowerThird) S.hud.lowerThird={};
    S.hud.lowerThird.visible=false;
    toast('Lower third hidden','info');pub();
  }
  
  function ltPreset(text,subtext){
    const txt=document.getElementById('hudLtText');
    const sub=document.getElementById('hudLtSub');
    if(txt)txt.value=text;
    if(sub)sub.value=subtext;
    showLowerThird();
  }
  
  function renderHUDPreview(){
    const LANES2=['EXP Lane','Jungle','Mid Lane','Gold Lane','Roam'];
    const RI2={Fighter:'⚔',Mage:'🔮',Assassin:'🗡',Marksman:'🏹',Tank:'🛡',Support:'💚'};
    ['blue','red'].forEach(side=>{
      const div=document.getElementById('hudPreview'+side.charAt(0).toUpperCase()+side.slice(1));
      if(!div)return;
      div.innerHTML='';
      const picks=side==='blue'?S.bluePicks:S.redPicks;
      const players=side==='blue'?S.players.blue:S.players.red;
      const roles=side==='blue'?S.roles.blue:S.roles.red;
      for(let i=0;i<S.numPlayers;i++){
        const h=picks[i];const p=players[i]||`P${i+1}`;const r=roles[i]||LANES2[i];
        const row=document.createElement('div');
        row.style.cssText='display:flex;align-items:center;gap:6px;padding:4px 6px;background:var(--panel);border:1px solid var(--border);border-radius:3px;font-size:11px;';
        row.innerHTML=`<span style="width:20px;height:20px;border-radius:3px;overflow:hidden;background:var(--bg);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;">${h?((h.portrait||h.img)?`<img src="${h.portrait||h.img}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.textContent='${RI2[h.role]||'⚔'}'">`:RI2[h.role]||'⚔'):''}</span><span style="font-weight:700;flex:1;color:var(--text);">${p}</span><span style="color:var(--text3);">${h?h.name:'—'}</span>`;
        div.appendChild(row);
      }
    });
  }
  
  // ═══════════════════════════════════════════════════
  //  INIT
  // ═══════════════════════════════════════════════════
  function init(){ console.log('Starting init');
  
      try {
          let r = localStorage.getItem('mplState');
          if (r && r.length > 1000000) { // Over 1MB is 100% a memory leak crash
              localStorage.removeItem('mplState');
              console.log("Nuked massive memory leak state to unfreeze browser.");
              console.warn("Draft state corrupted and wiped.");
          }
      } catch(e) {}
  
    load();
    
    if(document.getElementById('mTotalMatches')) document.getElementById('mTotalMatches').value = S.meta.totalMatches || 0;
    if(document.getElementById('mStatsEnabled')) document.getElementById('mStatsEnabled').checked = S.meta.statsEnabled !== false;
    if(document.getElementById('bWins')) document.getElementById('bWins').value=S.meta.blueWins||0;
    if(document.getElementById('rWins')) document.getElementById('rWins').value=S.meta.redWins||0;
    if(document.getElementById('mTour')) document.getElementById('mTour').value=S.meta.tournament||'MPL Season 15';
    if(document.getElementById('mMatch')) document.getElementById('mMatch').value=S.meta.match||'Upper Bracket Finals';
    if(document.getElementById('mGame')) document.getElementById('mGame').value=S.meta.game||1;
    syncSegUI();
    if(S.meta.playerPopupEnabled===undefined) S.meta.playerPopupEnabled=S.settings.broadcast.playerPopups;
    if(S.meta.statsEnabled===undefined) S.meta.statsEnabled=S.settings.broadcast.heroStats;
    updateGameOptions();
    renderSettings();
    if(S.status==='running'){S.status='paused';toast('Draft was running — click Resume','info');}
    renderRChips();renderUI();pub();
    // Periodic timer broadcast
    setInterval(()=>{
      if(S.status==='running' || S.status==='last_change'){
        if(bc)bc.postMessage({t:'TICK',remaining:S.timer.remaining,max:S.timer.max});
      }
      rTimerUI();rStatusUI();
    },500);
    setInterval(()=>{
      const streamTimer=ensureStreamTimer();
      if(streamTimer.running){
        streamTimer.remaining=Math.max(0,streamTimer.remaining-1);
        if(streamTimer.remaining===0) streamTimer.running=false;
        saveQ();
      }
      renderStreamTimerUI();
    },1000);
  }
  
  init();
  
  // ==============================================
  // TEAM DATABASE LOGIC
  // ==============================================
  let mplTeamsDB = JSON.parse(localStorage.getItem('mplTeamsDB') || '[]');
  
  fetch('teams_db.php')
    .then(r => r.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        mplTeamsDB = data;
      }
      
      // Auto-fix ONIC Philippines if it was created with AP Bren players
      let __needsSave = false;
      mplTeamsDB.forEach(t => {
        if (t.name.toLowerCase().includes('onic')) {
          if (t.roster && t.roster.length === 5 && t.roster[0].name === 'Owgwen') {
            t.roster[0].name = 'Kelra'; t.roster[0].role = 'Gold Lane';
            t.roster[1].name = 'K1NGKONG'; t.roster[1].role = 'Jungle';
            t.roster[2].name = 'Super Frince'; t.roster[2].role = 'Mid Lane';
            t.roster[3].name = 'Escalera'; t.roster[3].role = 'EXP Lane';
            t.roster[4].name = 'Brusko'; t.roster[4].role = 'Roam';
            __needsSave = true;
          }
          // Also fix if it has Flap, Kyle, etc. in normal order
          else if (t.roster && t.roster.length === 5 && t.roster[0].name === 'Flap') {
            t.roster[0].name = 'Escalera'; t.roster[0].role = 'EXP Lane';
            t.roster[1].name = 'K1NGKONG'; t.roster[1].role = 'Jungle';
            t.roster[2].name = 'Super Frince'; t.roster[2].role = 'Mid Lane';
            t.roster[3].name = 'Kelra'; t.roster[3].role = 'Gold Lane';
            t.roster[4].name = 'Brusko'; t.roster[4].role = 'Roam';
            __needsSave = true;
          }
        }
      });
      if (__needsSave) {
        saveDB();
      } else {
        renderTeamDB();
        populateTeamSelects();
      }
    })
    .catch(() => {
      renderTeamDB();
      populateTeamSelects();
    });
  
  
  function saveDB() {
    localStorage.setItem('mplTeamsDB', JSON.stringify(mplTeamsDB));
    fetch('teams_db.php', { method: 'POST', body: JSON.stringify(mplTeamsDB) }).catch(()=>{});
    renderTeamDB();
    populateTeamSelects();
  }
  
  function renderTeamDB() { console.log('Starting renderTeamDB');
    const container = document.getElementById('teamDbList');
    if (!container) return;
    container.innerHTML = '';
    
    if (mplTeamsDB.length === 0) {
      container.innerHTML = `<div style="grid-column:1/-1; padding:20px; text-align:center; color:var(--text3); border:1px dashed var(--border); border-radius:var(--r);">No teams saved yet. Click 'Create New Team' to add one!</div>`;
      return;
    }
    
    mplTeamsDB.forEach((team, idx) => {
      container.innerHTML += `
        <div style="background:var(--panel); border:1px solid var(--border); border-radius:var(--r); padding:15px; display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
             <div style="display:flex; gap:10px; align-items:center;">
               <img src="${team.logo || ''}" onerror="this.style.display='none'" style="width:40px;height:40px;object-fit:contain;">
               <div>
                 <div style="font-weight:bold; font-size:16px;">${team.name}</div>
                 <div style="font-size:11px; color:var(--text2);">${team.tag}</div>
               </div>
             </div>
             <div>
               <button class="btn bgo bsm" onclick="editTeamDB(${idx})"><i class='bx bx-edit'></i></button>
               <button class="btn bd bsm" onclick="deleteTeamDB(${idx})"><i class='bx bx-trash'></i></button>
             </div>
          </div>
          <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:5px; margin-top:10px;">
            ${team.roster.map(p => `
               <div style="text-align:center; background:var(--bg); border-radius:var(--rs); padding:5px;">
                 <img src="${p.image || ''}" onerror="this.style.display='none'" style="width:100%; aspect-ratio:1; object-fit:cover; border-radius:4px; margin-bottom:5px;">
                 <div style="font-size:10px; font-weight:bold; overflow:hidden; text-overflow:ellipsis;">${p.name || '-'}</div>
               </div>
            `).join('')}
          </div>
        </div>
      `;
    });
  }
  
  function openTeamEditor() {
    document.getElementById('teId').value = '';
    document.getElementById('teName').value = '';
    document.getElementById('teTag').value = '';
    document.getElementById('teLogoPreview').src = '';
    document.getElementById('teLogoPreview').style.display = 'none';
    document.getElementById('teLogoPath').value = '';
    
    const rc = document.getElementById('teRosterContainer');
    rc.innerHTML = '';
    const roles = ['EXP Lane', 'Jungle', 'Mid Lane', 'Gold Lane', 'Roam'];
    
    for(let i=0; i<5; i++) {
      rc.innerHTML += `
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; background:var(--bg); padding:10px; border:1px solid var(--border); border-radius:var(--r); position:relative; cursor:pointer;" onclick="document.getElementById('tePlayerFile${i}').click()">
           <div style="font-size:9px; color:var(--text3); margin-bottom:5px; text-transform:uppercase;">${roles[i]}</div>
           
           <img id="tePlayerImgPreview${i}" src="" style="width:60px; height:60px; object-fit:cover; border-radius:4px; margin-bottom:10px; display:none;">
           <div id="tePlayerPlaceholder${i}" style="width:60px; height:60px; display:flex; align-items:center; justify-content:center; background:var(--panel); border-radius:4px; margin-bottom:10px; color:var(--text3); border:1px dashed var(--border);"><i class='bx bx-image-add' style="font-size:24px;"></i></div>
           
           <input type="text" id="tePlayerName${i}" placeholder="Player Name" autocomplete="off" style="text-align:center; width:100%; margin-top:auto;" onclick="event.stopPropagation()">
           <input type="hidden" id="tePlayerRole${i}" value="${roles[i]}">
           <input type="hidden" id="tePlayerImgPath${i}" value="">
           <input type="file" id="tePlayerFile${i}" style="display:none;" accept="image/*" onchange="uploadFile(this, 'player', 'tePlayerImgPreview${i}', 'tePlayerImgPath${i}'); document.getElementById('tePlayerPlaceholder${i}').style.display='none';">
        </div>
      `;
    }
    
    document.getElementById('teTitle').textContent = 'Create Team';
    document.getElementById('teamEditorModal').classList.add('show');
  }
  
  function editTeamDB(idx) {
    openTeamEditor();
    const t = mplTeamsDB[idx];
    document.getElementById('teId').value = idx;
    document.getElementById('teTitle').textContent = 'Edit Team';
    document.getElementById('teName').value = t.name;
    document.getElementById('teTag').value = t.tag;
    if (t.logo) {
      document.getElementById('teLogoPreview').src = t.logo;
      document.getElementById('teLogoPreview').style.display = 'block';
      document.getElementById('teLogoPath').value = t.logo;
    }
    
    t.roster.forEach((p, i) => {
      document.getElementById('tePlayerName'+i).value = p.name;
      if (p.image) {
        document.getElementById('tePlayerImgPreview'+i).src = p.image;
        document.getElementById('tePlayerImgPreview'+i).style.display = 'block';
        document.getElementById('tePlayerPlaceholder'+i).style.display = 'none';
        document.getElementById('tePlayerImgPath'+i).value = p.image;
      }
    });
  }
  
  function closeTeamEditor() {
    document.getElementById('teamEditorModal').classList.remove('show');
  }
  
  function saveTeamEditor() {
    try {
      const tId = document.getElementById('teId').value;
      const team = {
        name: document.getElementById('teName').value,
        tag: document.getElementById('teTag').value,
        logo: document.getElementById('teLogoPath').value,
        roster: []
      };
      
      for(let i=0; i<5; i++) {
        team.roster.push({
          name: document.getElementById('tePlayerName'+i).value,
          role: document.getElementById('tePlayerRole'+i).value,
          image: document.getElementById('tePlayerImgPath'+i).value
        });
      }
      
      if (tId !== '') {
        mplTeamsDB[tId] = team;
      } else {
        mplTeamsDB.push(team);
      }
      
      saveDB();
      closeTeamEditor();
      toast('Team saved successfully!', 'success');
    } catch (err) {
      toast('Save error: ' + err.message, 'error');
      console.error(err);
    }
  }
  
  function deleteTeamDB(idx) {
    if (confirm('Delete this team?')) {
      mplTeamsDB.splice(idx, 1);
      saveDB();
    }
  }
  
  function uploadFile(input, type, previewId, pathId) {
    if (!input.files || !input.files[0]) return;
    const formData = new FormData();
    formData.append('image', input.files[0]);
    formData.append('type', type);
    
    fetch('upload.php', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById(previewId).src = data.path;
        document.getElementById(previewId).style.display = 'block';
        document.getElementById(pathId).value = data.path;
      } else {
        toast('Upload failed: ' + data.error, 'error');
      }
    })
    .catch(err => {
      toast('Upload error: ' + err.message, 'error');
      console.error(err);
    });
  }
  
  function populateTeamSelects() {
    const blueSel = document.getElementById('dbBlueTeamSelect');
    const redSel = document.getElementById('dbRedTeamSelect');
    if(!blueSel || !redSel) return;
    
    const opts = `<option value="">-- Select Saved Team --</option>` + mplTeamsDB.map((t, i) => `<option value="${i}">${t.name}</option>`).join('');
    
    const bVal = blueSel.value;
    const rVal = redSel.value;
    
    blueSel.innerHTML = opts;
    redSel.innerHTML = opts;
    
    blueSel.value = bVal;
    redSel.value = rVal;
    updateSetupStartButton();
  }
  
  function loadTeamFromDB(side, idx) {
    if (idx === '') return;
    const t = mplTeamsDB[idx];
    
    S.teams[side].name = t.name;
    S.teams[side].tag = t.tag;
    S.teams[side].logo = t.logo;
    
    t.roster.forEach((p, i) => {
      if(!S.players[side]) S.players[side] = [];
      if(!S.roles[side]) S.roles[side] = [];
      if(!S.playerImages[side]) S.playerImages[side] = [];
      if(!S.basePlayers[side]) S.basePlayers[side] = [];
      if(!S.baseRoles[side]) S.baseRoles[side] = [];
      if(!S.basePlayerImages[side]) S.basePlayerImages[side] = [];
      
      S.players[side][i] = p.name;
      S.roles[side][i] = p.role;
      S.playerImages[side][i] = p.image;
      
      S.basePlayers[side][i] = p.name;
      S.baseRoles[side][i] = p.role;
      S.basePlayerImages[side][i] = p.image;
    });
    
    // Render preview
    const previewBox = document.getElementById(`${side}TeamPreview`);
    const icons = ['assets/imgs/black_exp.png', 'assets/imgs/black_core.png', 'assets/imgs/black_mid.png', 'assets/imgs/black_gold.png', 'assets/imgs/black_roam.png'];
    
        const logoBlock = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:120px; ${side==='blue' ? 'margin-right:20px;' : 'margin-left:20px;'}">
          <img src="${t.logo}" style="width:100px; height:100px; object-fit:contain; margin-bottom:8px;" onerror="this.style.display='none'">
          <div style="text-align:center; font-size:26px; font-weight:900; color:var(--text); letter-spacing:1px;">${t.tag}</div>
        </div>
      `;
      const rosterBlock = `
        <div style="display:flex; gap:12px;">
          ${t.roster.map((p, i) => `
            <div class="setup-player-card">
              <div class="setup-player-portrait">
                ${p.image ? `<img src="${p.image}" class="player-img" onerror="this.src='${icons[i]}'; this.className='role-icon'">` : `<img src="${icons[i]}" class="role-icon">`}
              </div>
              <div class="setup-player-footer">${p.name || `Player ${i+1}`}</div>
            </div>
          `).join('')}
        </div>
      `;
      previewBox.innerHTML = side === 'blue' ? logoBlock + rosterBlock : rosterBlock + logoBlock;
    
    pub();
  }
  
  // Ensure the UI locks down if draft is running
  function checkLockState() {
    const setupTab = document.getElementById('tab-setup');
    if(!setupTab) return;
    if(S.status !== 'idle') {
      setupTab.classList.add('setup-locked');
    } else {
      setupTab.classList.remove('setup-locked');
    }
  }
  
  // Hook into existing init logic
  const originalRenderTimerUI = renderTimerUI;
  renderTimerUI = function() {
    if(typeof originalRenderTimerUI === 'function') originalRenderTimerUI();
    checkLockState();
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    renderTeamDB();
    populateTeamSelects();
  });
  
  
  </script>
  </body>
  </html>
  
  
