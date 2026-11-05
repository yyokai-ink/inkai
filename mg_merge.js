/* INKAI mini-game: «Злиття йокаїв» — м'які латексні кулі. Кидай йокаїв у скриню: двоє однакових, що торкнулись, ПРОСТО зливаються в більшого (без вибухів).
   Найбільший — Король Хякі: м'яко лопається, дає очки й звільняє місце. Над червоною лінією довше за LV.over с — кінець. Кулі НІКОЛИ не виходять за рамку.
   СВОЇ PNG: assets/slime_0.png … slime_7.png (прозорий PNG 256–512 px, істота по центру) — з'явиться ВСЕРЕДИНІ м'якої кулі. Немає файлу — assets/yokai_*.png.
   200 РІВНІВ: кожен має ціль (створити йокая / набрати очки / зробити злиття / лопнути Короля) і обмежену кількість кидків; далі — менше кидків, більші кулі, нижча лінія, «сміття» на дні, гра наосліп.
   Рівні куль: 0 лис · 1 каппа · 2 тенгу · 3 оні · 4 череп · 5 дракон · 6 золотий оні · 7 Король Хякі. Фон — твій екіпірований (BG). */
// 🔧 РЕГУЛЯТОРИ.  RS — розмір усіх куль (більше = швидше заповнюється банка = легше програти, але й більше злиттів)  ·  LINE — де червона лінія (частка висоти банки від верху; більше = нижче = складніше)
//    OVER — скільки секунд над лінією до кінця  ·  OM — м'якість (менше = м'якше, глибше «сідає» під вагою)  ·  ZE — гасіння (≥1 = ЗОВСІМ без пружин)  ·  FLAT — наскільки сплющується в місцях дотику (0 круг … 1 повністю)  ·  WOB — тремтіння форми (0 = жодного)
const MGM={RS:1.45,LINE:.25,OVER:1.4,OM:24,ZE:1.05,SAG:.24,HARD:6,COH:28,BULGE:.09,FLAT:1,WOB:.03,MERGE:1.06};
const MGMT=[["🦊","Лис|Fox",15,"#fb923c"],["🐸","Каппа|Kappa",20,"#34d399"],["👺","Тенгу|Tengu",26,"#f87171"],["👹","Оні|Oni",33,"#a78bfa"],["💀","Череп|Skull",41,"#cbd5e1"],["🐉","Дракон|Dragon",50,"#38bdf8"],["👹","Золотий оні|Golden Oni",60,"#fbbf24"],["🐉","Король Хякі|Hyakki King",72,"#fb3a6b"]];
const MGMPT=[0,2,4,7,12,20,35,60];
// ═══ РІВНІ ═══
const MGML=200;   // 🔧 кількість рівнів
const mgmLerp=(a,b,p)=>a+(b-a)*p;
function mgmSpec(n){const p=Math.min(1,(n-1)/(MGML-1)),U=4+124*Math.pow(p,1.15),k=(n-1)%4,boss=n%10==0&&n>=30,cl=(v,lo)=>Math.max(lo,Math.min(7,Math.round(v)));   // U — «одиниці лиса», які треба зліпити (4 → 128)
 let kind=["tier","score","merge","tiers"][k],T=0,c=1,goal=0,units=U;
 if(boss&&n>=150){kind="king";goal=1;units=128}
 else if(boss){kind="tier";T=cl(Math.log2(U*1.4),3);units=Math.pow(2,T)}
 else if(kind=="tier"){T=cl(Math.log2(U),2);units=Math.pow(2,T)}
 else if(kind=="tiers"){c=n<60?2:3;T=cl(Math.log2(U/c),1);units=c*Math.pow(2,T)}
 else if(kind=="score")goal=Math.max(30,Math.round(U*5/10)*10);
 else goal=Math.max(3,Math.ceil(U*.7));
 const f=mgmLerp(2.8,1.45,p)-(boss?.2:0),D=Math.ceil(units/2.6*f)+8;   // кидків: «одиниці»/2.6 (середня вага кулі) × запас (з рівнем запас менший)
 const a=mgmLerp(.55,.22,p),b=mgmLerp(.30,.32,p),c2=mgmLerp(.12,.34,p);
 return{n,kind,T,c,goal,D,rs:mgmLerp(1.40,1.52,p),line:mgmLerp(.22,.36,p),over:mgmLerp(1.6,1.1,p),junk:Math.floor(16*Math.pow(p,1.1)),blind:n>=40&&n%7==0,w:[a,a+b,a+b+c2]}}
const mgmEndless=()=>({n:0,kind:"endless",D:0,rs:MGM.RS,line:MGM.LINE,over:MGM.OVER,junk:0,blind:0,w:[.4,.7,.9]});
const mgmDone=(g,L)=>L.kind=="tier"?g.mx>=L.T:L.kind=="tiers"?(g.made[L.T]||0)>=L.c:L.kind=="score"?g.sc>=L.goal:L.kind=="merge"?g.mc>=L.goal:L.kind=="king"?g.kings>=L.goal:false;
const mgmGoalTxt=L=>{const nm=L.T?t(MGMT[L.T][1]):"";return L.kind=="tier"?t("Створи|Make")+" "+nm:L.kind=="tiers"?t("Створи|Make")+" "+L.c+"× "+nm:L.kind=="score"?t("Набери очок|Score")+" "+L.goal:L.kind=="merge"?t("Зроби злиттів|Merges")+": "+L.goal:L.kind=="king"?t("Лопни Короля Хякі|Pop the Hyakki King"):""};
const mgmProg=(g,L)=>L.kind=="tier"?(g.mx>=L.T?1:0)+"/1":L.kind=="tiers"?Math.min(L.c,g.made[L.T]||0)+"/"+L.c:L.kind=="score"?Math.min(L.goal,g.sc)+"/"+L.goal:L.kind=="merge"?Math.min(L.goal,g.mc)+"/"+L.goal:Math.min(L.goal,g.kings)+"/"+L.goal;
function mgmHud(g,L){const a=$("mgT"),b=$("mgG"),c=$("mgS2");if(!a)return;a.textContent=L.n?t("Рівень|Level")+" "+L.n+(L.blind?" · "+t("наосліп|blind"):""):t("Нескінченний режим|Endless");b.textContent=L.n?mgmGoalTxt(L)+" · "+mgmProg(g,L):(g.mx?t(MGMT[g.mx][1]):"");c.textContent="⭐ "+g.sc+(L.D?" · "+t("Кидків|Drops")+": "+g.dl:"")+(g.kings?" · 👑×"+g.kings:"")}
function mgmBest(){S.mg=S.mg||{};return S.mg.mb||0}
registerMiniGame({id:"merge",order:10,icon:"🧩",color:"#a855f7",name:"Злиття йокаїв|Yokai merge",desc:"200 рівнів: цілі, обмежені кидки, усе складніше|200 levels: goals, limited drops, ever harder",badge:"NEW",status:()=>{const c=Object.keys((S.mg||{}).ml||{}).length;return c?t("Пройдено|Cleared")+": "+c+"/"+MGML:t("Рекорд|Best")+": "+mgmBest()},start:mgmMenu});
const _hx=c=>{c=String(c).trim();let m=c.match(/^rgba?\(([^)]+)\)/);if(m){const v=m[1].split(",").map(x=>Math.max(0,Math.min(255,Math.round(parseFloat(x)||0))));return[v[0]||0,v[1]||0,v[2]||0]}c=c.replace("#","");if(c.length==3)c=c.split("").map(z=>z+z).join("");const n=parseInt(c,16)||0;return[(n>>16)&255,(n>>8)&255,n&255]};
const _mix=(h,to,p)=>{const a=_hx(h),b=to=="w"?[255,255,255]:[8,4,20];return"rgb("+a.map((v,i)=>Math.round(v+(b[i]-v)*p)).join(",")+")"};
const _rgba=(h,al)=>{const a=_hx(h);al=Math.max(0,Math.min(1,+al||0));return"rgba("+a.join(",")+","+al.toFixed(3)+")"};
function mgmMenu(){const A=mgShell("merge",""),s=(S.mg=S.mg||{}),ml=(s.ml=s.ml||{});let mx=1;for(const k in ml)mx=Math.max(mx,+k+1);mx=Math.min(mx,MGML);const CH=20;
 let gr="";for(let c=0;c<MGML/CH;c++){let done=0;for(let n=c*CH+1;n<=(c+1)*CH;n++)if(ml[n])done++;
  gr+=`<div style="grid-column:1/-1;text-align:center;font-size:11px;font-weight:900;letter-spacing:.12em;color:#ffd27a;margin-top:${c?10:0}px;text-transform:uppercase">${t("Розділ|Chapter")} ${c+1} · ${c*CH+1}–${(c+1)*CH} · ${done}/${CH}</div>`;
  for(let n=c*CH+1;n<=(c+1)*CH;n++){const lock=n>mx,st=ml[n]||0;gr+=`<button ${lock?"disabled":""} data-n="${n}" onclick="mgmStart(${n})" class="rounded-xl py-2 text-center ${lock?"opacity-35":""}" style="background:rgba(19,17,24,.85);border:1px solid ${st?"#ffb703":n==mx?"#4ade80":"#ffffff33"}"><div class="font-black">${lock?"🔒":n}</div><div class="text-[10px] text-neonGold leading-none">${st?"★".repeat(st)+"☆".repeat(3-st):"&nbsp;"}</div></button>`}}
 A.innerHTML=`<div style="padding:calc(env(safe-area-inset-top,0px) + 8px) 12px 6px;display:grid;grid-template-columns:40px 1fr 40px;align-items:center;gap:8px;color:#fff"><span></span><h2 class="text-lg font-black text-neonGold text-center">🧩 ${t("Злиття йокаїв|Yokai merge")}</h2><button onclick="mgClose()" class="w-10 h-10 rounded-full bg-black/55 border border-white/20">✕</button></div>
 <div class="px-4 text-[11px] text-gray-200 text-center">${t("Виконуй цілі за обмежену кількість кидків. Натисни «?» — правила. 200 рівнів, кожен складніший.|Complete goals within a limited number of drops. Tap “?” for rules. 200 levels, each harder.")}</div>
 <div class="px-4 pt-3"><button class="btn w-full py-2" onclick="mgmStart(0)">♾ ${t("Нескінченний режим|Endless mode")} · ${t("Рекорд|Best")}: ${mgmBest()}</button></div>
 <div class="p-4 grid grid-cols-6 gap-2" style="flex:1;min-height:0;overflow-y:auto;touch-action:pan-y;align-content:start">${gr}</div>`;
 mgRules(A,t("Злиття йокаїв — правила|Yokai merge — rules"),mgmRulesHtml(),null,"left");
 const el=A.querySelector('[data-n="'+mx+'"]');if(el&&mx>12)setTimeout(()=>{try{el.scrollIntoView({block:"center"})}catch(e){}},30)}
const mgmRulesHtml=()=>`<p>🎯 <b>${t("Мета|Goal")}</b>: ${t("у кожному рівні є ціль (угорі): створити певного йокая, набрати очки, зробити злиття або лопнути Короля — і все це за обмежену кількість кидків.|every level has a goal (at the top): make a certain yokai, score points, do merges or pop the King — within a limited number of drops.")}</p>
 <p>👆 <b>${t("Керування|Controls")}</b>: ${t("веди пальцем — йокай пересувається над скринею; відпусти — він падає.|drag your finger — the yokai moves above the chest; release — it drops.")}</p>
 <p>🧩 <b>${t("Злиття|Merging")}</b>: ${t("двоє ОДНАКОВИХ йокаїв, що торкнулись, зливаються в більшого. Кілька злиттів підряд дають множник очок.|two IDENTICAL yokai that touch merge into a bigger one. Several merges in a row multiply points.")}</p>
 <p>⭐ <b>${t("Зірки|Stars")}</b>: ${t("чим більше кидків лишилось у кінці, тим більше зірок.|the more drops left at the end, the more stars.")}</p>
 <p>📈 <b>${t("Складність|Difficulty")}</b>: ${t("з рівнем цілі більші, кидків менше, кулі більші, червона лінія нижча, на дні лежить «сміття», а подекуди наступного йокая не видно.|each level has bigger goals, fewer drops, bigger balls, a lower red line, junk at the bottom and sometimes you can't see the next yokai.")}</p>
 <p>⚠️ <b>${t("Програш|Defeat")}</b>: ${t("йокаї над червоною лінією довше за 1–2 с, або кидки скінчились, а ціль не виконана.|yokai above the red line for 1–2 s, or you run out of drops without finishing the goal.")}</p>
 <p>🎁 <b>${t("Нагороди|Rewards")}</b>: ${t("ІНК за рівень (росте з твоєю катаною), ⛩️ за 3 зірки на кожному 10-му, сундук кожен 25-й, 💎 кожен 50-й. Повтор майже не дає нагород. Є денний ліміт.|INK per level (grows with your katana), ⛩️ for 3 stars on every 10th, a chest every 25th, 💎 every 50th. Replays give almost nothing. There is a daily cap.")}</p>`;
function mgmStart(n){n=+n||0;const LV=n?mgmSpec(n):mgmEndless();
 const g={sc:0,B:[],pt:[],fx:[],hx:0,cd:0,nx:0,cur:0,mx:0,cb:0,lm:-9,dg:0,el:0,end:0,got:[],kings:0,hs:0,pause:0,acc:0,mc:0,made:{},dl:LV.D,tail:0,winT:0,lv:n};
 const A=mgShell("merge",`<canvas id="mgv" style="position:absolute;inset:0;width:100%;height:100%;touch-action:none"></canvas><div style="position:absolute;left:0;right:0;top:0;padding:calc(env(safe-area-inset-top,0px) + 8px) 62px 0;text-align:center;font-weight:900;pointer-events:none;text-shadow:0 1px 4px #000"><div id="mgT" style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#ffd27a"></div><div id="mgG" style="font-size:15px;line-height:1.25"></div><div id="mgS2" style="font-size:12px;color:#e5e7eb"></div></div><button onclick="mgmQuit()" style="position:absolute;right:12px;top:calc(env(safe-area-inset-top,0px) + 8px);width:40px;height:40px;border-radius:50%;background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.25);color:#fff;z-index:5">✕</button>`);
 mgRules(A,t("Злиття йокаїв — правила|Yokai merge — rules"),mgmRulesHtml(),o=>{g.pause=o?1:0},"left");
 const cv=$("mgv"),W=A.clientWidth,H=A.clientHeight,dpr=Math.min(2,window.devicePixelRatio||1),x=cv.getContext("2d");cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
 const CW=Math.min(W-20,360),CH=Math.min(H-190,560),CL=(W-CW)/2,CR=CL+CW,CT=Math.max(112,(H-CH)/2+20),CB=CT+CH,s=CW/360,GR=1600*s,RR=MGMT.map(a=>a[2]*s*LV.rs),HY=CT+RR[3]+4,LINE=Math.max(HY+RR[3]+8,CT+CH*LV.line),DT=1/180,OM=MGM.OM,ZE=MGM.ZE;
 g.hx=W/2;g.got=Object.keys(BOSS).filter(k=>(S.bst||{})[k]>0);const bk=g.got.length?g.got[R()*g.got.length|0]:null,LD={},okI=i=>i&&i.complete&&i.naturalWidth;
 const ld=u=>LD[u]||(LD[u]=Object.assign(new Image(),{src:u}));
 // ── Кулі: кожен рівень малюється ОДИН раз у кеш-канвас (без лагів). Істота ВСЕРЕДИНІ м'якої кулі ──
 const SC={},custom=t0=>{const k="c"+t0;if(!LD[k]){const im=new Image();im.onload=()=>{im._ok=1};im.onerror=()=>{im._bad=1};im.src="assets/slime_"+t0+".png";LD[k]=im}return LD[k]._ok?LD[k]:null};
 const base=t0=>{const c=custom(t0);if(c)return c;if(t0==6&&bk){const b=ld("assets/boss_"+bk+".png");if(okI(b))return b}const y=YIMG[MGMT[t0][0]];return okI(y)?y:null};
 const slime=t0=>{const sp=base(t0),key=sp?sp.src||"y"+t0:"e";let e=SC[t0];if(e&&e.key===key)return e;
  const R0=RR[t0],D=R0*2*1.34,c=document.createElement("canvas");c.width=c.height=Math.ceil(D*dpr);const k=c.getContext("2d");k.scale(dpr,dpr);k.translate(D/2,D/2);const col=MGMT[t0][3];
  let gr=k.createRadialGradient(-R0*.3,-R0*.35,R0*.08,0,0,R0);gr.addColorStop(0,_mix(col,"w",.6));gr.addColorStop(.55,col);gr.addColorStop(1,_mix(col,"k",.45));k.globalAlpha=.94;k.fillStyle=gr;k.beginPath();k.arc(0,0,R0,0,6.283);k.fill();k.globalAlpha=1;
  if(sp){const z=R0*1.55;k.drawImage(sp,-z/2,-z/2+R0*.05,z,z)}else{k.font=R0*1.25+"px serif";k.textAlign="center";k.textBaseline="middle";k.fillText(MGMT[t0][0],0,R0*.06)}
  gr=k.createRadialGradient(0,0,R0*.35,0,0,R0);gr.addColorStop(0,_rgba(col,0));gr.addColorStop(1,_rgba(col,.55));k.fillStyle=gr;k.beginPath();k.arc(0,0,R0,0,6.283);k.fill();
  k.save();k.rotate(-.65);const hg=k.createLinearGradient(-R0*.6,0,R0*.2,0);hg.addColorStop(0,"rgba(255,255,255,0)");hg.addColorStop(.5,"rgba(255,255,255,.7)");hg.addColorStop(1,"rgba(255,255,255,0)");k.fillStyle=hg;k.beginPath();k.ellipse(-R0*.18,-R0*.58,R0*.42,R0*.15,0,0,6.283);k.fill();k.restore();
  k.fillStyle="rgba(255,255,255,.85)";k.beginPath();k.arc(-R0*.42,-R0*.28,R0*.07,0,6.283);k.fill();
  e=SC[t0]={cv:c,D,key,edge:_mix(col,"k",.5),rim:_mix(col,"w",.35)};return e};
 const rt=()=>{const r=R(),w=LV.w;return r<w[0]?0:r<w[1]?1:r<w[2]?2:3};g.cur=rt();g.nx=rt();
 const txt=(sx,xx,yy,col,z)=>g.fx.push({s:sx,x:xx,y:yy,c:col||"#ffe27a",z:z||16,l:.8,m:.8});
 const mk=(xx,yy,t0,vx,vy)=>({x:xx,y:yy,vx:vx||0,vy:vy||0,t:t0,r:RR[t0],rt:RR[t0],age:0,w:0,wv:0,ca:0,gs:1,gv:0,m:RR[t0]*RR[t0],rk:null});
 if(LV.junk>0){let cnt=LV.junk,rowB=CB,row=0;   // «сміття» на дні: ряди куль трьох різних розмірів (щоб не зливались самі)
  while(cnt>0&&row<4){const rb=[];let xx=CL+2,k=0,mxr=0;while(cnt>0){const t0=(k+row*2)%3,r0=RR[t0];if(xx+2*r0>CR-2)break;rb.push([xx+r0,t0]);xx+=2*r0+3;k++;cnt--;mxr=Math.max(mxr,r0)}
   for(const[bx,t0]of rb){const b=mk(bx,rowB-RR[t0]-1,t0,0,0);b.age=2;b.jk=1;g.B.push(b)}rowB-=2*mxr*.9;row++}}
 const drop=()=>{if(g.end||g.pause||g.cd>0||g.winT>0||(LV.D&&g.dl<=0))return;g.B.push(mk(g.hx,HY,g.cur,0,40*s));if(LV.D)g.dl--;g.cur=g.nx;g.nx=rt();g.cd=.4;sfx("slash",null,3)};
 const px=e=>{const r=cv.getBoundingClientRect(),xx=e.clientX-r.left,rr=RR[g.cur];g.hx=Math.max(CL+rr+2,Math.min(CR-rr-2,xx))};
 cv.addEventListener("pointerdown",e=>{e.preventDefault();if(!g.pause)px(e)});cv.addEventListener("pointermove",e=>{if(!g.pause&&(e.buttons||e.pointerType=="touch"))px(e)});cv.addEventListener("pointerup",e=>{if(g.pause)return;px(e);drop()});
 // Злиття: просто зливаються — без вибухів, кілець, поштовхів сусідам. Нова куля м'яко «виростає» з ~90% розміру.
 const merge=(a,b)=>{a.dead=b.dead=1;const nt=a.t+1,w=a.r+b.r,xx=(a.x*b.r+b.x*a.r)/w,yy=(a.y*b.r+b.y*a.r)/w;g.cb=g.el-g.lm<.8?g.cb+1:1;g.lm=g.el;
  const p=MGMPT[nt]*g.cb,live=g.el>1.3||!LV.junk;g.tail=0;if(live){g.sc+=p;g.mc++;g.made[nt]=(g.made[nt]||0)+1;if(nt>g.mx)g.mx=nt}const n=mk(xx,yy,nt,(a.vx+b.vx)/2,(a.vy+b.vy)/2);n.r=Math.max(a.r,b.r);n.m=n.r*n.r;n.x=Math.max(CL+n.r,Math.min(CR-n.r,n.x));n.y=Math.max(CT+n.r,Math.min(CB-n.r,n.y));n.gs=1;n.age=a.age>b.age?a.age:b.age;if(nt==7)n.pop=.6;
  sfx(nt>=5?"bossdie":"combo",null,g.cb);g.B.push(n);txt("+"+p+(g.cb>1?" ×"+g.cb:""),xx,yy-n.r*.2,"#ffe27a",13+nt);if(!g.winT&&mgmDone(g,LV))g.winT=.45};
 const pop=b=>{b.dead=1;const p=150*Math.max(1,g.cb);g.sc+=p;g.kings++;g.mx=7;txt("👑 +"+p,b.x,b.y,"#ffd24a",26);sfx("reveal");navigator.vibrate&&navigator.vibrate(30);for(let i=0;i<10;i++){const a=R()*6.283,v=(30+R()*60)*s;g.pt.push({x:b.x,y:b.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:.5,m:.5,z:(3+R()*3)*s,c:"#ffd24a"})}if(!g.winT&&mgmDone(g,LV))g.winT=.45};
 // ── Фізика: фіксований крок 1/180 с; м'які контакти «пружина+демпфер» з ζ≥1 (БЕЗ відскоку), прогресивна жорсткість (стос не схлопується), липкість між сусідами ──
 const step=()=>{const B=g.B,n=B.length,mer=[];
  for(const b of B){b.vy+=GR*DT;b.age+=DT;b.cn=0;if(b.r<b.rt-.05){b.r+=(b.rt-b.r)*Math.min(1,DT*7);b.m=b.r*b.r;b.gr=1}else{b.r=b.rt;b.m=b.r*b.r;b.gr=0}}   // нова куля плавно ВИРОСТАЄ (≈0.4 с), а не з'являється одразу великою → сусіди не відштовхуються
  for(const b of B){let pen=CL-(b.x-b.r);if(pen>0){b.vx+=(OM*OM*pen+2*ZE*OM*Math.max(0,-b.vx))*DT;b.vy*=1-4*DT;b.cn++}
   pen=(b.x+b.r)-CR;if(pen>0){b.vx-=(OM*OM*pen+2*ZE*OM*Math.max(0,b.vx))*DT;b.vy*=1-4*DT;b.cn++}
   pen=(b.y+b.r)-CB;if(pen>0){b.vy-=(OM*OM*pen+2*ZE*OM*Math.max(0,b.vy))*DT;b.vx*=1-9*DT;b.cn++;b.ca=Math.PI/2}}
  for(let i=0;i<n;i++){const a=B[i];for(let j=i+1;j<n;j++){const b=B[j];const dx=b.x-a.x,dy=b.y-a.y,mr=a.r+b.r;if(dx>mr*1.2||dx<-mr*1.2||dy>mr*1.2||dy<-mr*1.2)continue;const d=Math.hypot(dx,dy);
   if(a.t==b.t&&a.t<7&&!a.pop&&!b.pop&&d<mr*MGM.MERGE&&!a.mg&&!b.mg&&!(a.jk&&b.jk)){a.mg=b.mg=1;mer.push([a,b]);continue}
   if(d<.0001)continue;const nx=dx/d,ny=dy/d,sm=a.m+b.m,wa=b.m/sm,wb=a.m/sm;
   if(d>=mr){const sm2=a.t==b.t&&a.t<7&&!(a.jk&&b.jk),rg=sm2?.2:.12;if(d<mr*(1+rg)){const A=MGM.COH*s*(sm2?2.4:1)*(1-(d-mr)/(mr*rg));a.vx+=nx*A*wa*DT;a.vy+=ny*A*wa*DT;b.vx-=nx*A*wb*DT;b.vy-=ny*A*wb*DT}continue}
   const pen=mr-d,vn=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny,lm=Math.min(a.r,b.r)*MGM.SAG,st=1+(pen/lm)*(pen/lm)*MGM.HARD,Ac=(OM*OM*pen*st+2*ZE*OM*Math.sqrt(st)*Math.max(0,-vn))*((a.gr||b.gr)?.4:1);
   a.vx-=nx*Ac*wa*DT;a.vy-=ny*Ac*wa*DT;b.vx+=nx*Ac*wb*DT;b.vy+=ny*Ac*wb*DT;a.cn++;b.cn++;
   const tx=(b.vx-a.vx)-vn*nx,ty=(b.vy-a.vy)-vn*ny,f=Math.min(1,16*DT);a.vx+=tx*f*wa;a.vy+=ty*f*wa;b.vx-=tx*f*wb;b.vy-=ty*f*wb;
   if(MGM.WOB&&-vn>160*s){const w=Math.min(MGM.WOB,-vn/(6000*s));if(w>a.w){a.w=w;a.ca=Math.atan2(ny,nx)}if(w>b.w){b.w=w;b.ca=Math.atan2(-ny,-nx)}}}}
  for(const b of B){b.vx*=1-.2*DT;const v=Math.hypot(b.vx,b.vy);if(b.cn&&v<28*s){b.vx*=1-5*DT;b.vy*=1-5*DT}const mv=650*s;if(v>mv){b.vx*=mv/v;b.vy*=mv/v}b.x+=b.vx*DT;b.y+=b.vy*DT;
   // ЖОРСТКА РАМКА: куля фізично не може вийти за межі банки
   if(b.x<CL+b.r){b.x=CL+b.r;if(b.vx<0)b.vx=0}if(b.x>CR-b.r){b.x=CR-b.r;if(b.vx>0)b.vx=0}if(b.y>CB-b.r){b.y=CB-b.r;if(b.vy>0)b.vy=0}if(b.y<CT+b.r){b.y=CT+b.r;if(b.vy<0)b.vy=0}}
  for(const p of mer)if(!p[0].dead&&!p[1].dead)merge(p[0],p[1]);for(const b of B)b.mg=0;
  if(mer.length)g.B=g.B.filter(b=>!b.dead)};
 const soft=dt=>{for(const b of g.B){if(MGM.WOB){b.wv+=(-b.w*260-b.wv*32)*dt;b.w+=b.wv*dt;if(b.w>MGM.WOB+.01)b.w=MGM.WOB+.01;if(b.w<-MGM.WOB)b.w=-MGM.WOB}
   b.gs+=(1-b.gs)*Math.min(1,dt*9);   // м'яке зростання без перельоту
   if(b.pop!=null){b.pop-=dt;b.gs=1+(1-b.pop/.6)*.12-(b.pop<.15?(1-b.pop/.15)*.5:0);if(b.pop<=0)pop(b)}}g.B=g.B.filter(b=>!b.dead)};
 // ── Форма: круг, що м'яко сплющується в місцях дотику (FLAT) і майже не розпливається (BULGE) ──
 const NV=26,UC=[],US=[],C2=[],S2=[];for(let k=0;k<NV;k++){const th=k*6.28319/NV;UC.push(Math.cos(th));US.push(Math.sin(th));C2.push(Math.cos(2*th));S2.push(Math.sin(2*th))}
 const blobs=dt=>{const B=g.B,n=B.length,kf=1-Math.exp(-dt*14);
  for(let i=0;i<n;i++){const a=B[i];if(!a.rk)a.rk=new Array(NV).fill(a.r);
   const pl=[[-1,0,a.x-CL+.5],[1,0,CR-a.x+.5],[0,1,CB-a.y+.5]];
   for(let j=0;j<n;j++){if(j==i)continue;const b=B[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d>(a.r+b.r)*1.4||d<.001)continue;pl.push([dx/d,dy/d,(d+a.r-b.r)/2])}
   const tm=a.r*(1+MGM.BULGE),w=a.w,c2=Math.cos(2*a.ca),s2=Math.sin(2*a.ca);
   for(let k=0;k<NV;k++){let t=tm;for(let q=0;q<pl.length;q++){const P=pl[q],dot=UC[k]*P[0]+US[k]*P[1];if(dot>.03){const v=P[2]/dot;if(v<t)t=v}}
    t=a.r+(t-a.r)*MGM.FLAT;if(t<a.r*.6)t=a.r*.6;if(w>.002||w<-.002)t*=1+w*(C2[k]*c2+S2[k]*s2);a.rk[k]+=(t-a.rk[k])*kf}}};
 const draw=()=>{x.clearRect(0,0,W,H);
  x.fillStyle="rgba(8,5,20,.3)";x.strokeStyle="rgba(255,183,3,.55)";x.lineWidth=3;x.beginPath();x.roundRect?x.roundRect(CL-3,CT,CW+6,CH+3,16):x.rect(CL-3,CT,CW+6,CH+3);x.fill();x.stroke();
  if(g.dg>0){x.fillStyle="rgba(255,40,40,"+(g.dg/LV.over*.2).toFixed(3)+")";x.fillRect(CL,CT,CW,LINE-CT)}
  x.strokeStyle=g.dg>0?"rgba(255,70,70,"+(.6+.4*Math.sin(g.el*16)).toFixed(3)+")":"rgba(255,110,110,.5)";x.setLineDash([8,8]);x.lineWidth=g.dg>0?3:2;x.beginPath();x.moveTo(CL,LINE);x.lineTo(CR,LINE);x.stroke();x.setLineDash([]);
  x.save();x.beginPath();x.rect(CL-3,CT,CW+6,CH+3);x.clip();   // усе малюється лише всередині рамки
  const blobPath=rk=>{x.beginPath();x.moveTo((rk[NV-1]*UC[NV-1]+rk[0]*UC[0])/2,(rk[NV-1]*US[NV-1]+rk[0]*US[0])/2);for(let k=0;k<NV;k++){const k1=(k+1)%NV,c=rk[k],nx=rk[k1]*UC[k1],ny=rk[k1]*US[k1];x.quadraticCurveTo(c*UC[k],c*US[k],(c*UC[k]+nx)/2,(c*US[k]+ny)/2)}x.closePath()};
  const body=b=>{if(!b.rk)return;const e=slime(b.t);let mx=0;for(const v of b.rk)if(v>mx)mx=v;x.save();x.translate(b.x,b.y);if(b.gs!==1)x.scale(b.gs,b.gs);blobPath(b.rk);x.save();x.clip();const D=e.D*mx/RR[b.t];x.drawImage(e.cv,-D/2,-D/2,D,D);x.restore();
   x.strokeStyle=e.edge;x.lineWidth=Math.max(2,b.r*.05);x.stroke();if(b.t>=6){x.strokeStyle=e.rim;x.lineWidth=Math.max(1.5,b.r*.025);x.stroke()}x.restore()};
  for(const b of g.B)body(b);
  const circ=(xx,yy,t0,gs)=>{const e=slime(t0),D=e.D*(gs||1),r=RR[t0]*(gs||1);x.drawImage(e.cv,xx-D/2,yy-D/2,D,D);x.strokeStyle=e.edge;x.lineWidth=Math.max(2,r*.05);x.beginPath();x.arc(xx,yy,r,0,6.283);x.stroke()};
  if(!g.end&&g.cd<=0){const r=RR[g.cur];circ(g.hx,HY,g.cur,Math.min(1,.7+g.hs*2.2));x.strokeStyle="rgba(255,255,255,.2)";x.lineWidth=1.5;x.setLineDash([4,6]);x.beginPath();x.moveTo(g.hx,HY+r);x.lineTo(g.hx,CB);x.stroke();x.setLineDash([])}
  x.restore();
  x.fillStyle="#fff";x.font="700 11px sans-serif";x.textAlign="right";if(LV.blind){x.fillText("?",CR-12,CT-14)}else{x.fillText(t("Далі|Next"),CR-34,CT-14);circ(CR-12,CT-16,g.nx,.4)}
  x.globalCompositeOperation="lighter";for(const p of g.pt){x.globalAlpha=Math.max(0,p.l/p.m)*.9;x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,p.z,0,6.283);x.fill()}x.globalCompositeOperation="source-over";x.globalAlpha=1;
  for(const f of g.fx){x.globalAlpha=Math.max(0,f.l/f.m);x.fillStyle=f.c;x.font="900 "+f.z+"px sans-serif";x.textAlign="center";x.fillText(f.s,f.x,f.y-(1-f.l/f.m)*24)}x.globalAlpha=1;
  if(g.dg>0){x.fillStyle="#ff5a5a";x.font="900 15px sans-serif";x.textAlign="center";x.fillText("⚠ "+t("Переповнення|Overflow")+" "+Math.max(0,LV.over-g.dg).toFixed(1),W/2,CT-6)}};
 let last=performance.now(),hud="";
 const loop=now=>{if(!A.isConnected||g.end)return;requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;if(g.pause){draw();return}
  g.el+=dt;g.cd=Math.max(0,g.cd-dt);if(g.cd<=0)g.hs+=dt;else g.hs=0;
  g.acc+=dt;let n=0;while(g.acc>=DT&&n<12){step();g.acc-=DT;n++}if(n==12)g.acc=0;soft(dt);blobs(dt);
  const over=g.B.some(b=>!b.pop&&b.age>1.3&&b.y-b.r*.55<LINE);g.dg=over?g.dg+dt:Math.max(0,g.dg-dt*1.5);if(g.winT>0){g.winT-=dt;if(g.winT<=0){mgmFin(g,"win");return}}else if(LV.D&&g.dl<=0){g.tail+=dt;if(g.tail>2.4){mgmFin(g,"drops");return}}
  if(g.dg>=LV.over){mgmFin(g,"over");return}
  for(const p of g.pt){p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt}g.pt=g.pt.filter(p=>p.l>0);for(const f of g.fx)f.l-=dt;g.fx=g.fx.filter(f=>f.l>0);
  draw();const h2=g.sc+"|"+g.mx+"|"+g.kings+"|"+g.mc+"|"+g.dl+"|"+(g.made[LV.T]||0);if(h2!=hud){hud=h2;mgmHud(g,LV)}};
 cv._g=g;mgmHud(g,LV);try{setMusic("battle")}catch(e){}requestAnimationFrame(t0=>{last=t0;loop(t0)})}
function mgmQuit(){const A=document.getElementById("mg"),cv=A&&$("mgv");if(cv&&cv._g&&!cv._g.end){const g=cv._g;if(g.lv){g.end=1;mgmMenu()}else mgmFin(g,"over")}else mgClose()}
function mgmFin(g,why){if(g.end)return;g.end=1;const A=document.getElementById("mg");if(!A)return;S.mg=S.mg||{};const n=g.lv,L=n?mgmSpec(n):null;
 if(!n){const nb=g.sc>(S.mg.mb||0);if(nb)S.mg.mb=g.sc;const tier=g.mx;   // нескінченний режим: лише трохи ІНК (без торіїв, нефриту й сундуків)
  const rw=g.sc>0?mgGrant({ink:mgInk(Math.min(.8,g.sc/5000)*(1+Math.min(1,g.got.length*.05)))},"merge"):{};
  track("merge_end",{score:g.sc,tier,kings:g.kings});sfx(g.sc>0?"reveal":"bomb");
  mgResult(A,{icon:g.kings?"👑":nb&&g.sc>0?"🏆":"🧩",title:g.kings?t("Король лопнув!|The King popped!"):t("Скриня повна|The chest is full"),score:g.sc,lines:[t("Найсильніший йокай|Strongest yokai")+": "+t(MGMT[Math.min(7,tier)][1])+(g.kings?" · 👑 ×"+g.kings:""),nb&&g.sc>0?"🏆 "+t("Новий рекорд!|New record!"):""],reward:rw,again:"mgmStart(0)",againLabel:t("Ще раз|Again")});return}
 const ml=(S.mg.ml=S.mg.ml||{});
 if(why=="win"){const ratio=L.D?g.dl/L.D:0,stars=ratio>=.4?3:ratio>=.15?2:1,first=!ml[n],base=mgInk(.2+n*.004);let rw;   // 🔧 ІНК за рівень: 0.2 «раунду» → 1.0 на 200-му (× катана через mgInk)
  if(first){ml[n]=stars;rw=mgGrant({ink:base*(1+.15*(stars-1)),souls:stars==3&&n%10==0?1:0,jd:n%50==0?1:0,chest:n%25==0?(n>=100?2:1):0},"merge")}
  else{if(stars>ml[n])ml[n]=stars;rw=mgGrant({ink:base*.1},"merge")}
  save();track("merge_win",{n,stars});sfx("reveal");
  mgResult(A,{icon:"🏆",title:t("Рівень пройдено!|Level cleared!")+" "+"★".repeat(stars)+"☆".repeat(3-stars),score:g.sc,lines:[mgmGoalTxt(L),t("Кидків лишилось|Drops left")+": "+g.dl+"/"+L.D,first?"":t("Повторне проходження — нагорода менша|Replay — smaller reward")],reward:rw,again:n<MGML?"mgmStart("+(n+1)+")":"mgmMenu()",againLabel:n<MGML?t("Далі|Next level"):t("До рівнів|Levels")})}
 else{track("merge_lose",{n,why});sfx("bomb");mgResult(A,{icon:"🧩",title:why=="drops"?t("Кидки закінчились|Out of drops"):t("Скриня повна|The chest is full"),score:g.sc,lines:[mgmGoalTxt(L)+" · "+mgmProg(g,L),t("Спробуй ще — рівень той самий.|Try again — same level.")],again:"mgmStart("+n+")",againLabel:t("Спробувати ще|Try again")})}}
