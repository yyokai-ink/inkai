window.INKV=window.INKV||{};INKV.ads="20261031a";
/* ═══════════════════════════════════════════════════════════════════════════════════════
   INKAI — РЕКЛАМА. Єдиний файл: просто додавай/міняй блоки у списку list нижче. Більше нічого чіпати не треба.
   ───────────────────────────────────────────────────────────────────────────────────────
   Як додати рекламу — скопіюй будь-який блок {…} і зміни:
     id      — будь-яка коротка назва (для статистики кліків: Google Analytics, події ad_start / ad_click)
     on      — true показувати · false вимкнути (блок можна не видаляти)
     title   — заголовок. Дві мови через |   →  "Українською|English"
     text    — короткий опис (необов'язково), теж "UA|EN"
     img     — картинка-банер (необов'язково). Поклади PNG/JPG у assets/ads/ і напиши "assets/ads/назва.png"
               (рекомендовано 600×300). Можна й повне посилання https://…
     url     — ПОСИЛАННЯ, куди веде кнопка (Instagram, Telegram, сайт партнера, афілійоване посилання)
     btn     — текст кнопки "UA|EN" (за замовчуванням «Відкрити»)
     weight  — «частота»: 1 звичайно, 3 = показується втричі частіше за інших
     where   — де показувати: "all" (скрізь) · "round" (після раундів) · "arrow" (стрілка-нагорода праворуч)
               · "revive" (додаткове життя) · "avatar" (аватар за рекламу). Можна кілька: ["round","arrow"]
     from/to — (необов'язково) дати показу "2026-11-01" … "2026-11-30"
     lang    — (необов'язково) "ua" або "en": показувати лише цією мовою
   Якщо список порожній або всі блоки on:false — показується запис про Instagram YYOKAI (core.js → CFG.promo).
   ═══════════════════════════════════════════════════════════════════════════════════════ */
window.INK_ADS={
  // ── Налаштування частоти ──
  everyRounds:3,     // примусова реклама після кожного N-го раунду
  arrowPerDay:3,     // скільки разів на день гравець може взяти нагороду зі стрілки праворуч
  arrowGapMin:10,    // пауза між нагородами зі стрілки, хвилин
  waitSec:5,         // скільки секунд чекати, перш ніж з'явиться кнопка «Забрати / Продовжити»

  // ── Сама реклама ──
  list:[
    {id:"ig_yyokai", on:true, title:"Підпишись на Instagram YYOKAI|Follow YYOKAI on Instagram",
     text:"Тату-майстер і автор гри. Нові ескізи та розіграші.|Tattoo artist and game author. New sketches and giveaways.",
     img:"", url:"https://instagram.com/yyokai.tattoo", btn:"Відкрити Instagram|Open Instagram", weight:3, where:"all"},

    {id:"tg_yyokai", on:true, title:"Наш Telegram-канал|Our Telegram channel",
     text:"Новини гри, промокоди й розіграші першими.|Game news, promo codes and giveaways first.",
     img:"", url:"https://t.me/yyokai", btn:"Відкрити Telegram|Open Telegram", weight:2, where:["round","arrow"]},

    // ПРИКЛАД партнерської реклами (вимкнена — постав on:true і свої дані):
    {id:"partner_example", on:false, title:"Назва партнера|Partner name",
     text:"Короткий опис пропозиції.|Short offer description.",
     img:"assets/ads/partner1.png", url:"https://example.com/?ref=inkai", btn:"Перейти|Go", weight:1, where:"all",
     from:"2026-11-01", to:"2026-11-30"}
  ]
};
