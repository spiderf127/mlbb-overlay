
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

// ═══════════════════════════════════════════════════
//  DEFAULT STATE
// ═══════════════════════════════════════════════════
function defState() {
  return {
    status:'idle',format:'3ban',numPlayers:5,
    teams:{blue:{name:'',logo:''},red:{name:'',logo:''}},
    players:{blue:[],red:[]},
    roles:{blue:[],red:[]},
    basePlayers:{blue:[],red:[]},
    baseRoles:{blue:[],red:[]},
    meta:{tournament:'MPL Season 15',match:'Upper Bracket Finals',bo:'BO3',game:1,blueWins:0,redWins:0,totalMatches:100,statsEnabled:true},
    timerConfig:{ban:30,pick:30,lastChange:30},
    timer:{remaining:30,max:30},
    steps:[],currentStep:0,
    blueBans:[],redBans:[],bluePicks:[],redPicks:[],
    blueBanIdx:0,redBanIdx:0,bluePickIdx:0,redPickIdx:0,
    phase:1,history:[],
    roster:loadRoster(),
  };
}

function defRoster(){return[
  {name:'Aamon',role:'Assassin',img:'portrait/Aamon.png',picks:38,bans:13,wins:10},
  {name:'Akai',role:'Tank',img:'portrait/Akai.png',picks:22,bans:73,wins:1},
  {name:'Aldous',role:'Fighter',img:'portrait/Aldous.png',picks:5,bans:73,wins:3},
  {name:'Alice',role:'Mage',img:'portrait/Alice.png',picks:33,bans:37,wins:12},
  {name:'Alpha',role:'Fighter',img:'portrait/Alpha.png',picks:37,bans:7,wins:28},
  {name:'Alucard',role:'Fighter',img:'portrait/Alucard.png',picks:15,bans:15,wins:4},
  {name:'Angela',role:'Support',img:'portrait/Angela.png',picks:20,bans:70,wins:13},
  {name:'Argus',role:'Fighter',img:'portrait/Argus.png',picks:12,bans:60,wins:10},
  {name:'Arlott',role:'Fighter',img:'portrait/Arlott.png',picks:6,bans:52,wins:3},
  {name:'Atlas',role:'Tank',img:'portrait/Atlas.png',picks:27,bans:63,wins:23},
  {name:'Aulus',role:'Fighter',img:'portrait/Aulus.png',picks:8,bans:44,wins:1},
  {name:'Aurora',role:'Mage',img:'portrait/Aurora.png',picks:5,bans:62,wins:4},
  {name:'Badang',role:'Fighter',img:'portrait/Badang.png',picks:33,bans:6,wins:6},
  {name:'Balmond',role:'Fighter',img:'portrait/Balmond.png',picks:17,bans:22,wins:14},
  {name:'Bane',role:'Fighter',img:'portrait/Bane.png',picks:33,bans:20,wins:33},
  {name:'Barats',role:'Tank',img:'portrait/Barats.png',picks:39,bans:18,wins:38},
  {name:'Baxia',role:'Tank',img:'portrait/Baxia.png',picks:18,bans:2,wins:14},
  {name:'Beatrix',role:'Marksman',img:'portrait/Beatrix.png',picks:8,bans:73,wins:2},
  {name:'Belerick',role:'Tank',img:'portrait/Belerick.png',picks:32,bans:61,wins:27},
  {name:'Benedetta',role:'Assassin',img:'portrait/Benedetta.png',picks:11,bans:1,wins:5},
  {name:'Brody',role:'Marksman',img:'portrait/Brody.png',picks:30,bans:3,wins:13},
  {name:'Bruno',role:'Marksman',img:'portrait/Bruno.png',picks:18,bans:49,wins:12},
  {name:'Carmilla',role:'Support',img:'portrait/Carmilla.png',picks:33,bans:41,wins:9},
  {name:'Cecilion',role:'Mage',img:'portrait/Cecilion.png',picks:5,bans:21,wins:2},
  {name:"Chang'e",role:'Mage',img:"portrait/Chang'e.png",picks:12,bans:24,wins:10},
  {name:'Chip',role:'Support',img:'portrait/Chip.png',picks:30,bans:20,wins:17},
  {name:'Chou',role:'Fighter',img:'portrait/Chou.png',picks:13,bans:70,wins:4},
  {name:'Cici',role:'Fighter',img:'portrait/Cici.png',picks:5,bans:60,wins:4},
  {name:'Claude',role:'Marksman',img:'portrait/Claude.png',picks:6,bans:41,wins:2},
  {name:'Clint',role:'Marksman',img:'portrait/Clint.png',picks:9,bans:59,wins:4},
  {name:'Cyclops',role:'Mage',img:'portrait/Cyclops.png',picks:22,bans:43,wins:18},
  {name:'Diggie',role:'Support',img:'portrait/Diggie.png',picks:6,bans:14,wins:6},
  {name:'Dyrroth',role:'Fighter',img:'portrait/Dyrroth.png',picks:37,bans:62,wins:8},
  {name:'Edith',role:'Tank',img:'portrait/Edith.png',picks:29,bans:37,wins:28},
  {name:'Esmeralda',role:'Tank',img:'portrait/Esmeralda.png',picks:27,bans:51,wins:0},
  {name:'Estes',role:'Support',img:'portrait/Estes.png',picks:37,bans:29,wins:12},
  {name:'Eudora',role:'Mage',img:'portrait/Eudora.png',picks:21,bans:58,wins:18},
  {name:'Fanny',role:'Assassin',img:'portrait/Fanny.png',picks:29,bans:16,wins:3},
  {name:'Faramis',role:'Support',img:'portrait/Faramis.png',picks:20,bans:51,wins:5},
  {name:'Floryn',role:'Support',img:'portrait/Floryn.png',picks:31,bans:17,wins:30},
  {name:'Franco',role:'Tank',img:'portrait/Franco.png',picks:16,bans:57,wins:2},
  {name:'Fredrinn',role:'Tank',img:'portrait/Fredrinn.png',picks:15,bans:81,wins:14},
  {name:'Freya',role:'Fighter',img:'portrait/Freya.png',picks:24,bans:11,wins:0},
  {name:'Gatotkaca',role:'Tank',img:'portrait/Gatotkaca.png',picks:20,bans:67,wins:0},
  {name:'Gloo',role:'Tank',img:'portrait/Gloo.png',picks:40,bans:3,wins:3},
  {name:'Gord',role:'Mage',img:'portrait/Gord.png',picks:29,bans:27,wins:6},
  {name:'Granger',role:'Marksman',img:'portrait/Granger.png',picks:20,bans:28,wins:2},
  {name:'Grock',role:'Tank',img:'portrait/Grock.png',picks:17,bans:4,wins:2},
  {name:'Guinevere',role:'Fighter',img:'portrait/Guinevere.png',picks:14,bans:62,wins:1},
  {name:'Gusion',role:'Assassin',img:'portrait/Gusion.png',picks:32,bans:60,wins:21},
  {name:'Hanabi',role:'Marksman',img:'portrait/Hanabi.png',picks:33,bans:29,wins:6},
  {name:'Hanzo',role:'Assassin',img:'portrait/Hanzo.png',picks:24,bans:6,wins:12},
  {name:'Harith',role:'Mage',img:'portrait/Harith.png',picks:17,bans:24,wins:2},
  {name:'Harley',role:'Mage',img:'portrait/Harley.png',picks:13,bans:46,wins:8},
  {name:'Hayabusa',role:'Assassin',img:'portrait/Hayabusa.png',picks:25,bans:5,wins:4},
  {name:'Helcurt',role:'Assassin',img:'portrait/Helcurt.png',picks:37,bans:33,wins:17},
  {name:'Hilda',role:'Fighter',img:'portrait/Hilda.png',picks:27,bans:12,wins:1},
  {name:'Hirara',role:'Fighter',img:'portrait/Hirara.png',picks:6,bans:76,wins:4},
  {name:'Hylos',role:'Tank',img:'portrait/Hylos.png',picks:39,bans:42,wins:27},
  {name:'Irithel',role:'Marksman',img:'portrait/Irithel.png',picks:39,bans:61,wins:10},
  {name:'Ixia',role:'Marksman',img:'portrait/Ixia.png',picks:39,bans:28,wins:9},
  {name:'Jawhead',role:'Fighter',img:'portrait/Jawhead.png',picks:9,bans:34,wins:1},
  {name:'Johnson',role:'Tank',img:'portrait/Johnson.png',picks:27,bans:45,wins:18},
  {name:'Joy',role:'Assassin',img:'portrait/Joy.png',picks:29,bans:7,wins:11},
  {name:'Julian',role:'Fighter',img:'portrait/Julian.png',picks:38,bans:3,wins:19},
  {name:'Kadita',role:'Mage',img:'portrait/Kadita.png',picks:26,bans:42,wins:0},
  {name:'Kagura',role:'Mage',img:'portrait/Kagura.png',picks:31,bans:31,wins:7},
  {name:'Kaja',role:'Support',img:'portrait/Kaja.png',picks:14,bans:67,wins:3},
  {name:'Kalea',role:'Fighter',img:'portrait/Kalea.png',picks:23,bans:23,wins:10},
  {name:'Karina',role:'Assassin',img:'portrait/Karina.png',picks:9,bans:53,wins:7},
  {name:'Karrie',role:'Marksman',img:'portrait/Karrie.png',picks:17,bans:4,wins:8},
  {name:'Khaleed',role:'Fighter',img:'portrait/Khaleed.png',picks:14,bans:84,wins:2},
  {name:'Khufra',role:'Tank',img:'portrait/Khufra.png',picks:34,bans:35,wins:19},
  {name:'Kimmy',role:'Mage',img:'portrait/Kimmy.png',picks:18,bans:8,wins:11},
  {name:'Lancelot',role:'Assassin',img:'portrait/Lancelot.png',picks:6,bans:41,wins:2},
  {name:'Lapu Lapu',role:'Fighter',img:'portrait/Lapu-Lapu.png',picks:19,bans:9,wins:1},
  {name:'Layla',role:'Marksman',img:'portrait/Layla.png',picks:15,bans:66,wins:1},
  {name:'Leomord',role:'Fighter',img:'portrait/Leomord.png',picks:5,bans:74,wins:0},
  {name:'Lesley',role:'Marksman',img:'portrait/Lesley.png',picks:19,bans:16,wins:16},
  {name:'Ling',role:'Assassin',img:'portrait/Ling.png',picks:31,bans:5,wins:20},
  {name:'Lolita',role:'Tank',img:'portrait/Lolita.png',picks:8,bans:3,wins:2},
  {name:'Lukas',role:'Fighter',img:'portrait/Lukas.png',picks:21,bans:9,wins:6},
  {name:'Lunox',role:'Mage',img:'portrait/Lunox.png',picks:32,bans:3,wins:29},
  {name:'Luo Yi',role:'Mage',img:'portrait/Luo Yi.png',picks:23,bans:33,wins:1},
  {name:'Lylia',role:'Mage',img:'portrait/Lylia.png',picks:31,bans:64,wins:10},
  {name:'Marcel',role:'Fighter',img:'portrait/Marcel.png',picks:26,bans:41,wins:13},
  {name:'Martis',role:'Fighter',img:'portrait/Martis.png',picks:12,bans:20,wins:7},
  {name:'Masha',role:'Fighter',img:'portrait/Masha.png',picks:16,bans:0,wins:14},
  {name:'Mathilda',role:'Support',img:'portrait/Mathilda.png',picks:9,bans:20,wins:8},
  {name:'Melissa',role:'Marksman',img:'portrait/Melissa.png',picks:28,bans:51,wins:5},
  {name:'Minotaur',role:'Tank',img:'portrait/Minotaur.png',picks:26,bans:7,wins:0},
  {name:'Minsitthar',role:'Fighter',img:'portrait/Minsitthar.png',picks:25,bans:46,wins:1},
  {name:'Miya',role:'Marksman',img:'portrait/Miya.png',picks:36,bans:25,wins:4},
  {name:'Moskov',role:'Marksman',img:'portrait/Moskov.png',picks:25,bans:18,wins:23},
  {name:'Nana',role:'Mage',img:'portrait/Nana.png',picks:29,bans:10,wins:18},
  {name:'Natalia',role:'Assassin',img:'portrait/Natalia.png',picks:7,bans:42,wins:3},
  {name:'Natan',role:'Marksman',img:'portrait/Natan.png',picks:13,bans:0,wins:3},
  {name:'Nolan',role:'Assassin',img:'portrait/Nolan.png',picks:38,bans:18,wins:23},
  {name:'Novaria',role:'Mage',img:'portrait/Novaria.png',picks:39,bans:31,wins:3},
  {name:'Obsidia',role:'Fighter',img:'portrait/Obsidia.png',picks:34,bans:57,wins:32},
  {name:'Odette',role:'Mage',img:'portrait/Odette.png',picks:6,bans:29,wins:6},
  {name:'Paquito',role:'Fighter',img:'portrait/Paquito.png',picks:9,bans:51,wins:9},
  {name:'Pharsa',role:'Mage',img:'portrait/Pharsa.png',picks:23,bans:33,wins:0},
  {name:'Phoveus',role:'Fighter',img:'portrait/Phoveus.png',picks:14,bans:42,wins:14},
  {name:'Popol and Kupa',role:'Marksman',img:'portrait/Popol and Kupa.png',picks:12,bans:49,wins:4},
  {name:'Rafaela',role:'Support',img:'portrait/Rafaela.png',picks:22,bans:78,wins:4},
  {name:'Roger',role:'Fighter',img:'portrait/Roger.png',picks:17,bans:78,wins:9},
  {name:'Ruby',role:'Fighter',img:'portrait/Ruby.png',picks:27,bans:1,wins:4},
  {name:'Saber',role:'Assassin',img:'portrait/Saber.png',picks:29,bans:18,wins:19},
  {name:'Selena',role:'Assassin',img:'portrait/Selena.png',picks:26,bans:61,wins:22},
  {name:'Silvanna',role:'Fighter',img:'portrait/Silvanna.png',picks:34,bans:4,wins:15},
  {name:'Sora',role:'Fighter',img:'portrait/Sora.png',picks:36,bans:31,wins:26},
  {name:'Sun',role:'Fighter',img:'portrait/Sun.png',picks:15,bans:1,wins:1},
  {name:'Suyou',role:'Assassin',img:'portrait/Suyou.png',picks:14,bans:14,wins:5},
  {name:'Terizla',role:'Fighter',img:'portrait/Terizla.png',picks:25,bans:24,wins:17},
  {name:'Thamuz',role:'Fighter',img:'portrait/Thamuz.png',picks:31,bans:28,wins:3},
  {name:'The Exorcists Member Introduction',role:'Fighter',img:'portrait/The Exorcists-Member Introduction.png',picks:9,bans:25,wins:3},
  {name:'Tigreal',role:'Tank',img:'portrait/Tigreal.png',picks:10,bans:71,wins:6},
  {name:'Uranus',role:'Tank',img:'portrait/Uranus.png',picks:7,bans:91,wins:0},
  {name:'Vale',role:'Mage',img:'portrait/Vale.png',picks:35,bans:12,wins:5},
  {name:'Valentina',role:'Mage',img:'portrait/Valentina.png',picks:6,bans:24,wins:3},
  {name:'Valir',role:'Mage',img:'portrait/Valir.png',picks:31,bans:19,wins:3},
  {name:'Vexana',role:'Mage',img:'portrait/Vexana.png',picks:38,bans:20,wins:36},
  {name:'Wanwan',role:'Marksman',img:'portrait/Wanwan.png',picks:15,bans:1,wins:4},
  {name:'X.Borg',role:'Fighter',img:'portrait/X.Borg.png',picks:35,bans:52,wins:1},
  {name:'Xavier',role:'Mage',img:'portrait/Xavier.png',picks:38,bans:29,wins:22},
  {name:'Yi Sun-shin',role:'Assassin',img:'portrait/Yi Sun-shin.png',picks:26,bans:58,wins:5},
  {name:'Yin',role:'Fighter',img:'portrait/Yin.png',picks:40,bans:28,wins:8},
  {name:'Yu Zhong',role:'Fighter',img:'portrait/Yu Zhong.png',picks:36,bans:37,wins:3},
  {name:'Yve',role:'Mage',img:'portrait/Yve.png',picks:25,bans:49,wins:5},
  {name:'Zetian',role:'Fighter',img:'portrait/Zetian.png',picks:27,bans:19,wins:21},
  {name:'Zhask',role:'Mage',img:'portrait/Zhask.png',picks:20,bans:20,wins:10},
  {name:'Zhuxin',role:'Mage',img:'portrait/Zhuxin.png',picks:36,bans:61,wins:1},
  {name:'Zilong',role:'Fighter',img:'portrait/Zilong.png',picks:6,bans:83,wins:6},
  {name:'No Ban',role:'None',img:'',picks:0,bans:0,wins:0},
].map(h => ({...h, portrait: h.img, icon: 'icon/' + h.name.toLowerCase() + '.jpg'}));}

// ═══════════════════════════════════════════════════
//  PERSISTENT ROSTER — saved separately so images/stats survive full reset
// ═══════════════════════════════════════════════════
function loadRoster() {
  try {
    const r = localStorage.getItem(SK_ROSTER);
    if(r) {
      const parsed = JSON.parse(r);
      const def = defRoster();
      
      // Update existing heroes and add missing ones
      const merged = def.map(defHero => {
        const existingHero = parsed.find(x => x.name === defHero.name);
        if (existingHero) {
          return {
            ...existingHero,
            // Force update paths and roles from defRoster
            img: defHero.img,
            portrait: defHero.portrait,
            icon: defHero.icon,
            role: defHero.role
          };
        }
        return defHero;
      });
      return merged;
    }
  } catch(e) {}
  return defRoster();
}

function saveRoster() {
  try { localStorage.setItem(SK_ROSTER, JSON.stringify(S.roster)); } catch(e){}
}

// ═══════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════
let S = defState();
let timerInt = null;
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

function pub() {
  const json = JSON.stringify(S);
  try { localStorage.setItem(SK, json); } catch(e){}
  if(bc) try { bc.postMessage({t:'STATE',d:S}); } catch(e){}
  saveRoster();
  renderUI();
}

function saveQ() {
  try { localStorage.setItem(SK, JSON.stringify(S)); } catch(e){}
  if(bc) try { bc.postMessage({t:'STATE',d:S}); } catch(e){}
  saveRoster();
}

function load() {
  try {
    const r = localStorage.getItem(SK);
    if(r) {
      const p = JSON.parse(r);
      S = {...defState(),...p};
      // Always load roster from the dedicated key (preserves images/stats across resets)
      S.roster = loadRoster();
      if(!S.roles) S.roles={blue:[],red:[]};
      if(!p.basePlayers) S.basePlayers = JSON.parse(JSON.stringify(S.players || {blue:[],red:[]}));
      if(!p.baseRoles) S.baseRoles = JSON.parse(JSON.stringify(S.roles || {blue:[],red:[]}));
      if(!p.timerConfig) S.timerConfig={ban:30,pick:30,lastChange:30};
      if(S.timerConfig.lastChange===undefined) S.timerConfig.lastChange=30;
    }
  } catch(e) { S=defState(); }
}

// ═══════════════════════════════════════════════════
//  STEP BUILDER
// ═══════════════════════════════════════════════════
function buildSteps(fmt) {
  const b5 = fmt==='5ban';
  const st = [];
  const p1b = b5?6:4;
  for(let i=0;i<p1b;i++) st.push({phase:1,action:'ban',side:i%2===0?'blue':'red'});
  ['blue','red','red','blue','blue','red'].forEach(s=>st.push({phase:1,action:'pick',side:s}));
  const p2b = b5?4:2;
  for(let i=0;i<p2b;i++) st.push({phase:2,action:'ban',side:i%2===0?'red':'blue'});
  ['red','blue','blue','red'].forEach(s=>st.push({phase:2,action:'pick',side:s}));
  return st;
}

// ═══════════════════════════════════════════════════
//  TIMER
// ═══════════════════════════════════════════════════
function stopTimer(){if(timerInt){clearInterval(timerInt);timerInt=null;}}
function startTimer(secs){
  stopTimer();
  S.timer.remaining=secs; S.timer.max=secs;
  timerInt=setInterval(()=>{
    if(S.status!=='running' && S.status!=='last_change')return;
    S.timer.remaining=Math.max(0,S.timer.remaining-1);
    if(S.timer.remaining<=0){
      stopTimer();
      if(S.status==='last_change'){finishDraft();}
      // timer halted at zero
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
  S.steps=buildSteps(S.format);
  S.currentStep=0;
  S.blueBans=[];S.redBans=[];S.bluePicks=[];S.redPicks=[];
  S.blueBanIdx=0;S.redBanIdx=0;S.bluePickIdx=0;S.redPickIdx=0;
  S.history=[];S.status='running';S.phase=1;
  beginStep();sw('heroes');
  toast('Draft started!','success');logH('🚀 Draft started');
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
}
function pauseDraft(){if(S.status!=='running')return;stopTimer();S.status='paused';logH('⏸ Paused');toast('Paused','info');pub();}
function resumeDraft(){if(S.status!=='paused')return;S.status='running';startTimer(S.timer.remaining>0?S.timer.remaining:S.timerConfig.ban);logH('▶ Resumed');toast('Resumed','success');pub();}
function skipTurn(){if(S.status!=='running'&&S.status!=='paused')return;S.status='running';logH('⏭ Skipped');advStep();}
function advStep(){S.currentStep++;beginStep();}
function undoAction(){
  const last=[...S.history].reverse().find(h=>h.snap);
  if(!last){toast('Nothing to undo','error');return;}
  const sn=last.snap;
  S.blueBans=[...sn.blueBans];S.redBans=[...sn.redBans];
  S.bluePicks=[...sn.bluePicks];S.redPicks=[...sn.redPicks];
  S.blueBanIdx=sn.blueBanIdx;S.redBanIdx=sn.redBanIdx;
  S.bluePickIdx=sn.bluePickIdx;S.redPickIdx=sn.redPickIdx;
  S.currentStep=sn.currentStep;
  const idx=S.history.lastIndexOf(last);
  S.history=S.history.slice(0,idx);
  S.status='running';
  S.skipNextPopup = true; // Added flag to suppress popup on next repick
  beginStep();toast('Undone','info');
}

// ═══════════════════════════════════════════════════
//  RESET — FIXED: properly resets status and re-enables Start Draft
// ═══════════════════════════════════════════════════
function cSoftReset(){openAct('Soft Reset','Clear picks/bans/timer. Team info is kept.',null,softReset,'bw','Soft Reset');}
function cHardReset(){openAct('Full Reset','Clear EVERYTHING including teams, players and scores.',null,hardReset,'bd','Full Reset');}

function softReset(){
  stopTimer();
  const keep={roster:S.roster,teams:S.teams,basePlayers:S.basePlayers,baseRoles:S.baseRoles,meta:S.meta,timerConfig:S.timerConfig,format:S.format,numPlayers:S.numPlayers};
  S=defState();
  // Overwrite the roster that defState() loaded with the current kept roster
  Object.assign(S, keep);
  S.players = JSON.parse(JSON.stringify(S.basePlayers || {blue:[],red:[]}));
  S.roles = JSON.parse(JSON.stringify(S.baseRoles || {blue:[],red:[]}));
  S.status='idle';
  S.steps=[];S.currentStep=0;
  S.blueBans=[];S.redBans=[];S.bluePicks=[];S.redPicks=[];
  S.blueBanIdx=0;S.redBanIdx=0;S.bluePickIdx=0;S.redPickIdx=0;
  S.history=[];
  S.timer={remaining:S.timerConfig.ban||30,max:S.timerConfig.ban||30};
  rebuildPInputs();
  toast('Soft reset done — team data kept','info');logH('↺ Soft reset');
  pub();
}

function hardReset(){
  stopTimer();
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
  document.getElementById('mBo').value='BO3';
  document.getElementById('mGame').value=1;
  document.getElementById('selFmt').value='3ban';
  document.getElementById('selP').value=5;
  document.getElementById('banT').value=30;
  document.getElementById('pickT').value=30;
  document.getElementById('lcT').value=30;
  rebuildPInputs();
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
  [S.roles.blue,S.roles.red]=[S.roles.red,S.roles.blue];
  [S.basePlayers.blue,S.basePlayers.red]=[S.basePlayers.red,S.basePlayers.blue];
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
    }
  });

  document.getElementById('bTeam').value=S.teams.blue.name||'';
  document.getElementById('rTeam').value=S.teams.red.name||'';
  document.getElementById('bLogo').value=S.teams.blue.logo||'';
  document.getElementById('rLogo').value=S.teams.red.logo||'';
  document.getElementById('bWins').value=S.meta.blueWins;
  document.getElementById('rWins').value=S.meta.redWins;
  rebuildPInputs();toast('Sides swapped','success');logH('⇄ Sides swapped');pub();
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
    if(!div) return;
    div.innerHTML = '';
    const picks = side === 'blue' ? S.bluePicks : S.redPicks;
    const players = side === 'blue' ? S.players.blue : S.players.red;
    const roles = side === 'blue' ? S.roles.blue : S.roles.red;
    const iconMapLC = {'EXP Lane':'imgs/exp.png', 'Jungle':'imgs/jungler.png', 'Mid Lane':'imgs/mid.png', 'Gold Lane':'imgs/gold.png', 'Roam':'imgs/Roamer.png'};
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
  const iconMapLC = {'EXP Lane':'imgs/exp.png', 'Jungle':'imgs/jungler.png', 'Mid Lane':'imgs/mid.png', 'Gold Lane':'imgs/gold.png', 'Roam':'imgs/Roamer.png'};
  
  const lcSwapSub = document.getElementById('lcSwapSub');
  if(lcSwapSub) lcSwapSub.innerHTML = `Swapping <b>${lcSource.hero ? lcSource.hero.name : 'None'}</b> for <b>${lcSource.player}</b>.`;
  const list = document.getElementById('lcSwapList');
  if(list) list.innerHTML = '';
  
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
    if(list) list.appendChild(card);
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
function isUsed(n){if(n==='No Ban')return false;return S.blueBans.some(h=>h.name===n)||S.redBans.some(h=>h.name===n)||S.bluePicks.some(h=>h.name===n)||S.redPicks.some(h=>h.name===n);}
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
  
  const iconMap = {'EXP Lane':'imgs/exp.png', 'Jungle':'imgs/jungler.png', 'Mid Lane':'imgs/mid.png', 'Gold Lane':'imgs/gold.png', 'Roam':'imgs/Roamer.png'};
  
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
  
  if (targetIdx !== currentIdx) {
    const side = flexStep.side;
    
    if(!S.players[side]) S.players[side] = [];
    if(!S.roles[side]) S.roles[side] = [];
    
    // Swap Players with fallbacks
    const currentPlayer = S.players[side][currentIdx] || '';
    const targetPlayer = S.players[side][targetIdx] || '';
    S.players[side][currentIdx] = targetPlayer;
    S.players[side][targetIdx] = currentPlayer;
    
    // Swap Roles with fallbacks
    const currentRole = S.roles[side][currentIdx] || LANES[currentIdx];
    const targetRole = S.roles[side][targetIdx] || LANES[targetIdx];
    S.roles[side][currentIdx] = targetRole;
    S.roles[side][targetIdx] = currentRole;
    
    saveRoster();
    rebuildPInputs();
  }
  
  applyHero(flexHero, flexStep);
  cFlex();
}
function applyHero(hero,step){
  const snap={blueBans:[...S.blueBans],redBans:[...S.redBans],bluePicks:[...S.bluePicks],redPicks:[...S.redPicks],blueBanIdx:S.blueBanIdx,redBanIdx:S.redBanIdx,bluePickIdx:S.bluePickIdx,redPickIdx:S.redPickIdx,currentStep:S.currentStep};
  logH(`${step.action==='ban'?'🚫':'✅'} ${step.side==='blue'?'Blue':'Red'} ${step.action}: ${hero.name}`,snap);
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
  let usedNames = [];
  if(step.action==='ban') {
    usedNames = [...S.blueBans.map(h=>h.name), ...S.redBans.map(h=>h.name)];
  } else {
    usedNames = [...S.bluePicks.map(h=>h.name), ...S.redPicks.map(h=>h.name)];
  }
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
    el.className=`mhc${u?' mu':''}`;
    el.innerHTML=(h.icon||h.img)?`<img src="${h.icon||h.img}" style="width:100%;height:32px;object-fit:cover;" onerror="this.style.display='none'"><div class="mhcn">${h.name}</div>`:`<div style="font-size:18px;height:32px;display:flex;align-items:center;justify-content:center;">${RI[h.role]||'⚔'}</div><div class="mhcn">${h.name}</div>`;
    if(!u){el.onclick=()=>{document.querySelectorAll('.mhc').forEach(c=>c.classList.remove('msel'));el.classList.add('msel');modHero=h;document.getElementById('mmsel').textContent=h.name;};}
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
//  HERO STATS (Ban/Pick/Contention rates)
// ═══════════════════════════════════════════════════
function openStats(idx) {
  statsHeroIdx = idx;
  const h = S.roster[idx];
  document.getElementById('smTitle').textContent = `Stats — ${h.name}`;
  document.getElementById('smBan').value = h.banRate||0;
  document.getElementById('smPick').value = h.pickRate||0;
  document.getElementById('smContest').value = h.contestRate||0;
  document.getElementById('statsModal').classList.add('show');
}
function cStats(){document.getElementById('statsModal').classList.remove('show');statsHeroIdx=null;}
function doStats(){
  if(statsHeroIdx===null)return;
  S.roster[statsHeroIdx].banRate = parseFloat(document.getElementById('smBan').value)||0;
  S.roster[statsHeroIdx].pickRate = parseFloat(document.getElementById('smPick').value)||0;
  S.roster[statsHeroIdx].contestRate = parseFloat(document.getElementById('smContest').value)||0;
  cStats();
  toast('Stats saved','success');
  pub();renderRoster();
}

// ═══════════════════════════════════════════════════
//  HERO ROSTER
// ═══════════════════════════════════════════════════
function addHero(){
  const n=document.getElementById('nhName').value.trim();
  if(!n){toast('Enter name','error');return;}
  if(S.roster.find(h=>h.name.toLowerCase()===n.toLowerCase())){toast('Already exists','error');return;}
  const r=document.getElementById('nhRole').value;
  const portrait=document.getElementById('nhPortrait').value.trim();
  const icon=document.getElementById('nhIcon').value.trim();
  S.roster.push({name:n,role:r,portrait,icon,picks:9,bans:46,wins:5});
  document.getElementById('nhName').value='';document.getElementById('nhPortrait').value='';document.getElementById('nhIcon').value='';
  toast(`${n} added`,'success');pub();renderRoster();
}
function removeHero(i){const n=S.roster[i].name;S.roster.splice(i,1);toast(`${n} removed`,'info');pub();renderRoster();}
function updHero(i,f,v){S.roster[i][f]=v;saveRoster();saveQ();}
function exportRoster(){const b=new Blob([JSON.stringify(S.roster,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='roster.json';a.click();}

let rosterSortKeys = [
  {key:'name',label:'Name'},
  {key:'role',label:'Role'},
  {key:'banRate',label:'Ban %'},
  {key:'pickRate',label:'Pick %'},
  {key:'contestRate',label:'Contention %'},
];



function buildRosterSortBar(){
  const bar=document.getElementById('rosterSortBar');bar.innerHTML='';
  rosterSortKeys.forEach(({key,label})=>{
    const el=document.createElement('div');
    const isActive = rosterSortKey===key;
    el.className=`chip${isActive?' active':''}`;
    el.innerHTML=`${label}${isActive?(rosterSortDir===1?' ↑':' ↓'):''}`;
    el.onclick=()=>{
      if(rosterSortKey===key) rosterSortDir*=-1;
      else { rosterSortKey=key; rosterSortDir=1; }
      buildRosterSortBar(); renderRoster();
    };
    bar.appendChild(el);
  });
}

function renderRoster(){
  const div=document.getElementById('rosterList');div.innerHTML='';
  const q=(document.getElementById('rosterSearch').value||'').toLowerCase();
  let heroes = [...S.roster];
  if(q) heroes = heroes.filter(h=>h.name.toLowerCase().includes(q)||h.role.toLowerCase().includes(q));
  heroes.sort((a,b)=>{
    let av=a[rosterSortKey]??'',bv=b[rosterSortKey]??'';
    if(typeof av==='string') av=av.toLowerCase();
    if(typeof bv==='string') bv=bv.toLowerCase();
    return av<bv?-rosterSortDir:av>bv?rosterSortDir:0;
  });
  heroes.forEach(h=>{
    const i=S.roster.indexOf(h);
    const row=document.createElement('div');row.className='rrow';
    row.style.gridTemplateColumns='32px 1fr 95px 140px 140px 28px 60px';
    const imgH=(h.icon||h.img)?`<img src="${h.icon||h.img}" style="width:28px;height:28px;border-radius:4px;object-fit:cover;" onerror="this.style.display='none'">`:RI[h.role]||'⚔';
    const hasStats=(h.banRate||h.pickRate||h.contestRate);
    row.innerHTML=`<div class="rimg">${imgH}</div>
      <input type="text" value="${h.name}" onchange="updHero(${i},'name',this.value);renderHGrid();">
      <select onchange="updHero(${i},'role',this.value);renderHGrid();">${ROLES.map(r=>`<option${r===h.role?' selected':''}>${r}</option>`).join('')}</select>
      <input type="text" value="${h.portrait||h.img||''}" placeholder="Portrait URL" onchange="updHero(${i},'portrait',this.value);renderRoster();renderHGrid();">
      <input type="text" value="${h.icon||h.img||''}" placeholder="Icon URL" onchange="updHero(${i},'icon',this.value);renderRoster();renderHGrid();">
      <button class="btn bg2 bxs" onclick="removeHero(${i})">✕</button>
      <button class="btn ${hasStats?'bp':'bg2'} bxs" onclick="openStats(${i})" title="Edit ban/pick/contention rates" style="font-size:8px;">📊</button>`;
    div.appendChild(row);
  });
}

// ═══════════════════════════════════════════════════
//  RENDER: HERO GRID
// ═══════════════════════════════════════════════════
let lastHGridFilter = '';
let hGridEls = [];

function renderHGrid(){
  const grid=document.getElementById('hgrid');
  const search=document.getElementById('hsearch').value.toLowerCase();
  const heroes=S.roster.filter(h=>(rfilt==='all'||h.role===rfilt)&&(!search||h.name.toLowerCase().includes(search)));
  document.getElementById('hcnt').textContent=`${heroes.length} heroes`;
  
  const filterKey = rfilt + '|' + search + '|' + S.roster.length;
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
    const u=isUsed(hero.name);
    const ban=S.blueBans.some(h=>h&&h.name===hero.name)||S.redBans.some(h=>h&&h.name===hero.name);
    const pick=S.bluePicks.some(h=>h&&h.name===hero.name)||S.redPicks.some(h=>h&&h.name===hero.name);
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
  steps.forEach((step,i)=>{
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
    row.innerHTML=`<span class="sn">${i+1}</span><span class="sbg sb${step.action}">${step.action.toUpperCase()}</span><span style="font-weight:700;font-size:12px;color:${sc};">${step.side==='blue'?'Blue':'Red'}</span><span style="font-size:11px;color:var(--text2);">${ah||'<span style="color:var(--text3);">—</span>'}</span><span style="font-size:9px;color:var(--text3);">P${step.phase}</span>${done?'<span class="schk">✓</span>':'<span></span>'}<button class="btn ${done?'bgo':'bg2'} bxs" onclick="openModify(${i})" style="white-space:nowrap;">${done?'Edit':'Modify'}</button>`;
    list.appendChild(row);
  });
}

// ═══════════════════════════════════════════════════
//  RENDER: RIGHT PANEL
// ═══════════════════════════════════════════════════
function renderRP(){
  const bc=S.format==='5ban'?5:3;
  const mkItems=(id,items,total,type)=>{
    const d=document.getElementById(id);d.innerHTML='';
    for(let i=0;i<total;i++){const h=items[i];const el=document.createElement('div');el.className=`bi bi-${type}`;el.innerHTML=`<div class="bid bid${type==='ban'?'b':'p'}"></div><div class="bin">${h?h.name:'—'}</div><div class="binum">#${i+1}</div>`;d.appendChild(el);}
  };
  mkItems('rpBB',S.blueBans,bc,'ban');mkItems('rpBP',S.bluePicks,S.numPlayers,'pick');
  mkItems('rpRB',S.redBans,bc,'ban');mkItems('rpRP',S.redPicks,S.numPlayers,'pick');
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
  [...S.history].reverse().slice(0,22).forEach(e=>{
    const d=document.createElement('div');d.className='hli';
    d.innerHTML=`<span>${e.msg}</span><span class="hlt">${e.time}</span>`;list.appendChild(d);
  });
}

// ═══════════════════════════════════════════════════
//  RENDER: TIMER + STATUS
// ═══════════════════════════════════════════════════
function rTimerUI(){
  const rem=S.timer.remaining;
  const el=document.getElementById('sTimer');
  el.textContent=String(Math.floor(rem)).padStart(2,'0');
  el.className='tbig'+(rem<=5?' warn':'');
}
function rStatusUI(){
  const badge=document.getElementById('sbdg');
  const map={idle:'si',running:'sr',paused:'sp',last_change:'sp',complete:'sc2'};
  badge.className=`sbdg ${map[S.status]||'si'}`;
  badge.innerHTML=`<div class="sd"></div><span>${S.status.toUpperCase().replace('_',' ')}</span>`;
  const step=S.steps[S.currentStep];
  const tbox=document.getElementById('tbox');
  const ta=document.getElementById('ta');const td=document.getElementById('td');
  if(S.status==='idle'){tbox.className='turn-box';ta.textContent='—';ta.style.color='';td.textContent='Draft not started';}
  else if(S.status==='last_change'){tbox.className='turn-box';ta.style.color='var(--gold)';ta.textContent='LAST CHANGE';td.textContent='Final adjustments...';}
  else if(S.status==='complete'){tbox.className='turn-box';ta.style.color='var(--green)';ta.textContent='Complete';td.textContent='All picks & bans locked';}
  else if(step){
    const ib=step.side==='blue';
    tbox.className=`turn-box${ib?'':' r'}`;
    ta.style.color=ib?'var(--blue)':'var(--red)';
    ta.textContent=`${step.side.toUpperCase()} — ${step.action.toUpperCase()}`;
    td.textContent=`Phase ${step.phase} · Step ${S.currentStep+1}/${S.steps.length}`;
    document.getElementById('sTimerSub').textContent=step.action==='ban'?'Ban Phase':'Pick Phase';
  }
  // FIXED: Start Draft only disabled when NOT idle
  document.getElementById('btnStart').disabled=S.status!=='idle';
  document.getElementById('btnPause').disabled=S.status!=='running';
  document.getElementById('btnResume').disabled=S.status!=='paused';
  document.getElementById('btnSkip').disabled=S.status!=='running'&&S.status!=='paused';
  document.getElementById('btnUndo').disabled=!S.history.some(h=>h.snap);
  document.getElementById('btnSwap').disabled=S.status==='running';
  const lcBtn=document.getElementById('btnLastChange');
  if(lcBtn) lcBtn.style.display=S.status==='last_change'?'inline-flex':'none';
}

// ═══════════════════════════════════════════════════
//  RENDER: FULL UI
// ═══════════════════════════════════════════════════
function renderUI(){
  rTimerUI();rStatusUI();renderHGrid();renderSeqList();renderRP();renderHist();renderRoster();
}

// ═══════════════════════════════════════════════════
//  PLAYER INPUTS
// ═══════════════════════════════════════════════════
function rebuildPInputs(){
  const n=S.numPlayers;
  ['blue','red'].forEach(side=>{
    const div=document.getElementById(side==='blue'?'bPInputs':'rPInputs');
    div.innerHTML='';
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
  if(id==='heroes')renderHGrid();
  if(id==='sequence')renderSeqList();
  if(id==='roster')renderRoster();
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
//  INIT
// ═══════════════════════════════════════════════════
function init(){
  load();
  document.getElementById('bTeam').value=S.teams.blue.name||'';
  document.getElementById('rTeam').value=S.teams.red.name||'';
  document.getElementById('bLogo').value=S.teams.blue.logo||'';
  document.getElementById('rLogo').value=S.teams.red.logo||'';
  document.getElementById('bWins').value=S.meta.blueWins||0;
  document.getElementById('rWins').value=S.meta.redWins||0;
  document.getElementById('mTour').value=S.meta.tournament||'MPL Season 15';
  document.getElementById('mMatch').value=S.meta.match||'Upper Bracket Finals';
  document.getElementById('mBo').value=S.meta.bo||'BO3';
  document.getElementById('mGame').value=S.meta.game||1;
  document.getElementById('selFmt').value=S.format||'3ban';
  document.getElementById('selP').value=S.numPlayers||5;
  document.getElementById('banT').value=S.timerConfig.ban||30;
  document.getElementById('pickT').value=S.timerConfig.pick||30;
  if(S.status==='running'){S.status='paused';toast('Draft was running — click Resume','info');}
  rebuildPInputs();renderRChips();buildRosterSortBar();renderUI();pub();
  // Periodic timer broadcast
  setInterval(()=>{
    if(S.status==='running'){
      if(bc)bc.postMessage({t:'TICK',remaining:S.timer.remaining,max:S.timer.max});
    }
    rTimerUI();rStatusUI();
  },500);
}

init();
