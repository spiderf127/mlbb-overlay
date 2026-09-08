import re

with open('operator.html', 'r', encoding='utf-8') as f:
    content = f.read()

stats_html = """
  <!-- STATISTICS TAB -->
  <div class="tab-panel" id="tab-stats">
    <div class="sc3" style="margin-bottom:15px;display:flex;align-items:center;gap:15px;">
      <div style="flex:1;">
        <div style="font-weight:700;font-size:14px;color:var(--text);">Global Statistics Settings</div>
        <div style="font-size:10px;color:var(--text3);margin-top:2px;">Set the total number of matches played in the tournament to calculate Pick, Ban, and Contention rates.</div>
      </div>
      <div>
        <label style="display:block;font-size:10px;color:var(--text2);margin-bottom:4px;font-weight:700;">TOTAL MATCHES</label>
        <input type="number" id="mTotalMatches" min="0" onchange="S.meta.totalMatches=parseInt(this.value)||0; pub(); renderStatsGrid();" style="width:100px;font-size:16px;text-align:center;">
      </div>
    </div>
    
    <div class="sc3">
      <div style="display:grid;grid-template-columns:1fr 80px 80px;gap:10px;margin-bottom:8px;font-size:10px;font-weight:700;color:var(--text2);text-transform:uppercase;">
        <div>Hero</div>
        <div style="text-align:center;">Picks</div>
        <div style="text-align:center;">Bans</div>
      </div>
      <div id="statsList" style="display:flex;flex-direction:column;gap:5px;"></div>
    </div>
  </div>
"""

# Insert stats_html after tab-roster closes
content = content.replace('  <div class="rmgr" id="rosterList"></div>\n  </div>', '  <div class="rmgr" id="rosterList"></div>\n  </div>\n' + stats_html)

with open('operator.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected stats HTML.")
