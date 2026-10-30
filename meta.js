window.INKV=window.INKV||{};INKV.meta="20261031a";
/* INKAI meta.js — рейтинг тиждень/місяць/міста, щоденна серія, бестіарій, переродження, івенти, дуель, навчання.
   Підключається ПІСЛЯ game.js. Використовує глобальні змінні решти файлів. */

// ═══ ЧАС І XP: тиждень (пн–нд) і місяць. Ключі числові, щоб сортувати без складених індексів Firestore ═══
const XP_K=3;   // 🔧 скільки XP дає 1 монета раунду (очки = монети; від цього залежать рівні й рейтинг)
const wkNum=()=>Math.floor((Date.now()-4*864e5)/(7*864e5)),monNum=()=>{const d=new Date();return d.getFullYear()*12+d.getMonth()};
function addXP(n){const w=wkNum(),m=monNum();if(S.xwk!==w){S.xwk=w;S.xw=0}if(S.xmk!==m){S.xmk=m;S.xm=0}S.xw+=n;S.xm+=n;S.xp+=n}

// ═══ ІВЕНТИ: [від MM-DD, до MM-DD, id, іконка, назва, опис, ×монет, (необов'язково) години дії [з, до] щодня, напр. [20,2] = 20:00–02:00]. Нагороди за діапазон дат; додавай свої ═══
const EVENTS=[
 ["03-25","04-05","hanami","🌸","Ханамі|Hanami","Цвітіння сакури: ІНК ×1.5, нефрит з босів ×2|Sakura bloom: INK ×1.5, jade from bosses ×2",1.5],
 ["07-06","07-08","tanabata","🎋","Танабата|Tanabata","Свято зірок: ІНК ×1.5, нефрит з босів ×2|Star festival: INK ×1.5, jade from bosses ×2",1.5],
 ["08-12","08-16","obon","🏮","Обон|Obon","Ніч ліхтарів: ІНК ×1.5, нефрит з босів ×2|Lantern nights: INK ×1.5, jade from bosses ×2",1.5],
 ["10-25","11-01","hyakki","👹","Ніч сотні демонів|Night of 100 Demons","Парад йокаїв щоночі 20:00–02:00: ІНК ×1.5, нефрит з босів ×2|Yokai parade every night 20:00–02:00: INK ×1.5, jade from bosses ×2",1.5,[20,2]],
 ["12-30","01-03","oshogatsu","🎍","Осьогацу|Oshogatsu","Японський Новий рік: ІНК ×1.5, нефрит з босів ×2|Japanese New Year: INK ×1.5, jade from bosses ×2",1.5]
];
function evDate(e,d){const k=String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");return e[0]<=e[1]?(k>=e[0]&&k<=e[1]):(k>=e[0]||k<=e[1])}
function evToday(){const d=new Date();return EVENTS.find(e=>evDate(e,d))||null}      // подія діє сьогодні за датою (години — у curEvent)
function curEvent(){const d=new Date(),h=d.getHours();for(const e of EVENTS){const w=e[7];if(!w){if(evDate(e,d))return e;continue}
  if(w[0]<w[1]){if(h>=w[0]&&h<w[1]&&evDate(e,d))return e}else{if(h>=w[0]&&evDate(e,d))return e;if(h<w[1]&&evDate(e,new Date(d-864e5)))return e}}return null}

// ═══ ШЛЯХ САМУРАЯ: щоденна серія на 30 днів. Фони, катани, знижки, сундуки. Пропустив день — серія з 1-го дня. Після 30-го починається нове коло ═══
// Нагорода: mon 墨 · souls ⛩️ · jd 💎 · b бустери · chest сундук (рівень 1–3) · bl/bg катана/фон рідкості r (найдешевша ще не твоя) · disc знижка % у майстра YYOKAI
const PATH=[{mon:600},{b:{mb:1}},{souls:3},{mon:1500,b:{st:1}},{disc:5},{jd:1},{chest:1},{mon:3000},{bg:1},{b:{x2:1},souls:3},
 {souls:4},{mon:5000},{jd:2},{disc:10},{bl:1},{mon:6000},{souls:5},{jd:2},{b:{x2:2}},{bg:2},
 {disc:15},{mon:10000},{jd:3},{chest:2},{bl:2},{mon:15000},{souls:10},{jd:3},{jd:4},{disc:20,chest:3,jd:5}];
const PDAYS=PATH.length,dayIdx=()=>((S.streak||1)-1)%PDAYS,pCycle=()=>Math.floor(((S.streak||1)-1)/PDAYS),dailyReady=()=>S.sr!==today();
const pOwn=(k,r)=>{const A=k=="bl"?BL:BG,own=k=="bl"?S.blades:S.bgs;return A.filter(x=>!x.ex&&x.r==r&&x.cur=="mon"&&x.price>0&&!own.includes(x.i)).sort((x,y)=>x.price-y.price)[0]};
function pIc(r){return r.disc?"🏷":r.bl?"🗡":r.bg?"🖼":r.chest?"🎁":r.jd?"💎":r.souls?"⛩️":r.b?"⚡":"墨"}
function pTxt(r){const p=[];if(r.disc)p.push("🏷 −"+r.disc+"% "+t("на тату|off a tattoo"));if(r.mon)p.push("+"+fmt(r.mon)+" 墨");if(r.souls)p.push("+"+r.souls+" ⛩️");if(r.jd)p.push("+"+r.jd+" 💎");
 if(r.b)p.push("⚡ "+t("бустер|boost")+(Object.values(r.b)[0]>1?" ×"+Object.values(r.b)[0]:""));if(r.chest)p.push("🎁 "+t("сундук|chest"));if(r.bl)p.push("🗡 "+t("катана|blade")+" ("+t(RN[r.bl][0])+")");if(r.bg)p.push("🖼 "+t("фон|background")+" ("+t(RN[r.bg][0])+")");return p.join(" · ")}
async function pathDisc(day,pct){
 if(!isReal()){alert(t("Щоб забрати знижку, увійди через Google/Apple.|Sign in with Google/Apple to claim the discount."));return 0}
 await loadSD();if(SD<day){toast(t("Ще рано — потрібно більше різних днів у грі|Not yet — you need more different days played"));return 0}
 const m=masterOf(OWN);if(!m){alert(t("Майстер YYOKAI тимчасово недоступний.|Master YYOKAI is temporarily unavailable."));return 0}
 try{if(!(await claimOk(m,pct)))return 0;
  await claimWrite(user.uid+"_ladder_"+day+(pCycle()?"_"+pCycle():""),m,{uid:user.uid,master:m.id,masterName:m.nm,email:user.email||"",nick:S.nick,tier:"ladder_"+day,pct,code:"",kind:"discount",serverDays:SD});
  track("path_disc",{day});alert(t("Заявку надіслано майстру YYOKAI. Знижка |Request sent to master YYOKAI. The discount ")+pct+t("% діє 30 днів.|% is valid for 30 days."));return 1}
 catch(e){if(e.code=="permission-denied"||e.code=="slots-full"){alert((e.code=="slots-full"?t("Слоти знижок цього місяця закінчились.|This month's discount slots are used up."):t("Така заявка вже подавалась.|Such a request was already sent."))+" "+t("Замість знижки — 2 💎.|Instead of the discount — 2 💎."));return 2}
  alert(e.message);return 0}}
async function claimPath(){if(!dailyReady()||window._pb)return;window._pb=1;
 try{const i=dayIdx(),r=PATH[i];let sub=0;
  if(r.disc){const k=await pathDisc(i+1,r.disc);if(!k)return;sub=k==2}
  S.sr=today();S.mon+=r.mon||0;S.souls+=r.souls||0;S.jd+=(r.jd||0)+(sub?2:0);for(const k in(r.b||{}))S.c[k]=(S.c[k]||0)+r.b[k];
  const got=[];for(const k of["bl","bg"])if(r[k]){const it=pOwn(k,r[k]);if(it){(k=="bl"?S.blades:S.bgs).push(it.i);got.push((k=="bl"?"🗡 "+bname(it):"🖼 "+t(it.nm))+" ("+t(RN[it.r][0])+")")}else{S.jd+=r[k]*2;got.push("+"+r[k]*2+" 💎")}}
  save();push();hdr();track("daily_claim",{day:i+1});sfx("claim");adTick();
  if(r.chest){afterRev=()=>{rend();pathPop(i,r,got)};runChest(["bonus","🎁","Сундук-знахідка|Found chest",0,"#ffb703"],r.chest,"assets/chest_bonus.png")}
  else{pathPop(i,r,got);rend()}}
 finally{window._pb=0}}
const claimDaily=claimPath;
function pathPop(i,r,got){dlModal(`<div class="text-5xl">${pIc(r)}</div><h3 class="font-black text-lg text-neonGold">${t("Шлях самурая — день|Samurai path — day")} ${i+1}/${PDAYS}</h3><div class="text-sm font-bold">${pTxt(r)}</div>${got&&got.length?`<div class="text-xs text-gray-200">${got.join("<br>")}</div>`:""}<div class="text-[11px] text-gray-400">${t("Повертайся завтра — серія не має перерватись!|Come back tomorrow — keep the streak alive!")}</div><button class="btng w-full py-3" onclick="dlClose()">OK</button><button class="btn !bg-inkDark border border-inkBorder w-full" onclick="dlClose();openPath()">${t("Показати весь шлях|Show the whole path")}</button>`)}
function openPath(){const i=dayIdx(),ok=dailyReady();
 dlModal(`<h3 class="font-black text-lg text-neonGold">⛩️ ${t("Шлях самурая|Samurai path")}</h3><div class="text-[11px] text-gray-300">${t("Заходь щодня: фони, катани, знижки на тату й сундуки. Пропустиш день — шлях почнеться з 1-го.|Visit daily: backgrounds, blades, tattoo discounts and chests. Miss a day and the path restarts.")}</div>
 <div class="fsb"><i style="width:${(i+(ok?0:1))/PDAYS*100}%"></i></div>
 <div class="grid grid-cols-6 gap-1 text-center">${PATH.map((r,k)=>{const big=r.disc||r.bl||r.bg||r.chest,done=k<i||(k==i&&!ok);return `<div class="rounded-lg py-1 text-[9px] leading-tight ${k==i?"border-2 border-neonGold bg-neonGold/20":big?"border border-neonGold/50 bg-inkDark":"border border-inkBorder bg-inkDark"} ${done?"opacity-45":""}"><div class="text-base">${done?"✓":pIc(r)}</div>${k+1}${r.disc?`<div class="text-neonGold font-black">−${r.disc}%</div>`:""}</div>`}).join("")}</div>
 <div class="rounded-xl p-2 text-xs" style="background:#0a090d;border:1px solid #272235">${ok?t("Сьогодні|Today"):t("Завтра|Tomorrow")} (${t("день|day")} ${ok?i+1:(i+1)%PDAYS+1}): <b class="text-neonGold">${pTxt(PATH[ok?i:(i+1)%PDAYS])}</b></div>
 <button class="${ok?"btng":"btn"} w-full py-3" ${ok?"":"disabled"} onclick="dlClose();claimPath()">${ok?"🎁 "+t("Забрати нагороду|Claim reward"):"✓ "+t("Сьогодні вже забрано|Already claimed today")}</button>
 <div class="text-[10px] text-gray-500">${t("Знижка діє 30 днів, не сумується, запис за домовленістю. Для знижок потрібен вхід через Google/Apple.|Discounts last 30 days, no stacking, booking by arrangement. Discounts need a Google/Apple sign-in.")}</div><button class="text-[11px] text-gray-400 underline" onclick="dlClose()">${t("Закрити|Close")}</button>`)}
function dailyCard(){return ""}
// ПЛАШКА ПІД РЕКЛАМОЮ (праворуч): торкнись — забереш нагороду дня або побачиш весь шлях
(function(){const d=document.createElement("div");d.id="spw";d.className="fixed right-0 z-[60]";d.style.cssText="top:calc(38% + 58px);display:none";
 d.innerHTML=`<button id="spwB" onclick="spwGo()" class="flex flex-col items-center leading-none pl-2.5 pr-1.5 py-2 rounded-l-2xl text-white text-[10px] font-black active:scale-95" style="background:linear-gradient(135deg,#7c3aed,#ff2a5f);box-shadow:0 0 16px rgba(124,58,237,.55)"><span class="text-base" id="spwI">⛩️</span><span id="spwT" class="font-mono mt-0.5">1/30</span></button>`;document.body.appendChild(d);
 const st=document.createElement("style");st.textContent=`@keyframes spwIn{from{transform:translateX(110%)}to{transform:none}}@keyframes spwP{0%,100%{box-shadow:0 0 14px rgba(255,183,3,.5)}50%{box-shadow:0 0 26px rgba(255,183,3,1)}}#spwB.rdy{animation:spwP 1.4s ease-in-out infinite;background:linear-gradient(135deg,#ffcf4d,#ff2a5f)!important}`;document.head.appendChild(st)})();
function spwGo(){if(dailyReady())claimPath();else openPath()}
let _spwH=1;
function spwTick(){const e=$("spw");if(!e)return;const hide=!splashDone||cur=="auth"||playing()||!!document.getElementById("mg");e.style.display=hide?"none":"";if(hide){_spwH=1;return}if(_spwH){_spwH=0;e.style.animation="none";void e.offsetWidth;e.style.animation="spwIn .5s cubic-bezier(.2,1.2,.4,1)"}
 const ok=dailyReady();$("spwT").textContent=(dayIdx()+1)+"/"+PDAYS;$("spwI").textContent=ok?"🎁":"⛩️";$("spwB").classList.toggle("rdy",ok)}
{const f=window.adTick;window.adTick=function(){f();spwTick()}}
setInterval(spwTick,1000);
function dailyCardOld(){return ""}

// ═══ ГОЛОВНИЙ ЕКРАН: івент, дуель, навчання, серія ═══
/* ═══ РЕЖИМИ ДНЯ (ще два, окрім івентів): різні механіки й множники. Нічний «Хякікі» лишається івентом (EVENTS). Час — локальний на пристрої. ═══ */
const DM={
 morning:{ic:"🌅",nm:"Ранок Тенґу|Tengu Morning",ds:"Вітер: йокаї летять швидше й частіше — ІНК ×1.6|Wind: yokai fly faster and more often — INK ×1.6",m:1.6,h:[6,13]},
 evening:{ic:"🦊",nm:"Вечір Кіцуне|Kitsune Evening",ds:"Золоті лисиці = ×5, але гарбузів більше — ІНК ×1.4|Golden foxes are worth ×5, but more pumpkins — INK ×1.4",m:1.4,h:[17,24]}};
function dayMode(){const h=new Date().getHours();for(const k in DM)if(h>=DM[k].h[0]&&h<DM[k].h[1])return Object.assign({id:k},DM[k]);return null}
function dmLeft(x){const n=new Date(),e=new Date(n);e.setHours(x.h[1]>=24?0:x.h[1],0,0,0);if(x.h[1]>=24)e.setDate(e.getDate()+1);const s=Math.max(0,e-n)/1000|0;return String(s/3600|0).padStart(2,"0")+":"+String((s%3600)/60|0).padStart(2,"0")}
// ОДИН бонус за раз (не сумуються): Ніч Сьогуна > івент (Ніч сотні демонів тощо) > режим дня (ранок / вечір)
function bonusNow(){if(typeof shogunNight=="function"&&shogunNight())return{id:"sh",m:2};const ev=curEvent();if(ev)return{id:"ev",m:ev[6],ev};const dm=dayMode();if(dm)return{id:dm.id,m:dm.m,dm};return{id:"none",m:1}}
function playExtras(){let h="";
 h+=timeCard();
 if(DUEL&&DUEL.sc>0)h+=`<div class="card text-center !border-neonGold/60"><b class="text-neonGold">⚔️ ${t("Дуель|Duel")}: ${esc(DUEL.n)} ${t("набрав|scored")} ${fmt(DUEL.sc)}</b><div class="text-[11px] text-gray-300">${t("Побий цей рахунок в одному соло-раунді — отримаєш бустер ×2 ІНК.|Beat this score in one solo round to win a ×2 INK boost.")}</div></div>`;
 if(!S.tut)h+=`<div class="card text-center !border-neonGold/60 glow"><b>🥷 ${t("Натисни ГРАТИ — коротке навчання, і перший сундук у подарунок|Press PLAY — a quick tutorial and a free first chest")}</b></div>`;
 return h}
/* ═══ ПЛАНКА НАВЧАННЯ: перший раунд навчає всіх автоматично, далі — ця планка (екскурсія по іконках + правила) ═══ */
function tutBar(){return `<div class="card flex items-center gap-3 !py-2.5" style="background:rgba(19,17,24,.82)"><div class="text-2xl">📖</div><div class="flex-1 min-w-0"><b class="text-xs">${t("Навчання|Tutorial")}</b><div class="text-[11px] text-gray-400">${t("Що де натискати й як грати|What to tap and how to play")}</div></div><button class="btng !px-3 !py-2 text-xs" onclick="tutMenu()">${t("Відкрити|Open")}</button></div>`}
function tutMenu(){dlModal(`<h3 class="font-black">📖 ${t("Навчання|Tutorial")}</h3>
 <button class="btng w-full py-3" onclick="dlClose();startTour()">👆 ${t("Показати, що де натискати|Show what every icon does")}</button>
 <button class="btng w-full py-3" onclick="dlClose();setTimeout(()=>tutGuide(0),150)">📚 ${t("Правила гри (слайди)|Game rules (slides)")}</button>
 <div class="text-[11px] text-gray-400 text-left space-y-1"><div>✂️ ${t("Ріж йокаїв свайпом. 3 і більше за раз — бонус.|Swipe to cut yokai. 3+ at once is a bonus.")}</div><div>${BOMB.e} ${t("Не ріж {bomb:many}: кожен −3 очки, три — кінець.|Don't cut {bomb:many}: −3 points each, three end the round.")}</div><div>❌ ${t("3 пропущені йокаї — кінець раунду.|3 missed yokai end the round.")}</div></div>
 <button class="btn w-full" onclick="dlClose()">${t("Закрити|Close")}</button>`)}
function startTour(){
 go("play");
 const T=(s,ua,en)=>({s,t:ua+"|"+en}),steps=[
  T("#hCoins","墨 ІНК. Нараховуються за кожного розрізаного йокая. За них — катани, прокачка й сундуки.","墨 INK. Earned for every cut yokai. Spend it on blades, upgrades and chests."),
  T("#hSouls","⛩️ Торії. Дають боси, дуелі, бестіарій, міні-ігри. За них — окремі фони, катани й сундуки.","⛩️ Torii. From bosses, duels, the bestiary and mini-games. Buy exclusive backgrounds, blades and chests."),
  T("#hJade","💎 Нефрит. Рідкісна валюта: легендарні й міфічні катани та фони, найкращі сундуки.","💎 Jade. The rare currency: legendary and mythic blades, backgrounds and the best chests."),
  T("#musBtn","🔊 Вмикає й вимикає музику та звуки.","🔊 Turns music and sounds on or off."),
  T("#bSolo","⚔️ ГРАТИ — звичайний раунд. Свайпай по йокаях. Гарбуз = −3 очки, 3 пропущені йокаї = кінець.","⚔️ PLAY — a normal round. Swipe the yokai. Pumpkin = −3 points, 3 missed yokai = game over."),
  T("#bDuo","👥 ВДВОХ — екран ділиться навпіл, граєте вдвох на одному телефоні.","👥 DUO — the screen splits in two; play together on one phone."),
  T("#bMulti","🌐 МУЛЬТИПЛЕЄР — виклич друга на дуель за посиланням. Однакові йокаї. Перемога = печатка 🪪, 10 печаток = знижка.","🌐 ONLINE — challenge a friend by link. Identical yokai. A win = a seal 🪪; 10 seals = a discount."),
  T('.nb[data-g="shop"]',"🛒 Магазин: катани, фони й прокачка. Біля кожної катани є «▶ Анімація» — подивись слід до покупки.","🛒 Shop: blades, backgrounds and upgrades. Each blade has “▶ Animation” — preview the trail before buying."),
  T('.nb[data-g="chests"]',"🎁 Сундуки: ріж кришку катаною — випадають ІНК, бустери й навіть знижки.","🎁 Chests: slash the lid — INK, boosters and even discounts drop."),
  T('.nb[data-g="friends"]',"👥 Друзі: запрошуй за посиланням — бонуси вам обом.","👥 Friends: invite by link — bonuses for you both."),
  T('.nb[data-g="rewards"]',"🏆 Нагороди: розіграш тату, знижки в майстра YYOKAI.","🏆 Rewards: the tattoo raffle, discounts with master YYOKAI."),
  T("#spwB","⛩️ Шлях самурая: заходь щодня 30 днів — фони, катани, знижки й сундуки. Торкнись плашки, щоб забрати нагороду.","⛩️ Samurai path: visit daily for 30 days — backgrounds, blades, discounts and chests. Tap the plaque to claim."),
   T('.nb[data-g="rating"]',"📊 Рейтинг: тиждень, місяць, весь час. Твоє місце видно завжди.","📊 Rating: week, month, all-time. Your place is always visible."),
  T('.nb[data-g="profile"]',"👤 Профіль: нік, аватар, приватність і видалення даних.","👤 Profile: nickname, avatar, privacy and data deletion.")];
 let i=0;const el=document.createElement("div");el.id="tour";el.style.cssText="position:fixed;left:0;top:0;right:0;bottom:0;z-index:250";
 const end=()=>{el.remove();S.tour=1;save()};
 const draw=()=>{const st=steps[i],tg=document.querySelector(st.s);
  if(!tg||!tg.getBoundingClientRect().width){i++;return i<steps.length?draw():end()}
  const sticky=tg.closest("#hdr,#nav");if(!sticky)tg.scrollIntoView({block:"center"});
  const r=tg.getBoundingClientRect(),pad=6,below=r.top<innerHeight/2,pos=below?"top:"+Math.min(innerHeight-200,r.bottom+16)+"px":"bottom:"+Math.max(10,innerHeight-r.top+16)+"px";
  el.innerHTML=`<div style="position:fixed;left:${r.left-pad}px;top:${r.top-pad}px;width:${r.width+pad*2}px;height:${r.height+pad*2}px;border-radius:14px;box-shadow:0 0 0 9999px rgba(0,0,0,.78);border:2px solid #ffb703;pointer-events:none"></div>
  <div style="position:fixed;left:12px;right:12px;${pos};background:#15121d;border:1px solid #ffb703;border-radius:16px;padding:14px;color:#fff;font-size:14px;line-height:1.4"><div style="font-size:11px;color:#9ca3af">${i+1}/${steps.length}</div><div style="margin:6px 0 12px">${t(st.t)}</div><div style="display:flex;gap:8px"><button id="tkS" class="btn" style="flex:1">${t("Пропустити|Skip")}</button><button id="tkN" class="btng" style="flex:2">${i<steps.length-1?t("Далі ▶|Next ▶"):t("Готово ✓|Done ✓")}</button></div></div>`;
  el.querySelector("#tkN").onclick=()=>{i++;i<steps.length?draw():end()};el.querySelector("#tkS").onclick=end};
 document.body.appendChild(el);draw()}

// ═══ НАВЧАННЯ: перший соло-раунд — без програшу: йокаї → свиток → бос → сундук ═══
function bstHit(f,ty){S.bst=S.bst||{};const first=!S.bst[ty];S.bst[ty]=(S.bst[ty]||0)+1;if(first){S.souls+=3;pop(f,f.bx,f.by-70,"📖 +3 ⛩️",1)}
 if(G.tut){G.tut=0;S.tut=1;save();setTimeout(tutEnd,1400)}}
function tutEnd(){if(!G.on)return;G.on=0;addPlay(G.el);ptr={};setMusic("menu");$("gm").classList.add("hidden");adTick();track("tutorial_done");
 toast("🎉 "+t("Навчання пройдено! Тримай перший сундук|Tutorial complete! Here is your first chest"));
 afterRev=()=>go("play");runChest(["bonus","🎁","Сундук-знахідка|Found chest",0,"#ffb703"],1,"assets/chest_bonus.png")}

// ═══ ДУЕЛЬ: виграш = бустер ×2 ═══
function duelCheck(best){if(!DUEL||!(DUEL.sc>0)||G.m!=1||best<DUEL.sc)return;const nn=DUEL.n;DUEL=null;localStorage.removeItem("ink_duel");
 S.c.x2=(S.c.x2||0)+1;track("duel_won");setTimeout(()=>toast("⚔️ "+t("Дуель виграно проти |Duel won against ")+nn+t("! +1 бустер ×2|! +1 ×2 boost")),1200)}

// ═══ БЕСТІАРІЙ: 20 босів; повна колекція = знижка 30% на flash-ескіз у майстра YYOKAI ═══
function bestiary(){const ks=Object.keys(BOSS),got=ks.filter(k=>(S.bst||{})[k]>0).length,p=$("pc");p.onclick=()=>p.classList.replace("flex","hidden");
 p.innerHTML=`<div class="card rounded-3xl w-full max-w-sm max-h-[85vh] overflow-y-auto space-y-3" onclick="event.stopPropagation()"><h3 class="font-black text-center">📖 ${t("Бестіарій йокаїв|Yokai bestiary")} ${got}/${ks.length}</h3>
 <p class="text-[11px] text-gray-400 text-center">${t("Перша перемога над босом — +3 ⛩️. Збери всіх — отримаєш знижку 30% на flash-ескіз у майстра YYOKAI.|First win over a boss: +3 ⛩️. Collect them all for 30% off a flash sketch with master YYOKAI.")}</p>
 <div class="grid grid-cols-2 gap-2">${ks.map(k=>{const n=(S.bst||{})[k]||0,B=BOSS[k];return `<div class="rounded-xl p-2 text-center ${n?"":"opacity-40"}" style="background:#0a090d;border:1px solid ${n?B[1]:"#272235"}"><div class="h-14 flex items-center justify-center text-3xl">${IMG("assets/boss_"+k+".png",n?B[0].split("|")[0].split(" ")[0]:"❔","h-14 w-auto")}</div><b class="text-[10px] block leading-tight">${n?t(B[0]):"???"}</b><div class="text-[9px] text-gray-400 leading-tight">${n?t(B[3]):""}</div><div class="text-[10px] text-neonGold">×${n}</div></div>`}).join("")}</div>
 ${got>=ks.length?`<button class="btng w-full py-2.5" ${S.flash?"disabled":""} onclick="claimFlash()">${S.flash?"✓":t("Забрати знижку 30%|Claim 30% off")}</button>`:""}
 <button class="btn w-full" onclick="$('pc').classList.replace('flex','hidden')">${t("Закрити|Close")}</button></div>`;p.classList.replace("hidden","flex")}
async function claimFlash(){if(S.flash)return;
 if(!isReal()){alert(t("Щоб подати заявку, увійди через Google/Apple.|Sign in with Google/Apple to claim."));return}
 const m=masterOf(OWN);if(!m){alert(t("Майстер YYOKAI тимчасово недоступний.|Master YYOKAI is temporarily unavailable."));return}
 try{if(!(await claimOk(m,30)))return;await claimWrite(user.uid+"_flash",m,{uid:user.uid,master:m.id,masterName:m.nm,email:user.email||"",nick:S.nick,tier:"bestiary_flash",pct:30,code:"",kind:"discount",ts:FB.serverTimestamp(),status:"new"});
  S.flash=1;save();alert(t("Заявку надіслано майстру YYOKAI. Він напише тобі.|Request sent to master YYOKAI. He will contact you."));bestiary()}
 catch(e){alert(e.code=="permission-denied"?t("Така заявка вже подавалась.|Such a claim was already sent."):e.message)}}

// ═══ ПЕРЕРОДЖЕННЯ: скидає монети й покращення, дає постійні +25% монет ═══
const PR_MIN=1.5e6;
function prestigeCard(){const ok=(S.ptot||0)>=PR_MIN;
 return `<div class="card space-y-2 text-center"><h4 class="text-xs font-bold text-neonGold uppercase">🔄 ${t("Переродження|Rebirth")} ${S.pr?"· ×"+(1+.25*S.pr).toFixed(2):""}</h4><p class="text-[11px] text-gray-300">${t("Скидає ІНК й покращення, але лишає катани, фони, аватари, 💎, ⛩️ і рейтингові ІНК. За кожне переродження: +25% ІНК назавжди і +10 ⛩️.|Resets INK and upgrades but keeps blades, backgrounds, avatars, 💎, ⛩️ and rating INK. Each rebirth: +25% INK forever and +10 ⛩️.")}</p><div class="text-[10px] text-gray-400">${t("Зароблено з минулого переродження|Earned since last rebirth")}: ${fmt(Math.min(S.ptot||0,PR_MIN))}/${fmt(PR_MIN)}</div><button class="btng w-full py-2.5" ${ok?"":"disabled"} onclick="doPrestige()">${t("Переродитись|Rebirth")}</button></div>`}
function doPrestige(){if((S.ptot||0)<PR_MIN||!confirm(t("Скинути ІНК й покращення заради +25% ІНК назавжди?|Reset INK and upgrades for +25% INK forever?")))return;
 S.pr=(S.pr||0)+1;S.souls+=10;S.mon=500;S.lm=500;S.up={};S.rc=0;S.ptot=0;save();push();track("prestige",{n:S.pr});toast("🔄 ×"+(1+.25*S.pr).toFixed(2));rend()}
function profExtras(){const n=Object.keys(BOSS).filter(k=>(S.bst||{})[k]>0).length;
 return `<button onclick="bestiary()" class="w-full py-3 rounded-xl bg-inkCard border border-inkBorder font-bold text-sm">📖 ${t("Бестіарій йокаїв|Yokai bestiary")} · ${n}/${Object.keys(BOSS).length}</button>${prestigeCard()}${legalBlock()}`}

// ═══ РЕЙТИНГ: тиждень · місяць · міста · весь час (розіграш тату — за монетами місяця) ═══
let ratT="w";
// місце поза ТОП-100: один запит-лічильник («скільки гравців мають більше за мене»)
async function myRank(f,v){try{const r=await FB.getCountFromServer(FB.query(FB.collection(db,"public"),FB.where(f,">",v)));return r.data().count+1}catch(e){return null}}
async function rRatingX(){
 const el=$("view-rating"),W=wkNum(),M=monNum(),me=isReal()?user.uid:"me",tabs=[["w","Тиждень|Week"],["m","Місяць|Month"],...(typeof SOLO!=="undefined"&&SOLO?[]:[["c","Міста|Cities"]]),["a","Весь час|All time"]];
 const head=`<h2 class="text-xl font-black uppercase text-neonGold mb-3 text-center">⛩️ ${t("Книга Самураїв|Samurai Book")}</h2>${raffleCard()}<div class="grid grid-cols-4 gap-1.5 text-[11px] font-bold my-3">${tabs.map(([k,l])=>`<button onclick="ratT='${k}';rRatingX()" class="py-2 rounded-xl ${ratT==k?"bg-crimsonRed":"bg-inkCard border border-inkBorder"}">${t(l)}</button>`).join("")}</div>`;
 el.innerHTML=head+`<div class="text-xs text-gray-400 text-center py-6">…</div>`;
 let L=[];
 if(FBOK&&db){try{const f=ratT=="m"?"msc":ratT=="a"?"xp":"wsc",q=await FB.getDocs(FB.query(FB.collection(db,"public"),FB.orderBy(f,"desc"),FB.limit(ratT=="c"?300:100)));q.forEach(d=>L.push({id:d.id,...d.data()}))}catch(e){}}
 if(cur!="rating")return;
 const val=u=>ratT=="m"?(u.mk===M?u.mx||0:0):ratT=="a"?u.xp||0:(u.wk===W?u.wx||0:0);
 const card=(big,sub,hl)=>`<div class="card !p-3 text-center ${hl?"!border-crimsonRed glow":""}"><div class="text-[10px] uppercase text-gray-400">${t("Твоє місце|Your place")}</div><div class="text-2xl font-black text-neonGold">${big}</div><div class="text-[11px] text-gray-300">${sub}</div></div>`;
 // ── МІСТА ──
 if(ratT=="c"){const g={};L.filter(u=>u.wk===W&&u.city).forEach(u=>{const c=g[u.city]=g[u.city]||{n:u.city,v:0,p:0};c.v+=u.wx||0;c.p++});
  const all=Object.values(g).sort((a,b)=>b.v-a.v),mc=S.master&&S.master.city,ci=all.findIndex(c=>c.n==mc),row=(c,i)=>`<div class="card !p-3 flex items-center justify-between ${c.n==mc?"!border-crimsonRed":i<3?"!border-neonGold/50":""}"><div class="flex items-center gap-3"><span class="font-black font-mono text-sm w-10 ${i==0?"text-neonGold":""}">#${i+1}</span><div><b class="text-xs">${i==0?"👑 ":""}${esc(c.n)}</b><div class="text-[10px] text-gray-400">${c.p} ${t("гравців|players")}</div></div></div><span class="font-mono text-xs text-neonGold">${fmt(c.v)} 墨</span></div>`;
  const mine=!mc?`<button class="btn w-full" onclick="go('rewards')">🥷 ${t("Обери майстра, щоб грати за своє місто|Pick a master to play for your city")}</button>`:ci>=0?card("#"+(ci+1)+" · "+esc(mc),fmt(all[ci].v)+" 墨 · "+all[ci].p+" "+t("гравців|players"),1):card("—",esc(mc)+" · "+t("поки без очок цього тижня|no points this week"),0);
  el.innerHTML=head+`<p class="text-[11px] text-gray-400 text-center">${t("Місто береться з обраного майстра. ІНК всіх гравців міста за тиждень складаються.|City comes from your chosen master. All players' weekly INK add up.")}</p>`+mine+
   (all.length?all.slice(0,100).map(row).join(""):`<p class="text-xs text-gray-500 text-center">—</p>`);return}
 // ── ГРАВЦІ (тиждень / місяць / весь час) ──
 L=L.map(u=>({...u,v:val(u)})).filter(u=>u.v>0).sort((a,b)=>b.v-a.v).map(u=>u.id==me?{...u,av:S.av}:u);
 if(!isReal()&&ratT=="a")L.push({id:me,nick:S.nick||t("Ти|You"),av:S.av,xp:S.xp,v:S.xp,days:S.days});
 PL=L.slice(0,100);
 const mi=PL.findIndex(u=>u.id==me),mineV=ratT=="m"?(S.xmk===M?S.xm||0:0):ratT=="a"?S.xp||0:(S.xwk===W?S.xw||0:0),
  key=ratT=="m"?M*1e9+(S.xm||0):ratT=="a"?(S.xp||0):W*1e9+(S.xw||0),fld=ratT=="m"?"msc":ratT=="a"?"xp":"wsc";
 let summary;
 if(!isReal())summary=`<div class="card !p-3 text-center text-xs text-gray-300">${t("Увійди через Google/Apple, щоб потрапити в рейтинг.|Sign in with Google/Apple to enter the rating.")}</div>`;
 else if(mineV<=0)summary=card("—",t("Ще немає очок за цей період — зіграй раунд!|No points for this period yet — play a round!"),0);
 else if(mi>=0)summary=card("#"+(mi+1),fmt(mineV)+" 墨",1);
 else{const rk=await myRank(fld,key);if(cur!="rating")return;
  summary=card(rk?"#"+rk.toLocaleString("uk"):"> 100",fmt(mineV)+" 墨"+(PL.length>=100?" · "+t("ТОП-100 від|TOP-100 from")+" "+fmt(PL[99].v)+" 墨":""),1)}
 el.innerHTML=head+summary+`<div class="space-y-2 mt-2">`+
 PL.map((u,i)=>`<button onclick="showPl(${i})" class="card !p-3 w-full flex items-center justify-between text-left ${i<5?"!border-neonGold/50":""} ${u.id==me?"!border-crimsonRed":""}"><div class="flex items-center gap-3"><span class="font-black font-mono text-sm w-10 ${i==0?"text-neonGold":i==1?"text-gray-300":i==2?"text-amber-600":""}">#${i+1}</span><div class="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center text-xl">${avHTML(u.av||"fox")}</div><div><b class="text-xs">${esc(u.nick||"?")}</b><div class="text-[10px] text-gray-400">Lv ${lvl(u.xp||0)}${u.city?" · "+esc(u.city):""}</div></div></div><span class="font-mono text-xs text-neonGold">${fmt(u.v)} 墨</span></button>`).join("")+`</div>`}
RV.rating=()=>rRatingX();
