window.INKV=window.INKV||{};INKV.minigames="20261031a";
/* ═══════════════════════════════════════════════════════════════════════════════════════
   INKAI — МІНІ-ІГРИ. Тут «каркас»: реєстр ігор, плитки на головному екрані (під кнопками ГРАТИ / ВДВОХ / МУЛЬТИПЛЕЄР),
   спільний екран гри з твоїм фоном, видача нагород із лімітами та вікно результату.
   ───────────────────────────────────────────────────────────────────────────────────────
   ЯК ДОДАТИ НОВУ МІНІ-ГРУ (повна інструкція — MINIGAMES.md):
     1) Скопіюй mg_template.js → mg_назва.js і зроби свою гру (поклади там registerMiniGame({...}))
     2) Допиши "mg_назва.js" у список MG_FILES нижче
     3) Залий файл на хостинг — плитка зʼявиться сама. Вимкнути/відкласти: on:false або from:"2026-12-01" у registerMiniGame
   ═══════════════════════════════════════════════════════════════════════════════════════ */
const MG_FILES=["mg_merge.js","mg_sudoku.js"];   // ← ТУТ підключаються файли міні-ігор (по одному на гру)
const MG_CAPS={jd:2,chest:3};                    // 🔧 денні ліміти РІДКІСНОГО з усіх міні-ігор разом: нефрит і сундуки (ІНК і торії — без ліміту)
const MG=[];
function registerMiniGame(g){MG.push(Object.assign({on:true,order:100,icon:"🎮"},g));MG.sort((a,b)=>a.order-b.order)}
const mgLive=g=>g.on!==false&&(!g.from||Date.now()>=Date.parse(g.from))&&(!g.to||Date.now()<=Date.parse(g.to)+864e5);
function mgDay(){S.mg=S.mg||{};const d=today();if(S.mg.d!==d){S.mg.d=d;S.mg.jd=0;S.mg.ch=0}return S.mg}
// ── Плитки на головному екрані ──
function mgHub(){const L=MG.filter(mgLive),soon=MG.filter(g=>g.on!==false&&g.from&&Date.now()<Date.parse(g.from)&&g.teaser);if(!L.length&&!soon.length)return"";
 const tile=g=>`<button class="card !p-3 text-left space-y-1 active:scale-95" style="background:rgba(19,17,24,.82);border-color:${g.color||"#7c3aed"}88" onclick="mgStart('${g.id}')"><div class="flex items-center justify-between"><span class="text-3xl">${g.img?`<img src="${g.img}" class="h-9 w-9 object-contain inline-block" alt="">`:g.icon}</span>${g.badge?`<span class="chip text-[9px] !py-0 text-neonGold">${t(g.badge)}</span>`:""}</div><div class="text-xs font-black">${t(g.name)}</div><div class="text-[10px] text-gray-300 leading-tight">${t(g.desc||"")}</div>${g.status?`<div class="text-[10px] text-neonGold">${g.status()}</div>`:""}</button>`;
 const lock=g=>`<div class="card !p-3 space-y-1 opacity-60" style="background:rgba(19,17,24,.82)"><div class="text-3xl">${g.icon}</div><div class="text-xs font-black">${t(g.name)}</div><div class="text-[10px] text-gray-300">${t("Скоро|Coming soon")}</div></div>`;
 return `<div class="space-y-2"><div class="text-[11px] font-black uppercase tracking-widest text-gray-300">🎮 ${t("Міні-ігри|Mini-games")}</div><div class="grid grid-cols-2 gap-2">${L.map(tile).join("")}${soon.map(lock).join("")}</div></div>`}
function mgStart(id){const g=MG.find(x=>x.id==id);if(!g||!mgLive(g))return;track("minigame_open",{id});try{g.start()}catch(e){console.error(e);toast(t("Помилка міні-гри|Mini-game error"))}}
// ── Спільна оболонка: твій екіпірований фон (куплений чи з сундука) під грою ──
function mgBgCss(){const b=BG[S.bg]||BG[0];return `linear-gradient(rgba(8,5,20,.26),rgba(8,5,20,.6)),url(assets/bg_${S.bg}.png) center/cover no-repeat,linear-gradient(180deg,${b.g[0]},${b.g[1]})`}
function mgShell(id,html){mgClose(1);const A=document.createElement("div");A.id="mg";A.dataset.g=id;A.style.cssText="position:fixed;inset:0;z-index:98;display:flex;flex-direction:column;touch-action:none;-webkit-user-select:none;user-select:none;background:"+mgBgCss();
 const b=BG[S.bg]||BG[0],im=typeof bgImg=="function"?bgImg(S.bg):null,haveImg=im&&im.complete&&im.naturalWidth;
 A.innerHTML=(haveImg?"":`<div style="position:absolute;inset:0;overflow:hidden;pointer-events:none"><div style="position:absolute;left:70%;top:30%;transform:translate(-50%,-50%);font-size:${Math.round(Math.min(innerWidth,innerHeight)*.5)}px;opacity:.16;color:#fff">${b.ic||""}</div></div>`)+(html||"");document.body.appendChild(A);return A}
// ── Правила: кнопка «?» відкриває панель знизу; нічого не блокує. onToggle(open) — щоб поставити гру на паузу ──
function mgRules(A,title,html,onToggle){S.mg=S.mg||{};S.mg.rs=S.mg.rs||{};const id=A.dataset.g,b=document.createElement("button");b.textContent="?";
 b.style.cssText="position:absolute;right:58px;top:calc(env(safe-area-inset-top,0px) + 6px);width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.6);border:1px solid #ffb703;color:#ffd27a;font-weight:900;font-size:18px;z-index:5"+(S.mg.rs[id]?"":";animation:spwP 1.4s ease-in-out infinite");
 const P=document.createElement("div");P.style.cssText="position:absolute;left:0;right:0;bottom:0;z-index:6;max-height:72%;overflow:auto;background:rgba(14,10,22,.97);border-top:2px solid #ffb703;border-radius:18px 18px 0 0;padding:14px 18px calc(env(safe-area-inset-bottom,0px) + 16px);color:#eee;font-size:13px;line-height:1.5;transform:translateY(105%);transition:transform .28s;touch-action:pan-y";
 P.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b style="color:#ffd27a;font-size:15px">📖 ${title}</b><button style="color:#aaa;font-size:20px;width:36px;height:36px">✕</button></div>${html}`;
 let open=0;const tog=v=>{open=v!=null?v:!open;P.style.transform=open?"none":"translateY(105%)";if(open){S.mg.rs[id]=1;b.style.animation="none"}if(onToggle)onToggle(open)};b.onclick=()=>tog();P.querySelector("button").onclick=()=>tog(false);A.appendChild(b);A.appendChild(P);return tog}
// ── Нагорода ІНК масштабується під економіку гравця: «раундів-еквівалентів» його звичайного заробітку (S.rc — середній заробіток за раунд) ──
const mgBase=()=>Math.max(40,Math.round(+S.rc||40));
function mgInk(rounds){return Math.max(0,Math.round(mgBase()*rounds))}
function mgClose(silent){const A=document.getElementById("mg");if(A){if(A._off)try{A._off()}catch(e){}A.remove()}if(!silent){try{setMusic("menu")}catch(e){}rend()}}
// ── Видача нагород. r={ink,souls,jd,chest(сила 1–3)}. Рідкісне (нефрит, сундуки) — з денним лімітом MG_CAPS ──
function mgGrant(r,game){const m=mgDay(),n=v=>Math.max(0,Math.round(+v||0)),out={ink:n(r.ink),souls:n(r.souls),jd:0,chest:0};
 S.mon=(+S.mon||0)+out.ink;S.souls=(+S.souls||0)+out.souls;
 if(n(r.jd)){out.jd=Math.min(n(r.jd),MG_CAPS.jd-m.jd);if(out.jd>0){S.jd=(+S.jd||0)+out.jd;m.jd+=out.jd}else out.jd=0}
 if(n(r.chest)&&m.ch<MG_CAPS.chest){out.chest=n(r.chest);m.ch++}
 save();push();hdr();track("minigame_reward",{game,ink:out.ink,souls:out.souls,jd:out.jd,chest:out.chest});return out}
function mgOpenChest(p){mgClose(1);try{setMusic("menu")}catch(e){}afterRev=()=>rend();runChest(["bonus","🎁","Сундук-знахідка|Found chest",0,"#ffb703"],p,"assets/chest_bonus.png")}
// ── Вікно результату. o={icon,title,score,lines:[html…],reward(з mgGrant),again:"jsВиклик()",nobox} ──
function mgResult(A,o){const r=o.reward||{},rows=[r.ink?`<div class="text-2xl font-black text-neonGold">+${fmt(r.ink)} 墨 ІНК</div>`:"",(r.souls||r.jd)?`<div class="text-lg font-black">${r.souls?"+"+r.souls+" ⛩️ ":""}${r.jd?"+"+r.jd+" 💎":""}</div>`:""].join("");
 A.innerHTML=`<div class="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center overflow-auto"><div class="text-6xl">${o.icon||"🎮"}</div><h2 class="text-2xl font-black text-neonGold">${o.title||""}</h2>${o.score!=null?`<div class="text-5xl font-black font-mono">⭐ ${o.score}</div>`:""}${(o.lines||[]).map(x=>`<div class="text-xs text-gray-200">${x}</div>`).join("")}${rows}
 ${r.chest?`<button class="btng w-full max-w-xs py-3" onclick="mgOpenChest(${r.chest})">🎁 ${t("Відкрити сундук|Open the chest")}</button>`:""}
 ${o.again?`<button class="btng w-full max-w-xs py-3" onclick="${o.again}">▶ ${t("Ще раз|Again")}</button>`:""}<button class="btn !bg-inkDark border border-inkBorder w-full max-w-xs" onclick="mgClose()">${t("Закрити|Close")}</button></div>`}
// ── Підвантаження файлів міні-ігор (кожен файл — окрема гра) ──
(function(){let n=MG_FILES.length;const done=()=>{if(--n<=0&&typeof cur!="undefined"&&cur=="play")rend()};MG_FILES.forEach(f=>{const s=document.createElement("script");s.src=f+"?v="+(window.INK_BUILD||"");s.async=false;s.onload=s.onerror=done;document.head.appendChild(s)})})();
