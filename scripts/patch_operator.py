import re

with open("c:/xampp/htdocs/mpl/operator.html", "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    (
        r'<input type="text" id="nhImg" placeholder="Image URL \(optional\)" style="max-width:190px;">',
        '<input type="text" id="nhPortrait" placeholder="Portrait URL" style="max-width:120px;">\n      <input type="text" id="nhIcon" placeholder="Icon URL" style="max-width:120px;">'
    ),
    (
        r"\{name:'Estes',role:'Support',img:'https://akmwebstatic.yuanzhanapp.com/web/madmin/image_42b2d76fe927ce57a1d29e220e2b5eea.png',banRate:0,pickRate:0,contestRate:0\},\n];}",
        "{name:'Estes',role:'Support',img:'https://akmwebstatic.yuanzhanapp.com/web/madmin/image_42b2d76fe927ce57a1d29e220e2b5eea.png',banRate:0,pickRate:0,contestRate:0},\n].map(h => ({...h, portrait: h.img, icon: h.img}));}"
    ),
    (
        r"if\(d && d\.img\) h\.img = d\.img;\n      \}\);",
        "if(d && d.img) h.img = d.img;\n        if(h.img && !h.portrait) h.portrait = h.img;\n        if(h.img && !h.icon) h.icon = h.img;\n      });"
    ),
    (
        r"el\.innerHTML=h\.img\?`<img src=\"\$\{h\.img\}\" style=\"width:100%;height:32px;object-fit:cover;\"",
        "el.innerHTML=(h.icon||h.img)?`<img src=\"${h.icon||h.img}\" style=\"width:100%;height:32px;object-fit:cover;\""
    ),
    (
        r"const img=document\.getElementById\('nhImg'\)\.value\.trim\(\);\n  S\.roster\.push\(\{name:n,role:r,img,banRate:0,pickRate:0,contestRate:0\}\);\n  document\.getElementById\('nhName'\)\.value='';document\.getElementById\('nhImg'\)\.value='';",
        "const portrait=document.getElementById('nhPortrait').value.trim();\n  const icon=document.getElementById('nhIcon').value.trim();\n  S.roster.push({name:n,role:r,portrait,icon,banRate:0,pickRate:0,contestRate:0});\n  document.getElementById('nhName').value='';document.getElementById('nhPortrait').value='';document.getElementById('nhIcon').value='';"
    ),
    (
        r"row\.style\.gridTemplateColumns='32px 1fr 95px 140px 28px 60px';\n    const imgH=h\.img\?`<img src=\"\$\{h\.img\}\"",
        "row.style.gridTemplateColumns='32px 1fr 95px 140px 140px 28px 60px';\n    const imgH=(h.icon||h.img)?`<img src=\"${h.icon||h.img}\""
    ),
    (
        r"<input type=\"text\" value=\"\$\{h\.img\|\|''\}\" placeholder=\"Image URL\" onchange=\"updHero\(\$\{i\},'img',this\.value\);renderRoster\(\);renderHGrid\(\);\">",
        "<input type=\"text\" value=\"${h.portrait||h.img||''}\" placeholder=\"Portrait URL\" onchange=\"updHero(${i},'portrait',this.value);renderRoster();renderHGrid();\">\n      <input type=\"text\" value=\"${h.icon||h.img||''}\" placeholder=\"Icon URL\" onchange=\"updHero(${i},'icon',this.value);renderRoster();renderHGrid();\">"
    ),
    (
        r"imgEl\.innerHTML=hero\.img\?`<img src=\"\$\{hero\.img\}\" style=\"width:38px;height:38px;border-radius:6px;object-fit:cover;\" onerror=\"this\.style\.display='none'\">`:`<div style=\"width:38px;height:38px;border-radius:6px;background:var\(--bg\);display:flex;align-items:center;justify-content:center;font-size:20px;\">\$\{RI\[hero\.role\]\|\|'⚔'\}</div>`;",
        "imgEl.innerHTML=(hero.portrait||hero.img)?`<img src=\"${hero.portrait||hero.img}\" style=\"width:38px;height:38px;border-radius:6px;object-fit:cover;\" onerror=\"this.style.display='none'\">`:`<div style=\"width:38px;height:38px;border-radius:6px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:20px;\">${RI[hero.role]||'⚔'}</div>`;"
    )
]

for old, new in replacements:
    content = re.sub(old, new, content)

content = content.replace(
    """el.innerHTML=`<div class="hci">${hero.img?`<img src="${hero.img}" onerror="this.style.display='none'">`:`<span class="hph">${RI[hero.role]||'⚔'}</span>`}<div class="hrd" style="background:${RC[hero.role]||'#546E7A'}"></div></div><div class="hcn">${hero.name}</div>`;""",
    """el.innerHTML=`<div class="hci">${(hero.icon||hero.img)?`<img src="${hero.icon||hero.img}" onerror="this.style.display='none'">`:`<span class="hph">${RI[hero.role]||'⚔'}</span>`}<div class="hrd" style="background:${RC[hero.role]||'#546E7A'}"></div></div><div class="hcn">${hero.name}</div>`;"""
)

with open("c:/xampp/htdocs/mpl/operator.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Patched operator.html successfully.")
