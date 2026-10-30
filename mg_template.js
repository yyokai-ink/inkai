/* ═════════════════════════════════════════════════════════════════════════════════════
   ШАБЛОН НОВОЇ МІНІ-ГРИ.  Не підключений — це просто зразок.
   1) Скопіюй цей файл:  mg_template.js → mg_моягра.js  (латиницею, без пробілів)
   2) Зміни id, name, desc, icon (або img) і напиши свою гру в функції start()
   3) Допиши "mg_моягра.js" у список MG_FILES у minigames.js — плитка зʼявиться на головному екрані
   Повна інструкція: MINIGAMES.md
   ═════════════════════════════════════════════════════════════════════════════════════ */
registerMiniGame({
  id:"template",                     // унікальний код (латиниця)
  name:"Назва гри|Game name",        // "Українською|English"
  desc:"Коротко: що робити й що отримаєш|Short: what to do and what you win",
  icon:"🎯",                         // емодзі. Або своя картинка:  img:"assets/mg_template.png"
  color:"#22c55e",                   // колір рамки плитки (необов'язково)
  badge:"NEW",                       // бейдж на плитці (необов'язково)
  order:50,                          // порядок плиток: менше = ближче до початку
  on:false,                          // true = показувати людям · false = сховано (для тесту став true)
  // from:"2026-12-01",              // (необов'язково) почати показувати з цієї дати
  // to:"2026-12-31",                // (необов'язково) прибрати після цієї дати (для сезонних ігор)
  // teaser:true,                    // (необов'язково) до дати from показувати плитку «Скоро»
  // status:()=>"Рекорд: 10",        // (необов'язково) рядок під описом на плитці
  start(){
    // Оболонка гри: повний екран з ТВОЇМ екіпірованим фоном (куплений чи з сундука) — зʼявляється автоматично
    const A=mgShell("template",`
      <div class="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <h2 class="text-2xl font-black text-neonGold">${t("Моя гра|My game")}</h2>
        <button class="btng w-full max-w-xs py-3" id="tplWin">${t("Виграти (тест)|Win (test)")}</button>
        <button class="btn w-full max-w-xs" onclick="mgClose()">${t("Закрити|Close")}</button>
      </div>`);
    A.querySelector("#tplWin").onclick=()=>{
      // Нагороди: ІНК і торії — без ліміту; нефрит (jd) і сундуки (chest = сила 1–3) — з денним лімітом MG_CAPS
      const reward=mgGrant({ink:1000,souls:1,jd:0,chest:1},"template");
      // Вікно результату: заголовок, очки, рядки, нагороди, кнопка «Ще раз» (again) і «Закрити»
      mgResult(A,{icon:"🏆",title:t("Перемога!|Victory!"),score:100,lines:[],reward,again:"mgStart('template')"});
    };
    // Корисне: фон = BG[S.bg]; для малювання на canvas — cv.getContext("2d"); зображення йокаїв — YIMG["🦊"] (assets/yokai_fox.png)
    // Інші звуки: sfx("slash"), sfx("combo"), sfx("bossdie"), sfx("reveal"), sfx("bomb"). Статистика: track("подія",{…})
  }
});
