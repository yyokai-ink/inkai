# INKAI — файли: усе в ОДНІЙ папці `assets/` (без вложених папок)
Кладеш файл у `assets/` з назвою як у таблиці. Немає файлу — гра показує емодзі, запасний фон або синтезований звук. Перевірити, що вже залито: відкрий `assets.html` на своєму сайті.
**GitHub:** репозиторій → папка `assets` → Add file → Upload files → перетягни всі файли → Commit (до 100 за раз). Після заливки новий номер версії: `python3 bump.py НОВА_ВЕРСІЯ`, або просто онови сторінку (Ctrl+Shift+R).

### 🖼 Фони екранів
портрет 1080×1920. Немає — береться app_bg.png
`app_bg.png`, `screen_lobby.png`, `screen_shop.png`, `screen_chests.png`, `screen_friends.png`, `screen_rewards.png`, `screen_rating.png`, `screen_profile.png`

### 🎵 Музика
mp3, 1–3 хв, loop. Немає — грає синтезована
`music_menu.mp3`, `music_shop.mp3`, `music_chests.mp3`, `music_battle.mp3`

### 🔊 Звуки інтерфейсу
дуже короткі. Немає — синтезуються
`sfx_click.mp3`, `sfx_tab.mp3`, `sfx_buy.mp3`, `sfx_deny.mp3`, `sfx_toast.mp3`, `sfx_open.mp3`, `sfx_close.mp3`, `sfx_success.mp3`, `sfx_start.mp3`, `sfx_win.mp3`, `sfx_levelup.mp3`, `sfx_claim.mp3`, `sfx_equip.mp3`, `sfx_coin.mp3`

### ⚔️ Звуки бою й сундука
0.1–1.5 с
`sfx_slash.mp3`, `sfx_boss.mp3`, `sfx_bossin.mp3`, `sfx_bossdie.mp3`, `sfx_bomb.mp3`, `sfx_chesthit.mp3`, `sfx_chestcrack.mp3`, `sfx_tick.mp3`, `sfx_reveal.mp3`, `sfx_land.mp3`, `sfx_combo.mp3`

### 👹 Йокаї
прозорий PNG
`yokai_fox.png`, `yokai_oni.png`, `yokai_tengu.png`, `yokai_kappa.png`, `yokai_skull.png`, `yokai_dragon.png`, `yokai_pumpkin.png`

### 👑 Боси (20)
прозорий PNG
`boss_frz.png`, `boss_slo.png`, `boss_sto.png`, `… (усього 20)`

### 📦 Сундуки
PNG; open_bg — загальний фон відкриття
`chest_silver.png`, `chest_gold.png`, `chest_diamond.png`, `… (усього 42)`

### 🌌 Фони відкриття сундуків епох (37)
необов'язково
`chest_bg_jomon.png`, `chest_bg_yayoi.png`, `chest_bg_kofun.png`, `… (усього 37)`

### 🗡 Катани 0–99
горизонтально, 512×128. Усі знайдуться автоматично
`katana_0.png`, `katana_1.png`, `katana_2.png`, `… (усього 100)`

### 🏞 Фони для гри 0–99
необов'язково
`bg_0.png`, `bg_1.png`, `bg_2.png`, `… (усього 100)`

### 🧩 Іконки
замінюють емодзі
`ico_coin.png`, `ico_soul.png`, `ico_jade.png`, `ico_lantern.png`, `ico_nav_play.png`, `ico_nav_shop.png`, `ico_nav_chests.png`, `ico_nav_friends.png`, `ico_nav_rewards.png`, `ico_nav_rating.png`, `ico_nav_profile.png`

### 📸 Фото майстра
квадрат
`master_yyokai.jpg`

### 🎬 Відео (необов'язково)

`video_auth_bg.mp4`

Інше: `data/…json` більше не потрібні (катани знаходяться самі). Іконка гри лежить у корені: `Иконка1.PNG`, `Иконка3.PNG`, відео-заставка `bar2.mp4`.

### 🏰 Іконки головної (стиль Clash Royale) — необов'язково, PNG з прозорістю ~128×128
`ico_lob_event.png` (подія), `ico_lob_bonus.png` (бонус часу), `ico_nav_bestiary.png` (вкладка «Йокаї»); решта: `ico_nav_rewards.png` (розіграш), `ico_nav_friends.png`, `ico_nav_profile.png`. Немає файлу — емодзі.
