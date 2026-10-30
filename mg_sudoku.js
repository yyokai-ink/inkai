/* INKAI mini-game: «Печатка демона» — класична судоку з душею. Розв'яжи сітку — запечатаєш демона. Нагорода: ІНК, торії, сундук (рідше — нефрит).
   3 помилки — демон тікає. 3 підказки. Нотатки, скасування. Прогрес зберігається (можна вийти й повернутись). Фон — твій екіпірований (BG). */
const SDK={ink:[4,9,18],souls:[1,2,3],chest:[.3,.6,1],clues:[40,32,26],nm:["Легко|Easy","Середньо|Medium","Складно|Hard"],dem:["🐸","👺","👹"],ML:3,HINT:3};   // 🔧 нагороди й складність
const sdkPop=n=>{let c=0;while(n){c+=n&1;n>>=1}return c};
function sdkSolve(g,lim,rnd){const r=new Int16Array(9),c=new Int16Array(9),b=new Int16Array(9),a=Int8Array.from(g),bx=i=>((i/27)|0)*3+(((i%9)/3)|0);let cnt=0,sol=null,nodes=0;
 for(let i=0;i<81;i++)if(a[i]){const m=1<<a[i];r[(i/9)|0]|=m;c[i%9]|=m;b[bx(i)]|=m}
 const rec=()=>{if(++nodes>60000){cnt=lim;return true}let bi=-1,bm=0,bc=10;
  for(let i=0;i<81;i++)if(!a[i]){const m=~(r[(i/9)|0]|c[i%9]|b[bx(i)])&0x3FE,n=sdkPop(m);if(n<bc){bc=n;bi=i;bm=m;if(n<2)break}}
  if(bi<0){cnt++;if(!sol)sol=Int8Array.from(a);return cnt>=lim}if(!bc)return false;
  const cand=[];for(let v=1;v<=9;v++)if(bm&(1<<v))cand.push(v);if(rnd)for(let i=cand.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[cand[i],cand[j]]=[cand[j],cand[i]]}
  const rr=(bi/9)|0,cc=bi%9,bb=bx(bi);for(const v of cand){a[bi]=v;const m=1<<v;r[rr]|=m;c[cc]|=m;b[bb]|=m;const f=rec();r[rr]&=~m;c[cc]&=~m;b[bb]&=~m;a[bi]=0;if(f)return true}return false};
 rec();return{cnt,sol,nodes}}
function sdkGen(d){const full=sdkSolve(new Int8Array(81),1,true).sol,p=Int8Array.from(full),ord=[...Array(81).keys()].sort(()=>Math.random()-.5);let left=81;
 for(const i of ord){if(left<=SDK.clues[d])break;const v=p[i];p[i]=0;if(sdkSolve(p,2,false).cnt!=1)p[i]=v;else left--}return{p,s:full}}
registerMiniGame({id:"sudoku",order:20,icon:"⛩️",color:"#ef4444",name:"Печатка демона (судоку)|Demon seal (sudoku)",desc:"Класична судоку: запечатай демона, забери ІНК, торії й сундук|Classic sudoku: seal the demon, win INK, torii and a chest",badge:"NEW",status:()=>S.sdk&&!S.sdk.done?t("Є незавершена гра|Game in progress"):"",start:sdkMenu});
(function(){const st=document.createElement("style");st.textContent=`
.sk-board{display:grid;grid-template-columns:repeat(9,1fr);background:#f1e4c8;border:3px solid #b3202a;border-radius:10px;box-shadow:0 8px 28px #000a,inset 0 0 40px #d9c49a;overflow:hidden;touch-action:manipulation}
.sk-c{position:relative;aspect-ratio:1;display:flex;align-items:center;justify-content:center;border:.5px solid #8a6f4a66;font:700 clamp(18px,6.2vw,28px)/1 "Hiragino Mincho ProN","Noto Serif JP","Yu Mincho",Georgia,serif;color:#1c1410;cursor:pointer}
.sk-c.r3{border-right:2px solid #b3202a}.sk-c.b3{border-bottom:2px solid #b3202a}.sk-c.hl{background:#e6d2a4}.sk-c.same{background:#f0b9a0}.sk-c.sel{background:#f7a58a;box-shadow:inset 0 0 0 2.5px #b3202a}
.sk-c.u{color:#9a1c25}.sk-c.bad{animation:skBad .5s}.sk-c.ok{animation:skOk .7s}
.sk-n{position:absolute;inset:1px;display:grid;grid-template-columns:repeat(3,1fr);font:600 9px/1 sans-serif;color:#7a5c3a;text-align:center;align-items:center}
@keyframes skBad{0%,100%{background:inherit}30%{background:#ff3b3b}}@keyframes skOk{0%{background:#ffd24a}100%{background:inherit}}
.sk-p{height:48px;border-radius:12px;background:linear-gradient(#5a3a22,#3a2414);border:1px solid #ffb70388;color:#ffd27a;font:900 22px Georgia,serif;position:relative}.sk-p i{position:absolute;right:5px;bottom:2px;font:600 9px sans-serif;color:#ddd;font-style:normal}.sk-p:active{transform:scale(.94)}
.sk-t{height:40px;border-radius:12px;background:#1c1424;border:1px solid #ffffff22;color:#fff;font:700 12px sans-serif}.sk-t.on{background:#b3202a}`;document.head.appendChild(st)})();
const sdkRules=()=>`<p>🎯 <b>${t("Мета|Goal")}</b>: ${t("заповнити сітку 9×9 цифрами 1–9 так, щоб у кожному <b>рядку</b>, кожному <b>стовпці</b> і кожному <b>квадраті 3×3</b> (обведені червоним) цифри не повторювались.|fill the 9×9 grid with the digits 1–9 so that every <b>row</b>, every <b>column</b> and every <b>3×3 box</b> (outlined in red) has no repeated digit.")}</p>
 <p>👆 <b>${t("Як грати|How to play")}</b>: ${t("торкнись порожньої клітинки, потім цифри внизу. Чорні цифри — дані, їх змінити не можна.|tap an empty cell, then a digit below. Black digits are given and cannot be changed.")}</p>
 <p>❤️ <b>${t("Помилки|Mistakes")}</b>: ${t("неправильна цифра не ставиться, клітинка блимає червоним і зникає одне серце. Втратиш усі 3 — демон тікає.|a wrong digit is not placed, the cell flashes red and you lose a heart. Lose all 3 and the demon escapes.")}</p>
 <p>✎ <b>${t("Нотатки|Notes")}</b>: ${t("увімкни ✎ і став маленькі цифри-припущення — вони нічого не рахують і самі зникають, коли ставиш цифру в рядку/стовпці/квадраті.|turn ✎ on to pencil in small guesses — they never count and disappear on their own when you place that digit nearby.")}</p>
 <p>💡 <b>${t("Підказка|Hint")}</b>: ${t("відкриває обрану (або випадкову) клітинку. Є 3 на гру. ↶ скасовує останній хід, ⌫ стирає нотатки.|reveals the selected (or a random) cell. 3 per game. ↶ undoes your last move, ⌫ clears notes.")}</p>
 <p>⛩️ <b>${t("Печатка|Seal")}</b>: ${t("смужка над сіткою росте з кожною правильною цифрою. Заповнив усе — демона запечатано.|the bar above the grid grows with every correct digit. Fill it all — the demon is sealed.")}</p>
 <p>🎁 <b>${t("Нагороди|Rewards")}</b>: ${t("ІНК, торії ⛩️, шанс на сундук; без жодної помилки нагорода ×1.5, а на «Складно» ще й 💎 нефрит.|INK, torii ⛩️, a chance for a chest; with no mistakes the reward is ×1.5, and on Hard also 💎 jade.")}</p>`;
let _sk=null;
function sdkMenu(){const A=mgShell("sudoku",""),sv=S.sdk&&!S.sdk.done?S.sdk:null;
 A.innerHTML=`<div class="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center overflow-auto"><button onclick="mgClose()" class="absolute right-3 top-3 w-10 h-10 rounded-full bg-black/55 border border-white/20 text-white" style="top:calc(env(safe-area-inset-top,0px) + 8px)">✕</button>
 <div class="text-6xl">⛩️</div><h2 class="text-2xl font-black text-neonGold">${t("Печатка демона|Demon seal")}</h2><div class="text-xs text-gray-200 max-w-xs">${t("Заповни сітку цифрами 1–9 — і демон буде запечатаний. 3 помилки — він тікає.|Fill the grid with digits 1–9 to seal the demon. 3 mistakes and it escapes.")}</div>
 <details class="w-full max-w-xs text-left rounded-xl bg-black/40 border border-white/15 p-3 text-xs text-gray-200"><summary class="font-black text-neonGold cursor-pointer">📖 ${t("Правила гри|How to play")}</summary><div class="space-y-2 mt-2">${sdkRules()}</div></details>
 ${sv?`<button class="btng w-full max-w-xs py-3" onclick="sdkResume()">▶ ${t("Продовжити гру|Continue")} · ${t(SDK.nm[sv.d])}</button>`:""}
 ${[0,1,2].map(d=>`<button class="btn w-full max-w-xs py-3 !bg-inkDark border border-crimsonRed/50" onclick="sdkNew(${d})"><b>${SDK.dem[d]} ${t(SDK.nm[d])}</b><div class="text-[10px] text-neonGold">${fmt(mgInk(SDK.ink[d]))} 墨 · ${SDK.souls[d]} ⛩️ · 🎁 ${Math.round(SDK.chest[d]*100)}%</div></button>`).join("")}
 <div class="text-[10px] text-gray-400">${t("Без помилок — нагорода ×1.5, а на «Складно» ще й 💎.|No mistakes — reward ×1.5, and 💎 on Hard.")}</div></div>`}
function sdkNew(d){const A=document.getElementById("mg");A.innerHTML=`<div class="flex-1 flex items-center justify-center text-gray-200">${t("Готуємо печатку…|Preparing the seal…")}</div>`;
 setTimeout(()=>{const z=sdkGen(d);S.sdk={d,p:Array.from(z.p).join(""),s:Array.from(z.s).join(""),a:Array.from(z.p).join(""),n:{},m:0,h:0,t:0,done:0};save();sdkResume()},30)}
function sdkResume(){const A=mgShell("sudoku",""),z=S.sdk;if(!z)return sdkMenu();
 const g={d:z.d,p:[...z.p].map(Number),s:[...z.s].map(Number),a:[...z.a].map(Number),n:z.n||{},m:z.m||0,h:z.h||0,sel:-1,nt:0,hist:[],t0:Date.now()-(z.t||0)*1000,end:0};_sk=g;
 const W=Math.min(A.clientWidth-20,420);
 A.innerHTML=`<div style="padding:calc(env(safe-area-inset-top,0px) + 8px) 12px 0;display:flex;align-items:center;gap:10px;color:#fff"><button onclick="sdkLeave()" class="w-10 h-10 rounded-full bg-black/55 border border-white/20">✕</button>
 <div style="flex:1;text-align:center"><div class="text-[11px] font-black uppercase tracking-widest text-neonGold">${t(SDK.nm[g.d])}</div><div id="skT" class="text-[11px] text-gray-300">0:00</div></div><div id="skL" class="text-lg font-black w-20 text-right"></div></div>
 <div style="display:flex;align-items:center;gap:10px;margin:8px auto 6px;width:${W}px"><span id="skD" style="font-size:34px;transition:transform .2s">${SDK.dem[g.d]}</span><div style="flex:1"><div class="text-[10px] text-gray-200 font-bold">${t("Печатка демона|Demon seal")} <span id="skP"></span></div><div style="height:8px;border-radius:6px;background:#00000066;overflow:hidden"><i id="skB" style="display:block;height:100%;width:0;background:linear-gradient(90deg,#b3202a,#ffb703);transition:width .3s"></i></div></div></div>
 <div id="skG" class="sk-board" style="width:${W}px;margin:0 auto"></div>
 <div class="text-center text-[11px] text-gray-300 mt-1">${t("Торкнись клітинки → обери цифру внизу|Tap a cell → pick a digit below")}</div>
 <div style="width:${W}px;margin:10px auto 0;display:grid;grid-template-columns:repeat(4,1fr);gap:6px"><button class="sk-t" onclick="sdkUndo()">↶ ${t("Назад|Undo")}</button><button class="sk-t" onclick="sdkErase()">⌫ ${t("Стерти|Erase")}</button><button id="skNt" class="sk-t" onclick="sdkNotes()">✎ ${t("Нотатки|Notes")}</button><button id="skH" class="sk-t" onclick="sdkHint()">💡 <span id="skHn"></span></button></div>
 <div id="skK" style="width:${W}px;margin:8px auto 0;display:grid;grid-template-columns:repeat(9,1fr);gap:4px">${[1,2,3,4,5,6,7,8,9].map(v=>`<button class="sk-p" onclick="sdkPut(${v})">${v}<i id="skc${v}"></i></button>`).join("")}</div>`;
 mgRules(A,t("Печатка демона — правила|Demon seal — rules"),sdkRules());
 const G=$("skG");G.innerHTML=g.a.map((_,i)=>`<div class="sk-c ${i%9%3==2&&i%9<8?"r3":""} ${((i/9)|0)%3==2&&i<72?"b3":""}" data-i="${i}"></div>`).join("");
 G.addEventListener("pointerdown",e=>{const c=e.target.closest(".sk-c");if(c){g.sel=+c.dataset.i;sfx("tick");sdkDraw()}});
 g.iv=setInterval(()=>{if(!document.getElementById("skG")){clearInterval(g.iv);return}if(!g.end){const s=Math.floor((Date.now()-g.t0)/1000);$("skT").textContent=Math.floor(s/60)+":"+String(s%60).padStart(2,"0")}},500);A._off=()=>clearInterval(g.iv);sdkDraw()}
function sdkSave(){const g=_sk,z=S.sdk;if(!g||!z)return;z.a=g.a.join("");z.n=g.n;z.m=g.m;z.h=g.h;z.t=Math.floor((Date.now()-g.t0)/1000);save()}
function sdkLeave(){sdkSave();mgClose()}
function sdkDraw(){const g=_sk;if(!g)return;const cs=$("skG").children,sel=g.sel,sv=sel>=0?g.a[sel]:0,sr=sel>=0?(sel/9)|0:-9,sc=sel>=0?sel%9:-9,sb=sel>=0?((sr/3)|0)*3+((sc/3)|0):-9;let filled=0,empty=0;const cnt=Array(10).fill(0);
 for(let i=0;i<81;i++){const el=cs[i],v=g.a[i],r=(i/9)|0,c=i%9,b=((r/3)|0)*3+((c/3)|0),giv=g.p[i]>0;if(!giv){empty++;if(v)filled++}if(v)cnt[v]++;
  el.className="sk-c "+(c%3==2&&c<8?"r3 ":"")+(r%3==2&&r<8?"b3 ":"")+(i==sel?"sel ":(sel>=0&&(r==sr||c==sc||b==sb))?"hl ":"")+(sv&&v==sv&&i!=sel?"same ":"")+(!giv&&v?"u":"");
  if(v)el.textContent=v;else{const nm=g.n[i]||0;el.innerHTML=nm?`<div class="sk-n">${[1,2,3,4,5,6,7,8,9].map(k=>`<span>${nm&(1<<k)?k:""}</span>`).join("")}</div>`:""}}
 for(let v=1;v<=9;v++){const k=$("skc"+v);k.textContent=9-cnt[v]>0?9-cnt[v]:"";k.parentNode.style.opacity=cnt[v]>=9?.25:1}
 const pr=empty?Math.round(filled/empty*100):100;$("skB").style.width=pr+"%";$("skP").textContent=pr+"%";$("skL").textContent="❤️".repeat(SDK.ML-g.m)+"🖤".repeat(g.m);$("skHn").textContent=SDK.HINT-g.h;$("skNt").classList.toggle("on",!!g.nt)}
function sdkPut(v){const g=_sk;if(!g||g.end||g.sel<0)return;const i=g.sel;if(g.p[i]||g.a[i]==g.s[i])return;
 if(g.nt){g.hist.push({i,a:g.a[i],n:g.n[i]||0});g.n[i]=(g.n[i]||0)^(1<<v);g.a[i]=0;sdkSave();sdkDraw();return}
 if(v!=g.s[i]){g.m++;const el=$("skG").children[i];el.classList.add("bad");setTimeout(()=>el.classList.remove("bad"),500);sfx("bomb");navigator.vibrate&&navigator.vibrate(60);$("skD").style.transform="scale(1.3) rotate(-10deg)";setTimeout(()=>{const d=$("skD");if(d)d.style.transform=""},250);sdkSave();sdkDraw();if(g.m>=SDK.ML)sdkEnd(0);return}
 g.hist.push({i,a:g.a[i],n:g.n[i]||0});g.a[i]=v;delete g.n[i];for(let k=0;k<81;k++){const r=(k/9)|0,c=k%9,r0=(i/9)|0,c0=i%9;if(g.n[k]&&(r==r0||c==c0||(((r/3)|0)==((r0/3)|0)&&((c/3)|0)==((c0/3)|0))))g.n[k]&=~(1<<v)}
 sfx("slash",null,5);sdkDraw();sdkUnits(i);sdkSave();if(g.a.every((x,k)=>x==g.s[k]))sdkEnd(1)}
function sdkUnits(i){const g=_sk,r=(i/9)|0,c=i%9,cs=$("skG").children,full=a=>a.every(k=>g.a[k]==g.s[k]),R9=[...Array(9)].map((_,k)=>r*9+k),C9=[...Array(9)].map((_,k)=>k*9+c),b9=[];for(let y=0;y<3;y++)for(let x=0;x<3;x++)b9.push((((r/3)|0)*3+y)*9+((c/3)|0)*3+x);
 let n=0;for(const u of[R9,C9,b9])if(full(u)){n++;u.forEach((k,j)=>{const el=cs[k];setTimeout(()=>{el.classList.add("ok");setTimeout(()=>el.classList.remove("ok"),700)},j*40)})}if(n){sfx("combo",null,n+2)}}
function sdkNotes(){const g=_sk;if(g)g.nt^=1,sdkDraw()}
function sdkErase(){const g=_sk;if(!g||g.end||g.sel<0)return;const i=g.sel;if(g.p[i]||g.a[i]==g.s[i])return;g.hist.push({i,a:g.a[i],n:g.n[i]||0});g.n[i]=0;sdkSave();sdkDraw()}
function sdkUndo(){const g=_sk;if(!g||g.end||!g.hist.length)return;const h=g.hist.pop();g.a[h.i]=h.a;g.n[h.i]=h.n;sdkSave();sdkDraw()}
function sdkHint(){const g=_sk;if(!g||g.end||g.h>=SDK.HINT)return;let i=g.sel;if(i<0||g.p[i]||g.a[i]==g.s[i]){const e=g.a.map((v,k)=>g.p[k]||v==g.s[k]?-1:k).filter(k=>k>=0);if(!e.length)return;i=e[Math.random()*e.length|0]}
 g.h++;g.sel=i;g.hist.push({i,a:g.a[i],n:g.n[i]||0});g.a[i]=g.s[i];delete g.n[i];sdkDraw();sdkUnits(i);sdkSave();sfx("reveal");if(g.a.every((x,k)=>x==g.s[k]))sdkEnd(1)}
function sdkEnd(win){const g=_sk;if(!g||g.end)return;g.end=1;clearInterval(g.iv);const A=document.getElementById("mg");if(S.sdk)S.sdk.done=1;
 if(!win){save();track("sudoku_end",{d:g.d,win:0});sfx("bomb");mgResult(A,{icon:"💨",title:t("Демон втік…|The demon escaped…"),lines:[t("Три помилки. Спробуй іншу сітку!|Three mistakes. Try another grid!")],again:"sdkMenu()"});return}
 const k=g.m==0?1.5:1,rw=mgGrant({ink:mgInk(SDK.ink[g.d]*k),souls:SDK.souls[g.d],jd:g.d==2&&g.m==0?1:0,chest:Math.random()<SDK.chest[g.d]?g.d+1:0},"sudoku");
 track("sudoku_end",{d:g.d,win:1,m:g.m,h:g.h});sfx("reveal");
 A.innerHTML=`<div class="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center"><div id="skS" style="font-size:90px;color:#b3202a;font-family:serif;font-weight:900;text-shadow:0 0 24px #b3202a;transform:scale(3);opacity:0;transition:all .5s cubic-bezier(.2,1.4,.4,1)">封</div><div class="text-4xl">${SDK.dem[g.d]}</div></div>`;
 setTimeout(()=>{const s=$("skS");if(s){s.style.transform="scale(1)";s.style.opacity=1}sfx("bossdie",null,5)},50);
 setTimeout(()=>mgResult(A,{icon:"⛩️",title:t("Демона запечатано!|The demon is sealed!"),lines:[t(SDK.nm[g.d])+" · "+Math.floor((Date.now()-g.t0)/60000)+" "+t("хв|min")+(g.m==0?" · ✨ "+t("без помилок ×1.5|flawless ×1.5"):"")],reward:rw,again:"sdkMenu()"}),1500)}
