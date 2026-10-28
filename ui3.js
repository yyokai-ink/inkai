window.INKV=window.INKV||{};INKV.ui3="20261028e";
/* INKAI ui3.js — СКІН У СТИЛІ CLASH ROYALE + бокова планка «Шлях самурая».
   Нічого не видаляє й не міняє в логіці: лише накладає стилі поверх (картинки екранів, твої PNG/звуки, тексти — як були) і додає плашку справа під стрілкою-рекламою.
   Прибрати скін повністю: видали цей файл і рядок <script src="ui3.js"> у game1.html. */
(function(){const c=document.createElement("style");c.id="crskin";c.textContent=`
:root{--crb1:#3a68c8;--crb2:#1f3c86;--crbd:#0d1a40;--crg1:#ffd54f;--crg2:#f59e0b;--crgd:#8a4b00}
body,button,input,select,textarea{font-family:'Lilita One','Cormorant Garamond',system-ui,sans-serif}
body{letter-spacing:.01em}
body::before{content:"";position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.07;background-image:linear-gradient(45deg,#fff 25%,transparent 25%,transparent 75%,#fff 75%),linear-gradient(45deg,#fff 25%,transparent 25%,transparent 75%,#fff 75%);background-size:46px 46px;background-position:0 0,23px 23px}
/* панелі */
.card{background:linear-gradient(180deg,rgba(60,106,205,.94),rgba(31,60,134,.96))!important;border:3px solid var(--crbd)!important;border-radius:18px!important;box-shadow:0 4px 0 #0a1233,inset 0 2px 0 rgba(255,255,255,.28)!important;color:#fff}
.card .text-gray-300,.card .text-gray-400{color:#d3e2ff!important}.card .text-gray-500,.card .text-gray-600{color:#a8c0f0!important}
.card .bg-inkDark,.card [class*="bg-inkDark"]{background:rgba(9,20,64,.55)!important}
.card .border-inkBorder{border-color:#10224f!important}
/* кнопки */
.btng,.btn{border-radius:14px!important;font-family:'Lilita One',sans-serif!important;font-weight:400!important;letter-spacing:.03em;text-shadow:0 2px 0 rgba(0,0,0,.55),1px 1px 0 rgba(0,0,0,.45),-1px 1px 0 rgba(0,0,0,.45);transition:transform .08s,box-shadow .08s}
.btng{background:linear-gradient(180deg,var(--crg1),var(--crg2))!important;border:3px solid var(--crgd)!important;box-shadow:0 4px 0 #6b3800,inset 0 2px 0 rgba(255,255,255,.55)!important;color:#fff!important}
.btn:not([class*="!bg-"]){background:linear-gradient(180deg,#58b0ff,#1f6fe0)!important;border:3px solid #0f3f94!important;box-shadow:0 4px 0 #0a2a66,inset 0 2px 0 rgba(255,255,255,.45)!important;color:#fff!important}
.btn[class*="!bg-"]{background:linear-gradient(180deg,#46619b,#2a4078)!important;border:3px solid #13224d!important;box-shadow:0 4px 0 #0a1233,inset 0 2px 0 rgba(255,255,255,.2)!important;color:#fff!important}
.btng:active,.btn:active{transform:translateY(3px)!important;box-shadow:0 1px 0 #0a1233!important}
.btng:disabled,.btn:disabled{filter:grayscale(.75) brightness(.8)}
.chip{background:linear-gradient(180deg,#14275e,#0b1740)!important;border:2px solid #0a1233!important;color:#fff;text-shadow:0 1px 0 #000}
.inp{background:#0b1740!important;border:3px solid #13224d!important;color:#fff;border-radius:14px!important}
/* шапка: блакитна панель, ресурси як у CR */
#hdr{background:linear-gradient(180deg,#2c52a8,#1b3375)!important;border-bottom:3px solid var(--crbd)!important;box-shadow:0 3px 0 rgba(0,0,0,.35)}
#hdr .tabular-nums{background:linear-gradient(180deg,#0f1f55,#0a1537)!important;border:2px solid #07102c!important;border-radius:14px!important;padding:5px 12px!important;font-size:13px!important;gap:5px!important;box-shadow:inset 0 2px 4px #000a;text-shadow:0 2px 0 #000}
#hdr #musBtn,#hdr #langBtn{background:linear-gradient(180deg,#46619b,#2a4078)!important;border:2px solid #13224d!important;border-radius:12px!important}
.logo-s{-webkit-text-stroke:1.2px #2a0612;font-size:24px}
/* заголовки екранів — золота стрічка як «Акції» */
.view>h2,.view>div>h2:first-child{display:block;width:fit-content;max-width:100%;margin:0 auto 12px!important;padding:8px 28px;border-radius:16px;background:linear-gradient(180deg,#ffd54f,#f0a020)!important;border:3px solid #8a4b00;box-shadow:0 4px 0 #6b3800,inset 0 2px 0 rgba(255,255,255,.5);color:#5a2f00!important;font-weight:400!important;text-shadow:0 2px 0 rgba(255,236,170,.9);-webkit-text-fill-color:#5a2f00;letter-spacing:.05em}
/* нижнє меню: активна вкладка розтягується з підписом, решта — лише іконки */
#nav{background:linear-gradient(180deg,#3d5c97,#25396b)!important;border-top:3px solid var(--crbd)!important;padding-left:0!important;padding-right:0!important;padding-top:0!important;gap:0;box-shadow:0 -3px 0 rgba(0,0,0,.3)}
#nav .nb{flex:1 1 0;min-width:0;padding:8px 0 6px;position:relative;transition:flex .22s ease,background .2s;color:#b9c9ee!important}
#nav .nb .nv{display:block;transition:transform .2s;filter:drop-shadow(0 2px 0 rgba(0,0,0,.5))}
#nav .nb>span:last-child{display:none;font-size:11px!important;font-weight:400!important;color:#fff;text-shadow:0 2px 0 #000,1px 1px 0 #000,-1px 1px 0 #000;margin-top:0}
#nav .nb.text-crimsonRed{flex:1.9 1 0;background:linear-gradient(180deg,#6aa0f0,#3567c4);box-shadow:inset 0 3px 0 rgba(255,255,255,.35);color:#fff!important}
#nav .nb.text-crimsonRed .nv{transform:translateY(-6px) scale(1.3)}
#nav .nb.text-crimsonRed>span:last-child{display:block;margin-top:-4px}
/* головна: великі CR-кнопки режимів */
#bSolo{min-height:86px;font-size:20px}#bSolo .text-xl{font-size:30px}#bSolo .text-\\[11px\\]{font-size:15px}
#bDuo,#bMulti{min-height:86px}
/* бокова планка «Шлях самурая» (під стрілкою-рекламою) */
#sprail{position:fixed;right:6px;top:150px;z-index:59;display:none;flex-direction:column;align-items:center;gap:2px}
#sprail.on{display:flex;animation:spIn .4s cubic-bezier(.3,1.4,.5,1)}
@keyframes spIn{from{transform:translateX(90px)}}
#spB{position:relative;width:62px;height:62px;border-radius:50%;border:4px solid #8a4b00;background:radial-gradient(circle at 50% 30%,#fff3b0,#ffc83a 55%,#f59e0b);box-shadow:0 4px 0 #6b3800,0 0 18px rgba(255,200,60,.55),inset 0 3px 0 rgba(255,255,255,.7);font-size:30px;display:flex;align-items:center;justify-content:center}
#spB.rdy{animation:spPulse 1.1s ease-in-out infinite}
@keyframes spPulse{50%{transform:scale(1.1);box-shadow:0 4px 0 #6b3800,0 0 30px rgba(255,220,90,.95),inset 0 3px 0 rgba(255,255,255,.7)}}
#spB i{position:absolute;right:-6px;top:-6px;min-width:22px;height:22px;border-radius:11px;background:#ef2b3a;border:2px solid #fff;color:#fff;font-style:normal;font-size:13px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 0 #7a0010;text-shadow:0 1px 0 #000}
#spT{font-size:12px;color:#fff;text-shadow:0 2px 0 #000,1px 1px 0 #000,-1px 1px 0 #000}
`;document.head.appendChild(c);
const L=document.createElement("link");L.rel="stylesheet";L.href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap";document.head.appendChild(L)})();

// ═══ ПЛАНКА «ШЛЯХ САМУРАЯ»: тап — вікно з 30 днями й кнопкою «Забрати» ═══
function spInit(){if(document.getElementById("sprail")){crLayout();return}const d=document.createElement("div");d.id="sprail";d.innerHTML=`<button id="spB" onclick="spOpen()">🎖<i id="spBd">!</i></button><div id="spT"></div>`;document.body.appendChild(d);crLayout()}
function lobIc(n,e){return typeof ico=="function"?ico(n,e,"h-9 w-9 object-contain"):e}
function lobBtn(id,n,e,fn){const b=document.createElement("button");b.id=id;b.className="sidei";b.setAttribute("onclick",fn);b.innerHTML='<span class="nv"></span><span class="lt"></span>';b.dataset.n=n;b.dataset.e=e;return b}
function lobSet(b,ic,txt,k){if(!b)return;const nv=b.firstChild,key=k||ic;if(b.dataset.k!==key){b.dataset.k=key;nv.innerHTML=ic}const l=b.lastChild;if(l.textContent!==txt)l.textContent=txt}
const lobTf=s=>s>=3600?(s/3600|0)+":"+String((s%3600)/60|0).padStart(2,"0")+":"+String(s%60).padStart(2,"0"):String(s/60|0).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
function spUpd(){spInit();const r=document.getElementById("sprail");if(!r)return;const nav=document.getElementById("nav"),show=typeof cur!="undefined"&&cur=="play"&&!(typeof G!="undefined"&&G&&G.on)&&typeof dailyReady=="function"&&nav&&nav.style.display!="none";
 const sl=document.getElementById("slrail");r.classList.toggle("on",!!show);if(sl)sl.classList.toggle("on",!!show);if(!show)return;
 const rd=dailyReady(),b=document.getElementById("spB");b.classList.toggle("rdy",rd);document.getElementById("spBd").style.display=rd?"flex":"none";document.getElementById("spT").textContent=t("День|Day")+" "+(dayIdx()+1)+"/"+DAILY.length;
 // ліва колонка: профіль (аватар), друзі, подія
 const pr=document.querySelector('#slrail .nb[data-g="profile"]');if(pr){const nv=pr.querySelector(".nv"),k="av"+S.av;if(nv.dataset.k!==k){nv.dataset.k=k;nv.innerHTML=typeof avHTML=="function"?'<div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center text-2xl">'+avHTML(S.av)+'</div>':"👤"}}
 const ev=typeof curEvent=="function"?curEvent():null;let eb=document.getElementById("lobEv");
 if(ev){if(!eb){eb=lobBtn("lobEv","lob_event","👹","lobModal()");document.getElementById("slrail").appendChild(eb)}const e=new Date();let en=new Date(e.getFullYear(),+ev[1].slice(0,2)-1,+ev[1].slice(3),23,59,59);if(en<e)en.setFullYear(en.getFullYear()+1);const dl=Math.max(1,Math.ceil((en-e)/864e5));lobSet(eb,lobIc("lob_event",ev[3]),dl+" "+t("д.|d"))}else if(eb)eb.remove();
 // права колонка: розіграш (таймер), шлях самурая, бонус часу
 const rw=document.querySelector('#sprail .nb[data-g="rewards"]');if(rw&&typeof rafTarget!="undefined"){const ms=Math.max(0,rafTarget-Date.now()),d=ms/864e5|0,l=rw.lastChild;l.removeAttribute("data-t");const tx=d>0?d+" "+t("д.|d"):lobTf(ms/1000|0);if(l.textContent!==tx)l.textContent=tx}
 let bb=document.getElementById("lobBn");if(!bb){bb=lobBtn("lobBn","lob_bonus","⏳","lobModal()");r.appendChild(bb)}
 const ti=typeof timeInfo=="function"?timeInfo():null;if(ti)lobSet(bb,lobIc("lob_bonus",ti.ic),lobTf(Math.max(0,Math.floor((ti.end-Date.now())/1000))));
 lobBanners()}
function lobModal(){sfx("open");dlModal(`<h3 class="font-black text-lg">⏱ ${t("Бонуси й події|Bonuses & events")}</h3>${timeCard()}<button class="btn w-full" onclick="dlClose()">${t("Закрити|Close")}</button>`);const p=document.getElementById("pc");p.onclick=()=>dlClose()}
// плашки: гравець угорі, «Подія» над кнопкою бою (як у CR)
function lobBanners(){const v=document.getElementById("view-play");if(!v||v.classList.contains("hidden"))return;
 if(!document.getElementById("lobPb")){const lv=lvl(S.xp),a=300*(lv-1)**2,b2=300*lv*lv,pr=Math.max(0,Math.min(1,(S.xp-a)/(b2-a)));
  v.insertAdjacentHTML("afterbegin",`<div id="lobPb"><div class="lav">${typeof avHTML=="function"?avHTML(S.av):"👤"}</div><div class="lnm"><b>${esc(S.nick||t("Гість|Guest"))}</b><span>${t("Рівень|Level")} ${lv}</span></div><div class="lxp"><i style="width:${(pr*100).toFixed(0)}%"></i><b>${fmt(Math.max(0,S.xp-a))} / ${fmt(b2-a)}</b></div></div>`)}
 const g=v.querySelector(":scope>.grid.grid-cols-3");if(g&&!document.getElementById("lobEb")){g.insertAdjacentHTML("beforebegin",`<button id="lobEb" onclick="lobModal()"><span class="tab">${t("Бонус|Bonus")}</span><span class="pl"><span id="lobEbT"></span></span></button>`)}
 const ti=typeof timeInfo=="function"?timeInfo():null,el=document.getElementById("lobEbT");if(el&&ti){const tx=ti.m?ti.ic+" "+t(ti.nm)+" ×"+ti.m+" · "+lobTf(Math.max(0,Math.floor((ti.end-Date.now())/1000))):ti.ic+" "+t("Наступний бонус через|Next bonus in")+" "+lobTf(Math.max(0,Math.floor((ti.end-Date.now())/1000)));if(el.textContent!==tx)el.textContent=tx}}
function spOpen(){sfx("open");dlModal(`<h3 class="font-black text-lg">🎖 ${t("Шлях самурая|Samurai path")}</h3>${dailyCard()}<button class="btn w-full" onclick="dlClose()">${t("Закрити|Close")}</button>`);const p=document.getElementById("pc");p.onclick=()=>{dlClose()};}
{const f=window.go;window.go=function(v){const r=f.apply(this,arguments);spUpd();return r}}
{const f=window.claimDaily;window.claimDaily=function(){dlClose();const r=f.apply(this,arguments);spUpd();return r}}
{const f=window.rend;window.rend=function(){const r=f.apply(this,arguments);spUpd();return r}}
setInterval(spUpd,1000);setTimeout(spUpd,1500);

// ═══ РОЗКЛАДКА CLASH ROYALE: низ — Магазин · Йокаї · ГРА (по центру) · Сундуки · Рейтинг; решта іконок — по боках головної ═══
(function(){const c=document.createElement("style");c.id="crlayout";c.textContent=`
#nav .nb[data-g="play"]{flex:1.6 1 0;margin-top:-14px;border-radius:22px 22px 0 0;background:linear-gradient(180deg,#ffd54f,#f59e0b)!important;border:3px solid #8a4b00;border-bottom:0;box-shadow:inset 0 3px 0 rgba(255,255,255,.6),0 -3px 10px rgba(0,0,0,.35);color:#fff!important}
#nav .nb[data-g="play"] .nv{transform:translateY(-2px) scale(1.35)}
#nav .nb[data-g="play"]>span:last-child{display:block;margin-top:0;font-size:12px!important}
#nav .nb:not([data-g="play"]).text-crimsonRed{flex:1.5 1 0}
.sidei{display:flex;flex-direction:column;align-items:center;gap:1px;background:none!important;border:0!important;padding:0!important;color:#fff!important}
.sidei .nv{width:56px;height:56px;border-radius:50%;display:flex!important;align-items:center;justify-content:center;font-size:25px;color:#fff;background:radial-gradient(circle at 50% 25%,#7fb4ff,#2f62c8 60%,#1d3f94);border:4px solid #0d1a40;box-shadow:0 4px 0 #0a1233,inset 0 3px 0 rgba(255,255,255,.45)}
.sidei .nv img{height:30px!important;width:30px!important}
.sidei>span:last-child{display:block!important;font-size:11px!important;color:#fff;text-shadow:0 2px 0 #000,1px 1px 0 #000,-1px 1px 0 #000;margin-top:0}
.sidei:active .nv{transform:translateY(3px);box-shadow:0 1px 0 #0a1233}
#slrail{position:fixed;left:6px;top:30%;z-index:59;display:none;flex-direction:column;gap:12px}
#slrail.on{display:flex;animation:slIn .4s cubic-bezier(.3,1.4,.5,1)}
@keyframes slIn{from{transform:translateX(-90px)}}
#sprail{gap:10px!important;top:calc(38% + 62px)!important}
#view-play:not(.hidden){display:flex;flex-direction:column}
#view-play>*{order:5}
#view-play>.card.relative.overflow-hidden{order:1;margin-left:58px;margin-right:58px}
#view-play>.grid.grid-cols-3{order:2;grid-template-columns:76px 1fr 76px!important;align-items:stretch}
#bSolo{order:2;min-height:96px;border-radius:20px!important}
#bSolo .text-xl{font-size:34px}#bSolo .text-\\[11px\\]{font-size:20px;letter-spacing:.06em}
#bDuo{order:1}#bMulti{order:3}
#bDuo,#bMulti{border-radius:18px!important;min-height:76px;align-self:center;padding:6px 2px!important}
#bDuo .text-\\[11px\\],#bMulti .text-\\[11px\\]{font-size:10px!important}
`;document.head.appendChild(c)})();
function crLayout(){const nav=document.getElementById("nav");if(!nav||nav.dataset.cr)return;nav.dataset.cr=1;
 const b=g=>nav.querySelector('.nb[data-g="'+g+'"]'),shop=b("shop"),play=b("play"),chests=b("chests"),rating=b("rating"),friends=b("friends"),rewards=b("rewards"),profile=b("profile");
 if(!(shop&&play&&chests&&rating&&friends&&rewards&&profile))return;
 const be=document.createElement("button");be.className="nb flex flex-col items-center text-gray-400";be.dataset.g="bestiary";be.setAttribute("onclick","bestiary()");
 be.innerHTML='<span class="nv" data-n="bestiary" data-fa="dragon"></span><span class="text-[9px] font-semibold mt-0.5" data-t="Йокаї|Yokai"></span>';
 nav.append(shop,be,play,chests,rating);
 const sl=document.createElement("div");sl.id="slrail";document.body.appendChild(sl);
 [profile,friends].forEach(x=>{x.classList.add("sidei");sl.appendChild(x)});
 rewards.classList.add("sidei");const sp=document.getElementById("sprail");if(sp)sp.insertBefore(rewards,sp.firstChild);
 try{navIcons()}catch(e){}try{tr()}catch(e){}}

(function(){const c=document.createElement("style");c.id="crlobby";c.textContent=`
#slrail{top:calc(env(safe-area-inset-top,0px) + 150px)!important;gap:8px!important}
#sprail{top:calc(env(safe-area-inset-top,0px) + 150px)!important;gap:8px!important}
#adw{top:calc(env(safe-area-inset-top,0px) + 420px)!important}
.sidei .nv{width:54px;height:54px}.sidei .nv img{height:34px!important;width:34px!important}
#lobEv .nv{background:radial-gradient(circle at 50% 25%,#c9a0ff,#7a3fd0 60%,#4b1f94)}
#lobBn .nv{background:radial-gradient(circle at 50% 25%,#ffe08a,#f3a21a 60%,#b86a00)}
#lobPb{order:0;display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:16px;background:linear-gradient(180deg,#14275e,#0b1740);border:3px solid #07102c;box-shadow:0 4px 0 #050c22,inset 0 2px 0 rgba(255,255,255,.18)}
#lobPb .lav{width:44px;height:44px;border-radius:12px;overflow:hidden;border:3px solid #ffd54f;display:flex;align-items:center;justify-content:center;font-size:26px;background:#0b1740}
#lobPb .lnm{display:flex;flex-direction:column;line-height:1.1;min-width:0}#lobPb .lnm b{font-size:17px;font-weight:400;color:#fff;text-shadow:0 2px 0 #000;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#lobPb .lnm span{font-size:12px;color:#9fc0ff}
#lobPb .lxp{position:relative;flex:1;height:22px;border-radius:11px;background:#06102e;border:2px solid #040a1e;overflow:hidden;box-shadow:inset 0 2px 4px #000a}
#lobPb .lxp i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(180deg,#5de0ff,#0a8be0)}
#lobPb .lxp b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:400;color:#fff;text-shadow:0 2px 0 #000,1px 1px 0 #000,-1px 1px 0 #000}
#lobEb{order:2;display:block;margin:2px auto 0;width:min(100%,330px);text-align:center;position:relative}
#lobEb .tab{display:block;width:62%;margin:0 auto;padding:2px 0;border-radius:12px 12px 0 0;background:linear-gradient(180deg,#8f5bf0,#5b2bb8);border:3px solid #2c0f66;border-bottom:0;color:#fff;font-size:15px;text-shadow:0 2px 0 #000}
#lobEb .pl{display:block;padding:8px 6px;border-radius:14px;background:linear-gradient(180deg,#ffd54f,#f59e0b);border:3px solid #8a4b00;box-shadow:0 4px 0 #6b3800,inset 0 2px 0 rgba(255,255,255,.55);color:#fff;font-size:16px;text-shadow:0 2px 0 rgba(0,0,0,.6),1px 1px 0 rgba(0,0,0,.5),-1px 1px 0 rgba(0,0,0,.5)}
#view-play>.grid.grid-cols-3{order:3!important}
`;document.head.appendChild(c)})();

// ═══ МАГАЗИН У СТИЛІ CLASH ROYALE: великі вкладки, товари — компактні плитки по 2 в ряд, ціна-кнопка знизу ═══
(function(){const c=document.createElement("style");c.id="crshop";c.textContent=`
#view-shop:not(.hidden){display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-items:stretch}
#view-shop>*{margin:0!important;min-width:0}
#view-shop>.grid,#view-shop>.flex.overflow-x-auto,#view-shop>p,#view-shop>div:not(.card),#view-shop>button.btn,#view-shop>.card:has(#pInc){grid-column:1/-1}
#view-shop>.grid.grid-cols-4{gap:6px!important}
#view-shop>.grid.grid-cols-4>button{padding:10px 2px!important;border-radius:14px 14px 6px 6px!important;font-size:12px!important;font-weight:400!important;line-height:1.1;color:#fff;background:linear-gradient(180deg,#46619b,#2a4078)!important;border:3px solid #13224d!important;box-shadow:0 3px 0 #0a1233;text-shadow:0 2px 0 #000}
#view-shop>.grid.grid-cols-4>button.bg-crimsonRed{background:linear-gradient(180deg,#ffd54f,#f59e0b)!important;border-color:#8a4b00!important;box-shadow:0 3px 0 #6b3800,inset 0 2px 0 rgba(255,255,255,.5);transform:translateY(-2px)}
/* плитка = картка товару */
#view-shop>.card:not(:has(#pInc)){display:flex!important;flex-direction:column;align-items:center;justify-content:space-between;gap:6px;text-align:center;padding:10px 8px!important}
#view-shop>.card:not(:has(#pInc))>div.flex,#view-shop>.card>div.p-3{flex-direction:column!important;align-items:center!important;gap:6px!important;width:100%;text-align:center;padding:6px!important}
#view-shop>.card:not(:has(#pInc))>div>div.flex.items-center{flex-direction:column;gap:6px}
#view-shop>.card .w-9.h-9{width:60px!important;height:60px!important;font-size:42px!important}
#view-shop>.card .w-9.h-9 img{height:60px!important;width:60px!important}
#view-shop>.card .text-3xl{font-size:44px}
#view-shop>.card .btng,#view-shop>.card .btn,#view-shop>.card [class*="w-[42%]"]{width:100%!important;min-width:0!important;justify-content:center;font-size:13px!important;padding:8px 4px!important}
#view-shop>.card b.text-xs{font-size:13px;font-weight:400;text-shadow:0 2px 0 rgba(0,0,0,.6);line-height:1.1}
#view-shop>.card .text-\\[10px\\],#view-shop>.card .text-\\[11px\\]{line-height:1.15}
/* товари-клинки: сітка вже 2×N усередині одного блоку — розтягуємо на весь ряд */
#view-shop>.grid.grid-cols-2{gap:10px!important}
#view-shop>.grid.grid-cols-2>.card{text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 8px!important}
#view-shop>.grid.grid-cols-2>.card .btn,#view-shop>.grid.grid-cols-2>.card .btng,#view-shop>.grid.grid-cols-2>.card .chip{width:100%;justify-content:center}
`;document.head.appendChild(c)})();
