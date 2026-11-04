# 📁 Куди класти файли — коротко й по-людськи

## Три правила
1. **Усі картинки, звуки й музика — в одну папку `assets/`** (без підпапок). Єдині винятки: реклама → `assets/ads/`, заставка `bar2.mp4` → **у корінь** (поряд з `game1.html`), нові міні-ігри → папка `games/`.
2. **Імена — латиницею, малими літерами, без пробілів**, точно як у таблиці. `Fox.PNG`, `лис.png`, `fox (1).png` гра **не побачить**.
3. Не залив файл — нічого страшного: гра покаже емодзі або синтезує звук. Заливати можна поступово.

## Як залити (GitHub)
1. Відкрий репозиторій → папку `assets` → **Add file → Upload files**.
2. Перетягни всі файли разом → **Commit changes** (за раз до 100 файлів; решту — другою порцією).
3. Відкрий у браузері `твій-сайт/assets.html` — там усі потрібні імена: **зелені = залито, сірі = ще ні**. Клік по імені копіює його.
4. Не з'явилось у грі? Оновлення з очищенням кешу (Ctrl+Shift+R; на телефоні — очистити дані сайту).

## Що → як назвати
| Що це | Ім'я файлу | Куди | Розмір |
|---|---|---|---|
| Фон вкладки | `screen_lobby.png`, `screen_games.png`, `screen_shop.png`, `screen_chests.png`, `screen_friends.png`, `screen_rewards.png`, `screen_rating.png`, `screen_profile.png` | `assets/` | 1080×1920 |
| Загальний фон | `app_bg.png` | `assets/` | 1080×1920 |
| Іконки валют | `ico_coin.png` (ІНК), `ico_jade.png` (нефрит), `ico_soul.png` (торії) | `assets/` | 128×128, прозорий |
| Іконки нижнього меню | `ico_nav_play.png`, `ico_nav_games.png`, `ico_nav_shop.png`, `ico_nav_chests.png`, `ico_nav_friends.png`, `ico_nav_rewards.png`, `ico_nav_rating.png`, `ico_nav_profile.png` | `assets/` | 96×96, прозорий |
| Йокаї (і ними ж — шари «Злиття», фішки «Маджонгу») | `yokai_fox.png`, `yokai_oni.png`, `yokai_tengu.png`, `yokai_kappa.png`, `yokai_skull.png`, `yokai_dragon.png`, `yokai_pumpkin.png` | `assets/` | прозорий PNG |
| Боси | `boss_frz.png`, `boss_slo.png`, `boss_sto.png`, `boss_bh.png` … (20 шт., див. assets.html) | `assets/` | прозорий PNG |
| Катани | `katana_0.png` … `katana_99.png` | `assets/` | 512×128, горизонтально |
| Фони для гри (куплені/з сундуків) | `bg_0.png` … `bg_99.png` | `assets/` | 1080×1920 |
| Сундуки | `chest_silver.png`, `chest_gold.png`, `chest_bonus.png` … (див. assets.html) | `assets/` | прозорий PNG |
| Музика | `music_menu.mp3`, `music_shop.mp3`, `music_chests.mp3`, `music_battle.mp3` | `assets/` | 1–3 хв, loop |
| Звуки | `sfx_slash.mp3`, `sfx_click.mp3` … (див. assets.html) | `assets/` | дуже короткі |
| Відео-фон екрана входу | `video_auth_bg.mp4` | `assets/` | MP4 H.264 без звуку, ~720×1280, 5–10 с, до 5 МБ |
| **Відео-заставка при запуску** | **`bar2.mp4`** | **у корінь** (поряд з `game1.html`) | те саме |

## Міні-ігри
| Що це | Ім'я файлу | Що робить |
|---|---|---|
| **Кулі «Злиття»** (необов'язково) | `slime_0.png` … `slime_7.png` | твоя істота лягає **всередину м'якої кулі**. 0 лис · 1 каппа · 2 тенгу · 3 оні · 4 череп · 5 дракон · 6 золотий оні · 7 Король Хякі |
| **Фішки «Маджонгу»** (окремий набір — НЕ ті, що в інших іграх) | `mj_0.png` … `mj_35.png` | малюнок фішки. Без файлу — емодзі. **0–5** лис, каппа, тенгу, оні, череп, дракон · **6–25** боси: `frz, slo, sto, bh, scr, gld, nos, mir, swm, inv, lgt, hvy, spl, shd, hea, rch, wnd, cha, cmb, vmp` · **26–35** декор 🎴🏮🌸⛩️🗡️🍶🔔🎎🪭🍡 |
| Фон вкладки «Ігри» | `screen_games.png` | див. вище |
| **Нова міні-гра** | `games/game1.js` (далі `game2.js`, `game3.js` …) | файл у папці `games/` — гра сама з'явиться у вкладці «Ігри». Інструкція — `MINIGAMES.md` |

Картинки фішок/куль: **прозорий PNG, 256–512 px, істота по центру**, важливе — ближче до центру (краї можуть трохи обрізатись формою).

## Реклама
Баннери кладуться в **`assets/ads/`** (створи папку: Add file → Create new file → набери `ads/readme.txt`). Імена будь-які, але прописати їх треба у файлі **`ads.js`**, поле `img: "assets/ads/назва.png"` (рекомендовано 600×300). Посилання, текст і частота — теж там.
