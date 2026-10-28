window.INKV=window.INKV||{};INKV.slots="20261028e";
/* INKAI slots.js — ЛІМІТ ЗНИЖОК, СТРОК ДІЇ ТА «ШЛЯХ САМУРАЯ». Підключається ПІСЛЯ duel.js.
   • Кожен майстр (і ти, YYOKAI) приймає не більше SLOT_MAX заявок на ЗНИЖКИ на місяць. Слот займається разом із заявкою одним пакетом запису;
     правила Firestore (firestore.rules) не дозволяють ні заявку без слота, ні слот понад ліміт, ні «спалити» слот без заявки.
   • Знижка діє CLAIM_DAYS днів із моменту заявки (поле exp у заявці — майстер бачить дедлайн).
   • Перед відправкою гравець бачить умови: не сумується, діє 30 днів, робота в місті майстра, запис за домовленістю, майстер підтверджує.
   • Шлях самураїв (LADDER): 2-й день у грі → 5%, 4-й → 10%, 7-й → 20% у майстра YYOKAI. Дні — серверні (SD), підробити з телефона не можна. */
const SLOT_MAX=20,CLAIM_DAYS=30;       // 🔧 слотів знижок на місяць у кожного майстра; строк дії знижки (дні). Ліміт 20 також прописаний у firestore.rules (k<=20) — міняй в обох місцях
const LADDER=[[7,5],[14,10],[21,15],[30,20]];     // 🔧 [день Шляху самурая (серія 30 днів), % знижки]
const SLC={};let SLt=0;
const ymNow=()=>today().slice(0,7);

async function slotsLeft(mid){try{const q=await FB.getDocs(FB.query(FB.collection(db,"slots"),FB.where("key","==",mid+"_"+ymNow())));return Math.max(0,SLOT_MAX-q.docs.length)}catch(e){return null}}
async function refreshSlots(){if(!isReal()||Date.now()-SLt<60000)return;SLt=Date.now();SLC[OWN]=await slotsLeft(OWN);if(cur=="play")rend()}

// Заявка на ЗНИЖКУ: заявка + слот пишуться одним пакетом. Якщо слот забрали секундою раніше — пробуємо наступний (до 4 спроб)
async function slotClaim(mid,claimId,data){
 const key=mid+"_"+ymNow();
 for(let n=0;n<4;n++){
  const q=await FB.getDocs(FB.query(FB.collection(db,"slots"),FB.where("key","==",key))),taken=new Set(q.docs.map(d=>d.data().k));
  let k=0;for(let i=1;i<=SLOT_MAX;i++)if(!taken.has(i)){k=i;break}
  if(!k){const e=new Error(t("Слоти знижок цього місяця закінчились — нові з 1-го числа.|This month's discount slots are used up — new ones from the 1st."));e.code="slots-full";throw e}
  const sid=key+"_"+k,b=FB.writeBatch(db);
  b.set(FB.doc(db,"claims",claimId),{...data,ym:ymNow(),exp:Date.now()+CLAIM_DAYS*864e5,slot:sid,ts:FB.serverTimestamp(),status:"new"});
  b.set(FB.doc(db,"slots",sid),{key,k,uid:user.uid,claim:claimId,ts:FB.serverTimestamp()});
  try{await b.commit();SLt=0;return}catch(e){if(e.code!="permission-denied"||n==3)throw e}}}
// єдина точка запису заявок: знижки йдуть через слоти, тату — як раніше
const claimWrite=(id,m,data)=>{
 if(data.kind=="discount"&&String(id).includes("_raffle_"))data={...data,kind:"raffle_discount",ym:ymNow(),exp:Date.now()+CLAIM_DAYS*864e5,ts:FB.serverTimestamp(),status:"new"};   // призи розіграшу гарантовані й слотів не займають
 return data.kind=="discount"?slotClaim(m.id,id,data):FB.setDoc(FB.doc(db,"claims",id),data)};
// умови перед відправкою: true — гравець погодився
async function claimOk(m,pct,noSlot){
 if(!adultGate())return false;
 const left=noSlot?null:await slotsLeft(m.id);
 if(left!==null&&left<=0){alert(t("У майстра «|The master “")+m.nm+t("» слоти знижок цього місяця закінчились — нові з 1-го числа.|” has no discount slots left this month — new ones from the 1st."));return false}
 return confirm(t("Знижка |Discount ")+(pct?pct+"% ":"")+t("у майстра «|with master “")+m.nm+"»"+(m.city?" ("+m.city+")":"")+"\n"+
  "• "+t("діє "+CLAIM_DAYS+" днів після заявки|valid for "+CLAIM_DAYS+" days after the request")+"\n"+
  "• "+t("не сумується з іншими знижками|cannot be combined with other discounts")+"\n"+
  "• "+t("робота виконується в місті майстра; запис — за домовленістю, майстер підтверджує заявку|work is done in the master's city; booking by arrangement, the master confirms the request")+"\n"+
  (noSlot?"":"• "+t("вільних слотів цього місяця|free slots this month")+": "+(left==null?"?":left+"/"+SLOT_MAX)+"\n")+"\n"+t("Надіслати заявку?|Send the request?"))}

// ═══ ШЛЯХ САМУРАЯ (30 днів): знижки на 7-й 5% · 14-й 10% · 21-й 15% · 30-й 20% ═══
function ladderCard(){return ""}   // окремого «Шляху самурая зі знижками» більше немає: знижки тепер у 30-денному шляху (dailyCard у meta.js)
async function claimLadder(day){const x=LADDER.find(l=>l[0]==day);if(!x||(S.lad||[]).includes(day))return;
 if(!isReal()){alert(t("Щоб подати заявку, увійди через Google/Apple.|Sign in with Google/Apple to claim."));return}
 if((S.streak||1)<day){toast(t("Шлях самурая ще не дійшов до цього дня|The Samurai path has not reached this day yet"));return}
 if(SD<day){toast(t("Ще рано — потрібно більше різних днів у грі|Not yet — you need more different days played"));return}
 const m=masterOf(OWN);if(!m){alert(t("Майстер YYOKAI тимчасово недоступний.|Master YYOKAI is temporarily unavailable."));return}
 try{if(!(await claimOk(m,x[1])))return;
  await claimWrite(user.uid+"_ladder_"+day,m,{uid:user.uid,master:m.id,masterName:m.nm,email:user.email||"",nick:S.nick,tier:"ladder_"+day,pct:x[1],code:"",kind:"discount",serverDays:SD});
  S.lad=[...(S.lad||[]),day];save();track("ladder_claim",{day});rend();
  alert(t("Заявку надіслано майстру YYOKAI. Знижка |Request sent to master YYOKAI. The discount ")+x[1]+t("% діє до |% is valid until ")+new Date(Date.now()+CLAIM_DAYS*864e5).toLocaleDateString(lang=="ua"?"uk":"en")+".")}
 catch(e){alert(e.code=="permission-denied"?t("Така заявка вже подавалась, або майстер більше не активний.|Such a request was already sent, or the master is no longer active."):e.message)}}
