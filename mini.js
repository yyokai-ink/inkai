window.INKV=window.INKV||{};INKV.mini="20261028e";
/* INKAI mini.js — МІНІ-ГРА «ПОЛЮВАННЯ НА ДЕМОНІВ» (аркада з бестіарієм). Підключається ПІСЛЯ ui2.js.
   45 секунд, сітка 3×3: з-під плиток виринають йокаї з бестіарію. Угорі — ЦІЛЬ (ім'я, сила й підказка). Тапни саме її: +очки, комбо росте.
   Не той йокай — мінус «життя» (3 життя). Золота ціль = ×3. Нагорода: монети (частка середнього доходу за раунд, тому економіку не ламає),
   душі ⛩️ за високий рахунок і +1 ⛩️ за кожного нового йокая, якого впіймав у цій грі. Ліміт: MG_DAY ігор на добу. */
const MG_DAY=3,MG_TIME=45,MG_LIVES=3;   // 🔧 ігор на добу · секунд · життів
let MG=null;
const mgSt=()=>{S.mg=S.mg||{d:"",n:0,b:0};if(S.mg.d!==today()){S.mg.d=today();S.mg.n=0}return S.mg};
const mgLeft=()=>Math.max(0,MG_DAY-mgSt().n);
(function(){const c=document.createElement("style");c.textContent=`
#mg{position:fixed;inset:0;z-index:96;display:flex;flex-direction:column;align-items:center;padding:calc(env(safe-area-inset-top,0px) + 10px) 12px calc(env(safe-area-inset-bottom,0px) + 12px);background:radial-gradient(circle at 50% 18%,rgba(70,16,50,.96),rgba(7,5,14,.99));color:#fff;touch-action:manipulation;user-select:none;-webkit-user-select:none}
.mgh{width:100%;max-width:380px;display:flex;justify-content:space-between;align-items:center;font-weight:900}
.mgbar{width:100%;max-width:380px;height:6px;border-radius:6px;background:rgba(255,255,255,.12);overflow:hidden;margin-top:6px}.mgbar i{display:block;height:100%;background:linear-gradient(90deg,#ff2a5f,#ffb703);transition:width .1s linear}
.mgt{width:100%;max-width:380px;margin-top:10px;border-radius:18px;padding:8px 12px;display:flex;align-items:center;gap:12px;background:linear-gradient(160deg,rgba(255,183,3,.14),rgba(255,255,255,.03));border:1px solid rgba(255,183,3,.55);box-shadow:0 0 22px rgba(255,183,3,.18);animation:mgTgt .45s cubic-bezier(.3,1.4,.5,1)}
@keyframes mgTgt{from{transform:scale(.85);opacity:0}}
.mgg{width:100%;max-width:380px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px;flex:0 0 auto}
.mgc{position:relative;aspect-ratio:1;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 62%,#050309 0,#15101f 58%,#2a1d3a 100%);border:2px solid rgba(255,255,255,.1);box-shadow:inset 0 8px 18px #000c,0 0 14px rgba(167,139,250,.12)}
.mgd{position:absolute;inset:8%;display:flex;align-items:center;justify-content:center;font-size:44px;animation:mgUp .22s cubic-bezier(.3,1.5,.5,1) both;filter:drop-shadow(0 4px 8px #000a)}
.mgd img{max-height:100%;max-width:100%;object-fit:contain}
.mgd.gold{filter:drop-shadow(0 0 14px #ffd24a) drop-shadow(0 0 28px #ff9f1c)}
.mgd.out{animation:mgDown .2s ease-in both}
.mgd.hit{animation:mgHit .35s ease-out both}
.mgd.bad{animation:mgBad .35s ease-out both}
@keyframes mgUp{from{transform:translateY(105%) scale(.7)}}
@keyframes mgDown{to{transform:translateY(105%) scale(.7)}}
@keyframes mgHit{0%{transform:scale(1)}40%{transform:scale(1.35);filter:brightness(2) drop-shadow(0 0 18px #ffd24a)}100%{transform:scale(0);opacity:0}}
@keyframes mgBad{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px);filter:grayscale(1) brightness(.7)}60%{transform:translateX(8px)}100%{transform:translateY(105%);opacity:0}}
.mgp{position:absolute;left:50%;top:30%;transform:translateX(-50%);font-weight:900;font-size:18px;pointer-events:none;animation:mgFloat .8s ease-out forwards;text-shadow:0 0 10px currentColor;z-index:3}
@keyframes mgFloat{to{transform:translate(-50%,-46px);opacity:0}}
.mgshake{animation:bigShake .35s linear}
`;document.head.appendChild(c)})();

function mgCard(){const s=mgSt();
 return `<div class="card flex items-center gap-3 !py-2.5" style="background:rgba(19,17,24,.82)"><div class="text-2xl">👹</div><div class="flex-1 min-w-0"><b class="text-xs">${t("Полювання на демонів|Demon hunt")}</b><div class="text-[11px] text-gray-400">${t("Аркада з бестіарієм: упіймай саме того йокая|Bestiary arcade: catch the right yokai")} · ${mgLeft()}/${MG_DAY}${s.b?" · 🏆 "+fmt(s.b):""}</div></div><button class="btng !px-3 !py-2 text-xs" onclick="mgOpen()">${t("Грати|Play")}</button></div>`}

function mgOpen(){const s=mgSt(),hist=(s.h||[]).map(x=>fmt(x)).join(" · "),known=Object.keys(BOSS).filter(k=>(S.bst||{})[k]>0).length;sfx("open");
 dlModal(`<div class="text-4xl">👹</div><h3 class="font-black text-lg">${t("Полювання на демонів|Demon hunt")}</h3>
 <div class="text-xs text-gray-300 text-left space-y-1.5"><div>🎯 ${t("Угорі показано ціль — ім'я, силу й вигляд йокая з бестіарію. Тапай ЛИШЕ його.|The target is shown on top — name, power and look of a bestiary yokai. Tap ONLY that one.")}</div><div>🔥 ${t("Влучання поспіль піднімають комбо й очки. Золота ціль = ×3.|Consecutive hits raise the combo and points. A golden target = ×3.")}</div><div>💔 ${t("Не той йокай — мінус життя (їх 3). Час: 45 секунд.|Wrong yokai — lose a life (you have 3). Time: 45 seconds.")}</div><div>🎁 ${t("Нагорода: монети, душі ⛩️ і +1 ⛩️ за кожного нового йокая, якого впіймав тут.|Reward: coins, souls ⛩️ and +1 ⛩️ for every new yokai you catch here.")}</div>
 ${known<3?`<div class="text-neonGold">📖 ${t("Ціллю бувають лише йокаї, яких ти вже відкрив у бестіарії. Переможи більше босів у раундах — і гра стане різноманітнішою.|Only yokai you unlocked in the bestiary can be targets. Defeat more bosses in rounds to add variety.")} (${known}/${Object.keys(BOSS).length})</div>`:""}</div>
 ${hist?`<div class="text-[11px] text-gray-400">${t("Останні рахунки|Recent scores")}: ${hist}</div>`:""}<div class="text-sm">${t("Сьогодні залишилось ігор|Games left today")}: <b class="text-neonGold">${mgLeft()}/${MG_DAY}</b>${s.b?` · 🏆 ${fmt(s.b)}`:""}</div>
 <button class="btng w-full py-3" ${mgLeft()?"":"disabled"} onclick="dlClose();mgStart()">${mgLeft()?t("Почати|Start"):t("Ліміт на сьогодні вичерпано|Daily limit reached")}</button><button class="btn w-full" onclick="dlClose()">${t("Закрити|Close")}</button>`)}

const mgDem=(k,sil,gold)=>{const B=BOSS[k];return `<div class="mgd ${gold?"gold":""}" style="${sil?"filter:brightness(0) opacity(.6)":""}">${bImg(k,bEm(B),"")}</div>`};
function mgStart(){const s=mgSt();if(s.n>=MG_DAY)return;const ks=Object.keys(BOSS),kn=ks.filter(k=>(S.bst||{})[k]>0);if(!kn.length){toast("📖 "+t("Спершу переможи хоча б одного боса в раунді|First defeat at least one boss in a round"));return}s.n++;save();
 const tp=kn;
 MG={on:1,t:MG_TIME,sc:0,li:MG_LIVES,cb:0,mc:0,cat:0,tp,ks,tg:null,tgN:0,cells:[],seen:{},nw:0,tm:0,sp:0};
 let o=document.getElementById("mg");if(o)o.remove();o=document.createElement("div");o.id="mg";
 o.innerHTML=`<div class="mgh"><div class="text-2xl text-neonGold" id="mgSc">0</div><div id="mgCb" class="text-sm text-orange-400"></div><div id="mgLi" class="text-xl"></div></div><div class="mgbar"><i id="mgBar" style="width:100%"></i></div>
 <div class="mgt" id="mgT"></div><div class="mgg">${Array.from({length:9},(_,i)=>`<div class="mgc" data-i="${i}"></div>`).join("")}</div>
 <div class="text-[11px] text-gray-400 mt-3 text-center">${t("Тапай лише ціль угорі • золота ціль ×3|Tap only the target on top • golden target ×3")}</div><button class="btn mt-auto !bg-inkDark border border-inkBorder" onclick="mgEnd(1)">${t("Вийти|Quit")}</button>`;
 document.body.appendChild(o);
 o.querySelectorAll(".mgc").forEach(c=>c.addEventListener("pointerdown",e=>{e.preventDefault();mgTap(+c.dataset.i)}));
 MG.cells=Array.from({length:9},()=>null);mgTarget();mgHud();setMusic&&setMusic("battle");
 MG.tm=setInterval(()=>{if(!MG||!MG.on)return;MG.t-=.1;if(MG.t<=0){MG.t=0;mgEnd()}else mgHud();MG.tgT=(MG.tgT||0)+.1;if(MG.tgT>=13)mgTarget()},100);
 mgSpawn()}
function mgTarget(){if(!MG)return;const old=MG.tg;let k;do{k=MG.tp[Math.random()*MG.tp.length|0]}while(k==old&&MG.tp.length>1);MG.tg=k;MG.tgN=0;MG.tgT=0;
 const B=BOSS[k],el=document.getElementById("mgT");if(!el)return;el.style.animation="none";void el.offsetWidth;el.style.animation="";
 el.innerHTML=`<div style="width:56px;height:56px;font-size:40px;display:flex;align-items:center;justify-content:center" class="shrink-0">${bImg(k,bEm(B),"h-14 w-auto")}</div><div class="min-w-0 text-left"><div class="text-[10px] tracking-[.25em] uppercase" style="color:#ffd24a">${t("ЛОВИ|CATCH")}</div><div class="font-black leading-tight" style="color:${B[1]}">${t(B[0])}</div><div class="text-[10px] text-gray-300 leading-tight">${t(B[3])}</div></div>`}
function mgHud(){if(!MG)return;const q=id=>document.getElementById(id);if(!q("mgSc"))return;q("mgSc").textContent=fmt(MG.sc);q("mgBar").style.width=(MG.t/MG_TIME*100)+"%";q("mgLi").textContent="❤️".repeat(MG.li)+"🖤".repeat(MG_LIVES-MG.li);q("mgCb").textContent=MG.cb>=2?"🔥 ×"+(1+Math.min(MG.cb,10)*.1).toFixed(1):""}
function mgSpawn(){if(!MG||!MG.on)return;const free=MG.cells.map((c,i)=>c?-1:i).filter(i=>i>=0);
 if(free.length){const i=free[Math.random()*free.length|0],r=Math.random(),prog=1-MG.t/MG_TIME,isT=r<.42,k=isT?MG.tg:(()=>{let x;do{x=MG.ks[Math.random()*MG.ks.length|0]}while(x==MG.tg);return x})(),gold=isT&&Math.random()<.1,
  life=Math.max(750,1500-prog*650)-(gold?250:0),cell=document.querySelector(`#mg .mgc[data-i="${i}"]`);
  if(cell){const known=(S.bst||{})[k]>0,el=document.createElement("div");el.innerHTML=mgDem(k,!known&&!isT,gold);const d=el.firstChild;cell.appendChild(d);
   const o={k,gold,d,tm:setTimeout(()=>{if(MG&&MG.cells[i]===o){MG.cells[i]=null;d.classList.add("out");setTimeout(()=>d.remove(),220)}},life)};MG.cells[i]=o}}
 MG.sp=setTimeout(mgSpawn,Math.max(330,820-(1-MG.t/MG_TIME)*420))}
function mgPop(cell,txt,col){const p=document.createElement("div");p.className="mgp";p.style.color=col;p.textContent=txt;cell.appendChild(p);setTimeout(()=>p.remove(),800)}
function mgTap(i){if(!MG||!MG.on)return;const o=MG.cells[i];if(!o)return;const cell=document.querySelector(`#mg .mgc[data-i="${i}"]`);clearTimeout(o.tm);MG.cells[i]=null;
 if(o.k==MG.tg){MG.cb++;MG.mc=Math.max(MG.mc,MG.cb);const pts=Math.round(10*(1+Math.min(MG.cb,10)*.1)*(o.gold?3:1));MG.sc+=pts;MG.cat++;MG.tgN++;
  if(!(S.mgSeen=S.mgSeen||{})[o.k]&&!MG.seen[o.k]){MG.seen[o.k]=1;MG.nw++}
  o.d.classList.add("hit");mgPop(cell,"+"+pts,o.gold?"#ffd24a":"#6ee7b7");snd(520+Math.min(MG.cb,12)*50,.09,.12);navigator.vibrate&&navigator.vibrate(12);
  if(MG.tgN>=5)setTimeout(mgTarget,260)}
 else{MG.cb=0;MG.li--;o.d.classList.add("bad");mgPop(cell,"💔","#ff2a5f");snd(150,.25,.2);navigator.vibrate&&navigator.vibrate([40,30,40]);const m=document.getElementById("mg");m.classList.remove("mgshake");void m.offsetWidth;m.classList.add("mgshake");if(MG.li<=0)setTimeout(mgEnd,350)}
 setTimeout(()=>o.d.remove(),380);mgHud()}
function mgEnd(quit){if(!MG||!MG.on)return;const M=MG;M.on=0;clearInterval(M.tm);clearTimeout(M.sp);M.cells.forEach(c=>c&&clearTimeout(c.tm));
 const o=document.getElementById("mg");setMusic&&setMusic("menu");
 if(quit&&M.sc<=0){if(o)o.remove();MG=null;return}
 const s=mgSt(),rc=typeof rcAvg=="function"?rcAvg():600,coins=Math.round(rc*Math.min(.8,M.sc/350*.8)),soulsB=(M.sc>=150?1:0)+(M.sc>=300?1:0),soulsN=M.nw,rec=M.sc>(s.b||0);
 if(rec)s.b=M.sc;s.h=[M.sc,...(s.h||[])].slice(0,5);let jdB=0;if(M.sc>=300&&s.jdD!==today()){s.jdD=today();jdB=1;S.jd+=1}S.mon+=coins;S.souls+=soulsB+soulsN;S.mgSeen=S.mgSeen||{};for(const k in M.seen)S.mgSeen[k]=1;save();push&&push();hdr();track("minigame",{score:M.sc,hunt:M.cat});
 if(!o){MG=null;return}
 o.innerHTML=`<div class="my-auto w-full max-w-xs text-center space-y-3"><h2 class="text-3xl font-black text-neonGold" style="animation:pop .4s">${t("Полювання завершено|Hunt over")}</h2><div class="text-5xl font-black font-mono">${fmt(M.sc)}</div>${rec?`<div class="text-sm text-emerald-400">🏆 ${t("Новий рекорд!|New record!")}</div>`:""}
 <div class="text-xs text-gray-300">${t("Впіймано|Caught")}: <b>${M.cat}</b> · ${t("Найкраще комбо|Best combo")}: <b>${M.mc}</b></div>
 <div class="card space-y-1"><div class="text-xl">+${fmt(coins)} 文</div>${jdB?`<div class="text-sm">+1 💎 <span class="text-[11px] text-gray-400">(${t("за 300+ очок, раз на день|for 300+ points, once a day")})</span></div>`:""}${soulsB+soulsN?`<div class="text-sm">+${soulsB+soulsN} ⛩️${soulsN?` <span class="text-[11px] text-gray-400">(${soulsN} ${t("нових йокаїв|new yokai")})</span>`:""}</div>`:""}</div>
 ${mgLeft()?`<button class="btng w-full py-3" onclick="mgClose();mgStart()">${t("Ще раз|Again")} (${mgLeft()}/${MG_DAY})</button>`:`<div class="text-[11px] text-gray-400">${t("Ліміт ігор на сьогодні вичерпано. Повертайся завтра!|Daily limit reached. Come back tomorrow!")}</div>`}<button class="btn w-full py-3" onclick="mgClose()">${t("Закрити|Close")}</button></div>`;sfx("claim")}
function mgClose(){const o=document.getElementById("mg");if(o)o.remove();MG=null;if(cur=="play")rend()}
