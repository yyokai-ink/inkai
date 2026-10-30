window.INKV=window.INKV||{};INKV.legal="20261030a";
/* INKAI legal.js — ЗГОДА, ВІК, ПРИВАТНІСТЬ. Підключається ПІСЛЯ slots.js.
   • При першому запуску (і після зміни legalVersion у config.js) гравець обирає вік і приймає Умови/Політику/Правила розіграшу; аналітика — окрема, необов'язкова згода.
   • Вік: a18 — усе; a16 (16–17) — рейтинг і дуелі, але без нагород і розіграшу; u16 — лише гість (без акаунта, рейтингу, нагород).
   • Приватність: вивантаження даних (JSON) і видалення акаунта з усіма даними — прямо в грі (вимога Apple/Google/GDPR). */
const LEGAL_V=(window.INK_CFG&&INK_CFG.legalVersion)||1;
const consentGet=()=>{try{return JSON.parse(localStorage.ink_consent||"null")}catch(e){return null}};

// нагороди, знижки й розіграш — лише 18+
function adultGate(){if(INK_AGE==="a18")return true;
 alert(t("Нагороди, знижки й розіграш — лише з 18 років (тату-послуги надаються повнолітнім). Грати та змагатися в рейтингу можна, але подати заявку на нагороду — ні.|Rewards, discounts and the raffle are for players 18+ (tattoo services are for adults). You can still play and compete, but you cannot claim rewards."));return false}

function consentSave(age,an){
 localStorage.ink_consent=JSON.stringify({v:LEGAL_V,ts:Date.now(),age,an:an?1:0});INK_AGE=age;S.adult=age==="a18"?1:0;save();
 if(an)startAnalytics();
 if(age==="u16"&&FBOK&&auth&&auth.currentUser){FB.signOut(auth).catch(()=>{});user=null;guestMode=false;if(typeof route==="function")route()}   // діти до 16 — без акаунта
 else if(isReal())push()}

function consentGate(){
 const c=consentGet();if(c&&c.v>=LEGAL_V&&c.age)return;
 let age=(c&&c.age)||"",acc=false,an=c?c.an===1:false;/* аналітика НЕ відмічена за замовчуванням (опт-ін, GDPR) */const el=document.createElement("div");el.id="cg";
 el.style.cssText="position:fixed;left:0;top:0;right:0;bottom:0;z-index:300;background:#0a090d;overflow-y:auto;color:#fff;font-family:system-ui,sans-serif";
 const lnk=(h,x)=>`<a href="${h}" target="_blank" rel="noopener" style="color:#ffb703">${x}</a>`;
 const draw=()=>{const ok=age&&acc;
  el.innerHTML=`<div style="max-width:430px;margin:0 auto;padding:max(26px,env(safe-area-inset-top)) 20px 30px;display:flex;flex-direction:column;gap:14px">
  <div style="text-align:center;font:900 36px Georgia,serif;letter-spacing:.08em;color:#ff2a5f">INKAI</div>
  <div style="text-align:center;font-size:13px;color:#9ca3af">${t("Перш ніж почати|Before you start")}</div>
  <div style="font-weight:800">${t("Скільки тобі років?|How old are you?")}</div>
  ${[["a18","18+",t("повний доступ, нагороди й розіграш|full access, rewards & raffle")],["a16","16–17",t("рейтинг і дуелі, без нагород|rating & duels, no rewards")],["u16",t("до 16|under 16"),t("гра як гість, без реєстрації й нагород|play as a guest, no sign-up or rewards")]]
   .map(([k,l,d])=>`<button data-age="${k}" style="text-align:left;padding:12px 14px;border-radius:12px;border:1px solid ${age==k?"#ffb703":"#3a3450"};background:${age==k?"#2a2108":"#15121d"};color:#fff;font-size:14px"><b>${l}</b> <span style="color:#9ca3af;font-size:12px">— ${d}</span></button>`).join("")}
  <label style="display:flex;gap:10px;font-size:13px;line-height:1.45;align-items:flex-start"><input type="checkbox" id="cgAcc" ${acc?"checked":""} style="margin-top:3px;width:18px;height:18px;flex:none"><span>${t("Я прочитав(ла) і приймаю|I have read and accept")} ${lnk("terms.html",t("Умови користування|Terms of Use"))}, ${lnk("privacy.html",t("Політику конфіденційності|Privacy Policy"))} ${t("та|and")} ${lnk("raffle-rules.html",t("Правила розіграшу й знижок|Raffle & Discount Rules"))}</span></label>
  <label style="display:flex;gap:10px;font-size:13px;line-height:1.45;align-items:flex-start"><input type="checkbox" id="cgAn" ${an?"checked":""} style="margin-top:3px;width:18px;height:18px;flex:none"><span>${t("Дозволяю анонімну аналітику (Google Analytics), щоб покращувати гру. Необов'язково, можна змінити в Профілі.|I allow anonymous analytics (Google Analytics) to improve the game. Optional; changeable in Profile.")}</span></label>
  <button id="cgOk" style="padding:14px;border-radius:14px;border:0;background:${ok?"#ff2a5f":"#3a3450"};color:${ok?"#fff":"#9ca3af"};font-weight:900;font-size:16px">${t("Продовжити|Continue")}</button>
  <div style="text-align:center"><button id="cgLang" style="background:none;border:0;color:#9ca3af;font-size:12px">${lang=="ua"?"🇬🇧 English":"🇺🇦 Українська"}</button></div></div>`;
  el.querySelectorAll("[data-age]").forEach(b=>b.onclick=()=>{acc=el.querySelector("#cgAcc").checked;an=el.querySelector("#cgAn").checked;age=b.dataset.age;draw()});
  el.querySelector("#cgAcc").onchange=e=>{acc=e.target.checked;an=el.querySelector("#cgAn").checked;draw()};
  el.querySelector("#cgAn").onchange=e=>{an=e.target.checked};
  el.querySelector("#cgOk").onclick=()=>{if(!(age&&acc))return;consentSave(age,an);el.remove();if(age==="u16")alert(t("Ти граєш як гість: прогрес зберігається лише на цьому пристрої, рейтинг і нагороди недоступні.|You play as a guest: progress stays on this device only; rating and rewards are unavailable."))};
  el.querySelector("#cgLang").onclick=()=>{acc=el.querySelector("#cgAcc").checked;an=el.querySelector("#cgAn").checked;toggleLanguage();draw()}};
 draw();document.body.appendChild(el)}

// ═══ ПРИВАТНІСТЬ І ДАНІ ═══
function legalBlock(){
 return `<div class="card space-y-2"><div class="grid grid-cols-2 gap-2 text-center text-xs">
 <a class="chip justify-center" href="privacy.html" target="_blank" rel="noopener">🔒 ${t("Конфіденційність|Privacy")}</a><a class="chip justify-center" href="terms.html" target="_blank" rel="noopener">📄 ${t("Умови|Terms")}</a>
 <a class="chip justify-center" href="raffle-rules.html" target="_blank" rel="noopener">🎰 ${t("Правила розіграшу|Raffle rules")}</a>${typeof SOLO!=="undefined"&&SOLO?"":`<a class="chip justify-center" href="masters.html" target="_blank" rel="noopener">🥷 ${t("Для майстрів|For masters")}</a>`}</div>
 <button class="btn w-full" onclick="privacySettings()">🛡 ${t("Приватність і дані|Privacy & data")}</button>
 <div class="text-[10px] text-gray-600 text-center">INKAI · ${t("збірка|build")} ${window.INK_BUILD||""}</div></div>`}
function privacySettings(){
 const c=consentGet()||{},ageL={a18:"18+",a16:"16–17",u16:t("до 16|under 16")}[c.age]||"—";
 dlModal(`<h3 class="font-black">🛡 ${t("Приватність і дані|Privacy & data")}</h3>
 <div class="text-[11px] text-gray-400">${t("Вік|Age")}: <b>${ageL}</b> · ${t("згода від|consent from")} ${c.ts?new Date(c.ts).toLocaleDateString(lang=="ua"?"uk":"en"):"—"}</div>
 <label class="flex items-start gap-2 text-left text-xs"><input type="checkbox" ${c.an===1?"checked":""} onchange="setAnalytics(this.checked)" class="mt-0.5"><span>${t("Анонімна аналітика (Google Analytics)|Anonymous analytics (Google Analytics)")}</span></label>
 <button class="btn w-full" onclick="exportData()">⬇️ ${t("Вивантажити мої дані|Export my data")}</button>
 <button class="btn w-full" onclick="consentReset()">🔁 ${t("Змінити вік або згоду|Change age or consent")}</button>
 <button class="btn w-full !text-crimsonRed" onclick="deleteAccount()">🗑 ${t("Видалити акаунт і дані|Delete account and data")}</button>
 <button class="btn w-full" onclick="dlClose()">${t("Закрити|Close")}</button>`)}
function setAnalytics(on){const c=consentGet()||{};c.an=on?1:0;localStorage.ink_consent=JSON.stringify(c);
 if(on)startAnalytics();else{const id=window.INK_CFG&&INK_CFG.firebase&&INK_CFG.firebase.measurementId;if(id)window["ga-disable-"+id]=true;FA={};toast(t("Аналітику вимкнено|Analytics off"))}}
function consentReset(){localStorage.removeItem("ink_consent");dlClose();consentGate()}
function exportData(){
 const d={exportedAt:new Date().toISOString(),uid:isReal()?user.uid:null,email:isReal()?user.email:null,consent:consentGet(),profile:S},
  b=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),a=document.createElement("a");
 a.href=URL.createObjectURL(b);a.download="inkai-my-data.json";document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},600);track("data_export")}
async function deleteAccount(){
 if(!confirm(t("Видалити акаунт і всі дані? Прогрес, рейтинг і невикористані нагороди зникнуть назавжди. Заявки на нагороди, які ми зобов'язані зберігати за законом, залишаться на потрібний строк.|Delete your account and all data? Progress, rating and unused rewards will be lost forever. Claims we are legally required to keep stay for the required period.")))return;
 try{
  if(isReal()){const uid=user.uid;
   const q=await FB.getDocs(FB.query(FB.collection(db,"daylog"),FB.where("uid","==",uid)));for(const d of q.docs)await FB.deleteDoc(d.ref);
   await FB.deleteDoc(FB.doc(db,"public",uid));await FB.deleteDoc(FB.doc(db,"users",uid));
   await FB.deleteUser(auth.currentUser)}
  track("account_deleted");localStorage.clear();sessionStorage.clear();location.href=location.pathname}
 catch(e){if(e.code=="auth/requires-recent-login"){alert(t("Для безпеки увійди в акаунт ще раз і повтори видалення.|For security, sign in again and repeat the deletion."));try{FB.signOut(auth)}catch(_){}}else alert(e.message)}}
