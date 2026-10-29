window.INKV=window.INKV||{};INKV.arcade="20261028a";
/* INKAI arcade.js — «Захист храму»: аркада в бестіарії.
   Йокаї валять на храм. Торкайся їх, щоб бити (гарбузи не чіпай!). Кожен бос з твого бестіарію = власна здатність (заморозка, чорна діра, блискавка…).
   Береш у бій до 4 босів — чим більше їх зібрано, тим більший вибір і тим вищий виграш. Нагорода — ті самі монети 文 (+ ⛩️/💎/🏮).
   Підключається ПІСЛЯ ui2.js. */
const ARC={T:75,HP:5,CD:14,SL:4,DAY:5,K:3,CAP:6000};   // 🔧 секунд · життів храму · перезарядка здібності, с · слотів · нагородних забігів/день · монет за очко (+1 за кожного боса в колекції) · стеля монет
// здібність кожного боса (за його силою з гри): ключ боса → ефект
const ARX={frz:"freeze",hvy:"freeze",slo:"slow",lgt:"slow",sto:"push",wnd:"push",bh:"hole",scr:"rain",rch:"rain",gld:"frenzy",cmb:"frenzy",nos:"heal",hea:"heal",mir:"bolt",swm:"bolt",spl:"bolt",shd:"shield",inv:"shield",cha:"vamp",vmp:"vamp"};
const ARN={freeze:["Крижаний полон|Ice prison","Вороги застигають на 3,5 с|Enemies freeze for 3.5 s"],slow:["Сповільнення|Slow-mo","6 с повільного часу, очки ×2|6 s of slow time, score ×2"],push:["Вихор|Whirlwind","Відкидає всіх угору|Blows everyone back"],hole:["Чорна діра|Black hole","3 с засмоктує й знищує ворогів|3 s sucks in and destroys enemies"],
 rain:["Вогняний дощ|Fire rain","2 с серії ударів по ворогах|2 s of strikes on enemies"],frenzy:["Шаленство|Frenzy","8 с очок ×2|8 s of score ×2"],heal:["Зцілення|Heal","+2 🏮 храму|+2 🏮 for the temple"],bolt:["Блискавка|Lightning","Б'є 5 найближчих ворогів|Strikes the 5 closest enemies"],shield:["Щит|Shield","Храм невразливий 5 с|Temple invulnerable for 5 s"],vamp:["Вампіризм|Vampirism","Знищує 3 найближчих і лікує|Kills the 3 closest and heals"]};
function arcSt(){const d=today();S.arc=S.arc||{};if(S.arc.d!==d){S.arc.d=d;S.arc.n=0}S.arc.best=S.arc.best||0;return S.arc}
const arcGot=()=>Object.keys(BOSS).filter(k=>(S.bst||{})[k]>0);
function arcBtn(){const a=arcSt();
 return `<div class="rounded-2xl p-3 space-y-2 text-center" style="background:linear-gradient(135deg,rgba(124,58,237,.25),rgba(255,42,95,.2));border:1px solid #7c3aed99"><b class="text-sm">🏯 ${t("Захист храму (аркада)|Temple defense (arcade)")}</b>
 <div class="text-[11px] text-gray-300">${t("Йокаї атакують храм — бий їх торканням. Кожен бос з твоєї колекції дає власну силу: заморозка, чорна діра, блискавка… Чим більше босів, тим більший вибір і більший виграш в монетах 文.|Yokai attack the temple — tap to hit them. Every boss you own gives its own power: freeze, black hole, lightning… The more bosses, the more choice and the bigger the payout.")}</div>
 <div class="text-[10px] text-neonGold">${t("Нагородних забігів сьогодні|Reward runs today")}: ${Math.max(0,ARC.DAY-a.n)}/${ARC.DAY} · ${t("рекорд|best")}: ${a.best} · ${t("босів|bosses")}: ${arcGot().length}/${Object.keys(BOSS).length}</div>
 <button class="btng w-full py-3" onclick="event.stopPropagation();arcStart()">▶ ${t("До бою|To battle")}</button></div>`}
(function(){const st=document.createElement("style");st.textContent=`
#arc{position:fixed;inset:0;z-index:98;display:flex;flex-direction:column;background:radial-gradient(circle at 50% 0,#3b1b5e,#0a090d 70%);touch-action:none;-webkit-user-select:none;user-select:none}
#arc .arp{padding:calc(env(safe-area-inset-top,0px) + 16px) 16px 16px;overflow:auto;flex:1}
#arc .arg{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
#arc .ari{border-radius:12px;padding:6px 2px;text-align:center;background:#0a090d;border:2px solid #272235;font-size:9px;line-height:1.15;color:#ddd}#arc .ari.on{border-color:var(--bc);box-shadow:0 0 12px var(--bc);background:#160f24}#arc .ari.lk{opacity:.35}
#arc .arh{position:absolute;left:0;right:0;top:0;padding:calc(env(safe-area-inset-top,0px) + 8px) 56px 0 14px;display:flex;justify-content:space-between;font-weight:900;font-size:15px;pointer-events:none;text-shadow:0 1px 4px #000}
#arc .arbar{position:absolute;left:0;right:0;bottom:0;display:flex;gap:8px;justify-content:center;padding:8px 10px calc(env(safe-area-inset-bottom,0px) + 10px);background:linear-gradient(0deg,#000c,#0000)}
#arc .arb{position:relative;width:74px;height:84px;border-radius:14px;overflow:hidden;background:#160f24;border:2px solid var(--bc);color:#fff;font-size:9px;font-weight:800;line-height:1.1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:4px}
#arc .arb .ai{position:absolute;top:4px;left:0;right:0;height:46px;display:flex;align-items:center;justify-content:center;font-size:30px}
#arc .arb .cd{position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,.72);height:0}#arc .arb.rd{animation:arcRd 1.1s ease-in-out infinite}
@keyframes arcRd{50%{box-shadow:0 0 14px var(--bc)}}
#arc .arx{position:absolute;right:12px;top:calc(env(safe-area-inset-top,0px) + 6px);width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.25);color:#fff}
#arc .arn{position:absolute;left:0;right:0;top:34%;text-align:center;font-weight:900;font-size:22px;pointer-events:none;animation:arcN 1.3s ease-out forwards;text-shadow:0 0 10px #000}
@keyframes arcN{0%{opacity:0;transform:scale(.7)}15%{opacity:1;transform:scale(1.1)}100%{opacity:0;transform:translateY(-30px)}}`;document.head.appendChild(st)})();
let _ar=null,_sel=[];
function arcStart(){const pc=$("pc");if(pc)pc.classList.replace("flex","hidden");let A=document.getElementById("arc");if(!A){A=document.createElement("div");A.id="arc";document.body.appendChild(A)}
 const got=arcGot(),used=new Set();if(!_sel.length||_sel.some(k=>!got.includes(k))){_sel=[];for(const k of got)if(_sel.length<ARC.SL&&!used.has(ARX[k])){used.add(ARX[k]);_sel.push(k)}}arcPick()}
function arcPick(){const A=document.getElementById("arc");if(!A)return;const got=arcGot();
 A.innerHTML=`<div class="arp"><button class="arx" onclick="arcClose()">✕</button><h2 class="text-xl font-black text-neonGold text-center">🏯 ${t("Захист храму|Temple defense")}</h2>
 <div class="text-[11px] text-gray-300 text-center mt-1">${t("Тримай храм ${ARC.T} с. Торкайся йокаїв, щоб бити. 🎃 не чіпай. Обери до 4 босів — їхні сили вмикаються кнопками внизу.|Hold the temple for ${ARC.T} s. Tap yokai to hit them. Don't touch 🎃. Pick up to 4 bosses — their powers sit on the buttons below.").replace(/\$\{ARC\.T\}/g,ARC.T)}</div>
 <div class="text-xs font-bold mt-3 mb-1">${t("Обрано|Picked")}: ${_sel.length}/${ARC.SL}</div>
 <div class="arg">${Object.keys(BOSS).map(k=>{const own=got.includes(k),on=_sel.includes(k),B=BOSS[k],n=ARN[ARX[k]][0];return `<div class="ari ${on?"on":""} ${own?"":"lk"}" style="--bc:${B[1]}" ${own?`onclick="arcTog('${k}')"`:""}><div class="h-10 flex items-center justify-center">${own?bImg(k,bEm(B),"h-10 w-auto"):"🔒"}</div><b>${t(n)}</b></div>`}).join("")}</div>
 ${_sel.length?`<div class="mt-2 space-y-0.5 text-[10px] text-gray-300">${_sel.map(k=>`<div><b style="color:${BOSS[k][1]}">${t(ARN[ARX[k]][0])}</b> — ${t(ARN[ARX[k]][1])}</div>`).join("")}</div>`:`<div class="mt-2 text-[11px] text-neonGold text-center">${t("Босів ще немає — візьмеш лише «Печатку храму». Перемагай босів у грі, щоб відкрити сили!|No bosses yet — you get only the “Temple seal”. Defeat bosses in the game to unlock powers!")}</div>`}
 <button class="btng w-full py-3 mt-3" onclick="arcRun()">▶ ${t("В бій|Fight")}</button><div class="text-center text-[10px] text-gray-400 mt-2">${t("Нагородних забігів|Reward runs")}: ${Math.max(0,ARC.DAY-arcSt().n)}/${ARC.DAY} · ${t("Виграш: очки × (3 + босів у колекції)|Payout: score × (3 + bosses owned)")}</div></div>`}
function arcTog(k){const i=_sel.indexOf(k);if(i>=0)_sel.splice(i,1);else if(_sel.length<ARC.SL)_sel.push(k);arcPick()}
function arcRun(){const A=document.getElementById("arc");if(!A)return;const got=arcGot(),sl=(_sel.length?_sel:["_seal"]).map(k=>k=="_seal"?{k,fx:"push",c:"#ffb703",e:"⛩️",nm:"Печатка храму|Temple seal"}:{k,fx:ARX[k],c:BOSS[k][1],e:bEm(BOSS[k]),nm:ARN[ARX[k]][0]});
 A.innerHTML=`<canvas id="arv" style="position:absolute;inset:0;width:100%;height:100%;touch-action:none"></canvas><div class="arh"><span id="arS">⭐ 0</span><span id="arC" style="color:#ffd27a"></span><span id="arT">${ARC.T}</span></div><div class="arh" style="top:28px;font-size:14px"><span id="arH"></span><span id="arF" style="color:#7dd3fc"></span><span></span></div><button class="arx" onclick="arcQuit()">✕</button>
 <div class="arbar">${sl.map((s,i)=>`<button class="arb" data-i="${i}" style="--bc:${s.c}"><div class="ai">${s.k=="_seal"?"⛩️":bImg(s.k,s.e,"h-11 w-auto")}</div><span>${t(s.nm)}</span><i class="cd"></i></button>`).join("")}</div>`;
 const cv=$("arv"),W=A.clientWidth,H=A.clientHeight,dpr=Math.min(2,window.devicePixelRatio||1),x=cv.getContext("2d");cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
 const TY=H-124,LD={},ld=s=>LD[s]||(LD[s]=Object.assign(new Image(),{src:s})),rd=i=>i&&i.complete&&i.naturalWidth;["fox","oni","tengu","kappa","skull","dragon","pumpkin"].forEach(n=>ld("assets/yokai_"+n+".png"));got.forEach(k=>ld("assets/boss_"+k+".png"));
 const g={sc:0,cb:0,hp:ARC.HP,el:0,en:[],pt:[],fx:[],cd:sl.map(()=>6),frz:0,slw:0,frn:0,shd:0,hole:null,rain:0,sp:.6,b1:0,b2:0,end:0,sh:0,got,kills:0};_ar=g;
 const stars=Array.from({length:45},()=>({x:R()*W,y:R()*TY,r:.6+R()*1.4,a:.3+R()*.6}));
 const mult=()=>(1+Math.min(4,g.cb/6|0))*(g.frn>0?2:1)*(g.slw>0?2:1);
 const txt=(s,xx,yy,col,sz)=>g.fx.push({ty:"t",s,x:xx,y:yy,c:col||"#ffe27a",z:sz||16,l:.8,m:.8});
 const burst=(xx,yy,col,n)=>{for(let i=0;i<(n||12);i++){const a=R()*6.283,v=60+R()*190;g.pt.push({x:xx,y:yy,vx:Math.cos(a)*v,vy:Math.sin(a)*v-30,l:.5+R()*.3,m:.8,z:4+R()*7,c:col})}};
 const banner=s=>{const b=document.createElement("div");b.className="arn";b.textContent=s;A.appendChild(b);setTimeout(()=>b.remove(),1300)};
 const fin=win=>{if(g.end)return;g.end=1;arcEnd(g,win)};
 const dmg=n=>{if(g.shd>0)return;g.hp-=n;g.cb=0;g.sh=.35;sfx("bomb");navigator.vibrate&&navigator.vibrate(80);if(g.hp<=0)fin(0)};
 const kill=(e,ab)=>{const p=Math.round(e.pt*mult());g.sc+=p;g.cb++;g.kills++;burst(e.x,e.y,e.ty=="boss"?"#ffd24a":e.ty=="gold"?"#ffd24a":"#c4b5fd",e.ty=="boss"?36:12);if(p)txt("+"+p,e.x,e.y-e.r,e.ty=="com"?"#fff":"#ffe27a",e.ty=="boss"?26:16);sfx(e.ty=="boss"?"bossdie":"slash",null,g.cb);if(g.cb%6==0)sfx("combo",null,g.cb);const i=g.en.indexOf(e);if(i>=0)g.en.splice(i,1)};
 const hit=(e,d)=>{e.hp-=d;e.fl=.12;if(e.hp<=0)kill(e);else sfx("bosshit")};
 const near=n=>g.en.filter(e=>e.ty!="bomb").sort((a,b)=>b.y-a.y).slice(0,n);
 const FX={freeze(){g.frz=3.5},slow(){g.slw=6},frenzy(){g.frn=8},shield(){g.shd=5},heal(){g.hp=Math.min(ARC.HP+2,g.hp+2)},
  push(){g.en.forEach(e=>{e.y=Math.max(-e.r,e.y-H*.3)});g.fx.push({ty:"r",x:W/2,y:TY,l:.7,m:.7,c:"#a5f3fc"})},
  hole(){g.hole={x:W/2,y:TY*.42,l:3}},rain(){g.rain=2.2},
  bolt(){near(5).forEach(e=>{g.fx.push({ty:"b",x:e.x,y:e.y,l:.35,m:.35});hit(e,3)})},
  vamp(){const L=near(3);L.forEach(e=>{burst(e.x,e.y,"#fb7185",8);kill(e)});if(L.length)g.hp=Math.min(ARC.HP+1,g.hp+1)}};
 const use=i=>{if(g.end||g.cd[i]>0)return;g.cd[i]=ARC.CD;FX[sl[i].fx]();sfx("reveal");banner(t(sl[i].nm));navigator.vibrate&&navigator.vibrate(30)};
 A.querySelectorAll(".arb").forEach(b=>b.addEventListener("pointerdown",e=>{e.preventDefault();e.stopPropagation();use(+b.dataset.i)}));
 cv.addEventListener("pointerdown",e=>{e.preventDefault();if(g.end)return;const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;let b=null,bd=1e9;
  for(const q of g.en){const d=Math.hypot(q.x-px,q.y-py);if(d<=q.r+16&&d<bd){bd=d;b=q}}
  g.fx.push({ty:"c",x:px,y:py,l:.25,m:.25,c:b?"#fff":"#ffffff55"});
  if(!b)return;if(b.ty=="bomb"){burst(b.x,b.y,"#ff8a1f",20);g.en.splice(g.en.indexOf(b),1);txt("💥",b.x,b.y,"#ff8a1f",26);dmg(1);return}hit(b,1)});
 const spawn=()=>{const t0=g.el,r=R();let o;
  if(r<.13)o={ty:"bomb",img:"pumpkin",e:BOMB.e,hp:1,r:23,v:1,pt:0};
  else if(r<.2)o={ty:"gold",img:"fox",e:"🦊",hp:1,r:20,v:1.7,pt:6};
  else if(r<.38&&t0>8)o={ty:"fast",img:"skull",e:"💀",hp:1,r:17,v:2.1,pt:2};
  else if(r<.5&&t0>16)o={ty:"tank",img:"oni",e:"👹",hp:3,r:35,v:.6,pt:5};
  else{const n=["fox","oni","tengu","kappa"][R()*4|0];o={ty:"com",img:n,e:{fox:"🦊",oni:"👹",tengu:"👺",kappa:"🐸"}[n],hp:1,r:22,v:1,pt:1}}
  o.mh=o.hp;o.x=o.r+R()*(W-2*o.r);o.y=-o.r;o.v0=o.v*(46+t0*.9);o.ph=R()*6.28;o.sw=4+R()*16;g.en.push(o)};
 const boss=()=>{const k=got.length?got[R()*got.length|0]:null;sfx("bossin");banner("⚠ "+t("БОС!|BOSS!"));g.en.push({ty:"boss",img:k?null:"dragon",bk:k,e:k?bEm(BOSS[k]):"🐉",hp:14+got.length,mh:14+got.length,r:58,v:.3,v0:.3*(46+g.el*.9),pt:30,x:W/2,y:-60,ph:0,sw:10})};
 const draw=()=>{x.clearRect(0,0,W,H);const gr=x.createLinearGradient(0,0,0,H);gr.addColorStop(0,"#1c0f33");gr.addColorStop(.7,"#2a1330");gr.addColorStop(1,"#0a090d");x.fillStyle=gr;x.fillRect(0,0,W,H);
  for(const s of stars){x.globalAlpha=s.a;x.fillStyle="#fff";x.beginPath();x.arc(s.x,s.y,s.r,0,6.283);x.fill()}x.globalAlpha=1;
  x.fillStyle="#f5e9c8";x.beginPath();x.arc(W*.78,H*.14,26,0,6.283);x.fill();x.fillStyle="#1c0f33";x.beginPath();x.arc(W*.78+9,H*.14-4,23,0,6.283);x.fill();
  const sx=g.sh>0?(R()-.5)*8:0;x.save();x.translate(sx,0);
  x.fillStyle="#120a1c";x.fillRect(0,TY,W,H-TY);x.strokeStyle="#ff2a5f66";x.setLineDash([8,8]);x.beginPath();x.moveTo(0,TY);x.lineTo(W,TY);x.stroke();x.setLineDash([]);
  const cx=W/2,ty=TY+6,w=Math.min(190,W*.5);x.fillStyle="#c0392b";x.fillRect(cx-w/2,ty+8,12,70);x.fillRect(cx+w/2-12,ty+8,12,70);x.fillRect(cx-w/2-14,ty,w+28,12);x.fillRect(cx-w/2+4,ty+24,w-8,8);x.fillStyle="#1a1a1a";x.fillRect(cx-w/2-18,ty-8,w+36,9);
  if(g.shd>0){x.strokeStyle="#67e8f9";x.lineWidth=3;x.globalAlpha=.5+.3*Math.sin(g.el*10);x.beginPath();x.ellipse(cx,ty+40,w*.75,62,0,0,6.283);x.stroke();x.globalAlpha=1;x.lineWidth=1}x.restore();
  if(g.hole){const h=g.hole,gg=x.createRadialGradient(h.x,h.y,4,h.x,h.y,90);gg.addColorStop(0,"#000");gg.addColorStop(.5,"#6d28d9aa");gg.addColorStop(1,"#0000");x.fillStyle=gg;x.beginPath();x.arc(h.x,h.y,90,0,6.283);x.fill()}
  for(const e of g.en){x.save();x.translate(e.x,e.y);if(e.ty!="boss")x.rotate(Math.sin(g.el*3+e.ph)*.12);const im=e.bk?ld("assets/boss_"+e.bk+".png"):ld("assets/yokai_"+e.img+".png"),s=e.r*2.3;
   if(e.ty=="gold"||e.ty=="boss"){x.shadowColor=e.ty=="boss"&&e.bk?BOSS[e.bk][1]:"#ffd24a";x.shadowBlur=e.ty=="boss"?22:12}
   if(rd(im))x.drawImage(im,-s/2,-s/2,s,s);else{x.font=s*.8+"px serif";x.textAlign="center";x.textBaseline="middle";x.fillText(e.e,0,0)}x.shadowBlur=0;
   if(e.fl>0){x.globalAlpha=.55;x.fillStyle="#fff";x.beginPath();x.arc(0,0,e.r,0,6.283);x.fill();x.globalAlpha=1}
   if(g.frz>0&&e.ty!="boss"||g.frz>0){x.globalAlpha=.35;x.fillStyle="#7dd3fc";x.beginPath();x.arc(0,0,e.r,0,6.283);x.fill();x.globalAlpha=1}
   if(e.mh>1){x.fillStyle="#000a";x.fillRect(-e.r,-e.r-10,e.r*2,5);x.fillStyle=e.ty=="boss"?"#ff2a5f":"#4ade80";x.fillRect(-e.r,-e.r-10,e.r*2*Math.max(0,e.hp/e.mh),5)}
   x.restore()}
  x.globalCompositeOperation="lighter";for(const p of g.pt){x.globalAlpha=Math.max(0,p.l/p.m)*.9;const gg=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.z);gg.addColorStop(0,p.c);gg.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=gg;x.beginPath();x.arc(p.x,p.y,p.z,0,6.283);x.fill()}x.globalCompositeOperation="source-over";x.globalAlpha=1;
  for(const f of g.fx){const k=f.l/f.m;x.globalAlpha=Math.max(0,k);
   if(f.ty=="t"){x.fillStyle=f.c;x.font="900 "+f.z+"px sans-serif";x.textAlign="center";x.fillText(f.s,f.x,f.y-(1-k)*30)}
   else if(f.ty=="c"||f.ty=="r"){x.strokeStyle=f.c;x.lineWidth=3;x.beginPath();x.arc(f.x,f.y,(f.ty=="r"?W*.6:34)*(1-k)+8,0,6.283);x.stroke()}
   else if(f.ty=="b"){x.strokeStyle="#e0f2fe";x.lineWidth=4;x.beginPath();x.moveTo(f.x+(R()-.5)*30,0);for(let i=1;i<6;i++)x.lineTo(f.x+(R()-.5)*34,f.y*i/5);x.lineTo(f.x,f.y);x.stroke();x.lineWidth=1}
   x.globalAlpha=1}};
 let last=performance.now(),hudS="";
 const loop=now=>{if(!A.isConnected||g.end)return;const dt=Math.min(.05,(now-last)/1000);last=now;g.el+=dt;
  if(g.el>=ARC.T){fin(1);return}
  if(g.el>=28&&!g.b1){g.b1=1;boss()}if(g.el>=55&&!g.b2){g.b2=1;boss()}
  g.sp-=dt;if(g.sp<=0){spawn();g.sp=Math.max(.3,1.05-g.el*.0105)*(.8+R()*.4)}
  g.frz=Math.max(0,g.frz-dt);g.slw=Math.max(0,g.slw-dt);g.frn=Math.max(0,g.frn-dt);g.shd=Math.max(0,g.shd-dt);g.sh=Math.max(0,g.sh-dt);
  if(g.rain>0){g.rain-=dt;if(R()<dt*7){const L=g.en.filter(e=>e.ty!="bomb");if(L.length){const e=L[R()*L.length|0];g.fx.push({ty:"c",x:e.x,y:e.y,l:.3,m:.3,c:"#fb923c"});burst(e.x,e.y,"#fb923c",6);hit(e,1)}}}
  if(g.hole){const h=g.hole;h.l-=dt;for(const e of g.en.slice()){if(e.ty=="boss")continue;const dx=h.x-e.x,dy=h.y-e.y,d=Math.hypot(dx,dy);if(d<230){e.x+=dx/d*200*dt;e.y+=dy/d*200*dt}if(d<26&&e.ty!="bomb")kill(e);else if(d<26){g.en.splice(g.en.indexOf(e),1)}}if(h.l<=0)g.hole=null}
  const spd=g.frz>0?0:g.slw>0?.4:1;
  for(const e of g.en.slice()){e.fl=Math.max(0,(e.fl||0)-dt);e.y+=e.v0*spd*dt;e.x=Math.max(e.r,Math.min(W-e.r,e.x+Math.sin(g.el*2+e.ph)*e.sw*dt*spd));
   if(e.y>=TY-e.r*.4){g.en.splice(g.en.indexOf(e),1);if(e.ty=="bomb"||e.ty=="gold")continue;dmg(e.ty=="boss"?3:1);if(g.end)return}}
  g.cd=g.cd.map(c=>Math.max(0,c-dt));
  for(const p of g.pt){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=240*dt;p.vx*=.97;p.l-=dt}g.pt=g.pt.filter(p=>p.l>0);for(const f of g.fx)f.l-=dt;g.fx=g.fx.filter(f=>f.l>0);
  draw();
  const hs=g.sc+"|"+g.cb+"|"+g.hp+"|"+Math.ceil(ARC.T-g.el)+"|"+(g.frn>0)+(g.slw>0)+(g.shd>0);
  if(hs!=hudS){hudS=hs;$("arS").textContent="⭐ "+g.sc;$("arC").textContent=g.cb>1?"🔥 ×"+mult()+" ("+g.cb+")":"";$("arT").textContent=Math.ceil(ARC.T-g.el);$("arH").textContent="🏮".repeat(Math.max(0,g.hp))+"🖤".repeat(Math.max(0,ARC.HP-g.hp));$("arF").textContent=(g.frn>0?"⚡×2 ":"")+(g.slw>0?"⏳ ":"")+(g.shd>0?"🛡":"")}
  A.querySelectorAll(".arb").forEach((b,i)=>{const c=g.cd[i]/ARC.CD;b.querySelector(".cd").style.height=c*100+"%";b.classList.toggle("rd",c==0)});
  requestAnimationFrame(loop)};
 try{setMusic("battle")}catch(e){}requestAnimationFrame(t0=>{last=t0;loop(t0)})}
function arcQuit(){if(_ar&&!_ar.end){_ar.end=1;arcEnd(_ar,0)}else arcClose()}
function arcClose(){const A=document.getElementById("arc");if(A)A.remove();_ar=null;try{setMusic("menu")}catch(e){}rend();bestiary()}
function arcEnd(g,win){const a=arcSt(),rw=a.n<ARC.DAY&&g.sc>0,got=g.got.length;if(win)g.sc=Math.round(g.sc*1.25);let coins=0,pr=[];
 if(rw){coins=Math.min(ARC.CAP,Math.round(g.sc*(ARC.K+got)));S.mon+=coins;a.n++;
  if(g.sc>=150){S.souls++;pr.push("+1 ⛩️")}if(g.sc>=350&&R()<.12){S.jd++;pr.push("+1 💎")}if(g.sc>=550&&R()<.06){S.ln++;pr.push("+1 🏮")}}
 const nb=g.sc>a.best;if(nb)a.best=g.sc;a.tot=(a.tot||0)+g.sc;save();push();hdr();track("arcade",{score:g.sc,coins,win:win?1:0});sfx(win?"reveal":"bossin");
 const A=document.getElementById("arc");if(!A)return;
 A.innerHTML=`<div class="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center"><div class="text-5xl">${win?"🏯":"💥"}</div><h2 class="text-2xl font-black text-neonGold">${win?t("Храм вистояв! (+25% очок)|The temple held! (+25% score)"):t("Храм упав|The temple fell")}</h2>
  <div class="text-5xl font-black font-mono">⭐ ${g.sc}</div>${nb&&g.sc>0?`<div class="text-sm font-black text-neonGold">🏆 ${t("Новий рекорд!|New record!")}</div>`:""}
  ${rw?`<div class="text-xl font-black">+${fmt(coins)} 文</div>${pr.length?`<div class="text-lg">${pr.join(" · ")}</div>`:""}`:`<div class="text-xs text-gray-300">${g.sc>0?t("Ліміт нагород на сьогодні вичерпано — це тренування. Завтра знову!|Reward limit for today reached — this was practice. Come back tomorrow!"):""}</div>`}
  <div class="text-[11px] text-gray-400">${t("Рекорд|Best")}: ${a.best} · ${t("Нагородних забігів|Reward runs")}: ${Math.min(ARC.DAY,a.n)}/${ARC.DAY}</div>
  <button class="btng w-full max-w-xs py-3" onclick="arcPick()">▶ ${t("Ще раз|Again")}</button><button class="btn !bg-inkDark border border-inkBorder w-full max-w-xs" onclick="arcClose()">${t("До бестіарію|Back to bestiary")}</button></div>`}
