/* INKAI mini-game: «Злиття йокаїв» — м'які гнучкі круги. Кидай йокаїв у скриню: двоє однакових зливаються в сильнішого.
   Найбільший (Король Хякі) надувається й ЛОПАЄТЬСЯ — дає очки й звільняє місце. Верх переповнений довше 2 с — кінець.
   Нагорода: ІНК (без денного ліміту), торії, рідкісне — нефрит і сундуки (ліміт у minigames.js → MG_CAPS). Фон — твій екіпірований (BG). */
const MGM={K:6,RS:1.35,OVER:2.0};   // 🔧 ІНК за очко · масштаб розмірів кругів (менше = менші) · секунд переповнення до кінця
// [емодзі-ключ спрайта з YIMG (assets/yokai_*.png), назва, радіус, колір]
const MGMT=[["🦊","Лис|Fox",15,"#fb923c"],["🐸","Каппа|Kappa",20,"#34d399"],["👺","Тенгу|Tengu",26,"#f87171"],["👹","Оні|Oni",33,"#c084fc"],["💀","Череп|Skull",41,"#d1d5db"],["🐉","Дракон|Dragon",50,"#38bdf8"],["👹","Золотий оні|Golden Oni",60,"#ffd24a"],["🐉","Король Хякі|Hyakki King",72,"#ff2a5f"]];
const MGMPT=[0,2,4,7,12,20,35,60];
function mgmBest(){S.mg=S.mg||{};return S.mg.mb||0}
registerMiniGame({id:"merge",order:10,icon:"🧩",color:"#a855f7",name:"Злиття йокаїв|Yokai merge",desc:"Зливай однакових — Король лопається й дає нагороди|Merge equals — the King pops for rewards",badge:"NEW",status:()=>t("Рекорд|Best")+": "+mgmBest(),start:mgmStart});
function mgmStart(){
 const A=mgShell("merge",`<canvas id="mgv" style="position:absolute;inset:0;width:100%;height:100%;touch-action:none"></canvas><div style="position:absolute;left:0;right:0;top:0;padding:calc(env(safe-area-inset-top,0px) + 8px) 56px 0 14px;display:flex;justify-content:space-between;align-items:center;font-weight:900;font-size:15px;pointer-events:none;text-shadow:0 1px 4px #000"><span id="mgS">⭐ 0</span><span id="mgM" style="color:#ffd27a"></span><span id="mgK"></span></div><button onclick="mgmQuit()" style="position:absolute;right:12px;top:calc(env(safe-area-inset-top,0px) + 6px);width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.25);color:#fff;z-index:2">✕</button>`);
 const cv=$("mgv"),W=A.clientWidth,H=A.clientHeight,dpr=Math.min(2,window.devicePixelRatio||1),x=cv.getContext("2d");cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
 const CW=Math.min(W-20,360),CH=Math.min(H-150,560),CL=(W-CW)/2,CR=CL+CW,CT=Math.max(70,(H-CH)/2+20),CB=CT+CH,s=CW/360,LINE=CT+76*s,GR=1500*s,HY=CT+32*s,RR=MGMT.map(a=>a[2]*s*MGM.RS);
 const got=Object.keys(BOSS).filter(k=>(S.bst||{})[k]>0),bk=got.length?got[R()*got.length|0]:null,LD={},ld=u=>LD[u]||(LD[u]=Object.assign(new Image(),{src:u})),okI=i=>i&&i.complete&&i.naturalWidth;
 const sprite=t0=>t0==6&&bk?ld("assets/boss_"+bk+".png"):YIMG[MGMT[t0][0]];
 const g={sc:0,B:[],pt:[],fx:[],rg:[],hx:W/2,cd:0,nx:0,cur:0,mx:0,cb:0,lm:-9,dg:0,el:0,end:0,got,kings:0,shake:0,hs:0};cv._g=g;
 const rt=()=>[0,0,0,0,1,1,1,2,2,3][R()*10|0];g.cur=rt();g.nx=rt();
 const txt=(sx,xx,yy,col,z)=>g.fx.push({s:sx,x:xx,y:yy,c:col||"#ffe27a",z:z||16,l:.9,m:.9});
 const burst=(xx,yy,col,n,sp)=>{for(let i=0;i<n;i++){const a=R()*6.283,v=(40+R()*(sp||130))*s;g.pt.push({x:xx,y:yy,vx:Math.cos(a)*v,vy:Math.sin(a)*v-20,l:.45+R()*.35,m:.8,z:(3+R()*6)*s*1.3,c:col})}};
 const banner=sx=>{const b=document.createElement("div");b.style.cssText="position:absolute;left:0;right:0;top:22%;text-align:center;font-weight:900;font-size:22px;pointer-events:none;text-shadow:0 0 10px #000;color:#fff";b.textContent=sx;b.animate([{opacity:0,transform:"scale(.7)"},{opacity:1,transform:"scale(1.1)",offset:.15},{opacity:0,transform:"translateY(-26px)"}],{duration:1300});A.appendChild(b);setTimeout(()=>b.remove(),1300)};
 const mk=(xx,yy,t0,vx,vy)=>({x:xx,y:yy,vx:vx||0,vy:vy||0,t:t0,r:RR[t0],age:0,sq:0,sv:0,sa:0,cq:0,ca:0,gs:1,gv:0});
 const drop=()=>{if(g.end||g.cd>0)return;const b=mk(g.hx,HY,g.cur,0,60*s);b.gs=.8;g.B.push(b);g.cur=g.nx;g.nx=rt();g.cd=.42;sfx("slash",null,3)};
 const px=e=>{const r=cv.getBoundingClientRect(),xx=e.clientX-r.left,rr=RR[g.cur];g.hx=Math.max(CL+rr+2,Math.min(CR-rr-2,xx))};
 cv.addEventListener("pointerdown",e=>{e.preventDefault();px(e)});cv.addEventListener("pointermove",e=>{if(e.buttons||e.pointerType=="touch")px(e)});cv.addEventListener("pointerup",e=>{px(e);drop()});
 const merge=(a,b)=>{a.dead=b.dead=1;const nt=a.t+1,w=a.r+b.r,xx=(a.x*b.r+b.x*a.r)/w,yy=(a.y*b.r+b.y*a.r)/w;g.cb=g.el-g.lm<.7?g.cb+1:1;g.lm=g.el;
  const p=MGMPT[nt]*g.cb;g.sc+=p;if(nt>g.mx)g.mx=nt;const n=mk(xx,yy,nt,(a.vx+b.vx)/2,Math.min(-40*s,(a.vy+b.vy)/2-60*s));n.gs=.72;n.gv=0;n.sq=.18;
  if(nt==7){n.pop=.7;banner("👑 "+t("Король Хякі!|Hyakki King!"));sfx("reveal")}else{sfx(nt>=5?"bossdie":"combo",null,g.cb)}
  g.B.push(n);burst(xx,yy,MGMT[nt][3],8+nt*3);g.rg.push({x:xx,y:yy,r:n.r,c:MGMT[nt][3],l:.5,m:.5});txt("+"+p+(g.cb>1?" ×"+g.cb:""),xx,yy-n.r,"#ffe27a",13+nt);
  for(const o of g.B)if(o!==n&&!o.dead){const dx=o.x-xx,dy=o.y-yy,d=Math.hypot(dx,dy)||1;if(d<n.r*2.4){const k=(1-d/(n.r*2.4))*95*s;o.vx+=dx/d*k;o.vy+=dy/d*k}}
  if(nt>=5)g.shake=.22};
 const pop=b=>{b.dead=1;const p=150*Math.max(1,g.cb);g.sc+=p;g.kings++;g.mx=7;burst(b.x,b.y,"#ffd24a",46,260);burst(b.x,b.y,"#ff2a5f",24,200);g.rg.push({x:b.x,y:b.y,r:b.r*1.8,c:"#ffd24a",l:.6,m:.6});txt("+"+p,b.x,b.y-b.r*.4,"#ffd24a",30);banner(t("БАХ! Місце звільнено|POP! Room cleared"));sfx("bossdie",null,9);g.shake=.4;navigator.vibrate&&navigator.vibrate([40,30,80])};
 const physics=h=>{const B=g.B;
  for(const b of B){b.vy+=GR*h;b.x+=b.vx*h;b.y+=b.vy*h;b.age+=h;b.vx*=.9985;b.vy*=.9995;b.cq=0;
   if(b.x-b.r<CL){b.x=CL+b.r;b.vx=Math.abs(b.vx)*.1;b.cq=Math.max(b.cq,.1);b.ca=0}if(b.x+b.r>CR){b.x=CR-b.r;b.vx=-Math.abs(b.vx)*.1;b.cq=Math.max(b.cq,.1);b.ca=Math.PI}
   if(b.y+b.r>CB){if(b.vy>140*s)b.sv+=Math.min(.7,b.vy/(900*s));b.y=CB-b.r;b.vy=-Math.abs(b.vy)*.05;b.vx*=.985;b.cq=Math.max(b.cq,.1);b.ca=Math.PI/2}}
  for(let it=0;it<3;it++)for(let i=0;i<B.length;i++){const a=B[i];if(a.dead)continue;for(let j=i+1;j<B.length;j++){const b=B[j];if(b.dead)continue;
   let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),mr=a.r+b.r;if(d>=mr)continue;if(d<.001){dx=.01;dy=0;d=.01}
   if(a.t==b.t&&a.t<7&&!a.pop&&!b.pop&&d<mr*.9&&it==0){merge(a,b);break}   // «гуаш»: зливаються, коли вже втиснулись одне в одного
   const nx=dx/d,ny=dy/d,pen=mr-d,ma=a.r*a.r,mb=b.r*b.r,sm=ma+mb,f=.55;a.x-=nx*pen*mb/sm*f;a.y-=ny*pen*mb/sm*f;b.x+=nx*pen*ma/sm*f;b.y+=ny*pen*ma/sm*f;
   const vn=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(vn<0){if(-vn>150*s){a.sv+=Math.min(.6,-vn/(1100*s));b.sv+=Math.min(.6,-vn/(1100*s))}const jn=-(1.06)*vn/(1/ma+1/mb);a.vx-=jn*nx/ma;a.vy-=jn*ny/ma;b.vx+=jn*nx/mb;b.vy+=jn*ny/mb}
   const q=Math.min(.24,pen/mr*2.6);if(q>a.cq){a.cq=q;a.ca=Math.atan2(ny,nx)}if(q>b.cq){b.cq=q;b.ca=Math.atan2(-ny,-nx)}}}
  g.B=g.B.filter(b=>!b.dead)};
 const soft=dt=>{for(const b of g.B){const acc=(b.cq-b.sq)*340-b.sv*15;b.sv+=acc*dt;b.sq+=b.sv*dt;if(b.sq>.34)b.sq=.34;if(b.sq<-.14)b.sq=-.14;if(b.cq>.02)b.sa=b.ca;
   const ag=(1-b.gs)*300-b.gv*11;b.gv+=ag*dt;b.gs+=b.gv*dt;if(b.pop!=null){b.pop-=dt;b.gs=1+(1-b.pop/.7)*.55+Math.sin(g.el*40)*.03;if(b.pop<=0)pop(b)}}};
 const draw=()=>{x.clearRect(0,0,W,H);x.save();if(g.shake>0)x.translate((R()-.5)*8*g.shake*3,(R()-.5)*8*g.shake*3);
  x.fillStyle="rgba(8,5,20,.38)";x.strokeStyle="rgba(255,183,3,.55)";x.lineWidth=3;x.beginPath();x.roundRect?x.roundRect(CL-3,CT,CW+6,CH+3,16):x.rect(CL-3,CT,CW+6,CH+3);x.fill();x.stroke();
  if(g.dg>0){x.fillStyle="rgba(255,40,40,"+(g.dg/MGM.OVER*.22)+")";x.fillRect(CL,CT,CW,LINE-CT)}
  x.strokeStyle=g.dg>0?"rgba(255,70,70,"+(.6+.4*Math.sin(g.el*16))+")":"rgba(255,110,110,.45)";x.setLineDash([8,8]);x.lineWidth=g.dg>0?3:2;x.beginPath();x.moveTo(CL,LINE);x.lineTo(CR,LINE);x.stroke();x.setLineDash([]);
  const body=(xx,yy,r,t0,o)=>{o=o||{};const col=MGMT[t0][3],im=sprite(t0);x.save();x.translate(xx,yy);x.rotate(o.sa||0);const sq=o.sq||0,gs=o.gs||1;x.scale((1-sq)*gs,(1+sq*.75)*gs);x.rotate(-(o.sa||0));
   const gg=x.createRadialGradient(-r*.3,-r*.35,r*.1,0,0,r);gg.addColorStop(0,"#ffffff");gg.addColorStop(.25,col);gg.addColorStop(1,"#1c1030");x.globalAlpha=.97;x.fillStyle=gg;x.beginPath();x.arc(0,0,r,0,6.283);x.fill();x.globalAlpha=1;
   if(t0>=6){x.shadowColor=col;x.shadowBlur=18}
   if(okI(im)){const z=r*1.72;x.drawImage(im,-z/2,-z/2-r*.04,z,z)}else{x.font=r*1.2+"px serif";x.textAlign="center";x.textBaseline="middle";x.fillText(MGMT[t0][0],0,2)}   // спрайт без прозорості й без обрізки
   x.shadowBlur=0;x.strokeStyle=col;x.lineWidth=t0>=6?3.5:2.2;x.beginPath();x.arc(0,0,r,0,6.283);x.stroke();x.restore()};
  for(const b of g.B)body(b.x,b.y,b.r,b.t,b);
  if(!g.end&&g.cd<=0){x.globalAlpha=1;body(g.hx,HY,RR[g.cur],g.cur,{gs:Math.min(1,.7+g.hs*2)});x.strokeStyle="#ffffff30";x.lineWidth=1.5;x.setLineDash([4,6]);x.beginPath();x.moveTo(g.hx,HY+RR[g.cur]);x.lineTo(g.hx,CB);x.stroke();x.setLineDash([])}
  x.fillStyle="#fff";x.font="700 11px sans-serif";x.textAlign="right";x.fillText(t("Далі|Next"),CR-34,CT-14);body(CR-14,CT-16,RR[g.nx]*.5,g.nx);
  for(const q of g.rg){const k=1-q.l/q.m;x.globalAlpha=Math.max(0,1-k);x.strokeStyle=q.c;x.lineWidth=5*(1-k)+1;x.beginPath();x.arc(q.x,q.y,q.r*(1+k*.9),0,6.283);x.stroke()}x.globalAlpha=1;
  x.globalCompositeOperation="lighter";for(const p of g.pt){x.globalAlpha=Math.max(0,p.l/p.m)*.9;const gg=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.z);gg.addColorStop(0,p.c);gg.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=gg;x.beginPath();x.arc(p.x,p.y,p.z,0,6.283);x.fill()}x.globalCompositeOperation="source-over";x.globalAlpha=1;
  for(const f of g.fx){x.globalAlpha=Math.max(0,f.l/f.m);x.fillStyle=f.c;x.font="900 "+f.z+"px sans-serif";x.textAlign="center";x.fillText(f.s,f.x,f.y-(1-f.l/f.m)*28)}x.globalAlpha=1;
  if(g.dg>0){x.fillStyle="#ff5a5a";x.font="900 15px sans-serif";x.textAlign="center";x.fillText("⚠ "+t("Переповнення|Overflow")+" "+Math.max(0,MGM.OVER-g.dg).toFixed(1),W/2,CT-6)}
  x.restore()};
 let last=performance.now(),hud="";
 const loop=now=>{if(!A.isConnected||g.end)return;const dt=Math.min(.033,(now-last)/1000);last=now;g.el+=dt;g.cd=Math.max(0,g.cd-dt);if(g.cd<=0)g.hs+=dt;else g.hs=0;g.shake=Math.max(0,g.shake-dt);
  for(let i=0;i<3;i++){physics(dt/3)}soft(dt);
  // КІНЕЦЬ: будь-який йокай (старший за 1.3 с, що не злітає вгору) стирчить над червоною лінією довше за MGM.OVER секунд
  const over=g.B.some(b=>!b.pop&&b.age>1.3&&b.y-b.r*.55<LINE&&b.vy>-140*s);g.dg=over?g.dg+dt:Math.max(0,g.dg-dt*1.5);if(g.dg>=MGM.OVER){mgmFin(g);return}
  for(const p of g.pt){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=240*s*dt;p.l-=dt}g.pt=g.pt.filter(p=>p.l>0);for(const f of g.fx)f.l-=dt;g.fx=g.fx.filter(f=>f.l>0);for(const q of g.rg)q.l-=dt;g.rg=g.rg.filter(q=>q.l>0);
  draw();const h2=g.sc+"|"+g.mx+"|"+g.kings;if(h2!=hud){hud=h2;$("mgS").textContent="⭐ "+g.sc;$("mgM").textContent=g.mx?t(MGMT[g.mx][1]):"";$("mgK").textContent=g.kings?"👑 ×"+g.kings:""}
  requestAnimationFrame(loop)};
 try{setMusic("battle")}catch(e){}requestAnimationFrame(t0=>{last=t0;loop(t0)})}
function mgmQuit(){const A=document.getElementById("mg"),cv=A&&$("mgv");if(cv&&cv._g&&!cv._g.end)mgmFin(cv._g);else mgClose()}
function mgmFin(g){if(g.end)return;g.end=1;const A=document.getElementById("mg");if(!A)return;S.mg=S.mg||{};const nb=g.sc>(S.mg.mb||0);if(nb)S.mg.mb=g.sc;
 const got=g.got.length,tier=g.mx,ch=g.kings>=2?3:g.kings==1?(R()<.7?2:0):tier>=6?(R()<.4?1:0):0;
 const rw=g.sc>0?mgGrant({ink:g.sc*MGM.K*(1+Math.min(1,got*.05)),souls:(tier>=5?Math.min(4,tier-4):0)+g.kings,jd:g.kings?1:0,chest:ch},"merge"):{};
 track("merge_end",{score:g.sc,tier,kings:g.kings});sfx(g.sc>0?"reveal":"bomb");
 mgResult(A,{icon:g.kings?"👑":nb&&g.sc>0?"🏆":"🧩",title:g.kings?t("Король лопнув!|The King popped!"):t("Скриня повна|The chest is full"),score:g.sc,lines:[t("Найсильніший йокай|Strongest yokai")+": "+t(MGMT[Math.min(7,tier)][1])+(g.kings?" · 👑 ×"+g.kings:""),nb&&g.sc>0?"🏆 "+t("Новий рекорд!|New record!"):""],reward:rw,again:"mgmStart()"})}
