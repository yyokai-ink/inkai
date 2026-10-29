window.INKV=window.INKV||{};INKV.arcade="20261029a";
/* INKAI arcade.js — «Злиття йокаїв»: розслаблена аркада, щоб убити час і заробити мон 文, алмази 💎, торії ⛩️ та сундуки.
   Кидай йокаїв у скриню: двоє однакових зливаються в сильнішого. Дійди до дракона й далі. Якщо верх скрині переповнений — кінець.
   Входи: бестіарій (arcBtn) і головний екран (arcLobby). Фон: assets/screen_arcade.png (необов'язково). Підключається ПІСЛЯ ui2.js. */
const ARC={K:10,DAYCAP:20000,DJ:2,DCH:2};   // 🔧 мон за очко · денна стеля мон з аркади · алмазів/день · сундуків/день (рідкісне — лише за найвищих йокаїв)
// [ключ картинки assets/yokai_<ключ>.png, емодзі, радіус, колір]
const ARTI=[["fox","🦊",15,"#fb923c"],["kappa","🐸",20,"#34d399"],["tengu","👺",26,"#f87171"],["oni","👹",33,"#c084fc"],["skull","💀",41,"#e5e7eb"],["dragon","🐉",50,"#38bdf8"],["oni","👹",61,"#ffd24a"],["dragon","🐲",74,"#ff2a5f"]];
const ARNM=["Лис|Fox","Каппа|Kappa","Тенгу|Tengu","Оні|Oni","Череп|Skull","Дракон|Dragon","Золотий Оні|Golden Oni","Король Хякі|Hyakki King"],ARPT=[0,2,4,7,12,20,35,60];
function arcSt(){const d=today();S.arc=S.arc||{};if(S.arc.d!==d){S.arc.d=d;S.arc.c=0;S.arc.j=0;S.arc.ch=0;S.arc.n=0}S.arc.best=S.arc.best||0;return S.arc}
const arcGot=()=>Object.keys(BOSS).filter(k=>(S.bst||{})[k]>0);
function arcBtn(from){const a=arcSt();
 return `<div class="rounded-2xl p-3 space-y-2 text-center" style="background:linear-gradient(135deg,rgba(124,58,237,.25),rgba(255,42,95,.2));border:1px solid #7c3aed99"><b class="text-sm">🧩 ${t("Злиття йокаїв|Yokai merge")}</b>
 <div class="text-[11px] text-gray-300">${t("Відпочинь від розрізання: кидай йокаїв у скриню, однакові зливаються в сильніших. Нагорода — мон 文, алмази 💎, торії ⛩️ і сундуки.|Take a break from slicing: drop yokai in the chest, equal ones merge into stronger ones. Rewards — mon 文, diamonds 💎, torii ⛩️ and chests.")}</div>
 <div class="text-[10px] text-neonGold">${t("Сьогодні зароблено|Earned today")}: ${fmt(a.c)} / ${fmt(ARC.DAYCAP)} 文 · ${t("рекорд|best")}: ${a.best}</div>
 <button class="btng w-full py-3" onclick="event.stopPropagation();arcStart('${from||"b"}')">▶ ${t("Грати|Play")}</button></div>`}
const arcLobby=()=>arcBtn("l");
(function(){const st=document.createElement("style");st.textContent=`
#arc{position:fixed;inset:0;z-index:98;display:flex;flex-direction:column;background:url(assets/screen_arcade.png) center/cover no-repeat,radial-gradient(circle at 50% 0,#3b1b5e,#0a090d 72%);touch-action:none;-webkit-user-select:none;user-select:none}
#arc .arh{position:absolute;left:0;right:0;top:0;padding:calc(env(safe-area-inset-top,0px) + 8px) 56px 0 14px;display:flex;justify-content:space-between;align-items:center;font-weight:900;font-size:15px;pointer-events:none;text-shadow:0 1px 4px #000}
#arc .arx{position:absolute;right:12px;top:calc(env(safe-area-inset-top,0px) + 6px);width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.25);color:#fff;z-index:2}
#arc .arn{position:absolute;left:0;right:0;top:24%;text-align:center;font-weight:900;font-size:20px;pointer-events:none;animation:arcN 1.2s ease-out forwards;text-shadow:0 0 10px #000}
@keyframes arcN{0%{opacity:0;transform:scale(.7)}15%{opacity:1;transform:scale(1.1)}100%{opacity:0;transform:translateY(-26px)}}`;document.head.appendChild(st)})();
let _ar=null,_arF="b";
function arcStart(from){_arF=from||_arF;const pc=$("pc");if(pc)pc.classList.replace("flex","hidden");let A=document.getElementById("arc");if(A)A.remove();A=document.createElement("div");A.id="arc";document.body.appendChild(A);arcRun()}
function arcRun(){const A=document.getElementById("arc");if(!A)return;const got=arcGot();
 A.innerHTML=`<canvas id="arv" style="position:absolute;inset:0;width:100%;height:100%;touch-action:none"></canvas><div class="arh"><span id="arS">⭐ 0</span><span id="arM" style="color:#ffd27a"></span><span></span></div><button class="arx" onclick="arcQuit()">✕</button>`;
 const cv=$("arv"),W=A.clientWidth,H=A.clientHeight,dpr=Math.min(2,window.devicePixelRatio||1),x=cv.getContext("2d");cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
 const CW=Math.min(W-20,360),CH=Math.min(H-150,560),CL=(W-CW)/2,CR=CL+CW,CT=Math.max(70,(H-CH)/2+20),CB=CT+CH,s=CW/360,LINE=CT+78*s,GR=1500*s,HY=CT+34*s,RR=ARTI.map(a=>a[2]*s*1.55);
 const LD={},ld=u=>LD[u]||(LD[u]=Object.assign(new Image(),{src:u})),okI=i=>i&&i.complete&&i.naturalWidth;
 ["fox","kappa","tengu","oni","skull","dragon"].forEach(n=>ld("assets/yokai_"+n+".png"));const bk=got.length?got[R()*got.length|0]:null;if(bk)ld("assets/boss_"+bk+".png");
 const imgOf=t0=>t0==6&&bk?ld("assets/boss_"+bk+".png"):ld("assets/yokai_"+ARTI[t0][0]+".png");
 const g={sc:0,B:[],pt:[],fx:[],hx:W/2,cd:0,nx:0,cur:0,mx:0,cb:0,lm:-9,dg:0,el:0,end:0,got,chest:0,king:0};_ar=g;
 const rt=()=>[0,0,0,0,1,1,1,2,2,3][R()*10|0];g.cur=rt();g.nx=rt();
 const txt=(sx,xx,yy,col,z)=>g.fx.push({s:sx,x:xx,y:yy,c:col||"#ffe27a",z:z||16,l:.9,m:.9});
 const burst=(xx,yy,col,n)=>{for(let i=0;i<n;i++){const a=R()*6.283,v=40+R()*130;g.pt.push({x:xx,y:yy,vx:Math.cos(a)*v,vy:Math.sin(a)*v-20,l:.45+R()*.3,m:.7,z:3+R()*5,c:col})}};
 const banner=sx=>{const b=document.createElement("div");b.className="arn";b.textContent=sx;A.appendChild(b);setTimeout(()=>b.remove(),1250)};
 const drop=()=>{if(g.end||g.cd>0)return;const t0=g.cur;g.B.push({x:g.hx,y:HY,vx:0,vy:60*s,t:t0,r:RR[t0],age:0});g.cur=g.nx;g.nx=rt();g.cd=.5;sfx("slash",null,3)};
 const px=e=>{const r=cv.getBoundingClientRect(),xx=e.clientX-r.left,rr=RR[g.cur];g.hx=Math.max(CL+rr+2,Math.min(CR-rr-2,xx))};
 cv.addEventListener("pointerdown",e=>{e.preventDefault();px(e)});cv.addEventListener("pointermove",e=>{if(e.buttons||e.pointerType=="touch")px(e)});cv.addEventListener("pointerup",e=>{px(e);drop()});
 const merge=(a,b)=>{const nt=a.t+1,xx=(a.x*b.r+b.x*a.r)/(a.r+b.r),yy=(a.y*b.r+b.y*a.r)/(a.r+b.r);a.dead=b.dead=1;
  g.cb=g.el-g.lm<.6?g.cb+1:1;g.lm=g.el;
  const p=ARPT[nt]*g.cb;g.sc+=p;if(nt>g.mx)g.mx=nt;if(nt==7&&!g.king){g.king=1;g.sc+=150;banner("👑 "+t("Король Хякі!|Hyakki King!"));sfx("reveal")}burst(xx,yy,ARTI[nt][3],8+nt*3);txt("+"+p+(g.cb>1?" ×"+g.cb:""),xx,yy-RR[nt],"#ffe27a",14+nt);
  sfx(nt>=5?"bossdie":"combo",null,g.cb);if(nt>=5&&nt>g.mx-1)banner(t(ARNM[nt]));
  g.B.push({x:xx,y:yy,vx:(a.vx+b.vx)/2,vy:Math.min(-60*s,(a.vy+b.vy)/2-80*s),t:nt,r:RR[nt],age:0,pop:.18})};
 const physics=h=>{const B=g.B;
  for(const b of B){b.vy+=GR*h;b.x+=b.vx*h;b.y+=b.vy*h;b.age+=h;b.vx*=.9993;if(b.pop>0)b.pop-=h;
   if(b.x-b.r<CL){b.x=CL+b.r;b.vx=Math.abs(b.vx)*.15}if(b.x+b.r>CR){b.x=CR-b.r;b.vx=-Math.abs(b.vx)*.15}
   if(b.y+b.r>CB){b.y=CB-b.r;b.vy=-Math.abs(b.vy)*.08;b.vx*=.985}}
  for(let it=0;it<4;it++)for(let i=0;i<B.length;i++){const a=B[i];if(a.dead)continue;for(let j=i+1;j<B.length;j++){const b=B[j];if(b.dead)continue;
   let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),mr=a.r+b.r;if(d>=mr)continue;if(d<.001){dx=.01;dy=0;d=.01}
   if(a.t==b.t&&a.t<7&&it==0){merge(a,b);break}
   const nx=dx/d,ny=dy/d,pen=mr-d,ma=a.r*a.r,mb=b.r*b.r,sm=ma+mb;a.x-=nx*pen*mb/sm*.85;a.y-=ny*pen*mb/sm*.85;b.x+=nx*pen*ma/sm*.85;b.y+=ny*pen*ma/sm*.85;
   const vn=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(vn<0){const jn=-(1+.1)*vn/(1/ma+1/mb);a.vx-=jn*nx/ma;a.vy-=jn*ny/ma;b.vx+=jn*nx/mb;b.vy+=jn*ny/mb}}}
  g.B=g.B.filter(b=>!b.dead)};
 const draw=()=>{x.clearRect(0,0,W,H);
  x.fillStyle="rgba(8,5,20,.55)";x.strokeStyle="#ffb70388";x.lineWidth=3;x.beginPath();x.roundRect?x.roundRect(CL-3,CT,CW+6,CH+3,14):x.rect(CL-3,CT,CW+6,CH+3);x.fill();x.stroke();
  x.strokeStyle=g.dg>0?"rgba(255,60,60,"+(.5+.5*Math.sin(g.el*14))+")":"rgba(255,90,90,.35)";x.setLineDash([8,8]);x.lineWidth=2;x.beginPath();x.moveTo(CL,LINE);x.lineTo(CR,LINE);x.stroke();x.setLineDash([]);
  const body=(xx,yy,r,t0,sc)=>{const col=ARTI[t0][3],im=imgOf(t0);x.save();x.translate(xx,yy);x.scale(sc||1,sc||1);
   const gg=x.createRadialGradient(-r*.3,-r*.3,r*.1,0,0,r);gg.addColorStop(0,col+"cc");gg.addColorStop(1,col+"44");x.fillStyle=gg;x.beginPath();x.arc(0,0,r,0,6.283);x.fill();
   if(okI(im)){x.save();x.beginPath();x.arc(0,0,r*.96,0,6.283);x.clip();x.drawImage(im,-r,-r,r*2,r*2);x.restore()}else{x.font=r*1.3+"px serif";x.textAlign="center";x.textBaseline="middle";x.fillText(ARTI[t0][1],0,2)}
   x.strokeStyle=col;x.lineWidth=t0>=6?4:2.5;if(t0>=6){x.shadowColor=col;x.shadowBlur=14}x.beginPath();x.arc(0,0,r,0,6.283);x.stroke();x.restore()};
  for(const b of g.B)body(b.x,b.y,b.r,b.t,b.pop>0?1+b.pop*1.3:1);
  if(!g.end){const r=RR[g.cur];x.globalAlpha=g.cd>0?.35:.95;body(g.hx,HY,r,g.cur);x.globalAlpha=1;x.strokeStyle="#ffffff22";x.setLineDash([4,6]);x.beginPath();x.moveTo(g.hx,HY+r);x.lineTo(g.hx,CB);x.stroke();x.setLineDash([])}
  x.fillStyle="#fff";x.font="700 11px sans-serif";x.textAlign="right";x.fillText(t("Далі|Next"),CR-4,CT-30);body(CR-22,CT-14+0,RR[g.nx]*.55,g.nx);
  x.globalCompositeOperation="lighter";for(const p of g.pt){x.globalAlpha=Math.max(0,p.l/p.m)*.9;const gg=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.z);gg.addColorStop(0,p.c);gg.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=gg;x.beginPath();x.arc(p.x,p.y,p.z,0,6.283);x.fill()}x.globalCompositeOperation="source-over";x.globalAlpha=1;
  for(const f of g.fx){x.globalAlpha=Math.max(0,f.l/f.m);x.fillStyle=f.c;x.font="900 "+f.z+"px sans-serif";x.textAlign="center";x.fillText(f.s,f.x,f.y-(1-f.l/f.m)*28)}x.globalAlpha=1};
 let last=performance.now(),hs="";
 const loop=now=>{if(!A.isConnected||g.end)return;const dt=Math.min(.033,(now-last)/1000);last=now;g.el+=dt;g.cd=Math.max(0,g.cd-dt);
  const n=3;for(let i=0;i<n;i++)physics(dt/n);
  // небезпека: звір над червоною лінією довше за 2.6 с — кінець
  const over=g.B.some(b=>b.age>1.4&&b.y-b.r<LINE&&Math.hypot(b.vx,b.vy)<40*s);g.dg=over?g.dg+dt:Math.max(0,g.dg-dt*2);if(g.dg>2.6){arcFin(g);return}
  for(const p of g.pt){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=220*dt;p.l-=dt}g.pt=g.pt.filter(p=>p.l>0);for(const f of g.fx)f.l-=dt;g.fx=g.fx.filter(f=>f.l>0);
  draw();const h2=g.sc+"|"+g.cb;if(h2!=hs){hs=h2;$("arS").textContent="⭐ "+g.sc;$("arM").textContent=g.mx?t(ARNM[Math.min(7,g.mx)]):""}
  requestAnimationFrame(loop)};
 try{setMusic("battle")}catch(e){}requestAnimationFrame(t0=>{last=t0;loop(t0)})}
function arcQuit(){if(_ar&&!_ar.end)arcFin(_ar);else arcClose()}
function arcClose(){const A=document.getElementById("arc");if(A)A.remove();_ar=null;try{setMusic("menu")}catch(e){}rend();if(_arF=="b")bestiary()}
function arcFin(g){if(g.end)return;g.end=1;const a=arcSt(),got=g.got.length,tier=g.king?8:g.mx;let coins=0,pr=[],chest=0;
 if(g.sc>0){const raw=Math.round(g.sc*ARC.K*(1+Math.min(1,got*.05)));coins=Math.max(0,Math.min(raw,ARC.DAYCAP-a.c));a.c+=coins;S.mon+=coins;a.n++;
  if(tier>=5){const sl=Math.min(4,tier-4);S.souls+=sl;pr.push("+"+sl+" ⛩️")}
  let jd=tier>=7?1:0;jd=Math.max(0,Math.min(jd,ARC.DJ-(a.j||0)));if(jd){S.jd+=jd;a.j=(a.j||0)+jd;pr.push("+"+jd+" 💎")}
  if(tier>=6&&(a.ch||0)<ARC.DCH&&R()<(tier>=7?.7:.4)){chest=tier>=7?2:1;a.ch=(a.ch||0)+1}}
 const nb=g.sc>a.best;if(nb)a.best=g.sc;g.chest=chest;save();push();hdr();track("arcade",{score:g.sc,tier,coins});sfx(g.sc>0?"reveal":"bomb");
 const A=document.getElementById("arc");if(!A)return;
 A.innerHTML=`<div class="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center"><div class="text-5xl">${g.king?"👑":nb&&g.sc>0?"🏆":"🧩"}</div><h2 class="text-2xl font-black text-neonGold">${g.king?t("Король Хякі!|Hyakki King!"):t("Скриня повна|The chest is full")}</h2>
  <div class="text-5xl font-black font-mono">⭐ ${g.sc}</div><div class="text-xs text-gray-300">${t("Найсильніший йокай|Strongest yokai")}: ${t(ARNM[Math.min(7,g.mx)])}</div>${nb&&g.sc>0?`<div class="text-sm font-black text-neonGold">🏆 ${t("Новий рекорд!|New record!")}</div>`:""}
  ${coins?`<div class="text-xl font-black">+${fmt(coins)} 文</div>`:`<div class="text-xs text-gray-400">${a.c>=ARC.DAYCAP?t("Денна стеля мон з аркади досягнута — грай для задоволення. Завтра знову!|Daily mon cap reached — play for fun. Back tomorrow!"):""}</div>`}
  ${pr.length?`<div class="text-lg">${pr.join(" · ")}</div>`:""}
  ${chest?`<button class="btng w-full max-w-xs py-3" onclick="arcChest(${chest})">🎁 ${t("Відкрити сундук|Open the chest")}</button>`:""}
  <button class="btng w-full max-w-xs py-3" onclick="arcStart()">▶ ${t("Ще раз|Again")}</button><button class="btn !bg-inkDark border border-inkBorder w-full max-w-xs" onclick="arcClose()">${t("Закрити|Close")}</button></div>`}
function arcChest(p){const A=document.getElementById("arc");if(A)A.remove();_ar=null;try{setMusic("menu")}catch(e){}afterRev=()=>{rend();if(_arF=="b")bestiary()};runChest(["bonus","🎁","Сундук-знахідка|Found chest",0,"#ffb703"],p,"assets/chest_bonus.png")}
