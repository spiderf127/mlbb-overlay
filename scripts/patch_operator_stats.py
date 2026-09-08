import re

with open('operator.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the grid header
old_header = """<div style="display:grid;grid-template-columns:1fr 80px 80px;gap:10px;margin-bottom:8px;font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;">
        <div>Hero</div>
        <div style="text-align:center;">Picks</div>
        <div style="text-align:center;">Bans</div>
      </div>"""
new_header = """<div style="display:grid;grid-template-columns:1fr 60px 60px 60px 260px;gap:10px;margin-bottom:8px;font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;align-items:center;">
        <div>Hero</div>
        <div style="text-align:center;">Picks</div>
        <div style="text-align:center;">Bans</div>
        <div style="text-align:center;">Wins</div>
        <div style="text-align:right;">Calculated Rates</div>
      </div>"""
content = content.replace(old_header, new_header)

# Replace the renderStatsGrid and updStats function
old_js = """function renderStatsGrid(){
  const list=document.getElementById('statsList');
  if(!list) return;
  list.innerHTML='';
  S.roster.forEach((h,i)=>{
    const row=document.createElement('div');
    row.className='rrow';
    row.style.gridTemplateColumns='1fr 80px 80px';
    row.innerHTML=`
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="${h.portrait||h.img||''}" style="width:28px;height:28px;border-radius:4px;object-fit:cover;" onerror="this.style.display='none'">
        <span style="font-weight:700;">${h.name}</span>
      </div>
      <input type="number" min="0" value="${h.picks||0}" onchange="updStats(${i},'picks',this.value)" style="text-align:center;">
      <input type="number" min="0" value="${h.bans||0}" onchange="updStats(${i},'bans',this.value)" style="text-align:center;">
    `;
    list.appendChild(row);
  });
}

function updStats(i, field, val) {
  S.roster[i][field] = parseInt(val) || 0;
  saveRoster();
  pub();
}"""

new_js = """function renderStatsGrid(){
  const list=document.getElementById('statsList');
  if(!list) return;
  list.innerHTML='';
  const total = S.meta?.totalMatches || 0;
  S.roster.forEach((h,i)=>{
    const row=document.createElement('div');
    row.className='rrow';
    row.style.gridTemplateColumns='1fr 60px 60px 60px 260px';
    
    const picks = h.picks||0;
    const bans = h.bans||0;
    const wins = h.wins||0;
    
    const pRate = total>0 ? ((picks/total)*100).toFixed(1) : 0;
    const bRate = total>0 ? ((bans/total)*100).toFixed(1) : 0;
    const cRate = total>0 ? (((picks+bans)/total)*100).toFixed(1) : 0;
    const wRate = picks>0 ? ((wins/picks)*100).toFixed(1) : 0;
    
    row.innerHTML=`
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="${h.portrait||h.img||''}" style="width:28px;height:28px;border-radius:4px;object-fit:cover;" onerror="this.style.display='none'">
        <span style="font-weight:700;">${h.name}</span>
      </div>
      <input type="number" min="0" value="${picks}" onchange="valStats(${i},'picks',this)" style="text-align:center;">
      <input type="number" min="0" value="${bans}" onchange="valStats(${i},'bans',this)" style="text-align:center;">
      <input type="number" min="0" value="${wins}" onchange="valStats(${i},'wins',this)" style="text-align:center;">
      <div style="text-align:right;font-size:11px;color:var(--text2);display:flex;gap:8px;justify-content:flex-end;">
        <div title="Pick Rate"><b style="color:var(--text);">${pRate}%</b> P</div>
        <div title="Ban Rate"><b style="color:var(--text);">${bRate}%</b> B</div>
        <div title="Contention Rate"><b style="color:var(--text);">${cRate}%</b> C</div>
        <div title="Win Rate"><b style="color:var(--gold);">${wRate}%</b> W</div>
      </div>
    `;
    list.appendChild(row);
  });
}

function valStats(i, field, el) {
  const h = S.roster[i];
  const val = parseInt(el.value) || 0;
  const total = S.meta?.totalMatches || 0;
  
  if (field === 'picks' || field === 'bans') {
    const otherField = field === 'picks' ? 'bans' : 'picks';
    const otherVal = h[otherField] || 0;
    if (val + otherVal > total) {
      toast(`Error: Picks + Bans cannot exceed Total Matches (${total})`, 'err');
      el.value = h[field] || 0;
      return;
    }
  }
  
  if (field === 'wins') {
    const picks = h.picks || 0;
    if (val > picks) {
      toast(`Error: Wins cannot exceed Total Picks (${picks})`, 'err');
      el.value = h.wins || 0;
      return;
    }
  }
  
  if (field === 'picks') {
    const wins = h.wins || 0;
    if (val < wins) {
      toast(`Error: Picks cannot be less than Total Wins (${wins})`, 'err');
      el.value = h.picks || 0;
      return;
    }
  }

  S.roster[i][field] = val;
  saveRoster();
  pub();
  renderStatsGrid(); // Refresh to update calculated percentages live
}"""
content = content.replace(old_js, new_js)

with open('operator.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated operator.html with Win Rate UI and Validation logic.")
