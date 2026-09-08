import re

with open('operator.html', 'r', encoding='utf-8') as f:
    content = f.read()

stats_logic = """
function renderStatsGrid(){
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
}
"""

content = content.replace('function renderRoster(){', stats_logic + '\nfunction renderRoster(){')

init_addition = "\n  if(document.getElementById('mTotalMatches')) document.getElementById('mTotalMatches').value = S.meta.totalMatches || 0;\n"
content = content.replace('document.getElementById(\'bTeam\').value=S.teams.blue.name||\'\';', init_addition + '  document.getElementById(\'bTeam\').value=S.teams.blue.name||\'\';')

with open('operator.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected stats JS logic.")
