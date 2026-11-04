/* INKAI mini-game: «Маджонг-пасьянс» (вбудована гра: mg_mahjong.js, список MG_FILES у minigames.js) (Mahjong solitaire) — прибирай парами однакові ВІЛЬНІ фішки (не накриті зверху й вільні зліва або справа).
   200 рівнів (28 форм × розміри × правила шарів, відібрані за зростанням складності), кожен гарантовано проходимий (розкладка генерується «з кінця»). Фішки — твої йокаї й боси з бестіарію.
   СВОЇ КАРТИНКИ ФІШОК: assets/mj_0.png … mj_35.png (прозорий PNG ~256 px) — підмінять стандартні. 0–5 = лис, каппа, тенгу, оні, череп, дракон · 6–25 = боси (frz,slo,sto,bh,scr,gld,nos,mir,swm,inv,lgt,hvy,spl,shd,hea,rch,wnd,cha,cmb,vmp) · 26–35 = 🎴🎐🌸⛩️🗡️🍶🔔🎎🪭🍡. Фон — твій екіпірований (BG).
   Нагороди (збалансовано): ІНК за рівень (під твій заробіток і катану), торії за 3 зірки на 10-му, сундук кожен 25-й, нефрит кожен 50-й (лише перше проходження). */
const MJ={LEVELS:200,HINTS:3,SHUF:2};   // 🔧 кількість рівнів · підказок і перемішувань на рівень (мін. значення; реально — mjAids(n): з ростом рівня допомоги меншає)
// ─── ГЕНЕРАТОР 200 РІВНІВ: форма (маска) × правило шарів × розмір → відбір за зростанням складності ───
const mjAx=(a,n)=>Math.abs(a+.5-n/2),mjOv=(i,j,w,h)=>{const x=mjAx(i,w)/(w/2),y=mjAx(j,h)/(h/2);return x*x+y*y<=1.05};
const MJ_SHAPES=[   // [id, «Укр|Eng», (i,j,w,h)=>клітинка є?]
 ["rect","Прямокутник|Rectangle",()=>1],
 ["oval","Овал|Oval",mjOv],
 ["diam","Ромб|Diamond",(i,j,w,h)=>mjAx(i,w)/(w/2)+mjAx(j,h)/(h/2)<=1.05],
 ["plus","Хрест|Cross",(i,j,w,h)=>mjAx(i,w)<=Math.max(.5,w/6)||mjAx(j,h)<=Math.max(.5,h/6)],
 ["ring","Кільце|Ring",(i,j,w,h)=>{const k=Math.min(w,h)<7?1:2;return i<k||j<k||i>=w-k||j>=h-k}],
 ["gate","Торії|Torii",(i,j,w,h)=>j<2||i<2||i>=w-2],
 ["tri","Піраміда|Pyramid",(i,j,w,h)=>mjAx(i,w)<=(j+1)/h*w/2],
 ["tri2","Лійка|Funnel",(i,j,w,h)=>mjAx(i,w)<=(h-j)/h*w/2],
 ["hour","Пісочний годинник|Hourglass",(i,j,w,h)=>mjAx(i,w)/(w/2)<=mjAx(j,h)/(h/2)+.25],
 ["bow","Метелик|Butterfly",(i,j,w,h)=>mjAx(j,h)/(h/2)<=mjAx(i,w)/(w/2)+.25],
 ["xx","Ікс|Cross-X",(i,j,w,h)=>Math.abs((i+.5)/w-(j+.5)/h)<.19+.4/w||Math.abs((i+.5)/w+(j+.5)/h-1)<.19+.4/w],
 ["heart","Серце|Heart",(i,j,w,h)=>{const x=((i+.5)/w*2-1)*1.15,y=-((j+.5)/h*2-1)*1.15+.15,v=x*x+y*y-1;return v*v*v-x*x*y*y*y<=0}],
 ["hh","Брама|Gateway",(i,j,w,h)=>mjAx(i,w)>=w/2-Math.max(1,w/4)||mjAx(j,h)<=Math.max(.5,h/6)],
 ["tt","Молот|Hammer",(i,j,w,h)=>j<Math.max(1,h/3)||mjAx(i,w)<=Math.max(.5,w/6)],
 ["vv","Крило|Wing",(i,j,w,h)=>{const v=Math.round(mjAx(i,w)*(h-2)/(w/2));return j>=v&&j<=v+1}],
 ["stair","Сходи|Stairs",(i,j,w,h)=>i<(j+1)*w/h],
 ["twin","Двійня|Twins",(i,j,w,h)=>{const w2=Math.floor((w-1)/2);return i<w2?mjOv(i,j,w2,h):i>=w-w2?mjOv(i-(w-w2),j,w2,h):0}],
 ["conc","Лабіринт|Maze",(i,j,w,h)=>Math.min(i,j,w-1-i,h-1-j)%2==0],
 ["diag","Діагональ|Diagonal",(i,j,w,h)=>Math.abs((i+.5)/w-(j+.5)/h)<.3],
 ["comb","Гребінь|Comb",(i,j,w,h)=>j>=h-1||i%2==0],
 ["fort","Фортеця|Fortress",(i,j,w,h)=>i<1||j<1||i>=w-1||j>=h-1||(mjAx(i,w)<=w/6+.5&&mjAx(j,h)<=h/6+.5)],
 ["moon","Місяць|Crescent",(i,j,w,h)=>{if(!mjOv(i,j,w,h))return 0;const dx=(i+.5-w*.62)/(w*.42),dy=mjAx(j,h)/(h*.42);return dx*dx+dy*dy>=1}],
 ["strp","Смуги|Stripes",(i,j)=>j%2==0],
 ["star","Зірка|Star",(i,j,w,h)=>mjAx(i,w)/(w/2)+mjAx(j,h)/(h/2)<=1.05||mjAx(i,w)<=.5||mjAx(j,h)<=.5],
 ["arrow","Стріла|Arrow",(i,j,w,h)=>j<h*.55?mjAx(i,w)<=(j+1)/(h*.55)*w/2:mjAx(i,w)<=Math.max(.5,w/6)],
 ["tow","Чотири вежі|Four towers",(i,j,w,h)=>(i<w/3||i>=w-w/3)&&(j<h/2.5||j>=h-h/2.5)],
 ["donut","Бублик|Donut",(i,j,w,h)=>mjOv(i,j,w,h)&&Math.pow(mjAx(i,w)/(w*.25),2)+Math.pow(mjAx(j,h)/(h*.25),2)>=1]
];
// правила шарів: яким чином на базовий шар (маску) накладаються верхні. d — відстань клітинки до краю фігури (1 = крайня)
const MJ_RULES=[["flat"],["er2"],["er3"],["er4"],["chk"],["chk2"],["pil2"],["pil3"],["rows"],["edge"],["half"]];
function mjBuild(shape,w,h,rule){const M=[];for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(shape[2](i,j,w,h))M.push([i,j]);if(M.length<4)return null;
 const key=(i,j)=>i+","+j,in0=new Set(M.map(c=>key(c[0],c[1]))),d={};
 for(const[i,j]of M){let m=9;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){if(!in0.has(key(i+a,j+b)))m=Math.min(m,Math.max(Math.abs(a),Math.abs(b)))}d[key(i,j)]=m==9?9:m}   // 1 = є сусід-порожнеча
 // другий прохід — відстань до порожнечі крізь кілька клітинок (для er3/er4)
 for(let it=0;it<4;it++)for(const[i,j]of M){let m=d[key(i,j)];for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const n=d[key(i+a,j+b)];if(n!=null&&n+1<m)m=n+1}d[key(i,j)]=m}
 const F=f=>M.filter(c=>f(c[0],c[1],d[key(c[0],c[1])])),L=[M],r=rule[0];
 if(r=="er2"||r=="er3"||r=="er4"){const n=+r[2];for(let k=1;k<n;k++)L.push(F((i,j,dd)=>dd>k))}
 else if(r=="chk")L.push(F((i,j)=>(i+j)%2==0));
 else if(r=="chk2"){L.push(F((i,j)=>(i+j)%2==0));L.push(F((i,j)=>(i+j)%2==0&&i%2==0))}
 else if(r=="pil2"||r=="pil3"){const n=+r[3],P=F((i,j)=>i%3==1&&j%2==1);for(let k=0;k<n;k++)L.push(P)}
 else if(r=="rows")L.push(F((i,j)=>j%2==0));
 else if(r=="edge")L.push(F((i,j,dd)=>dd<=1));
 else if(r=="half")L.push(F((i,j)=>i<w/2));
 if(L.some(l=>!l.length))return null;if(r=="er2"&&L.length<2||r=="er3"&&L.length<3||r=="er4"&&L.length<4)return null;
 const T=[];L.forEach((l,z)=>l.forEach(c=>T.push([2*c[0],2*c[1],z])));if(T.length%2||T.length<10||T.length>156)return null;
 let cover=0;for(let z=1;z<L.length;z++)cover+=L[z].length;
 let inner=0;{const s0=new Set();T.forEach(t=>s0.add(t[0]+","+t[1]+","+t[2]));T.forEach(t=>{if(s0.has((t[0]-2)+","+t[1]+","+t[2])&&s0.has((t[0]+2)+","+t[1]+","+t[2]))inner++})}
 return{T,z:L.length,D:T.length+.8*cover+.15*inner+3*L.length,sig:T.map(t=>t.join()).join(";")}}
const MJ_PLAN=[[14,5,4,0],[6,4,4,0],[0,3,3,1],[15,3,3,4],[4,6,4,0],[16,4,4,4],[9,4,3,10],[2,6,5,0],[18,4,4,6],[26,6,5,0],[6,3,3,7],[0,4,3,6],[24,6,6,0],[19,4,4,4],[5,6,5,0],[21,6,6,8],[4,3,3,9],[16,3,3,5],[14,6,5,8],[13,5,4,4],[11,4,4,6],[19,4,3,5],[9,8,5,0],[15,4,4,7],[2,5,4,10],[25,9,7,0],[10,6,5,1],[4,5,4,10],[14,8,6,6],[22,10,6,0],[15,6,4,6],[24,6,5,4],[3,8,5,10],[1,6,6,0],[11,5,4,8],[25,6,5,6],[0,4,4,7],[2,6,4,9],[22,5,4,5],[5,5,4,6],[23,10,6,0],[3,6,6,7],[17,8,5,6],[21,8,5,5],[9,6,4,4],[14,7,5,9],[5,6,4,8],[19,5,4,9],[0,5,4,8],[18,6,4,9],[7,8,6,1],[13,6,4,5],[25,8,5,10],[2,8,5,6],[26,6,4,7],[19,6,6,10],[1,6,5,6],[21,10,6,7],[6,7,5,10],[24,7,5,8],[4,8,6,4],[7,10,8,0],[0,5,4,9],[25,8,5,7],[21,11,8,6],[10,10,7,0],[13,7,5,8],[12,6,5,7],[4,6,5,5],[8,6,4,9],[25,7,5,5],[24,11,7,1],[3,9,6,6],[20,8,8,1],[19,8,5,8],[16,8,6,10],[2,8,6,4],[1,6,5,7],[17,6,5,5],[25,8,5,9],[20,9,7,7],[9,6,4,9],[26,8,6,6],[16,8,5,9],[2,10,7,1],[11,10,8,0],[19,8,8,6],[20,7,5,10],[12,6,5,9],[3,12,9,0],[17,8,6,10],[0,10,6,0],[25,9,7,8],[13,9,6,10],[9,8,6,6],[1,6,5,5],[8,11,8,0],[12,9,6,10],[21,11,7,9],[5,10,6,4],[2,9,7,7],[3,10,6,4],[20,10,8,6],[1,8,5,2],[23,10,6,10],[10,6,6,9],[13,8,8,7],[5,7,5,9],[16,12,9,0],[7,9,7,10],[8,8,6,7],[6,11,7,2],[26,8,8,10],[10,8,8,8],[24,10,7,7],[13,10,7,1],[2,10,6,5],[9,10,8,1],[7,10,7,7],[8,10,7,6],[18,12,7,7],[6,11,7,4],[12,12,8,1],[11,8,6,5],[5,12,7,10],[24,8,8,9],[1,9,6,1],[2,11,8,2],[20,8,5,5],[3,12,7,1],[13,10,6,9],[18,11,8,10],[5,11,7,7],[17,10,8,4],[16,9,7,8],[7,10,7,9],[0,8,6,4],[10,9,7,10],[6,12,9,6],[2,11,8,8],[22,12,7,10],[4,11,7,6],[15,10,7,9],[7,11,8,4],[20,12,9,2],[3,10,7,8],[26,11,7,4],[13,12,9,6],[6,12,7,8],[8,11,7,4],[7,11,8,8],[24,12,10,6],[19,12,9,7],[15,12,8,8],[18,11,8,5],[12,10,8,8],[16,12,7,6],[26,9,7,5],[8,10,8,8],[10,12,8,6],[17,9,7,9],[18,12,9,8],[20,12,8,4],[3,12,8,9],[0,8,6,5],[7,12,9,2],[11,11,7,7],[10,10,7,5],[12,12,9,6],[9,12,7,8],[16,12,9,1],[17,11,7,8],[7,11,8,5],[11,11,8,9],[22,11,7,8],[10,12,10,2],[0,9,7,10],[9,11,8,7],[12,10,8,5],[16,11,8,2],[4,12,8,7],[24,12,10,5],[1,11,8,9],[4,12,10,8],[20,12,7,9],[9,12,9,2],[10,12,9,7],[26,12,10,8],[8,12,10,1],[16,12,8,7],[6,12,10,5],[1,12,8,8],[15,12,10,10],[0,8,8,2],[11,12,10,1],[8,12,10,10],[1,12,9,4],[26,12,9,9],[0,10,7,3],[9,12,10,5]];   // 200 рівнів, відсортовані за складністю: [форма, ширина, висота, правило шарів] (порахований заздалегідь з усіх ~3300 комбінацій; тут можна міняти порядок/вручну підкрутити)
const mjPl=n=>MJ_PLAN[Math.min(Math.max(n,1),MJ.LEVELS)-1];
function mjLayout(n){const p=mjPl(n),b=mjBuild(MJ_SHAPES[p[0]],p[1],p[2],MJ_RULES[p[3]]);return b.T.map(t=>t.slice())}
const mjName=n=>MJ_SHAPES[mjPl(n)[0]][1];
// допомоги з ростом рівня зменшуються: підказки 3→2→1, перемішування 2→1
const mjAids=n=>({h:n<50?3:n<120?2:1,s:n<70?2:1});
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
const MJ_BASE=[["fox","🦊"],["kappa","🐸"],["tengu","👺"],["oni","👹"],["skull","💀"],["dragon","🐉"]],MJ_DEC=["🎴","🎐","🌸","⛩️","🗡️","🍶","🔔","🎎","🪭","🍡"];
function mjTypes(){const L=[];MJ_BASE.forEach(b=>L.push({k:"y",f:b[0],e:b[1]}));Object.keys(typeof BOSS!="undefined"?BOSS:{}).forEach(k=>L.push({k:"b",f:k}));MJ_DEC.forEach(e=>L.push({k:"d",e}));return L}   // 0–5 йокаї · 6–25 боси (порядок як у грі) · 26–35 декор — НОМЕР ФІКСОВАНИЙ (для mj_N.png)
const mjFace=(i,ty)=>`<img src="assets/mj_${i}.png" class="w-full h-full object-contain" alt="" onerror="this.outerHTML=window.mjFb(${i})">`;
window.mjFb=i=>{const ty=window._mjT[i];const e=ty.k=="b"?bEm(BOSS[ty.f]):ty.e;return `<span style="font-size:1.3em">${e}</span>`};   // СВОЇ картинки фішок — assets/mj_N.png (окремий набір, не ті, що в інших іграх). Немає файлу — емодзі
// ─── Збереження ───
const mjSt=()=>(S.mj=S.mj||{ok:{}});
registerMiniGame({id:"mahjong",order:30,icon:"🀄",color:"#ef4444",name:"Маджонг-пасьянс|Mahjong solitaire",desc:"Прибирай пари вільних фішок. 200 рівнів, усе складніші, нагороди й сундуки|Remove pairs of free tiles. 200 ever-harder levels, rewards and chests",badge:"NEW",
 status:()=>{const c=Object.keys(mjSt().ok).length;return c?t("Пройдено|Cleared")+": "+c+"/"+MJ.LEVELS:""},start:mjMenu});
(function(){const st=document.createElement("style");st.textContent=`.mj-t{position:absolute;border-radius:7px;background:linear-gradient(145deg,#fffaf0,#efe2c4);border:2px solid var(--c,#999);box-shadow:2px 3px 0 #c9b88f,4px 6px 0 #8f7f58,5px 9px 8px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:12%;transition:filter .15s,transform .12s;touch-action:manipulation}
.mj-t.bl{filter:brightness(.62) saturate(.8)}.mj-t.sel{transform:translateY(-4px) scale(1.06);box-shadow:0 0 0 3px #ffb703,0 0 18px #ffb703,2px 3px 0 #c9b88f,5px 9px 8px rgba(0,0,0,.45);z-index:9999!important}.mj-t.hint{animation:mjH .7s ease-in-out infinite}@keyframes mjH{50%{box-shadow:0 0 0 3px #4ade80,0 0 20px #4ade80,2px 3px 0 #c9b88f}}.mj-t.shk{animation:mjS .3s}@keyframes mjS{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}`;document.head.appendChild(st)})();
function mjMenu(){const A=mgShell("mahjong",""),s=mjSt(),cur=s.cur;let mx=1;for(const k in s.ok)mx=Math.max(mx,+k+1);mx=Math.min(mx,MJ.LEVELS);const CH=20;
 let g="";for(let c=0;c<MJ.LEVELS/CH;c++){let done=0;for(let n=c*CH+1;n<=(c+1)*CH;n++)if(s.ok[n])done++;
  g+=`<div style="grid-column:1/-1;text-align:center;font-size:11px;font-weight:900;letter-spacing:.12em;color:#ffd27a;margin-top:${c?10:0}px;text-transform:uppercase">${t("Розділ|Chapter")} ${c+1} · ${c*CH+1}–${(c+1)*CH} · ${done}/${CH}</div>`;
  for(let n=c*CH+1;n<=(c+1)*CH;n++){const lock=n>mx,st=s.ok[n]||0;g+=`<button ${lock?"disabled":""} data-n="${n}" onclick="mjPlay(${n})" class="rounded-xl py-2 text-center ${lock?"opacity-35":""}" style="background:rgba(19,17,24,.85);border:1px solid ${st?"#ffb703":n==mx?"#4ade80":"#ffffff33"}"><div class="font-black">${lock?"🔒":n}</div><div class="text-[10px] text-neonGold leading-none">${st?"★".repeat(st)+"☆".repeat(3-st):"&nbsp;"}</div></button>`}}
 A.innerHTML=`<div style="padding:calc(env(safe-area-inset-top,0px) + 8px) 12px 6px;display:grid;grid-template-columns:40px 1fr 40px;align-items:center;gap:8px;color:#fff"><span></span><h2 class="text-lg font-black text-neonGold text-center">🀄 ${t("Маджонг-пасьянс|Mahjong solitaire")}</h2><button onclick="mgClose()" class="w-10 h-10 rounded-full bg-black/55 border border-white/20">✕</button></div>
 <div class="px-4 text-[11px] text-gray-200 text-center">${t("Прибирай пари однакових ВІЛЬНИХ фішок. Натисни «?» — правила. Рівнів: 200, і кожен складніший за попередній.|Remove pairs of identical FREE tiles. Tap “?” for rules. 200 levels, each harder than the last.")}</div>
 ${cur?`<div class="px-4 pt-3"><button class="btng w-full py-3" onclick="mjPlay(${cur.n},1)">▶ ${t("Продовжити рівень|Continue level")} ${cur.n}</button></div>`:""}
 <div id="mjG" class="p-4 grid grid-cols-6 gap-2" style="flex:1;min-height:0;overflow-y:auto;touch-action:pan-y;align-content:start">${g}</div>`;
 mgRules(A,t("Маджонг-пасьянс — правила|Mahjong solitaire — rules"),mjRulesHtml(),null,"left");
 const el=A.querySelector('[data-n="'+mx+'"]');if(el&&mx>12)setTimeout(()=>{try{el.scrollIntoView({block:"center"})}catch(e){}},30)}
const mjRulesHtml=()=>`<p>🎯 <b>${t("Мета|Goal")}</b>: ${t("прибрати всі фішки з поля.|clear every tile from the board.")}</p>
 <p>👆 <b>${t("Хід|Move")}</b>: ${t("торкнись фішки, потім такої ж — пара зникне. Можна брати лише ВІЛЬНІ фішки (яскраві): нічим не накриті зверху й вільні з лівого або з правого боку. Затемнені фішки заблоковані.|tap a tile, then an identical one — the pair disappears. You may take only FREE (bright) tiles: not covered from above and open on the left OR right. Dimmed tiles are blocked.")}</p>
 <p>💡 <b>${t("Підказка|Hint")}</b>: ${t("показує одну пару ходу (на початку 3 на рівень, далі менше). 🔀 перемішує фішки, що лишились (спершу 2, далі 1), розкладка завжди лишається проходимою. ↶ скасовує останню пару. З кожним рівнем поле більше, шарів і видів фішок — більше, а допомог — менше.|shows one available pair (3 per level at first, fewer later). 🔀 reshuffles the remaining tiles (2 at first, then 1) and always keeps the level solvable. ↶ undoes the last pair. Each level has a bigger board, more layers and more tile kinds, with fewer aids.")}</p>
 <p>⭐ <b>${t("Зірки|Stars")}</b>: ${t("3 — без підказок, перемішувань і скасувань; 2 — до двох допомог; 1 — більше.|3 — no hints, reshuffles or undos; 2 — up to two assists; 1 — more.")}</p>
 <p>🎁 <b>${t("Нагороди|Rewards")}</b>: ${t("ІНК за рівень (трохи більше за зірки; росте з твоєю катаною), ⛩️ за 3 зірки на кожному 10-му рівні, сундук кожен 25-й, 💎 кожен 50-й. Повторне проходження майже нічого не дає. На день є спільний ліміт нагород усіх міні-ігор.|INK per level (a bit more for stars; grows with your katana), ⛩️ for 3 stars on every 10th level, a chest every 25th, 💎 every 50th. Replays give almost nothing. All mini-games share a daily reward cap.")}</p>
 <p style="color:#aaa;font-size:12px">${t("Немає ходів — гра сама перемішає фішки (якщо лишились перемішування).|No moves left — the game reshuffles by itself (if reshuffles remain).")}</p>`;
function mjPlay(n,resume){const A=mgShell("mahjong",""),s=mjSt(),TY=window._mjT=mjTypes();const AID=mjAids(n);let T,hint=AID.h,shuf=AID.s,assists=0,undo=[],sel=-1,over=0,els=[];
 if(resume&&s.cur&&s.cur.n==n){const c=s.cur;T=c.T.map(t=>t.slice());hint=c.h;shuf=c.sh;assists=c.as;undo=c.un.map(u=>u.slice())}
 else{T=mjLayout(n);const nT=Math.min(6+Math.round(n*.15),TY.length),ids=[...Array(TY.length).keys()],pick=[];const got=ids.filter(i=>TY[i].k=="b"&&(S.bst||{})[TY[i].f]>0),bas=ids.filter(i=>TY[i].k=="y"),oth=ids.filter(i=>!got.includes(i)&&!bas.includes(i)).sort(()=>Math.random()-.5);
  [...bas.sort(()=>Math.random()-.5).slice(0,Math.min(nT,6)),...got.sort(()=>Math.random()-.5),...oth].slice(0,nT).forEach(i=>pick.push(i));
  const pool=[];for(let i=0;i<T.length/2;i++)pool.push(pick[i%pick.length]);if(!mjAssign(T,pool)){toast(t("Помилка розкладки|Layout error"));return mjMenu()}}
 A.innerHTML=`<div style="padding:calc(env(safe-area-inset-top,0px) + 8px) 12px 4px;display:grid;grid-template-columns:40px 1fr 40px;align-items:center;gap:8px;color:#fff;font-weight:900"><span></span><div style="text-align:center"><div class="text-[11px] text-neonGold uppercase tracking-widest">${t("Рівень|Level")} ${n} · ${t(mjName(n))}</div><div class="text-[12px] text-gray-200" id="mjP"></div></div><button onclick="mjLeave()" class="w-10 h-10 rounded-full bg-black/55 border border-white/20">✕</button></div>
 <div id="mjB" style="position:relative;flex:1;margin:4px 8px"></div>
 <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:6px 12px calc(env(safe-area-inset-bottom,0px) + 10px)"><button class="btn !py-3" id="mjU" onclick="mjUndo()">↶ ${t("Назад|Undo")}</button><button class="btn !py-3" id="mjH" onclick="mjHint()">💡 <span id="mjHn"></span></button><button class="btn !py-3" id="mjS" onclick="mjShuf()">🔀 <span id="mjSn"></span></button></div>`;
 mgRules(A,t("Маджонг-пасьянс — правила|Mahjong solitaire — rules"),mjRulesHtml(),null,"left");
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
  if(first){s.ok[n]=stars;r=mgGrant({ink:base*(1+.15*(stars-1)),souls:stars==3&&n%10==0?1:0,jd:n%50==0?1:0,chest:n%25==0?(n>=100?2:1):0},"mahjong")}
  else{const old=s.ok[n];if(stars>old)s.ok[n]=stars;r=mgGrant({ink:base*.1},"mahjong")}
  save();track("mahjong_win",{n,stars,first:first?1:0});sfx("reveal");
  mgResult(A,{icon:"🀄",title:t("Рівень пройдено!|Level cleared!")+" "+"★".repeat(stars)+"☆".repeat(3-stars),lines:[t(mjName(n))+" · "+n+"/"+MJ.LEVELS,first?"":t("Повторне проходження — нагорода менша|Replay — smaller reward")],reward:r,again:n<MJ.LEVELS?"mjPlay("+(n+1)+")":"mjMenu()",againLabel:n<MJ.LEVELS?t("Далі|Next level"):t("До рівнів|Levels")});
}
 const lose=()=>{over=1;s.cur=null;save();sfx("bomb");track("mahjong_stuck",{n});mgResult(A,{icon:"🀄",title:t("Ходів більше немає|No more moves"),lines:[t("Спробуй ще раз — розкладка буде новою.|Try again — the layout will be new.")],again:"mjPlay("+n+")",againLabel:t("Нова спроба|Try again")})};
 build();ui();save2();setTimeout(check,200);try{setMusic("battle")}catch(e){}}
function mjInk(n){return mgInk(.2+n*.004)}   // 🔧 ІНК за рівень: 0.2 «раунду» на 1-му → 1.0 на 200-му (і × катана через mgInk). Раніше було в 3–5 разів більше — можна було «бустанутись»
