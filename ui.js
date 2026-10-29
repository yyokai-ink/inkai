window.INKV=window.INKV||{};INKV.ui="20261028a";
/* INKAI ui.js — «атмосфера»: звуки интерфейса, музыка и фон для каждого экрана, обучение, «Первые шаги», красота.
   Підключається ОСТАННІМ. Усе, що тут описано, працює і без твоїх файлів (звуки синтезуються, фон — запасний app_bg.png).
   Куди класти файли — див. ASSETS.md. */

// ═══ 1. ФОНИ ЕКРАНІВ: assets/screen_<екран>.png (lobby, shop, chests, friends, rewards, rating, profile). Немає файлу — лишається assets/app_bg.png ═══
const SCR_BG={play:"lobby",shop:"shop",chests:"chests",friends:"friends",rewards:"rewards",rating:"rating",profile:"profile",admin:"profile"};
let _bgL=0;
function setScreenBg(v){
 const amb=document.getElementById("amb");if(!amb||!SCR_BG[v])return;
 let a=document.getElementById("ambA1"),b=document.getElementById("ambA2");
 if(!a){amb.insertAdjacentHTML("afterbegin",'<div id="ambA1" class="scrbg"></div><div id="ambA2" class="scrbg"></div>');a=document.getElementById("ambA1");b=document.getElementById("ambA2")}
 const url="url(assets/screen_"+SCR_BG[v]+".png?v="+INK_BUILD+"),url(assets/app_bg.png)",top=_bgL?b:a,low=_bgL?a:b;
 top.style.backgroundImage=url;top.style.opacity=1;low.style.opacity=0;_bgL^=1}

// ═══ 2. МУЗИКА ПО ЕКРАНАХ: assets/music_menu.mp3 (лобі), shop.mp3, chests.mp3, battle.mp3. Немає файлу екрана → грає menu.mp3 → немає — синтез ═══
Object.assign(MUS,{shop:"assets/music_shop.mp3",chests:"assets/music_chests.mp3"});
["shop","chests"].forEach(k=>{if(mA[k])return;const a=new Audio(MUS[k]);a.loop=true;a.volume=0;a.preload="auto";a.onerror=()=>{a.bad=1;if(mStarted&&music&&mTrack==k)setMusic(k)};mA[k]=a});
const SCR_MUS={play:"menu",shop:"shop",chests:"chests"};
function resTrack(k){if(mA[k]&&!mA[k].bad)return k;if(k!="battle"&&mA.menu&&!mA.menu.bad)return"menu";return null}
function setMusic(k){
 if(k=="menu")k=SCR_MUS[cur]||"menu";
 mTrack=k;if(!mStarted)return;
 const use=resTrack(k);
 Object.keys(mA).forEach(n=>{const a=mA[n];
  if(n==use&&music){if(a.paused)a.play().catch(()=>{a.bad=1;setMusic(k)});fade(a,CFG.vol[n]??CFG.vol.menu??.4)}
  else if(!a.paused||a.volume>0)fade(a,0,()=>a.pause())});
 if(music&&!use)musStart(k=="battle"?"battle":"menu");else musStop()}
const _go=go;
go=function(v){const r=_go(v);try{setScreenBg(v);if(!(typeof G!=="undefined"&&G&&G.on))setMusic("menu")}catch(e){}return r};

// ═══ 3. ЗВУКИ ІНТЕРФЕЙСУ: assets/sfx_<ім'я>.mp3 мають пріоритет, інакше синтезуються ═══
const UIS={click:"assets/sfx_click.mp3",tab:"assets/sfx_tab.mp3",buy:"assets/sfx_buy.mp3",deny:"assets/sfx_deny.mp3",toast:"assets/sfx_toast.mp3",open:"assets/sfx_open.mp3",close:"assets/sfx_close.mp3",
 success:"assets/sfx_success.mp3",start:"assets/sfx_start.mp3",win:"assets/sfx_win.mp3",levelup:"assets/sfx_levelup.mp3",claim:"assets/sfx_claim.mp3",equip:"assets/sfx_equip.mp3",coin:"assets/sfx_coin.mp3"};
Object.assign(SFXF,UIS);
Object.keys(UIS).forEach(k=>{if(!SA[k]){const a=new Audio(UIS[k]);a.preload="auto";a.onerror=()=>{a.bad=1};SA[k]=a}});
Object.assign(AUD.gap,{click:45,tab:90,toast:350,open:120,close:120,buy:120,deny:150,equip:120,coin:60});
const _arp=(t,n,b,d,v)=>n.forEach((s,i)=>aBell(t+i*d,b*2**(s/12),.5,v));
Object.assign(SYN,{
 click:t=>{aOsc(t,.05,{f0:950,f1:620,ty:"triangle",v:.07});aNz(t,.02,{type:"highpass",f0:3500,v:.04,a:.001})},
 tab:t=>{aBell(t,784,.22,.06);aBell(t+.05,1175,.22,.045)},
 buy:t=>{_arp(t,[0,7,12],880,.06,.07);aNz(t+.02,.05,{type:"highpass",f0:4500,v:.08,a:.001})},
 deny:t=>{aOsc(t,.16,{f0:150,f1:95,ty:"square",v:.1});aOsc(t+.09,.16,{f0:120,f1:80,ty:"square",v:.09})},
 toast:t=>{aBell(t,1046,.35,.05)},
 open:t=>{aNz(t,.28,{type:"bandpass",f0:350,f1:2200,q:.8,v:.05,a:.12});aOsc(t,.22,{f0:300,f1:620,v:.07})},
 close:t=>{aNz(t,.2,{type:"bandpass",f0:2000,f1:350,q:.8,v:.045,a:.05});aOsc(t,.16,{f0:520,f1:260,v:.06})},
 success:t=>{_arp(t,[0,4,7,12],660,.08,.07)},
 start:t=>{aOsc(t,.32,{f0:125,f1:46,v:.36});aBell(t+.1,660,.5,.05);aBell(t+.2,990,.5,.04)},
 win:t=>{_arp(t,[0,4,7,12,16],523,.09,.08);aNz(t,.5,{type:"bandpass",f0:600,f1:4200,q:.7,v:.05,a:.3})},
 levelup:t=>{_arp(t,[0,2,4,7,9,12],587,.07,.08)},
 claim:t=>{_arp(t,[0,5,9,12],740,.05,.07);aNz(t,.08,{type:"highpass",f0:5000,v:.06})},
 equip:t=>{aOsc(t,.08,{f0:240,f1:120,ty:"triangle",v:.14});aBell(t+.04,1318,.3,.05)},
 coin:t=>{aBell(t,1568,.2,.06);aBell(t+.05,2093,.25,.05)}
});
// клік по будь-якій кнопці; панель внизу — окремий звук «tab»
document.addEventListener("click",e=>{const el=e.target.closest&&e.target.closest("button,[onclick],select,.btn,.btng,.nb");if(!el||el.closest("canvas")||el.disabled)return;
 sfx(el.classList.contains("nb")||el.closest(".nb")?"tab":"click")},true);
const _tot=()=>(S.mon||0)+(S.jd||0)+(S.ln||0)+(S.souls||0);
function wrapSpend(n){const f=window[n];if(typeof f!="function")return;window[n]=function(...a){const b=_tot();const r=f.apply(this,a);setTimeout(()=>sfx(_tot()<b?"buy":"deny"),30);return r}}
["buy","buyB","buyUp"].forEach(wrapSpend);
function wrapSnd(n,k,delay){const f=window[n];if(typeof f!="function")return;window[n]=function(...a){const r=f.apply(this,a);setTimeout(()=>sfx(k),delay||0);return r}}
wrapSnd("eq","equip");wrapSnd("claimDaily","claim");wrapSnd("showRes","win",150);
{const f=window.toast;window.toast=function(m){sfx(/^🎉|✅/.test(m)?"success":"toast");return f(m)}}
{const f=window.dlModal,c=window.dlClose;window.dlModal=function(h){sfx("open");return f(h)};window.dlClose=function(){sfx("close");return c()}}
{const f=window.addXP;window.addXP=function(n){const l0=lvl(S.xp);const r=f(n);if(lvl(S.xp)>l0)setTimeout(()=>{sfx("levelup");toast("⭐ "+t("Новий рівень!|Level up!")+" Lv "+lvl(S.xp))},900);return r}}

{const f=window.runChest;if(f)window.runChest=function(...a){S.opened=(S.opened||0)+1;save();return f.apply(this,a)}}

// ═══ 4. ОБУЧЕННЯ: «Правила гри» (слайди) показуються перед першим раундом і доступні з 📖 в лобі ═══
function tutSlides(){return[
 {e:"✂️",h:"Ріж йокаїв|Slice the yokai",p:"Проводь пальцем крізь йокаїв, поки вони падають. Кожен розріз дає монети 文. Свайп крізь кількох одразу — бонус!|Swipe your finger through the yokai as they fall. Every cut earns 文 coins. Cutting several in one swipe gives a bonus!"},
 {e:BOMB.e,h:"Не ріж {bomb:e}|Don't cut the {bomb:e}",p:"{bomb:One} вибухає: −3 очки. Просто дай йому впасти — це не промах. Три вибухи — і раунд закінчено.|The {bomb:e} explodes: −3 points. Just let it fall — that isn't a miss. Three explosions end the round."},
 {e:"❌",h:"Промахи|Misses",p:"Якщо звичайний йокай упав, а ти його не розрізав — це промах. Три промахи — кінець раунду. Бустери й «Міцне серце» додають життя.|If a normal yokai falls uncut, that's a miss. Three misses end the round. Boosters and “Tough heart” add lives."},
 {e:"🔥",h:"Комбо й шаленство|Combo & frenzy",p:"Ріж без промахів: комбо росте, і кожен розріз дає більше монет. Багато комбо запускає ШАЛЕНСТВО — монети ×2!|Cut without missing: the combo grows and every cut pays more. A big combo triggers FRENZY — coins ×2!"},
 {e:"👑",h:"Боси|Bosses",p:"Раз на кілька розрізів з'являється бос. Рубай його з боку в бік за 5 секунд. Нагорода: багато монет, ⛩️ душі, іноді 💎 нефрит. Усіх 20 босів збирай у бестіарії.|Every few cuts a boss appears. Slash it side to side within 5 seconds. Reward: lots of coins, ⛩️ souls, sometimes 💎 jade. Collect all 20 bosses in the bestiary."},
 {e:"🛒",h:"Куди тратити монети|What to spend coins on",p:"Магазин → Покращення збільшують дохід. Катани й фони змінюють вигляд і додають множник. Сундуки дають бустери й рідкісні речі. Цілі розраховані на дні гри, а не на місяці.|Shop → Upgrades raise your income. Blades and backgrounds change the look and add a multiplier. Chests give boosters and rare items. Goals are meant to take days, not months."},
 {e:"🎁",h:"Головна нагорода|The big reward",p:"Грай щодня: Шлях самурая на 30 днів, сундуки, рейтинг і дуелі дають фони, катани й знижки на тату. Мініатюрне тату — за 3 млн 文, 20 днів у грі й 3 друзів.|Play daily: the 30-day Samurai path, chests, rating and duels earn backgrounds, blades and tattoo discounts. A mini tattoo costs 3M 文, 20 days of play and 3 friends."}]}
let _tg={i:0,after:null};
function tutGuide(i,after){_tg={i:i||0,after:after||null};dlModal('<div id="tgBody"></div>');tgRender()}
function tgRender(){const S_=tutSlides(),s=S_[_tg.i],last=_tg.i==S_.length-1,el=document.getElementById("tgBody");if(!el)return;
 el.innerHTML=`<div class="tgs" key="${_tg.i}"><div class="tg-ico">${s.e}</div><h3 class="font-black text-lg">${t(s.h)}</h3><p class="text-sm text-gray-200 leading-relaxed">${t(s.p)}</p></div>
 <div class="flex justify-center gap-1.5">${S_.map((_,k)=>`<i class="tg-dot${k==_tg.i?" on":""}"></i>`).join("")}</div>
 <div class="flex gap-2">${_tg.i?`<button class="btn !bg-inkDark border border-inkBorder flex-1 py-2.5" onclick="tgGo(-1)">←</button>`:""}<button class="btng flex-[3] py-2.5" onclick="tgGo(1)">${last?(_tg.after?t("Забрати подарунок!|Claim the gift!"):t("Зрозуміло!|Got it!")):t("Далі →|Next →")}</button></div>
 ${_tg.after?`<button class="text-[11px] text-gray-400 underline" onclick="tgSkip()">${t("Пропустити|Skip")}</button>`:""}`}
function tgGo(d){const n=tutSlides().length,i=_tg.i+d;if(i<0)return;if(i>=n){tgSkip();return}_tg.i=i;tgRender()}
function tgSkip(){const f=_tg.after;_tg.after=null;dlClose();if(f)setTimeout(f,120)}
{const f=window.startRound;window.startRound=function(m,opt){
 if((m||1)==1&&!S.tut&&!S.tgSeen&&!(opt&&opt.duel)){S.tgSeen=1;S.tut=1;save();track("tutorial_done");tutGuide(0,()=>{afterRev=()=>go("play");runChest(["bonus","🎁","Сундук-знахідка|Found chest",0,"#ffb703"],1,"assets/chest_bonus.png")});return}
 sfx("start");return f(m,opt)}}

// ═══ 5. «ПЕРШІ КРОКИ»: чек-лист у лобі з маленькими нагородами — гравець сам бачить, що робити далі ═══
const FS=[
 {id:"round",ic:"✂️",n:"Пройти навчання|Finish the tutorial",ok:()=>!!S.tut,r:{mon:500}},
 {id:"upg",ic:"💪",n:"Купити перше покращення (Магазин → Покращення)|Buy your first upgrade (Shop → Upgrades)",ok:()=>Object.values(S.up||{}).some(x=>x>0),r:{mon:1000}},
 {id:"blade",ic:"🗡",n:"Купити нову катану|Buy a new blade",ok:()=>(S.blades||[]).length>1,r:{mon:1500}},
 {id:"boss",ic:"👑",n:"Перемогти боса|Defeat a boss",ok:()=>Object.keys(S.bst||{}).length>0,r:{souls:3}},
 {id:"daily",ic:"📅",n:"Забрати щоденну нагороду|Claim the daily reward",ok:()=>S.sr==today(),r:{mon:1000}},
 {id:"chest",ic:"📦",n:"Відкрити сундук|Open a chest",ok:()=>(S.opened||0)>0||(S.rounds||0)>=3,r:{jd:1}}];
function fsCheck(){S.fs=S.fs||{};let got=0;FS.forEach(s=>{if(!S.fs[s.id]&&s.ok()){S.fs[s.id]=1;got++;Object.entries(s.r).forEach(([k,v])=>S[k]=(S[k]||0)+v);
  setTimeout(()=>toast("🎉 "+t(s.n)+" ✔ +"+Object.entries(s.r).map(([k,v])=>v+({mon:"文",souls:"⛩️",jd:"💎",ln:"🏮"}[k]||"")).join(" ")),600*got)}});
 if(got){save();hdr()}}
function fsCard(){if(!S.tut)return"";fsCheck();const done=FS.filter(s=>S.fs&&S.fs[s.id]).length;if(done==FS.length)return"";
 const nx=FS.find(s=>!(S.fs&&S.fs[s.id])),pc=Math.min(100,(S.ptot||0)/3e6*100);
 return`<div class="card space-y-2 !border-neonGold/40"><div class="flex justify-between items-center"><b class="text-xs text-neonGold">🧭 ${t("Перші кроки|First steps")}</b><span class="text-[11px] text-gray-400">${done}/${FS.length}</span></div>
 <div class="fsb"><i style="width:${done/FS.length*100}%"></i></div>
 <div class="text-xs text-gray-200">${nx.ic} ${t(nx.n)}</div>
 <div class="text-[10px] text-gray-500">${t("Шлях до мініатюрного тату|Path to the mini tattoo")}: ${fmt(Math.min(S.ptot||0,3e6))} / 3 000 000 文</div><div class="fsb"><i style="width:${pc}%;background:linear-gradient(90deg,#ff2a5f,#ffb703)"></i></div></div>`}
{const f=window.playExtras;window.playExtras=function(){return fsCard()+f()}}

// ═══ 6. ВІЗУАЛ: скло, світіння, пелюстки сакури, плавні переходи ═══
(function(){
 const css=`
 .scrbg{position:absolute;inset:0;background-size:cover;background-position:center;transition:opacity .9s ease}
 #amb>div:last-child{z-index:2}
 .card{background:linear-gradient(160deg,rgba(28,24,38,.82),rgba(14,12,20,.86))!important;border-color:rgba(255,255,255,.09)!important;box-shadow:0 6px 22px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.06);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
 .btng{background:linear-gradient(135deg,#ffcf4d,#ff7a3d 55%,#ff2a5f)!important;box-shadow:0 4px 16px rgba(255,90,60,.35),inset 0 1px 0 rgba(255,255,255,.35);text-shadow:0 1px 2px rgba(0,0,0,.35);letter-spacing:.02em}
 .btn{box-shadow:0 3px 12px rgba(255,42,95,.28)}
 .btn,.btng,.nb,.chip{transition:transform .12s ease,filter .2s ease,box-shadow .2s ease}
 .btng:active,.btn:active{transform:scale(.95);filter:brightness(1.15)}
 .nb{position:relative}.nb.text-crimsonRed::after{content:"";position:absolute;top:-9px;left:25%;right:25%;height:3px;border-radius:3px;background:#ff2a5f;box-shadow:0 0 10px #ff2a5f}
 .nb.text-crimsonRed span:first-child{transform:translateY(-2px) scale(1.12);filter:drop-shadow(0 0 6px rgba(255,42,95,.7))}
 .view:not(.hidden){animation:viewIn .35s ease both}@keyframes viewIn{from{opacity:0;transform:translateY(10px)}}
 #hdr{background:linear-gradient(180deg,rgba(10,9,13,.96),rgba(10,9,13,.82))!important;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
 #nav{background:linear-gradient(0deg,rgba(10,9,13,.97),rgba(10,9,13,.85))!important;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
 .petal{position:fixed;top:-30px;width:10px;height:13px;border-radius:70% 0 70% 0;background:linear-gradient(135deg,#ffd0de,#ff8fb0);opacity:.55;pointer-events:none;z-index:1;animation:petal linear infinite}
 @keyframes petal{to{transform:translate3d(var(--dx),112vh,0) rotate(540deg)}}
 .tg-ico{font-size:64px;line-height:1;margin-bottom:6px;animation:floatY 2.4s ease-in-out infinite}.tg-ico img{height:64px;margin:auto}
 .tgs{display:flex;flex-direction:column;gap:8px;align-items:center;min-height:190px;justify-content:center;animation:cardIn .35s ease both}
 .tg-dot{width:7px;height:7px;border-radius:50%;background:#3a3447;display:inline-block;transition:all .2s}.tg-dot.on{background:#ffb703;width:18px;border-radius:5px}
 .fsb{height:6px;border-radius:6px;background:#272235;overflow:hidden}.fsb i{display:block;height:100%;border-radius:6px;background:#ffb703;transition:width .6s ease}
 @media (prefers-reduced-motion:reduce){.petal{display:none}}`;
 const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
 if(!matchMedia("(prefers-reduced-motion:reduce)").matches&&!(typeof SLOW!="undefined"&&SLOW)){
  const n=10;let h="";for(let i=0;i<n;i++)h+=`<i class="petal" style="left:${(i*97%100)}%;--dx:${(i%2?1:-1)*(40+i*9)}px;animation-duration:${13+i*2.1}s;animation-delay:${-i*2.3}s;transform:scale(${.7+(i%4)*.18})"></i>`;
  document.body.insertAdjacentHTML("beforeend",h)}
 setScreenBg(typeof cur!="undefined"?cur:"play")})();
