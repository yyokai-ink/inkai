/* ═══════════════════════════════════════════════════════════════════════════════════
   INKAI — ЄДИНИЙ ФАЙЛ НАЛАШТУВАНЬ. Замінюй тут усе «PASTE…» і реквізити — більше ніде.
   Читають його: гра (core.js), service worker (sw.js) і юридичні сторінки (privacy / terms / raffle-rules / masters).
   ═══════════════════════════════════════════════════════════════════════════════════ */
(function(G){
 G.INKV=G.INKV||{};G.INKV.config="20261025b";
 G.INK_CFG={
  solo:true,   // РЕЖИМ «ТІЛЬКИ ЯК» (без підписок і вибору майстра): усі призи, знижки й розіграш — лише у YYOKAI. Щоб повернути партнерів — false
  // 1) Firebase → Project settings → Your apps → Web app (config). Authentication: увімкни Google і Apple. Firestore: створи базу й встав firestore.rules
  firebase:{apiKey:"PASTE_API_KEY",authDomain:"PASTE_PROJECT_ID.firebaseapp.com",projectId:"PASTE_PROJECT_ID",storageBucket:"PASTE_PROJECT_ID.appspot.com",messagingSenderId:"PASTE_SENDER_ID",appId:"PASTE_APP_ID",measurementId:"PASTE_MEASUREMENT_ID"},
  vapidKey:"PASTE_VAPID_KEY",                 // Firebase → Cloud Messaging → Web push certificates (для push-сповіщень)
  adminHash:"PASTE_SHA256_OF_ADMIN_PASSWORD", // відкрий hash.html у браузері, введи пароль адміна, скопіюй хеш сюди

  // 2) Хто організатор (потрапляє в політику конфіденційності, умови, правила розіграшу). ОБОВ'ЯЗКОВО заповни справжніми даними
  org:{name:"Прізвище Ім'я По батькові (фізична особа)",taxId:"",address:"м. Львів, вулиця, будинок",email:"hello@example.com",telegram:"@yyokai",instagram:"yyokai.tattoo",site:"https://example.com"},

  // 3) Призи й умови (мають збігатися з тим, що в грі: slots.js, social.js)
  prize:{city:"Львів",maxFreeUAH:7000,miniUAH:1500,claimDays:30,discountSlots:10,drawTime:"20:00 (Київ)",drawDay:"last"},

  // 4) Підписки майстрів: посилання на оплату (Monobank «банка»/LiqPay/Stripe Payment Link) і ціни
  pay:{subscription:"https://example.com/pay-subscription",top:"https://example.com/pay-top1"},
  pricing:{subscriptionUSD:10,topFromUSD:25,topToUSD:30},

  legalVersion:1,            // збільши на 1 після зміни юридичних текстів — гравці знову підтвердять згоду
  updated:"2026-10-24"
 };
})(typeof window!=="undefined"?window:self);
