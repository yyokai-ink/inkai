/* INKAI mini-game: «Злиття йокаїв» — об'ємні м'які слизні (як желейні слайми з Terraria). Кидай йокаїв у скриню: двоє однакових, що торкнулись, зливаються в сильнішого.
   Король Хякі надувається й ЛОПАЄТЬСЯ (очки + вільне місце). Над червоною лінією довше 2 с — кінець. Фон — твій екіпірований (BG), як у розрізанні.
   СВОЇ PNG У ШАРИКИ: поклади assets/slime_0.png … slime_7.png (прозорий PNG 256–512 px, істота по центру) — вона з'явиться ВСЕРЕДИНІ желейної кулі.
   Рівні: 0 лис · 1 каппа · 2 тенгу · 3 оні · 4 череп · 5 дракон · 6 золотий оні · 7 Король Хякі. Немає файлу — береться assets/yokai_*.png (для 6 — випадковий твій бос). */
const MGM={RS:1.35,OVER:1.5,KING:.92,OM:30,ZE:.62,SAG:.16,HARD:10,COH:16,BULGE:.06,FLAT:.85,WOB:.11,LINE:112};   // 🔧 [РЕЖИМ ЛАТЕКС] Було «щільний гель»: OM:36 ZE:.9 FLAT:.45 WOB:.05 · «слизень»: OM:24 ZE:.5 FLAT:1 WOB:.16. Тепер: OM — жорсткість (менше = м'якше, глибше вдавлюється під вагою) · ZE — в'язкість (менше = пружніше) · FLAT — наскільки сплющується в місцях дотику (0 круг … 1 повністю) · WOB — максимальне «тремтіння» форми після удару
// 🔧 масштаб розмірів · секунд переповнення до кінця · жорсткість · в'язкість (≈1 = майже без відскоку) · «липкість» (заповнює шпарини) · наскільки кулі «розпливаються» у вільне місце · глибина червоної лінії від верху (більше = складніше)
const MGMT=[["🦊","Лис|Fox",15,"#fb923c"],["🐸","Каппа|Kappa",20,"#34d399"],["👺","Тенгу|Tengu",26,"#f87171"],["👹","Оні|Oni",33,"#a78bfa"],["💀","Череп|Skull",41,"#cbd5e1"],["🐉","Дракон|Dragon",54,"#38bdf8"],["👹","Золотий оні|Golden Oni",68,"#fbbf24"],["🐉","Король Хякі|Hyakki King",86,"#fb3a6b"]];
const MGMPT=[0,2,4,7,12,20,35,60];
function mgmBest(){S.mg=S.mg||{};return S.mg.mb||0}
registerMiniGame({id:"merge",order:10,icon:"🧩",color:"#a855f7",name:"Злиття йокаїв|Yokai merge",desc:"М'які слизні: зливай однакових, Король лопається й дає нагороди|Soft slimes: merge equals, the King pops for rewards",badge:"NEW",status:()=>t("Рекорд|Best")+": "+mgmBest(),start:mgmStart});
const _hx=c=>{c=String(c).trim();let m=c.match(/^rgba?\(([^)]+)\)/);if(m){const v=m[1].split(",").map(x=>Math.max(0,Math.min(255,Math.round(parseFloat(x)||0))));return[v[0]||0,v[1]||0,v[2]||0]}c=c.replace("#","");if(c.length==3)c=c.split("").map(z=>z+z).join("");const n=parseInt(c,16)||0;return[(n>>16)&255,(n>>8)&255,n&255]};
const _mix=(h,to,p)=>{const a=_hx(h),b=to=="w"?[255,255,255]:[8,4,20];return"rgb("+a.map((v,i)=>Math.round(v+(b[i]-v)*p)).join(",")+")"};
const _rgba=(h,al)=>{const a=_hx(h);al=Math.max(0,Math.min(1,+al||0));return"rgba("+a.join(",")+","+al+")"};
function mgmStart(){
 const g={sc:0,B:[],pt:[],fx:[],rg:[],hx:0,cd:0,nx:0,cur:0,mx:0,cb:0,lm:-9,dg:0,el:0,end:0,got:[],kings:0,shake:0,hs:0,pause:0,acc:0};
 const A=mgShell("merge",`<canvas id="mgv" style="position:absolute;inset:0;width:100%;height:100%;touch-action:none"></canvas><div style="position:absolute;left:0;right:0;top:0;padding:calc(env(safe-area-inset-top,0px) + 8px) 104px 0 14px;display:flex;justify-content:space-between;align-items:center;font-weight:900;font-size:15px;pointer-events:none;text-shadow:0 1px 4px #000"><span id="mgS">⭐ 0</span><span id="mgM" style="color:#ffd27a"></span><span id="mgK"></span></div><button onclick="mgmQuit()" style="position:absolute;right:12px;top:calc(env(safe-area-inset-top,0px) + 6px);width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.25);color:#fff;z-index:5">✕</button>`);
 mgRules(A,t("Злиття йокаїв — правила|Yokai merge — rules"),`<p>🎯 <b>${t("Мета|Goal")}</b>: ${t("набрати якомога більше очок, зливаючи йокаїв.|score as many points as you can by merging yokai.")}</p>
 <p>👆 <b>${t("Керування|Controls")}</b>: ${t("веди пальцем — йокай пересувається над скринею; відпусти — він падає.|drag your finger — the yokai moves above the chest; release — it drops.")}</p>
 <p>🧩 <b>${t("Злиття|Merging")}</b>: ${t("двоє ОДНАКОВИХ йокаїв, що торкнулись, зливаються в сильнішого. Ланцюжок злиттів підряд дає множник очок ×2, ×3…|two IDENTICAL yokai that touch merge into a stronger one. Chains of merges give ×2, ×3… points.")}</p>
 <p>👑 <b>${t("Король Хякі|Hyakki King")}</b>: ${t("двох Золотих оні треба СИЛЬНО притиснути одне до одного (їх штовхає вага йокаїв зверху). Король надувається й лопається — дає очки, нагороду й звільняє місце.|two Golden Oni must be pressed HARD together (pushed by the weight of yokai above). The King swells and pops — points, a reward, and frees space.")}</p>
 <p>⚠️ <b>${t("Кінець гри|Game over")}</b>: ${t("якщо йокаї стирчать над червоною лінією довше 2 секунд.|if yokai stay above the red line for more than 2 seconds.")}</p>
 <p>🎁 <b>${t("Нагороди|Rewards")}</b>: ${t("ІНК за очки, торії за високі рівні, а за Короля ще й нефрит і шанс на сундук.|INK for points, torii for high tiers, and for the King also jade and a chance for a chest.")}</p>
 <p style="color:#aaa;font-size:12px">${t("Порядок: Лис → Каппа → Тенгу → Оні → Череп → Дракон → Золотий оні → Король.|Order: Fox → Kappa → Tengu → Oni → Skull → Dragon → Golden Oni → King.")}</p>`,o=>{g.pause=o?1:0});
 const cv=$("mgv"),W=A.clientWidth,H=A.clientHeight,dpr=Math.min(2,window.devicePixelRatio||1),x=cv.getContext("2d");cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
 const CW=Math.min(W-20,360),CH=Math.min(H-150,560),CL=(W-CW)/2,CR=CL+CW,CT=Math.max(70,(H-CH)/2+20),CB=CT+CH,s=CW/360,LINE=CT+MGM.LINE*s,GR=1600*s,HY=CT+32*s,RR=MGMT.map(a=>a[2]*s*MGM.RS),DT=1/180,OM=MGM.OM,ZE=MGM.ZE;
 g.hx=W/2;g.got=Object.keys(BOSS).filter(k=>(S.bst||{})[k]>0);const bk=g.got.length?g.got[R()*g.got.length|0]:null,LD={},okI=i=>i&&i.complete&&i.naturalWidth;
 const ld=u=>LD[u]||(LD[u]=Object.assign(new Image(),{src:u}));
 // ── Желейні слизні: кожен рівень малюється ОДИН раз у кеш-канвас, далі лише drawImage (це й прибирає лаги) ──
 const SC={},custom=t0=>{const k="c"+t0;if(!LD[k]){const im=new Image();im.onload=()=>{im._ok=1};im.onerror=()=>{im._bad=1};im.src="assets/slime_"+t0+".png";LD[k]=im}return LD[k]._ok?LD[k]:null};
 const base=t0=>{const c=custom(t0);if(c)return c;if(t0==6&&bk){const b=ld("assets/boss_"+bk+".png");if(okI(b))return b}const y=YIMG[MGMT[t0][0]];return okI(y)?y:null};
 const slime=t0=>{const sp=base(t0),key=sp?sp.src||"y"+t0:"e";let e=SC[t0];if(e&&e.key===key)return e;
  const R0=RR[t0],D=R0*2*1.34,c=document.createElement("canvas");c.width=c.height=Math.ceil(D*dpr);const k=c.getContext("2d");k.scale(dpr,dpr);k.translate(D/2,D/2);const col=MGMT[t0][3];
  let gr=k.createRadialGradient(-R0*.3,-R0*.35,R0*.08,0,0,R0);gr.addColorStop(0,_mix(col,"w",.6));gr.addColorStop(.55,col);gr.addColorStop(1,_mix(col,"k",.45));k.globalAlpha=.94;k.fillStyle=gr;k.beginPath();k.arc(0,0,R0,0,6.283);k.fill();k.globalAlpha=1;
  if(sp){const z=R0*1.55;k.drawImage(sp,-z/2,-z/2+R0*.05,z,z)}else{k.font=R0*1.25+"px serif";k.textAlign="center";k.textBaseline="middle";k.fillText(MGMT[t0][0],0,R0*.06)}   // істота ВСЕРЕДИНІ желе, повністю видима
  gr=k.createRadialGradient(0,0,R0*.35,0,0,R0);gr.addColorStop(0,_rgba(col,0));gr.addColorStop(1,_rgba(col,.55));k.fillStyle=gr;k.beginPath();k.arc(0,0,R0,0,6.283);k.fill();   // тонка желейна плівка поверх
  k.save();k.rotate(-.65);let hg=k.createLinearGradient(-R0*.6,0,R0*.2,0);hg.addColorStop(0,"rgba(255,255,255,.0)");hg.addColorStop(.5,"rgba(255,255,255,.7)");hg.addColorStop(1,"rgba(255,255,255,0)");k.fillStyle=hg;k.beginPath();k.ellipse(-R0*.18,-R0*.58,R0*.42,R0*.15,0,0,6.283);k.fill();k.restore();                  // глянцевий відблиск
  k.fillStyle="rgba(255,255,255,.85)";k.beginPath();k.arc(-R0*.42,-R0*.28,R0*.07,0,6.283);k.fill();
  e=SC[t0]={cv:c,D,key,edge:_mix(col,"k",.5),rim:_mix(col,"w",.35)};return e};
 const rt=()=>{const p=g.sc<800?[0,0,0,0,1,1,1,2,2,3]:g.sc<3500?[0,0,1,1,1,2,2,3,3,4]:[1,1,2,2,3,3,3,4,4,4,5];return p[R()*p.length|0]};g.cur=rt();g.nx=rt();
 const txt=(sx,xx,yy,col,z)=>g.fx.push({s:sx,x:xx,y:yy,c:col||"#ffe27a",z:z||16,l:.9,m:.9});
 const burst=(xx,yy,col,n,sp)=>{for(let i=0;i<n&&g.pt.length<150;i++){const a=R()*6.283,v=(40+R()*(sp||130))*s;g.pt.push({x:xx,y:yy,vx:Math.cos(a)*v,vy:Math.sin(a)*v-20,l:.45+R()*.35,m:.8,z:(3+R()*6)*s*1.3,c:col})}};
 const banner=sx=>{const b=document.createElement("div");b.style.cssText="position:absolute;left:0;right:0;top:22%;text-align:center;font-weight:900;font-size:22px;pointer-events:none;text-shadow:0 0 10px #000;color:#fff;z-index:3";b.textContent=sx;try{b.animate([{opacity:0,transform:"scale(.7)"},{opacity:1,transform:"scale(1.1)",offset:.15},{opacity:0,transform:"translateY(-26px)"}],{duration:1300})}catch(e){}A.appendChild(b);setTimeout(()=>b.remove(),1300)};
 const mk=(xx,yy,t0,vx,vy)=>({x:xx,y:yy,vx:vx||0,vy:vy||0,t:t0,r:RR[t0],age:0,w:0,wv:0,ca:0,gs:1,gv:0,m:RR[t0]*RR[t0],rk:null});
 const drop=()=>{if(g.end||g.pause||g.cd>0)return;const b=mk(g.hx,HY,g.cur,0,60*s);b.gs=.8;g.B.push(b);g.cur=g.nx;g.nx=rt();g.cd=.4;sfx("slash",null,3)};
 const px=e=>{const r=cv.getBoundingClientRect(),xx=e.clientX-r.left,rr=RR[g.cur];g.hx=Math.max(CL+rr+2,Math.min(CR-rr-2,xx))};
 cv.addEventListener("pointerdown",e=>{e.preventDefault();if(!g.pause)px(e)});cv.addEventListener("pointermove",e=>{if(!g.pause&&(e.buttons||e.pointerType=="touch"))px(e)});cv.addEventListener("pointerup",e=>{if(g.pause)return;px(e);drop()});
 const merge=(a,b)=>{a.dead=b.dead=1;const nt=a.t+1,w=a.r+b.r,xx=(a.x*b.r+b.x*a.r)/w,yy=(a.y*b.r+b.y*a.r)/w;g.cb=g.el-g.lm<.7?g.cb+1:1;g.lm=g.el;
  const p=MGMPT[nt]*g.cb;g.sc+=p;if(nt>g.mx)g.mx=nt;const n=mk(xx,yy,nt,(a.vx+b.vx)/2,Math.min(-30*s,(a.vy+b.vy)/2-50*s));n.gs=.78;n.w=.04;
  if(nt==7){n.pop=.7;banner("👑 "+t("Король Хякі!|Hyakki King!"));sfx("reveal")}else sfx(nt>=5?"bossdie":"combo",null,g.cb);
  g.B.push(n);burst(xx,yy,MGMT[nt][3],7+nt*3);g.rg.push({x:xx,y:yy,r:n.r,c:MGMT[nt][3],l:.5,m:.5});txt("+"+p+(g.cb>1?" ×"+g.cb:""),xx,yy-n.r,"#ffe27a",13+nt);
  for(const o of g.B)if(o!==n&&!o.dead){const dx=o.x-xx,dy=o.y-yy,d=Math.hypot(dx,dy)||1,R2=n.r*2.4;if(d<R2){const k=(1-d/R2)*55*s;o.vx+=dx/d*k;o.vy+=dy/d*k}}   // сусідів «розпихає» хвилею
  if(nt>=5)g.shake=.2};
 const pop=b=>{b.dead=1;const p=150*Math.max(1,g.cb);g.sc+=p;g.kings++;g.mx=7;burst(b.x,b.y,"#ffd24a",46,260);burst(b.x,b.y,"#ff2a5f",24,200);g.rg.push({x:b.x,y:b.y,r:b.r*1.8,c:"#ffd24a",l:.6,m:.6});txt("+"+p,b.x,b.y-b.r*.4,"#ffd24a",30);banner(t("БАХ! Місце звільнено|POP! Room cleared"));sfx("bossdie",null,9);g.shake=.4;navigator.vibrate&&navigator.vibrate([40,30,80])};
 // ── Фізика: фіксований крок 1/120 с; м'які контакти «пружина+демпфер» майже без відскоку (ζ≈0.9) + «липкість» між сусідами → слизні обтікають одне одного й заповнюють шпарини ──
 const step=()=>{const B=g.B,n=B.length,mer=[];
  for(const b of B){b.vy+=GR*DT;b.age+=DT;b.cn=0}
  for(const b of B){let pen=CL-(b.x-b.r);if(pen>0){b.vx+=(OM*OM*pen+2*ZE*OM*Math.max(0,-b.vx))*DT;b.vy*=1-4*DT;b.cn++}
   pen=(b.x+b.r)-CR;if(pen>0){b.vx-=(OM*OM*pen+2*ZE*OM*Math.max(0,b.vx))*DT;b.vy*=1-4*DT;b.cn++}
   pen=(b.y+b.r)-CB;if(pen>0){if(b.vy>200*s)b.w=Math.min(MGM.WOB,b.w+b.vy/(11000*s));b.vy-=(OM*OM*pen+2*ZE*OM*Math.max(0,b.vy))*DT;b.vx*=1-9*DT;b.cn++;b.ca=Math.PI/2}}
  for(let i=0;i<n;i++){const a=B[i];for(let j=i+1;j<n;j++){const b=B[j];const dx=b.x-a.x,dy=b.y-a.y,mr=a.r+b.r;if(dx>mr*1.2||dx<-mr*1.2||dy>mr*1.2||dy<-mr*1.2)continue;const d=Math.hypot(dx,dy);
   if(a.t==b.t&&a.t<7&&!a.pop&&!b.pop&&d<mr*(a.t==6?MGM.KING:1.02)&&!a.mg&&!b.mg){a.mg=b.mg=1;mer.push([a,b]);continue}
   if(d<.0001)continue;const nx=dx/d,ny=dy/d,sm=a.m+b.m,wa=b.m/sm,wb=a.m/sm;
   if(d>=mr){if(d<mr*1.12){const A=MGM.COH*s*(1-(d-mr)/(mr*.12));a.vx+=nx*A*wa*DT;a.vy+=ny*A*wa*DT;b.vx-=nx*A*wb*DT;b.vy-=ny*A*wb*DT}continue}   // липкість: майже торкнулись — злегка тягнуться (рідина)
   const pen=mr-d,vn=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny,lm=Math.min(a.r,b.r)*MGM.SAG,st=1+(pen/lm)*(pen/lm)*MGM.HARD,Ac=OM*OM*pen*st+2*ZE*OM*Math.sqrt(st)*Math.max(0,-vn);
   a.vx-=nx*Ac*wa*DT;a.vy-=ny*Ac*wa*DT;b.vx+=nx*Ac*wb*DT;b.vy+=ny*Ac*wb*DT;a.cn++;b.cn++;
   const tx=(b.vx-a.vx)-vn*nx,ty=(b.vy-a.vy)-vn*ny,f=Math.min(1,9*DT);a.vx+=tx*f*wa;a.vy+=ty*f*wa;b.vx-=tx*f*wb;b.vy-=ty*f*wb;       // в'язке тертя: «перетікають» без ривків
   if(-vn>160*s){const w=Math.min(MGM.WOB,-vn/(2400*s));if(w>a.w){a.w=w;a.ca=Math.atan2(ny,nx)}if(w>b.w){b.w=w;b.ca=Math.atan2(-ny,-nx)}}}}
  for(const b of B){b.vx*=1-.18*DT;const v=Math.hypot(b.vx,b.vy);if(b.cn&&v<28*s){b.vx*=1-5*DT;b.vy*=1-5*DT}const mv=1200*s;if(v>mv){b.vx*=mv/v;b.vy*=mv/v}b.x+=b.vx*DT;b.y+=b.vy*DT}   // у спокої швидкість гасне — жодного дрижання
  for(const p of mer)if(!p[0].dead&&!p[1].dead)merge(p[0],p[1]);for(const b of B)b.mg=0;
  if(mer.length)g.B=g.B.filter(b=>!b.dead)};
 const soft=dt=>{for(const b of g.B){b.wv+=(-b.w*210-b.wv*13)*dt;b.w+=b.wv*dt;if(b.w>MGM.WOB+.02)b.w=MGM.WOB+.02;if(b.w<-MGM.WOB*.7)b.w=-MGM.WOB*.7;
   const ag=(1-b.gs)*240-b.gv*17;b.gv+=ag*dt;b.gs+=b.gv*dt;if(b.pop!=null){b.pop-=dt;b.gs=1+(1-b.pop/.7)*.55+Math.sin(g.el*40)*.03;if(b.pop<=0)pop(b)}}g.B=g.B.filter(b=>!b.dead)};
 // ── «Рідка» форма: кожна кулька — крапля з NV вершин. Біля сусіда/стінки вона пласко прилягає (площина контакту), у вільний бік розпливається до +BULGE → заповнює шпарини, а не стає овалом ──
 const NV=22,UC=[],US=[],C2=[],S2=[];for(let k=0;k<NV;k++){const th=k*6.28319/NV;UC.push(Math.cos(th));US.push(Math.sin(th));C2.push(Math.cos(2*th));S2.push(Math.sin(2*th))}
 const blobs=dt=>{const B=g.B,n=B.length,kf=1-Math.exp(-dt*20);
  for(let i=0;i<n;i++){const a=B[i];if(!a.rk)a.rk=new Array(NV).fill(a.r);
   const pl=[[-1,0,a.x-CL+.5],[1,0,CR-a.x+.5],[0,1,CB-a.y+.5]];
   for(let j=0;j<n;j++){if(j==i)continue;const b=B[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d>(a.r+b.r)*1.4||d<.001)continue;pl.push([dx/d,dy/d,(d+a.r-b.r)/2])}
   const tm=a.r*(1+MGM.BULGE),w=a.w,c2=Math.cos(2*a.ca),s2=Math.sin(2*a.ca);
   for(let k=0;k<NV;k++){let t=tm;for(let q=0;q<pl.length;q++){const P=pl[q],dot=UC[k]*P[0]+US[k]*P[1];if(dot>.03){const v=P[2]/dot;if(v<t)t=v}}
    t=a.r+(t-a.r)*MGM.FLAT;if(t<a.r*.7)t=a.r*.7;if(w>.002||w<-.002)t*=1+w*(C2[k]*c2+S2[k]*s2);a.rk[k]+=(t-a.rk[k])*kf}}};
 const draw=()=>{x.clearRect(0,0,W,H);x.save();if(g.shake>0)x.translate((R()-.5)*8*g.shake*3,(R()-.5)*8*g.shake*3);
  x.fillStyle="rgba(8,5,20,.3)";x.strokeStyle="rgba(255,183,3,.55)";x.lineWidth=3;x.beginPath();x.roundRect?x.roundRect(CL-3,CT,CW+6,CH+3,16):x.rect(CL-3,CT,CW+6,CH+3);x.fill();x.stroke();
  if(g.dg>0){x.fillStyle="rgba(255,40,40,"+(g.dg/MGM.OVER*.2).toFixed(3)+")";x.fillRect(CL,CT,CW,LINE-CT)}
  x.strokeStyle=g.dg>0?"rgba(255,70,70,"+(.6+.4*Math.sin(g.el*16)).toFixed(3)+")":"rgba(255,110,110,.5)";x.setLineDash([8,8]);x.lineWidth=g.dg>0?3:2;x.beginPath();x.moveTo(CL,LINE);x.lineTo(CR,LINE);x.stroke();x.setLineDash([]);
  const blobPath=(rk)=>{x.beginPath();x.moveTo((rk[NV-1]*UC[NV-1]+rk[0]*UC[0])/2,(rk[NV-1]*US[NV-1]+rk[0]*US[0])/2);for(let k=0;k<NV;k++){const k1=(k+1)%NV,c=rk[k],nx=rk[k1]*UC[k1],ny=rk[k1]*US[k1];x.quadraticCurveTo(c*UC[k],c*US[k],(c*UC[k]+nx)/2,(c*US[k]+ny)/2)}x.closePath()};
  const body=b=>{if(!b.rk)return;const e=slime(b.t);let mx=0;for(const v of b.rk)if(v>mx)mx=v;x.save();x.translate(b.x,b.y);if(b.gs!==1)x.scale(b.gs,b.gs);blobPath(b.rk);x.save();x.clip();const D=e.D*mx/b.r;x.drawImage(e.cv,-D/2,-D/2,D,D);x.restore();
   x.strokeStyle=e.edge;x.lineWidth=Math.max(2,b.r*.06);x.stroke();if(b.t>=6){x.strokeStyle=e.rim;x.lineWidth=Math.max(1.5,b.r*.03);x.stroke()}x.restore()};
  const circ=(xx,yy,t0,gs)=>{const e=slime(t0),D=e.D*(gs||1),r=RR[t0]*(gs||1);x.drawImage(e.cv,xx-D/2,yy-D/2,D,D);x.strokeStyle=e.edge;x.lineWidth=Math.max(2,r*.06);x.beginPath();x.arc(xx,yy,r,0,6.283);x.stroke()};
  for(const b of g.B)body(b);
  if(!g.end&&g.cd<=0){const r=RR[g.cur];circ(g.hx,HY,g.cur,Math.min(1,.7+g.hs*2.2));x.strokeStyle="rgba(255,255,255,.2)";x.lineWidth=1.5;x.setLineDash([4,6]);x.beginPath();x.moveTo(g.hx,HY+r);x.lineTo(g.hx,CB);x.stroke();x.setLineDash([])}
  x.fillStyle="#fff";x.font="700 11px sans-serif";x.textAlign="right";x.fillText(t("Далі|Next"),CR-38,CT-14);circ(CR-14,CT-18,g.nx,.5);
  for(const q of g.rg){const k=1-q.l/q.m;x.globalAlpha=Math.max(0,1-k);x.strokeStyle=q.c;x.lineWidth=5*(1-k)+1;x.beginPath();x.arc(q.x,q.y,q.r*(1+k*.9),0,6.283);x.stroke()}x.globalAlpha=1;
  x.globalCompositeOperation="lighter";for(const p of g.pt){x.globalAlpha=Math.max(0,p.l/p.m)*.9;x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,p.z,0,6.283);x.fill()}x.globalCompositeOperation="source-over";x.globalAlpha=1;
  for(const f of g.fx){x.globalAlpha=Math.max(0,f.l/f.m);x.fillStyle=f.c;x.font="900 "+f.z+"px sans-serif";x.textAlign="center";x.fillText(f.s,f.x,f.y-(1-f.l/f.m)*28)}x.globalAlpha=1;
  if(g.dg>0){x.fillStyle="#ff5a5a";x.font="900 15px sans-serif";x.textAlign="center";x.fillText("⚠ "+t("Переповнення|Overflow")+" "+Math.max(0,MGM.OVER-g.dg).toFixed(1),W/2,CT-6)}x.restore()};
 let last=performance.now(),hud="";
 const loop=now=>{if(!A.isConnected||g.end)return;requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;if(g.pause){draw();return}
  g.el+=dt;g.cd=Math.max(0,g.cd-dt);if(g.cd<=0)g.hs+=dt;else g.hs=0;g.shake=Math.max(0,g.shake-dt);
  g.acc+=dt;let n=0;while(g.acc>=DT&&n<12){step();g.acc-=DT;n++}if(n==12)g.acc=0;soft(dt);blobs(dt);
  const over=g.B.some(b=>!b.pop&&b.age>1.3&&b.y-b.r*.55<LINE&&b.vy>-140*s);g.dg=over?g.dg+dt:Math.max(0,g.dg-dt*1.5);if(g.dg>=MGM.OVER){mgmFin(g);return}
  for(const p of g.pt){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=240*s*dt;p.l-=dt}g.pt=g.pt.filter(p=>p.l>0);for(const f of g.fx)f.l-=dt;g.fx=g.fx.filter(f=>f.l>0);for(const q of g.rg)q.l-=dt;g.rg=g.rg.filter(q=>q.l>0);
  draw();const h2=g.sc+"|"+g.mx+"|"+g.kings;if(h2!=hud){hud=h2;$("mgS").textContent="⭐ "+g.sc;$("mgM").textContent=g.mx?t(MGMT[g.mx][1]):"";$("mgK").textContent=g.kings?"👑 ×"+g.kings:""}};
 cv._g=g;try{setMusic("battle")}catch(e){}requestAnimationFrame(t0=>{last=t0;loop(t0)})}
function mgmQuit(){const A=document.getElementById("mg"),cv=A&&$("mgv");if(cv&&cv._g&&!cv._g.end)mgmFin(cv._g);else mgClose()}
function mgmFin(g){if(g.end)return;g.end=1;const A=document.getElementById("mg");if(!A)return;S.mg=S.mg||{};const nb=g.sc>(S.mg.mb||0);if(nb)S.mg.mb=g.sc;
 const got=g.got.length,tier=g.mx,ch=g.kings>=2?3:g.kings==1?(R()<.7?2:0):tier>=6?(R()<.4?1:0):0;
 const rw=g.sc>0?mgGrant({ink:mgInk(Math.min(3,g.sc/3000)*(1+Math.min(1,got*.05))),souls:g.kings?3:tier>=6?2:tier>=5?1:0,jd:g.kings?1:0,chest:ch},"merge"):{};
 track("merge_end",{score:g.sc,tier,kings:g.kings});sfx(g.sc>0?"reveal":"bomb");
 mgResult(A,{icon:g.kings?"👑":nb&&g.sc>0?"🏆":"🧩",title:g.kings?t("Король лопнув!|The King popped!"):t("Скриня повна|The chest is full"),score:g.sc,lines:[t("Найсильніший йокай|Strongest yokai")+": "+t(MGMT[Math.min(7,tier)][1])+(g.kings?" · 👑 ×"+g.kings:""),nb&&g.sc>0?"🏆 "+t("Новий рекорд!|New record!"):""],reward:rw,again:"mgmStart()"})}
