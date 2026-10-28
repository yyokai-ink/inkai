window.INKV=window.INKV||{};INKV.ui2="20261028e";
/* INKAI ui2.js — навчання з живими демо, бестіарій з легендами, одна картка бонусу часу, круті ефекти сундука, активація знижки в чат, юридичний блок.
   Підключається ПІСЛЯ ui.js і lore.js. */

// ═══ CSS ═══
(function(){const st=document.createElement("style");st.textContent=`
.dstage{position:relative;height:150px;width:100%;border-radius:16px;overflow:hidden;background:radial-gradient(circle at 50% 130%,#4a2470,#150e22 72%);border:1px solid rgba(255,255,255,.12);box-shadow:inset 0 0 30px rgba(0,0,0,.5)}
.dstage .dy{position:absolute;display:flex;align-items:center;justify-content:center;width:46px;height:46px;font-size:34px;margin-left:-23px;top:-50px;animation:dFall 3.2s linear infinite}
.dstage .dy img{height:44px;width:auto}
@keyframes dFall{0%{transform:translateY(0)}34%{transform:translateY(80px) rotate(14deg);opacity:1}37%{transform:translateY(84px) rotate(18deg) scale(1.15);opacity:1}38%,100%{transform:translateY(84px) scale(.2);opacity:0}}
.dstage .dh{position:absolute;font-size:26px;top:34px;opacity:0;margin-left:-13px;animation:dHalf 3.2s linear infinite}
@keyframes dHalf{0%,36%{opacity:0;transform:none}37%{opacity:1;transform:none}70%{opacity:0;transform:translate(var(--hx),50px) rotate(var(--hr))}100%{opacity:0}}
.dstage .dsl{position:absolute;left:8%;top:92px;width:84%;height:5px;border-radius:5px;transform-origin:left center;transform:rotate(-8deg) scaleX(0);background:linear-gradient(90deg,transparent,var(--c1,#ffb703),#fff);box-shadow:0 0 14px var(--c2,#ff2a5f);opacity:0;animation:dSlash 3.2s ease-out infinite}
@keyframes dSlash{0%,31%{transform:rotate(-8deg) scaleX(0);opacity:0}33%{opacity:1}40%{transform:rotate(-8deg) scaleX(1);opacity:1}58%,100%{transform:rotate(-8deg) scaleX(1);opacity:0}}
.dstage .dp{position:absolute;font-weight:900;font-size:13px;color:#ffd27a;text-shadow:0 0 8px #000;opacity:0;margin-left:-20px;animation:dPop 3.2s ease-out infinite}
@keyframes dPop{0%,36%{opacity:0;transform:translateY(8px)}42%{opacity:1}75%{opacity:1;transform:translateY(-26px)}100%{opacity:0;transform:translateY(-34px)}}
.dstage .dcap{position:absolute;left:0;right:0;bottom:6px;text-align:center;font-size:11px;font-weight:800;color:#fff;text-shadow:0 1px 6px #000}
.dstage .dok{animation:dFallOK 3.2s linear infinite}
@keyframes dFallOK{0%{transform:translateY(0);opacity:1}45%{transform:translateY(190px) rotate(40deg);opacity:1}46%,100%{opacity:0}}
.dstage .dboom{position:absolute;font-size:44px;margin-left:-22px;opacity:0;animation:dBoom 3.2s ease-out infinite}
@keyframes dBoom{0%,53%{opacity:0;transform:scale(.3)}58%{opacity:1;transform:scale(1.5)}80%{opacity:0;transform:scale(2)}100%{opacity:0}}
.dstage .dy2{animation:dFall2 3.2s linear infinite}
@keyframes dFall2{0%,48%{transform:translateY(0);opacity:0}50%{opacity:1}56%{transform:translateY(70px);opacity:1}57%,100%{transform:translateY(70px);opacity:0}}
.dstage .dsl2{animation:dSlash2 3.2s ease-out infinite}
@keyframes dSlash2{0%,53%{transform:rotate(-8deg) scaleX(0);opacity:0}55%{opacity:1}60%{transform:rotate(-8deg) scaleX(1);opacity:1}72%,100%{transform:rotate(-8deg) scaleX(1);opacity:0}}
.dstage .dmiss{position:absolute;top:-50px;animation:dMiss 3.6s linear infinite}
@keyframes dMiss{0%{transform:translateY(0)}60%,100%{transform:translateY(215px)}}
.dstage .dx{position:absolute;top:10px;font-size:20px;font-weight:900;color:#4b5563;animation:dX 3.6s infinite}
@keyframes dX{0%,55%{color:#4b5563;transform:none}60%{color:#ff2a5f;transform:scale(1.5)}100%{color:#ff2a5f;transform:none}}
.dstage .bar{position:absolute;left:14%;right:14%;height:9px;border-radius:6px;background:#272235;overflow:hidden}
.dstage .bar i{display:block;height:100%;border-radius:6px}
.dstage .hpb i{background:#ff2a5f;animation:dHp 3.6s linear infinite}
@keyframes dHp{0%{width:100%}85%,100%{width:0}}
.dstage .tmb i{background:#ffb703;animation:dTm 3.6s linear infinite}
@keyframes dTm{0%{width:100%}100%{width:8%}}
.dstage .bsl{position:absolute;top:58px;height:5px;width:34%;border-radius:5px;opacity:0;background:linear-gradient(90deg,transparent,var(--c1,#ffb703),#fff);box-shadow:0 0 12px var(--c2,#ff2a5f);animation:dBsl 1.2s ease-out infinite}
@keyframes dBsl{0%{opacity:0;transform:translateX(-30px) rotate(var(--ra,-10deg))}30%{opacity:1}70%{opacity:0;transform:translateX(50px) rotate(var(--ra,-10deg))}100%{opacity:0}}
.dstage .bsh{animation:dShake .3s linear infinite}
@keyframes dShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
.dstage .card2{position:absolute;top:36px;width:72px;height:74px;border-radius:14px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:30px;animation:dCard 3.6s infinite}
.dstage .card2 small{font-size:9px;color:#ffd27a;font-weight:800}
@keyframes dCard{0%,10%{transform:scale(1);box-shadow:none}20%{transform:scale(1.12);box-shadow:0 0 18px #ffb703;border-color:#ffb703}35%,100%{transform:scale(1);box-shadow:none}}
.dstage .coin{position:absolute;top:-16px;font-weight:900;color:#ffd27a;font-size:16px;animation:dCoin 2.4s linear infinite}
@keyframes dCoin{to{transform:translateY(180px) rotate(360deg);opacity:.2}}
@keyframes dPop2{0%,56%{opacity:0}62%{opacity:1}85%{opacity:1;transform:translateY(-20px)}100%{opacity:0}}
.tgs{gap:10px;min-height:0;justify-content:flex-start}
.tg-dots{display:flex;justify-content:center;gap:6px;margin:2px 0 4px}
#pc>.card,#pc .card{max-height:88vh;overflow-y:auto}
.tg-btns{display:flex;gap:8px;margin-top:16px;padding-bottom:6px}
.tg-btns+button{margin-top:6px}
/* час-бонус */
.tcard{position:relative;overflow:hidden}
.tcard .tm{font-family:ui-monospace,monospace;font-weight:900;font-size:22px;letter-spacing:.06em}
.tchip{padding:3px 8px;border-radius:999px;font-size:10px;font-weight:700;border:1px solid #272235;color:#9ca3af;background:rgba(10,9,13,.6)}
.tchip.on{color:#ffd27a;border-color:#ffb703;background:rgba(255,183,3,.12);box-shadow:0 0 10px rgba(255,183,3,.3)}

/* сундук: плавні світні ефекти, лише круглі м'які форми */
.chmote{position:absolute;bottom:6%;width:var(--z);height:var(--z);border-radius:50%;background:radial-gradient(circle,#fff 0,var(--c) 45%,transparent 72%);opacity:0;pointer-events:none;animation:moteUp var(--d) var(--dl) ease-in infinite}
@keyframes moteUp{0%{transform:translateY(0) scale(.5);opacity:0}20%{opacity:.9}100%{transform:translateY(-230px) scale(1.1);opacity:0}}
.chha,.chhb{will-change:transform,opacity}
.chha{animation:chHalf .6s cubic-bezier(.25,.6,.3,1) forwards}.chhb{animation:chHalf .6s cubic-bezier(.25,.6,.3,1) forwards}
@keyframes chHalf{0%{transform:none;opacity:1}30%{transform:translate(calc(var(--sx)*.3),calc(var(--sy)*.3));opacity:1}100%{transform:translate(var(--sx),var(--sy)) rotate(var(--rt));opacity:0}}
.chglow{position:absolute;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;pointer-events:none;z-index:20;background:radial-gradient(circle,#fff 0,var(--ca,#ffd24a) 38%,transparent 70%);mix-blend-mode:screen;animation:chGlow 1.1s ease-out forwards}
@keyframes chGlow{0%{transform:scale(.2);opacity:0}18%{opacity:1}100%{transform:scale(7);opacity:0}}
.chring{position:absolute;width:80px;height:80px;margin:-40px 0 0 -40px;border-radius:50%;pointer-events:none;z-index:21;border:2px solid #fff;box-shadow:0 0 18px var(--ca,#ffd24a),inset 0 0 18px var(--ca,#ffd24a);animation:chRing 1s .08s cubic-bezier(.1,.7,.3,1) forwards;opacity:0}
@keyframes chRing{0%{transform:scale(.3);opacity:.9}100%{transform:scale(4.6);opacity:0}}
.chseam{position:absolute;width:420px;height:4px;margin:-2px 0 0 -210px;border-radius:4px;pointer-events:none;z-index:22;background:linear-gradient(90deg,transparent,#fff 30%,#fff 70%,transparent);box-shadow:0 0 14px #fff,0 0 30px var(--ca,#ffd24a);transform:rotate(var(--ang));animation:chSeam .3s ease-out forwards;opacity:0}
@keyframes chSeam{0%{opacity:1;transform:rotate(var(--ang)) scaleX(.1)}40%{opacity:1;transform:rotate(var(--ang)) scaleX(1)}100%{opacity:0;transform:rotate(var(--ang)) scaleX(1.1) scaleY(.4)}}
/* сундук */
#chw.chdrop{animation:chDrop .95s cubic-bezier(.3,1.35,.5,1) both}
@keyframes chDrop{0%{transform:translateY(-120vh) scale(.7) rotate(-14deg);opacity:0}55%{opacity:1}100%{transform:none}}
.charay{display:none;position:absolute;left:50%;top:50%;width:170vmin;height:170vmin;margin:-85vmin 0 0 -85vmin;pointer-events:none;background:repeating-conic-gradient(from 0deg,var(--ca,#ffd24a) 0 5deg,transparent 5deg 24deg);-webkit-mask-image:radial-gradient(circle,#000 0,transparent 55%);mask-image:radial-gradient(circle,#000 0,transparent 55%);opacity:calc(.08 + var(--lv,0)*.07);animation:raySpin 26s linear infinite;mix-blend-mode:screen}
@keyframes raySpin{to{transform:rotate(360deg)}}
.chaura{position:absolute;inset:-46px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,var(--ca,#ffd24a) 0,transparent 66%);opacity:calc(.14 + var(--lv,0)*.12);filter:blur(12px);animation:auraP 1.7s ease-in-out infinite}
@keyframes auraP{50%{transform:scale(1.12)}}
.chcr{position:absolute;left:50%;top:50%;width:160%;height:3px;margin:-1.5px 0 0 -80%;pointer-events:none;mix-blend-mode:screen;border-radius:3px;background:linear-gradient(90deg,transparent,#fff 35%,#fff 65%,transparent);box-shadow:0 0 14px #fff,0 0 34px var(--ca,#ffd24a);transform:rotate(var(--a));animation:crFlash .55s ease-out forwards}
@keyframes crFlash{0%{opacity:1;transform:rotate(var(--a)) scaleX(.1)}30%{transform:rotate(var(--a)) scaleX(1)}100%{opacity:.4;transform:rotate(var(--a)) scaleX(1)}}
.chflash{position:absolute;inset:0;background:radial-gradient(circle at 50% 46%,#fff 0,rgba(255,255,255,.6) 30%,transparent 70%);pointer-events:none;animation:flashO .9s ease-out forwards;z-index:30}
@keyframes flashO{0%{opacity:0}12%{opacity:1}100%{opacity:0}}
.chbeam{position:absolute;left:50%;top:46%;width:14px;height:0;margin-left:-7px;transform-origin:50% 100%;pointer-events:none;background:linear-gradient(0deg,#fff,var(--ca,#ffd24a),transparent);filter:blur(1px);border-radius:8px;z-index:29;animation:beam .9s ease-out forwards}
@keyframes beam{0%{height:0;opacity:1}40%{height:90vmax;opacity:.95}100%{height:100vmax;opacity:0}}
.chshake{animation:bigShake .55s linear}
@keyframes bigShake{0%,100%{transform:none}15%{transform:translate(-4px,2px)}35%{transform:translate(3px,-3px)}55%{transform:translate(-3px,-2px)}75%{transform:translate(2px,3px)}}
.wow{font-size:42px;font-weight:900;letter-spacing:.04em;line-height:1;background:linear-gradient(180deg,#fff,#ffd24a 50%,#ff5c3a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 16px rgba(255,180,40,.7));animation:wowP 1s cubic-bezier(.3,1.5,.5,1) both}
@keyframes wowP{from{transform:scale(.2) rotate(-8deg);opacity:0}}
.bsc{border-radius:14px;padding:8px 6px;text-align:center;background:linear-gradient(160deg,#17121f,#0a090d);transition:transform .15s}
.bsc:active{transform:scale(.95)}
.bsc.lk img{filter:brightness(0) opacity(.5)}
.bsaura{position:relative;margin:0 auto;width:150px;height:150px;display:flex;align-items:center;justify-content:center;font-size:84px}
.bsaura::before{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,var(--bc) 0,transparent 68%);opacity:.5;filter:blur(8px);animation:auraP 2.4s ease-in-out infinite}
.bsaura img{position:relative;height:140px;width:auto;filter:drop-shadow(0 0 14px var(--bc))}
`;document.head.appendChild(st)})();

// ═══ НАВЧАННЯ: слайди з живими демо (як у справжній грі) ═══
const yI=(k,e,x,d)=>`<div class="dy" style="left:${x}%;animation-delay:${d||0}s">${IMG("assets/yokai_"+k+".png",e,"")}</div>`;
function dTrail(){const c=bcols(BL[S.blade]);return `--c1:${c[0]};--c2:${c[1]||c[0]}`}
function demoHTML(i){const tr=dTrail();
 switch(i){
 case 0:return `<div class="dstage" style="${tr}">${yI("fox","🦊",24)}${yI("oni","👹",50)}${yI("tengu","👺",76)}<i class="dsl"></i>
  <span class="dh" style="left:22%;--hx:-30px;--hr:-70deg">🦊</span><span class="dh" style="left:27%;--hx:30px;--hr:70deg">🦊</span><span class="dh" style="left:48%;--hx:-30px;--hr:-70deg">👹</span><span class="dh" style="left:53%;--hx:30px;--hr:70deg">👹</span><span class="dh" style="left:74%;--hx:-30px;--hr:-70deg">👺</span><span class="dh" style="left:79%;--hx:30px;--hr:70deg">👺</span>
  <b class="dp" style="left:24%;top:46px">+1 文</b><b class="dp" style="left:50%;top:46px">+1 文</b><b class="dp" style="left:76%;top:46px">+1 文</b><div class="dcap">${t("Один свайп — три йокаї = бонус!|One swipe — three yokai = bonus!")}</div></div>`;
 case 1:return `<div class="dstage" style="${tr}"><div class="dy dok" style="left:30%">${IMG("assets/yokai_pumpkin.png",BOMB.e,"")}</div>
  <div class="dy dy2" style="left:68%;top:0">${IMG("assets/yokai_pumpkin.png",BOMB.e,"")}</div><i class="dsl dsl2" style="top:62px"></i><span class="dboom" style="left:68%;top:36px">💥</span><b class="dp" style="left:68%;top:40px;color:#ff5c5c;animation-name:dPop2">−3</b>
  <b style="position:absolute;left:30%;top:14px;margin-left:-30px;font-size:11px;color:#6ee7b7">✔ ${t("дай впасти|let it fall")}</b><b style="position:absolute;left:68%;top:14px;margin-left:-30px;font-size:11px;color:#ff7b7b">✖ ${t("не ріж!|don't cut!")}</b></div>`;
 case 2:return `<div class="dstage"><div class="dmiss" style="left:30%;top:-50px">${IMG("assets/yokai_oni.png","👹","h-11")}</div><div class="dmiss" style="left:60%;animation-delay:1.2s;top:-50px">${IMG("assets/yokai_kappa.png","🐸","h-11")}</div>
  <div style="position:absolute;top:8px;left:0;right:0;display:flex;justify-content:center;gap:10px"><span class="dx" style="position:static;animation-delay:.1s">✖</span><span class="dx" style="position:static;animation-delay:1.2s">✖</span><span class="dx" style="position:static;animation-delay:2.3s">✖</span><span class="dx" style="position:static;animation-delay:3.4s">✖</span></div>
  <div class="dcap">${t("Не зрізав — це промах. 3 промахи = кінець|Uncut = a miss. 3 misses = end")}</div></div>`;
 case 3:return `<div class="dstage"><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px"><div id="dmC" style="font-size:44px;font-weight:900;color:#ffd27a;text-shadow:0 0 18px #ff7a3d">×1</div><div class="bar" style="position:relative;left:auto;right:auto;width:60%"><i id="dmB" style="width:0;background:linear-gradient(90deg,#ffb703,#ff2a5f);transition:width .25s"></i></div><div id="dmF" style="font-size:13px;font-weight:900;color:#fff;opacity:0;transition:opacity .2s">🔥 ${t("ШАЛЕНСТВО ×2|FRENZY ×2")}</div></div></div>`;
 case 4:return `<div class="dstage" style="${tr}"><div class="bar hpb" style="top:10px"><i></i></div><div class="bar tmb" style="top:24px;height:6px"><i></i></div>
  <div class="bsh" style="position:absolute;left:50%;top:40px;margin-left:-45px;width:90px;height:90px;display:flex;align-items:center;justify-content:center;font-size:66px;filter:drop-shadow(0 0 16px #facc15)">${IMG("assets/boss_gld.png","👑","h-20")}</div>
  <i class="bsl" style="left:18%;top:70px"></i><i class="bsl" style="left:48%;top:84px;--ra:10deg;animation-delay:.6s"></i><div class="dcap">${t("Рубай з боку в бік за 5 с — отримаєш нагороду|Slash side to side in 5 s for a reward")}</div></div>`;
 case 5:return `<div class="dstage"><span class="coin" style="left:20%">文</span><span class="coin" style="left:45%;animation-delay:.8s">文</span><span class="coin" style="left:70%;animation-delay:1.5s">文</span><span class="coin" style="left:85%;animation-delay:.3s">文</span>
  <div class="card2" style="left:7%">💪<small>${t("Покращення|Upgrades")}</small></div><div class="card2" style="left:37%;animation-delay:1.2s">🗡<small>${t("Катани|Blades")}</small></div><div class="card2" style="left:67%;animation-delay:2.4s">📦<small>${t("Сундуки|Chests")}</small></div></div>`;
 default:return `<div class="dstage"><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px"><div style="font-size:50px;animation:floatY 2s ease-in-out infinite">🎁</div><div class="bar" style="position:relative;left:auto;right:auto;width:70%;height:12px"><i style="background:linear-gradient(90deg,#ff2a5f,#ffb703);animation:dHp2 4s ease-in-out infinite"></i></div><div style="font-size:11px;color:#ffd27a;font-weight:800">0 → 3 000 000 文</div></div></div><style>@keyframes dHp2{0%{width:0}85%,100%{width:100%}}</style>`}}
// живий лічильник комбо у слайді 4
let _tgI=null;function tgDemoJS(i){clearInterval(_tgI);_tgI=null;if(i!=3)return;let n=1;_tgI=setInterval(()=>{const c=document.getElementById("dmC");if(!c){clearInterval(_tgI);return}n=n>=14?1:n+1;c.textContent="×"+n;document.getElementById("dmB").style.width=Math.min(100,n/12*100)+"%";document.getElementById("dmF").style.opacity=n>=12?1:0},420)}
function tgRender(){const S_=tutSlides(),s=S_[_tg.i],last=_tg.i==S_.length-1,el=document.getElementById("tgBody");if(!el)return;
 el.innerHTML=`<div class="tgs">${demoHTML(_tg.i)}<div class="tg-dots">${S_.map((_,k)=>`<i class="tg-dot${k==_tg.i?" on":""}"></i>`).join("")}</div><h3 class="font-black text-lg leading-tight">${t(s.h)}</h3><p class="text-sm text-gray-200 leading-relaxed">${t(s.p)}</p></div>
 <div class="tg-btns">${_tg.i?`<button class="btn !bg-inkDark border border-inkBorder flex-1 py-3" onclick="tgGo(-1)">←</button>`:""}<button class="btng flex-[3] py-3" onclick="tgGo(1)">${last?(_tg.after?t("Почати навчальний раунд!|Start practice round!"):t("Зрозуміло!|Got it!")):t("Далі →|Next →")}</button></div>
 ${_tg.after?`<button class="text-[11px] text-gray-400 underline pb-1" onclick="tgSkip()">${t("Пропустити|Skip")}</button>`:""}`;tgDemoJS(_tg.i)}
{const f=window.tgSkip;window.tgSkip=function(){clearInterval(_tgI);return f()}}

// ═══ БЕСТІАРІЙ З ЛЕГЕНДАМИ ═══
const BST_R=[[5,{mon:2000},"2 000 文"],[10,{jd:3},"3 💎"],[15,{ln:2,souls:10},"2 🏮 + 10 ⛩️"],[20,{jd:10},"10 💎 + −30% flash"]];
const bImg=(k,e,c)=>IMG("assets/boss_"+k+".png",e,c||"h-14 w-auto");
const bEm=B=>B[0].split("|")[0].split(" ")[0];
function bestiary(){const ks=Object.keys(BOSS),got=ks.filter(k=>(S.bst||{})[k]>0).length,p=$("pc");p.onclick=()=>p.classList.replace("flex","hidden");S.bstR=S.bstR||{};
 const ms=BST_R.map(([n,r,lb])=>{const ok=got>=n,cl=S.bstR[n];return `<button class="tchip ${ok&&!cl?"on":""}" ${ok&&!cl?`onclick="bstReward(${n});event.stopPropagation()"`:"disabled"}>${cl?"✓":ok?"🎁":"🔒"} ${n} → ${lb}</button>`}).join("");
 p.innerHTML=`<div class="card rounded-3xl w-full max-w-sm space-y-3" onclick="event.stopPropagation()"><h3 class="font-black text-center">📖 ${t("Бестіарій йокаїв|Yokai bestiary")} ${got}/${ks.length}</h3>
 <div class="fsb"><i style="width:${got/ks.length*100}%"></i></div>
 <p class="text-[11px] text-gray-400 text-center">${t("Переможи боса — він потрапить у колекцію, а ти відкриєш його легенду. Торкнись картки, щоб прочитати історію.|Defeat a boss to add it to your collection and unlock its legend. Tap a card to read its story.")}</p>
 <div class="flex flex-wrap gap-1.5 justify-center">${ms}</div>
 <button class="btng w-full py-3" onclick="$('pc').classList.replace('flex','hidden');mgOpen()">🎮 ${t("Полювання на демонів|Demon hunt")} · ${mgLeft()}/${MG_DAY}${(S.mg&&S.mg.b)?" · 🏆 "+fmt(S.mg.b):""}</button>
 <div class="grid grid-cols-3 gap-2">${ks.map(k=>{const n=(S.bst||{})[k]||0,B=BOSS[k];return `<button class="bsc ${n?"":"lk"}" style="border:1px solid ${n?B[1]:"#272235"};${n?`box-shadow:0 0 12px ${B[1]}44`:""}" onclick="bossLore('${k}')"><div class="h-14 flex items-center justify-center text-3xl">${bImg(k,n?bEm(B):"❔")}</div><b class="text-[10px] block leading-tight mt-1">${n?t(B[0]):"???"}</b><div class="text-[10px] ${n?"text-neonGold":"text-gray-600"}">${n?"⚔️ ×"+n:"🔒"}</div></button>`}).join("")}</div>
 ${got>=ks.length?`<button class="btng w-full py-2.5" ${S.flash?"disabled":""} onclick="claimFlash()">${S.flash?"✓":t("Забрати знижку 30%|Claim 30% off")}</button>`:""}
 <button class="btn w-full" onclick="$('pc').classList.replace('flex','hidden')">${t("Закрити|Close")}</button></div>`;p.classList.replace("hidden","flex")}
function bstReward(n){const x=BST_R.find(r=>r[0]==n);S.bstR=S.bstR||{};if(!x||S.bstR[n]||Object.keys(S.bst||{}).filter(k=>S.bst[k]>0).length<n)return;S.bstR[n]=1;Object.entries(x[1]).forEach(([k,v])=>S[k]=(S[k]||0)+v);save();hdr();sfx("claim");toast("🎉 "+t("Нагорода колекції: |Collection reward: ")+x[2]);bestiary()}
function bossLore(k){const B=BOSS[k],n=(S.bst||{})[k]||0,L=LORE[k]||[0,"?|?"],p=$("pc");sfx("open");
 p.innerHTML=`<div class="card rounded-3xl w-full max-w-sm space-y-3 text-center" onclick="event.stopPropagation()" style="border-color:${B[1]}88">
 <div class="bsaura ${n?"":"lk"}" style="--bc:${B[1]}">${bImg(k,n?bEm(B):"❔","")}</div>
 <h3 class="font-black text-xl" style="color:${n?B[1]:"#9ca3af"}">${n?t(B[0]):"???"}</h3>
 ${n?`<div class="flex justify-center gap-2 flex-wrap"><span class="tchip on">⚔️ ${t("Переможено|Defeated")} ×${n}</span><span class="tchip">${L[0]?"📜 "+t("За мотивами легенди|Based on a legend"):"✨ "+t("Нова легенда INKAI|New INKAI legend")}</span></div>
 <p class="text-sm text-gray-200 leading-relaxed text-left">${t(L[1])}</p>
 <div class="text-[11px] text-left rounded-xl p-2.5" style="background:#0a090d;border:1px solid #272235"><b class="text-neonGold">⚡ ${t("Сила|Power")}:</b> ${t(B[3])}<br><b class="text-emerald-400">🎯 ${t("Порада|Tip")}:</b> ${t(LORE_TIP[k]||"—")}</div>`
 :`<p class="text-sm text-gray-300">${t("Цього боса ти ще не зустрів. Він з'явиться під час раунду — переможи його, і відкриється його легенда.|You haven't met this boss yet. He will appear in a round — defeat him to unlock his legend.")}</p><div class="text-[11px] text-gray-500">🔒 ${t("Легенда закрита|Legend locked")}</div>`}
 <button class="btn w-full" onclick="bestiary()">← ${t("До бестіарію|Back to bestiary")}</button></div>`;p.classList.replace("hidden","flex")}

// ═══ ОДНА КАРТКА БОНУСУ ЧАСУ (ранок / вечір / подія / Ніч Сьогуна) ═══
function timeInfo(){const n=new Date(),ev=curEvent(),evm=ev?ev[6]:1,dm=dayMode(),at=hr=>{const d=new Date(n);d.setHours(hr>=24?0:hr,0,0,0);if(hr>=24||d<=n)d.setDate(d.getDate()+1);return d};
 const nxt=new Date(Math.min(at(DM.morning.h[0]),at(DM.evening.h[0])));
 if(typeof shogunNight=="function"&&shogunNight()){const e=new Date(n);e.setHours(23,0,0,0);return{ic:"🌙",nm:"Ніч Сьогуна|Shogun's Night",m:2,base:2,end:e,ds:"Усі монети за раунд ×2|All round coins ×2",id:"sh",ev:ev}}
 if(dm)return{ic:dm.ic,nm:dm.nm,m:dm.m,base:dm.m,end:at(dm.h[1]),ds:dm.ds,id:dm.id,ev:null};
 if(ev)return{ic:ev[3],nm:ev[4],m:evm,base:1,end:nxt,ds:ev[5],id:"ev",ev:null,endsBeforeNext:1};
 return{ic:"⏳",nm:"Наступний бонус|Next bonus",m:0,base:0,end:nxt,ds:"",id:"none",ev:null}}
const tfmt=s=>String(s/3600|0).padStart(2,"0")+":"+String((s%3600)/60|0).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
function timeCard(){const i=timeInfo(),ev=curEvent(),n=new Date(),s=Math.max(0,Math.floor((i.end-Date.now())/1000)),dm=dayMode();
 const inH=h=>{const d=new Date(n);d.setHours(h>=24?0:h,0,0,0);if(h>=24||d<=n)d.setDate(d.getDate()+1);const m=Math.max(0,(d-n)/6e4|0);return(m/60|0)+t(" год |h ")+(m%60)+t(" хв|min")};
 const row=(ic,nm,win,mul,on,st)=>`<div class="flex items-center gap-2 rounded-xl px-2.5 py-1.5 ${on?"bg-neonGold/15 border border-neonGold":"bg-inkDark border border-inkBorder opacity-80"}"><span class="text-lg">${ic}</span><div class="flex-1 min-w-0 text-left"><div class="text-[11px] font-bold leading-tight truncate">${nm}</div><div class="text-[10px] text-gray-400">${win}</div></div><div class="text-right"><div class="text-xs font-black ${on?"text-neonGold":"text-gray-400"}">×${mul}</div><div class="text-[9px] ${on?"text-emerald-400":"text-gray-500"}">${st}</div></div></div>`;
 const evOn=!dm&&i.id!="sh",evRow=ev?row(ev[3],t(ev[4]),t("до|until")+" "+ev[1].split("-").reverse().join("."),ev[6],evOn,evOn?t("діє зараз|active now"):t("після режиму дня|after the day mode")):"";
 const stack="";
 return `<div class="card tcard text-center space-y-1.5 !border-neonGold/50"><div class="flex items-center justify-center gap-2"><span class="text-2xl">${i.ic}</span><b class="text-neonGold text-sm">${t(i.nm)}</b>${i.m?`<span class="chip text-neonGold">${t("монети|coins")} ×${i.m}</span>`:""}</div>
 <div class="tm" id="tcCd" data-end="${+i.end}">${tfmt(s)}</div><div class="text-[10px] text-gray-400">${i.id=="none"?t("до початку наступного|until the next one"):i.id=="ev"?t("до початку наступного режиму дня|until the next day mode"):t("до кінця бонусу|until the bonus ends")}</div>
 ${i.ds?`<div class="text-[11px] text-gray-300">${t(i.ds)}</div>`:""}${stack}
 <div class="space-y-1 pt-1">${row("🌅",t(DM.morning.nm),"06:00–13:00",DM.morning.m,!!dm&&dm.id=="morning",dm&&dm.id=="morning"?t("діє зараз|active now"):t("через |in ")+inH(DM.morning.h[0]))}${row("🦊",t(DM.evening.nm),"17:00–24:00",DM.evening.m,!!dm&&dm.id=="evening",dm&&dm.id=="evening"?t("діє зараз|active now"):t("через |in ")+inH(DM.evening.h[0]))}${evRow}</div>
 ${ev&&dm?`<div class="text-[10px] text-gray-500">${t("Бонуси не складаються: діє лише один за раз|Bonuses do not stack: only one applies at a time")}</div>`:""}</div>`}
setInterval(()=>{const e=document.getElementById("tcCd");if(!e)return;const s=Math.floor((+e.dataset.end-Date.now())/1000);if(s<=0){if(cur=="play"&&!(typeof G!="undefined"&&G&&G.on))rend();return}e.textContent=tfmt(s)},1000);

// ═══ ЕФЕКТИ СУНДУКА ═══
function chInit(chw,cols){chw.style.setProperty("--ca",cols[0]||"#ffd24a");chw.style.setProperty("--lv",0);
 chw.insertAdjacentHTML("afterbegin",Array.from({length:9},(_,i)=>`<i class="chmote" style="left:${8+R()*84}%;--d:${3+R()*3}s;--dl:${-R()*5}s;--z:${4+R()*7}px;--c:${cols[i%cols.length]}"></i>`).join(""))}
function chCrack(){}   // тріщини більше не показуємо
function chFinale(rc,cols,cx,cy){const c=cols[0]||"#ffd24a";rc.style.setProperty("--ca",c);rc.classList.remove("chshake");void rc.offsetWidth;rc.classList.add("chshake");
 const W=rc.clientWidth,H=rc.clientHeight,dp=Math.min(2,devicePixelRatio||1),cv=document.createElement("canvas");cv.width=W*dp;cv.height=H*dp;cv.style.cssText="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:25";rc.appendChild(cv);
 const g=cv.getContext("2d");g.scale(dp,dp);const hx6=x=>/^#[0-9a-f]{6}$/i.test(x)?x:/^#[0-9a-f]{3}$/i.test(x)?"#"+x[1]+x[1]+x[2]+x[2]+x[3]+x[3]:"#ffffff",pal=[...cols.map(hx6),"#ffffff","#ffffff"],P=[];
 for(let i=0;i<34;i++){const a=R()*6.283,v=90+R()*260;P.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,l:.9+R()*.6,age:0,z:2+R()*3.5,c:pal[R()*pal.length|0],tw:R()*6})}
 let last=performance.now();const t0=last,loop=now=>{if(!cv.isConnected)return;const dt=Math.min(.05,(now-last)/1000);last=now;g.clearRect(0,0,W,H);g.globalCompositeOperation="lighter";
  for(const p of P){p.age+=dt;const f=p.age/p.l;if(f>=1)continue;const k=Math.pow(.94,dt*60);p.vx*=k;p.vy=p.vy*k-26*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
   const r=p.z*4.5,gr=g.createRadialGradient(p.x,p.y,0,p.x,p.y,r);gr.addColorStop(0,p.c+"ff");gr.addColorStop(.3,p.c+"99");gr.addColorStop(1,p.c+"00");g.globalAlpha=Math.max(0,(1-f)*Math.min(1,f*10)*(.7+.3*Math.sin(now/90+p.tw)));g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y,r,0,6.283);g.fill()}
  g.globalAlpha=1;if(now-t0<900)requestAnimationFrame(loop);else cv.remove()};requestAnimationFrame(loop)}

// ═══ ЗНИЖКА ЗІ СКРИНІ: «ВАУ» + активація + чат ═══
{const f=window.reveal;window.reveal=function(it){f(it);if(it.ty!="d")return;setTimeout(()=>{const c=document.getElementById("rcard"),cp=S.cp[S.cp.length-1];if(!c||!cp)return;
 c.innerHTML=`<div class="text-[11px] font-black tracking-[.35em] uppercase" style="color:#ffd24a;animation:cardIn .6s .2s both">${t("ЩАСЛИВИЙ ДЕНЬ|LUCKY DAY")}</div><div class="wow">${t("ВАУУУ!|WOOOW!")}</div>
 <div class="relative mx-auto flex items-center justify-center" style="width:150px;height:150px;animation:dropBounce .95s cubic-bezier(.3,1.2,.4,1) both"><span class="text-7xl" style="filter:drop-shadow(0 0 22px #ffb703)">🏷</span><b class="absolute -right-2 -top-1 text-xl px-3 py-1 rounded-full" style="background:linear-gradient(135deg,#ffcf4d,#ff2a5f);box-shadow:0 0 18px #ff2a5f">−${it.v}%</b></div>
 <div class="text-lg font-black" style="animation:cardIn .6s .6s both">${t("Ти вибив(ла) знижку "+it.v+"% на сеанс тату!|You won "+it.v+"% off a tattoo session!")}</div>
 <div class="text-sm text-gray-200" style="animation:cardIn .6s .8s both">${t("Активуй її й зроби собі тату мрії 🖤|Activate it and get your dream tattoo 🖤")}</div>
 <div style="animation:cardIn .6s 1s both" class="space-y-2 pt-1"><button class="btng px-8 py-3 w-full" onclick="useDisc()">🎟 ${t("Активувати та записатись|Activate & book")}</button><button class="btn !bg-inkDark border border-inkBorder w-full py-2.5" onclick="closeRev()">${t("Пізніше (збережено в «Нагороди»)|Later (saved in Rewards)")}</button></div>`},30)}}
function useDisc(){const cp=[...S.cp].reverse().find(c=>!c.used&&String(c.type).startsWith("d"));closeRev();if(cp)setTimeout(()=>claim(cp.type,cp.code),200)}
const dHandle=(v,d)=>String(v||d||"").replace(/^@/,"").replace(/^https?:\/\/(www\.)?(instagram\.com|t\.me)\//,"").replace(/\/$/,"");
function discountGo(cp,m){const o=(window.INK_CFG&&INK_CFG.org)||{},ig=dHandle(m&&m.ig,o.instagram),tg=dHandle(o.telegram,"yyokai"),code=cp?cp.code:"",pct=cp&&/^d\d+/.test(cp.type)?cp.type.slice(1):"";
 window._dmsg=t("Привіт! Я з гри INKAI 🥷 Мій код знижки: #"+code+(pct?" (−"+pct+"% на тату)":"")+". Хочу активувати й записатись на сеанс.|Hi! I'm from the INKAI game 🥷 My discount code: #"+code+(pct?" (−"+pct+"% off a tattoo)":"")+". I'd like to activate it and book a session.");window._dig=ig;window._dtg=tg;
 dlModal(`<div class="text-4xl">🎉</div><h3 class="font-black text-lg">${t("Знижку активовано!|Discount activated!")}</h3><p class="text-xs text-gray-300">${t("Заявку надіслано майстру. Щоб записатись швидше — напиши йому просто зараз: код уже в повідомленні.|Your request was sent to the master. To book faster, message him right now — the code is already in the text.")}</p>
 <div class="rounded-2xl py-3" style="background:#0a090d;border:1px dashed #ffb703"><div class="text-[10px] text-gray-400">${t("Твій код|Your code")}</div><div class="font-mono text-2xl font-black tracking-widest text-neonGold">#${esc(code)}</div>${pct?`<div class="text-sm font-bold">−${pct}%</div>`:""}</div>
 <button class="btng w-full py-3" onclick="dmGo('ig')">📸 ${t("Написати в Instagram|Message on Instagram")}</button><button class="btn w-full py-3" onclick="dmGo('tg')">✈️ ${t("Написати в Telegram|Message on Telegram")}</button>
 <button class="btn !bg-inkDark border border-inkBorder w-full" onclick="dmCopy()">📋 ${t("Скопіювати повідомлення|Copy message")}</button><button class="text-[11px] text-gray-400 underline" onclick="dlClose()">${t("Закрити|Close")}</button>`)}
function dmCopy(){const x=window._dmsg||"";try{navigator.clipboard.writeText(x).then(()=>toast("✅ "+t("Скопійовано|Copied")))}catch(e){const a=document.createElement("textarea");a.value=x;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(_){}a.remove();toast("✅ "+t("Скопійовано|Copied"))}}
function dmGo(w){dmCopy();if(w=="ig")window.open("https://ig.me/m/"+window._dig,"_blank");else window.open("https://t.me/"+window._dtg+"?text="+encodeURIComponent(window._dmsg),"_blank")}

// ═══ ПРОФІЛЬ: «Конфіденційність» поруч з «Умови», «Правила розіграшу» — знизу по центру ═══
function legalBlock(){return `<div class="card space-y-3"><div class="grid grid-cols-2 gap-2 text-center text-xs"><a class="chip justify-center" href="privacy.html" target="_blank" rel="noopener">🔒 ${t("Конфіденційність|Privacy")}</a><a class="chip justify-center" href="terms.html" target="_blank" rel="noopener">📄 ${t("Умови|Terms")}</a></div>
 <button class="btn w-full" onclick="privacySettings()">🛡 ${t("Приватність і дані|Privacy & data")}</button>
 <div class="flex flex-col items-center gap-2 text-center"><a class="chip justify-center" href="raffle-rules.html" target="_blank" rel="noopener">🎰 ${t("Правила розіграшу|Raffle rules")}</a>${typeof SOLO!=="undefined"&&SOLO?"":`<a class="chip justify-center" href="masters.html" target="_blank" rel="noopener">🥷 ${t("Для майстрів|For masters")}</a>`}<div class="text-[10px] text-gray-600">INKAI · ${t("збірка|build")} ${window.INK_BUILD||""}</div></div></div>`}

// ═══ КАТАНИ: самі знаходимо, які PNG залито (assets/katana_<номер>.png) — редагувати json не треба ═══
setTimeout(()=>{if(typeof KATL=="undefined"||KATL.size)return;let ok=0;Promise.all(Array.from({length:100},(_,i)=>new Promise(r=>{const m=new Image();m.onload=()=>{KATL.add(i);ok++;r()};m.onerror=r;m.src="assets/katana_"+i+".png"}))).then(()=>{if(ok)rend()})},2500);
