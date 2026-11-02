/* INKAI mini-game: «Маджонг-пасьянс» (вбудована гра: mg_mahjong.js, список MG_FILES у minigames.js) (Mahjong solitaire) — прибирай парами однакові ВІЛЬНІ фішки (не накриті зверху й вільні зліва або справа).
   24 рівні (7 розкладок × 3 розміри), кожен гарантовано проходимий (розкладка генерується «з кінця»). Фішки — твої йокаї й боси з бестіарію.
   СВОЇ КАРТИНКИ ФІШОК: assets/mj_0.png … mj_35.png (прозорий PNG ~256 px) — підмінять стандартні. 0–5 = лис, каппа, тенгу, оні, череп, дракон · 6–25 = боси (frz,slo,sto,bh,scr,gld,nos,mir,swm,inv,lgt,hvy,spl,shd,hea,rch,wnd,cha,cmb,vmp) · 26–35 = 🎴🏮🌸⛩️🗡️🍶🔔🎎🪭🍡. Фон — твій екіпірований (BG).
   Нагороди: ІНК за рівень (масштабується під твій заробіток), торії за 3 зірки, сундук кожен 5-й рівень, нефрит кожен 10-й (перше проходження). */
const MJ={LEVELS:24,HINTS:3,SHUF:2};   // 🔧 кількість рівнів · підказок і перемішувань на рівень
// ─── Розкладки ─── tile = [x, y, z] у «півклітинках»: фішка займає 2×2, сусіди на одному шарі відстоять на 2
const mjRows=(spec,z)=>{const o=[];for(const[x0,n,y]of spec)for(let i=0;i<n;i++)o.push([x0+2*i,y,z||0]);return o};
const mjStack=(c,r,L,h)=>{const o=[];for(let k=0;k<L;k++){const cc=c-(h?k:2*k),rr=r-(h?k:2*k);if(cc<1||rr<1)break;const x0=h?k:2*k,y0=h?k:2*k;for(let j=0;j<rr;j++)for(let i=0;i<cc;i++)o.push([x0+2*i,y0+2*j,k])}return o};
const mjRing=(c,r,x0,y0,z)=>{const o=[];for(let j=0;j<r;j++)for(let i=0;i<c;i++)if(i==0||j==0||i==c-1||j==r-1)o.push([x0+2*i,y0+2*j,z]);return o};
const mjDiam=(cnt,z,dy,dx)=>{const m=Math.max(...cnt),o=[];cnt.forEach((n,r)=>{for(let i=0;i<n;i++)o.push([(m-n)+(dx||0)+2*i,(dy||0)+2*r,z])});return o};
const MJ_SH=[
 ["Піраміда|Pyramid",s=>mjStack([4,6,8][s],[4,4,6][s],3,false)],
 ["Кільце|Ring",s=>[...mjRing([6,8,10][s],[5,6,7][s],0,0,0),...mjRing([6,8,10][s],[5,6,7][s],0,0,1)]],
 ["Ромб|Diamond",s=>[...mjDiam([[2,4,4,2],[2,4,6,6,4,2],[2,4,6,8,8,6,4,2]][s],0,0),...mjDiam([[2,2],[2,4,4,2],[2,4,6,6,4,2]][s],1,2,[2,2,2][s])]],
 ["Хрест|Cross",s=>[]],
 ["Двійня|Twins",s=>{const c=[4,4,5][s],r=[4,5,5][s],A=mjStack(c,r,2,false),gap=c*2+2;return[...A,...A.map(([x,y,z])=>[x+gap,y,z])]}],
 ["Торії|Torii",s=>{const w=[8,10,12][s],o=mjRows([[0,w,0]],0);o.push(...mjRows([[2,w-2,2]],1));const h=[3,4,5][s];for(let j=0;j<h;j++){o.push([2,4+2*j,0],[2*w-4,4+2*j,0],[2,4+2*j,1],[2*w-4,4+2*j,1])}return o}],
 ["Хвиля|Wave",s=>{const n=[4,5,6][s],o=[];for(let r=0;r<n;r++)o.push(...mjRows([[(r%2),[6,8,10][s],2*r]],0));o.push(...mjRows([[2,[4,6,8][s],2]],1));return o}],
 ["Черепаха|Turtle",s=>mjStack([6,8,10][s],[4,5,6][s],3,true)]
];
// хрест робимо окремо (простіше й надійніше)
MJ_SH[3][1]=s=>{const a=[3,4,5][s],o=[];for(let i=0;i<a*2+1;i++)o.push([2*i,2*a,0]);for(let j=0;j<a*2+1;j++)if(j!=a)o.push([2*a,2*j,0]);o.push(...mjRows([[2*a-2,3,2*a]],1));return o};
// 24 рівні = 8 розкладок × 3 розміри, відсортовані за кількістю фішок (від простих до складних)
function mjRaw(i,sz){const T=MJ_SH[i][1](sz).map(p=>p.slice());if(T.length%2)T.pop();return T}
const MJ_LV=(()=>{const a=[];for(let sz=0;sz<3;sz++)MJ_SH.forEach((_,i)=>a.push({i,sz,c:mjRaw(i,sz).length}));return a.sort((p,q)=>p.c-q.c||p.sz-q.sz)})();
function mjLayout(n){const L=MJ_LV[Math.min(n,MJ_LV.length)-1];return mjRaw(L.i,L.sz)}
const mjName=n=>MJ_SH[MJ_LV[Math.min(n,MJ_LV.length)-1].i][0];
// ─── Правила вільності ───
function mjFree(T,i){const t=T[i];if(!t[4])return false;let l=false,r=false;for(let k=0;k<T.length;k++){const u=T[k];if(k==i||!u[4])continue;
 if(u[2]==t[2]+1&&Math.abs(u[0]-t[0])<2&&Math.abs(u[1]-t[1])<2)return false;
 if(u[2]==t[2]&&Math.abs(u[1]-t[1])<2){if(u[0]==t[0]-2)l=true;if(u[0]==t[0]+2)r=true}}return!(l&&r)}
const mjFreeList=T=>{const o=[];for(let i=0;i<T.length;i++)if(mjFree(T,i))o.push(i);return o};
// Призначення типів «з кінця»: беремо дві вільні фішки → однаковий тип → прибираємо; так розкладка завжди проходима. pool — масив типів (парами)
function mjAssign(T,pool){for(let tr=0;tr<200;tr++){const A=T.map(t=>[t[0],t[1],t[2],-1,1]),P=pool.slice().sort(()=>Math.random()-.5);let ok=true,left=A.length;
  while(left>0){const f=mjFreeList(A);if(f.length<2){ok=false;break}const a=f.splice(Math.random()*f.length|0,1)[0],b=f[Math.random()*f.length|0],ty=P.pop();A[a][3]=ty;A[b][3]=ty;A[a][4]=0;A[b][4]=0;left-=2}
  if(ok){for(let i=0;i<T.length;i++){T[i][3]=A[i][3];T[i][4]=1}return true}}return false}
// Розумна підказка: шукаємо хід, після якого рівень ще можна пройти (DFS, ліміт вузлів). Якщо не знайшли — звичайна випадкова пара
function mjSolve(T,cap){const A=T.map(t=>t.slice()),seen=new Set();let nodes=0;
 const key=()=>A.map(t=>t[4]?1:0).join("");
 const rec=()=>{if(++nodes>cap)return null;const f=mjFreeList(A);if(!f.length)return A.every(t=>!t[4])?[]:null;const pr=[];for(let a=0;a<f.length;a++)for(let b=a+1;b<f.length;b++)if(A[f[a]][3]==A[f[b]][3])pr.push([f[a],f[b]]);if(!pr.length)return A.every(t=>!t[4])?[]:null;
  pr.sort(()=>Math.random()-.5);pr.sort((p,q)=>(A[q[0]][2]+A[q[1]][2])-(A[p[0]][2]+A[p[1]][2]));   // спершу верхні шари
  for(const[p,q]of pr){A[p][4]=A[q][4]=0;const k=key();if(!seen.has(k)){seen.add(k);const r=rec();if(r){A[p][4]=A[q][4]=1;return[[p,q],...r]}}A[p][4]=A[q][4]=1;if(nodes>cap)return null}return null};
 return rec()}
// ─── Типи фішок: 6 йокаїв + боси (зібрані — першими) + декор-емодзі. Свої PNG: assets/mj_<i>.png ───
const MJ_BASE=[["fox","🦊"],["kappa","🐸"],["tengu","👺"],["oni","👹"],["skull","💀"],["dragon","🐉"]],MJ_DEC=["🎴","🏮","🌸","⛩️","🗡️","🍶","🔔","🎎","🪭","🍡"];
function mjTypes(){const L=[];MJ_BASE.forEach(b=>L.push({k:"y",f:b[0],e:b[1]}));Object.keys(typeof BOSS!="undefined"?BOSS:{}).forEach(k=>L.push({k:"b",f:k}));MJ_DEC.forEach(e=>L.push({k:"d",e}));return L}   // 0–5 йокаї · 6–25 боси (порядок як у грі) · 26–35 декор — НОМЕР ФІКСОВАНИЙ (для mj_N.png)
const mjFace=(i,ty)=>`<img src="assets/mj_${i}.png" class="w-full h-full object-contain" alt="" onerror="this.outerHTML=window.mjFb(${i})">`;
window.mjFb=i=>{const ty=window._mjT[i];return ty.k=="y"?IMG("assets/yokai_"+ty.f+".png",ty.e,"w-full h-full object-contain"):ty.k=="b"?bImg(ty.f,bEm(BOSS[ty.f]),"w-full h-full object-contain"):`<span style="font-size:1.3em">${ty.e}</span>`};
// ─── Збереження ───
const mjSt=()=>(S.mj=S.mj||{ok:{}});
registerMiniGame({id:"mahjong",order:30,icon:"🀄",color:"#ef4444",name:"Маджонг-пасьянс|Mahjong solitaire",desc:"Прибирай пари вільних фішок. 24 рівні, нагороди й сундуки|Remove pairs of free tiles. 24 levels, rewards and chests",badge:"NEW",
 status:()=>{const c=Object.keys(mjSt().ok).length;return c?t("Пройдено|Cleared")+": "+c+"/"+MJ.LEVELS:""},start:mjMenu});
(function(){const st=document.createElement("style");st.textContent=`.mj-t{position:absolute;border-radius:7px;background:linear-gradient(145deg,#fffaf0,#efe2c4);border:2px solid var(--c,#999);box-shadow:2px 3px 0 #c9b88f,4px 6px 0 #8f7f58,5px 9px 8px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:12%;transition:filter .15s,transform .12s;touch-action:manipulation}
.mj-t.bl{filter:brightness(.62) saturate(.8)}.mj-t.sel{transform:translateY(-4px) scale(1.06);box-shadow:0 0 0 3px #ffb703,0 0 18px #ffb703,2px 3px 0 #c9b88f,5px 9px 8px rgba(0,0,0,.45);z-index:9999!important}.mj-t.hint{animation:mjH .7s ease-in-out infinite}@keyframes mjH{50%{box-shadow:0 0 0 3px #4ade80,0 0 20px #4ade80,2px 3px 0 #c9b88f}}.mj-t.shk{animation:mjS .3s}@keyframes mjS{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}`;document.head.appendChild(st)})();
function mjMenu(){const A=mgShell("mahjong",""),s=mjSt(),cur=s.cur;let mx=1;for(const k in s.ok)mx=Math.max(mx,+k+1);mx=Math.min(mx,MJ.LEVELS);
 A.innerHTML=`<div style="padding:calc(env(safe-area-inset-top,0px) + 10px) 14px 6px;display:flex;align-items:center;gap:10px;color:#fff"><button onclick="mgClose()" class="w-10 h-10 rounded-full bg-black/55 border border-white/20">✕</button><h2 class="text-lg font-black text-neonGold flex-1 text-center">🀄 ${t("Маджонг-пасьянс|Mahjong solitaire")}</h2><span class="w-10"></span></div>
 <div class="px-4 text-[11px] text-gray-200 text-center">${t("Прибирай пари однакових ВІЛЬНИХ фішок (не накритих і вільних зліва або справа). Натисни «?» у грі — правила.|Remove pairs of identical FREE tiles (uncovered and open on the left or right). Tap “?” in the game for rules.")}</div>
 ${cur?`<div class="px-4 pt-3"><button class="btng w-full py-3" onclick="mjPlay(${cur.n},1)">▶ ${t("Продовжити рівень|Continue level")} ${cur.n}</button></div>`:""}
 <div class="p-4 grid grid-cols-6 gap-2 overflow-auto" style="touch-action:pan-y">${Array.from({length:MJ.LEVELS},(_,i)=>{const n=i+1,lock=n>mx,st=s.ok[n]||0;return `<button ${lock?"disabled":""} onclick="mjPlay(${n})" class="rounded-xl py-2 text-center ${lock?"opacity-35":""}" style="background:rgba(19,17,24,.85);border:1px solid ${st?"#ffb703":"#ffffff33"}"><div class="font-black">${lock?"🔒":n}</div><div class="text-[10px] text-neonGold leading-none">${st?"★".repeat(st)+"☆".repeat(3-st):"&nbsp;"}</div></button>`}).join("")}</div>`;
 mgRules(A,t("Маджонг-пасьянс — правила|Mahjong solitaire — rules"),mjRulesHtml())}
const mjRulesHtml=()=>`<p>🎯 <b>${t("Мета|Goal")}</b>: ${t("прибрати всі фішки з поля.|clear every tile from the board.")}</p>
 <p>👆 <b>${t("Хід|Move")}</b>: ${t("торкнись фішки, потім такої ж — пара зникне. Можна брати лише ВІЛЬНІ фішки (яскраві): нічим не накриті зверху й вільні з лівого або з правого боку. Затемнені фішки заблоковані.|tap a tile, then an identical one — the pair disappears. You may take only FREE (bright) tiles: not covered from above and open on the left OR right. Dimmed tiles are blocked.")}</p>
 <p>💡 <b>${t("Підказка|Hint")}</b>: ${t("показує одну пару ходу (3 на рівень). 🔀 перемішує фішки, що лишились (2 на рівень), розкладка завжди лишається проходимою. ↶ скасовує останню пару.|shows one available pair (3 per level). 🔀 reshuffles the remaining tiles (2 per level) and always keeps the level solvable. ↶ undoes the last pair.")}</p>
 <p>⭐ <b>${t("Зірки|Stars")}</b>: ${t("3 — без підказок, перемішувань і скасувань; 2 — до двох допомог; 1 — більше.|3 — no hints, reshuffles or undos; 2 — up to two assists; 1 — more.")}</p>
 <p>🎁 <b>${t("Нагороди|Rewards")}</b>: ${t("ІНК за рівень (більше за зірки), ⛩️ за 3 зірки, сундук кожен 5-й рівень, 💎 кожен 10-й. Повторне проходження дає лише трохи ІНК.|INK per level (more for stars), ⛩️ for 3 stars, a chest every 5th level, 💎 every 10th. Replays give only a little INK.")}</p>
 <p style="color:#aaa;font-size:12px">${t("Немає ходів — гра сама перемішає фішки (якщо лишились перемішування).|No moves left — the game reshuffles by itself (if reshuffles remain).")}</p>`;
function mjPlay(n,resume){const A=mgShell("mahjong",""),s=mjSt(),TY=window._mjT=mjTypes();let T,hint=MJ.HINTS,shuf=MJ.SHUF,assists=0,undo=[],sel=-1,over=0,els=[];
 if(resume&&s.cur&&s.cur.n==n){const c=s.cur;T=c.T.map(t=>t.slice());hint=c.h;shuf=c.sh;assists=c.as;undo=c.un.map(u=>u.slice())}
 else{T=mjLayout(n);const nT=Math.min(6+Math.floor(n/2),TY.length),ids=[...Array(TY.length).keys()],pick=[];const got=ids.filter(i=>TY[i].k=="b"&&(S.bst||{})[TY[i].f]>0),bas=ids.filter(i=>TY[i].k=="y"),oth=ids.filter(i=>!got.includes(i)&&!bas.includes(i)).sort(()=>Math.random()-.5);
  [...bas.sort(()=>Math.random()-.5).slice(0,Math.min(nT,6)),...got.sort(()=>Math.random()-.5),...oth].slice(0,nT).forEach(i=>pick.push(i));
  const pool=[];for(let i=0;i<T.length/2;i++)pool.push(pick[i%pick.length]);if(!mjAssign(T,pool)){toast(t("Помилка розкладки|Layout error"));return mjMenu()}}
 A.innerHTML=`<div style="padding:calc(env(safe-area-inset-top,0px) + 8px) 12px 4px;display:flex;align-items:center;gap:8px;color:#fff;font-weight:900"><button onclick="mjLeave()" class="w-10 h-10 rounded-full bg-black/55 border border-white/20">✕</button><div style="flex:1;text-align:center"><div class="text-[11px] text-neonGold uppercase tracking-widest">${t("Рівень|Level")} ${n} · ${t(mjName(n))}</div><div class="text-[12px] text-gray-200" id="mjP"></div></div><span style="width:96px"></span></div>
 <div id="mjB" style="position:relative;flex:1;margin:4px 8px"></div>
 <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:6px 12px calc(env(safe-area-inset-bottom,0px) + 10px)"><button class="btn !py-3" id="mjU" onclick="mjUndo()">↶ ${t("Назад|Undo")}</button><button class="btn !py-3" id="mjH" onclick="mjHint()">💡 <span id="mjHn"></span></button><button class="btn !py-3" id="mjS" onclick="mjShuf()">🔀 <span id="mjSn"></span></button></div>`;
 mgRules(A,t("Маджонг-пасьянс — правила|Mahjong solitaire — rules"),mjRulesHtml());
 const B=document.getElementById("mjB");let U,UY,ox,oy,minX,minY;
 const lay=()=>{minX=Math.min(...T.map(t=>t[0]));const maxX=Math.max(...T.map(t=>t[0]))+2;minY=Math.min(...T.map(t=>t[1]));const maxY=Math.max(...T.map(t=>t[1]))+2,Z=Math.max(...T.map(t=>t[2])),bw=B.clientWidth-14,bh=B.clientHeight-14;
  U=Math.min(bw/(maxX-minX+.8+Z*.5),bh/((maxY-minY)*1.25+.8+Z*.6),30);UY=U*1.25;ox=(B.clientWidth-(maxX-minX)*U)/2;oy=(B.clientHeight-(maxY-minY)*UY)/2};
 const pos=(el,t)=>{const z=t[2];el.style.left=(ox+(t[0]-minX)*U-z*.22*U)+"px";el.style.top=(oy+(t[1]-minY)*UY-z*.3*UY)+"px";el.style.width=2*U+"px";el.style.height=2*UY+"px";el.style.zIndex=z*100+Math.round(t[1]);el.style.fontSize=U*1.3+"px"};
 const build=()=>{B.innerHTML="";lay();els=T.map((t,i)=>{const el=document.createElement("div");el.className="mj-t";el.style.setProperty("--c","hsl("+(t[3]*47%360)+",58%,42%)");el.innerHTML=mjFace(t[3],TY[t[3]]);pos(el,t);el.addEventListener("pointerdown",e=>{e.preventDefault();tap(i)});B.appendChild(el);if(!t[4])el.style.display="none";return el})};
 const alive=()=>T.filter(t=>t[4]).length,save2=()=>{s.cur={n,T:T.map(t=>t.slice()),h:hint,sh:shuf,as:assists,un:undo.map(u=>u.slice())};save()};
 const ui=()=>{const f=mjFreeList(T),fs=new Set(f);els.forEach((el,i)=>{if(!T[i][4])return;el.classList.toggle("bl",!fs.has(i));el.classList.toggle("sel",i==sel);el.classList.remove("hint")});$("mjP").textContent=t("Пар лишилось|Pairs left")+": "+alive()/2;$("mjHn").textContent=hint;$("mjSn").textContent=shuf;$("mjU").disabled=!undo.length;$("mjH").disabled=hint<=0;$("mjS").disabled=shuf<=0};
 const pairs=()=>{const f=mjFreeList(T),o=[];for(let a=0;a<f.length;a++)for(let b=a+1;b<f.length;b++)if(T[f[a]][3]==T[f[b]][3])o.push([f[a],f[b]]);return o};
 const check=()=>{if(!alive()){win();return}if(!pairs().length){if(shuf>0){banner(t("Ходів немає — перемішую…|No moves — reshuffling…"));setTimeout(()=>doShuf(true),700)}else lose()}};
 const banner=x=>{const b=document.createElement("div");b.style.cssText="position:absolute;left:0;right:0;top:30%;text-align:center;font-weight:900;font-size:20px;color:#fff;text-shadow:0 0 10px #000;pointer-events:none;z-index:99999";b.textContent=x;A.appendChild(b);try{b.animate([{opacity:0},{opacity:1,offset:.2},{opacity:0}],{duration:1400})}catch(e){}setTimeout(()=>b.remove(),1400)};
 const tap=i=>{if(over||!T[i][4])return;if(!mjFree(T,i)){els[i].classList.remove("shk");void els[i].offsetWidth;els[i].classList.add("shk");sfx("tick");return}
  if(sel<0||sel==i){sel=sel==i?-1:i;sfx("tick");ui();return}
  if(T[sel][3]==T[i][3]){const a=sel,b=i;sel=-1;T[a][4]=T[b][4]=0;undo.push([a,b]);sfx("combo",null,3);[a,b].forEach(k=>{try{els[k].animate([{transform:"scale(1)",opacity:1},{transform:"scale(1.25)",opacity:.8,offset:.35},{transform:"scale(.2)",opacity:0}],{duration:260,fill:"forwards"})}catch(e){}setTimeout(()=>{els[k].style.display="none"},260)});ui();save2();setTimeout(check,280)}
  else{sel=i;sfx("tick");ui()}};
 const doShuf=auto=>{if(over||shuf<=0)return;const ids=[];T.forEach((t,i)=>{if(t[4])ids.push(i)});const sub=ids.map(i=>[T[i][0],T[i][1],T[i][2],T[i][3],1]),cnt={};sub.forEach(t=>cnt[t[3]]=(cnt[t[3]]||0)+1);const half=[];for(const k in cnt)for(let q=0;q<cnt[k]/2;q++)half.push(+k);
  if(mjAssign(sub,half)){ids.forEach((i,j)=>{T[i][3]=sub[j][3];T[i][4]=1});shuf--;if(!auto)assists++;undo=[];sel=-1;sfx("reveal");els.forEach((el,i)=>{if(T[i][4]){el.style.setProperty("--c","hsl("+(T[i][3]*47%360)+",58%,42%)");el.innerHTML=mjFace(T[i][3],TY[T[i][3]])}});ui();save2();setTimeout(check,50)}else{if(auto)lose();else toast(t("Перемішати неможливо|Cannot reshuffle"))}};
 window.mjUndo=()=>{if(over||!undo.length)return;const[a,b]=undo.pop();T[a][4]=T[b][4]=1;els[a].style.display=els[b].style.display="";els[a].style.opacity=els[b].style.opacity=1;[a,b].forEach(k=>{try{els[k].getAnimations().forEach(x=>x.cancel())}catch(e){}});assists++;sel=-1;sfx("tick");ui();save2()};
 window.mjHint=()=>{if(over||hint<=0)return;const p=pairs();if(!p.length)return;let mv=null;try{const sol=mjSolve(T,2500);if(sol&&sol.length)mv=sol[0]}catch(e){}const[a,b]=mv||p[Math.random()*p.length|0];hint--;assists++;sel=-1;ui();els[a].classList.add("hint");els[b].classList.add("hint");sfx("reveal");save2()};
 window.mjShuf=()=>doShuf(false);
 window.mjLeave=()=>{over=1;mgClose()};
 const win=()=>{over=1;s.cur=null;const stars=assists==0?3:assists<=2?2:1,first=!s.ok[n],base=mjInk(n);let r;
  if(first){s.ok[n]=stars;r=mgGrant({ink:base*(1+.2*(stars-1)),souls:(stars==3?1:0)+(n%5==0?1:0),jd:n%10==0?1:0,chest:n%5==0?1+Math.min(2,Math.floor(n/10)):0},"mahjong")}
  else{const old=s.ok[n];if(stars>old)s.ok[n]=stars;r=mgGrant({ink:base*.2},"mahjong")}
  save();track("mahjong_win",{n,stars,first:first?1:0});sfx("reveal");
  mgResult(A,{icon:"🀄",title:t("Рівень пройдено!|Level cleared!")+" "+"★".repeat(stars)+"☆".repeat(3-stars),lines:[t(mjName(n))+" · "+n+"/"+MJ.LEVELS,first?"":t("Повторне проходження — нагорода менша|Replay — smaller reward")],reward:r,again:n<MJ.LEVELS?"mjPlay("+(n+1)+")":"mjMenu()",againLabel:n<MJ.LEVELS?t("Далі|Next level"):t("До рівнів|Levels")});
}
 const lose=()=>{over=1;s.cur=null;save();sfx("bomb");track("mahjong_stuck",{n});mgResult(A,{icon:"🀄",title:t("Ходів більше немає|No more moves"),lines:[t("Спробуй ще раз — розкладка буде новою.|Try again — the layout will be new.")],again:"mjPlay("+n+")",againLabel:t("Нова спроба|Try again")})};
 build();ui();save2();setTimeout(check,200);try{setMusic("battle")}catch(e){}}
function mjInk(n){return mgInk(.5+n*.1)}
