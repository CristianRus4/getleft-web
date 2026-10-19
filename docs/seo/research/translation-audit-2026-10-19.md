# getleft.app locale translation audit (read-only, 2026-10-19)

## 0. Method and caveats
- **Sources read.** Built pages `<loc>/index.html` and `<loc>/support/widget-iphone-home-screen.html`, the catalogs `i18n/locales/<loc>.json`, `docs/translation.config.json`, `i18n/README.md`, `partials/detect.html` and the headers of `scripts/patch-support-seo.mjs` and `scripts/apply-support-translations.mjs`. I wrote nothing.
- **Built pages match the catalogs and the live site.** Every value I compared was identical between the build and the catalog. A `curl` of `/de/`, `/ja/support/widget-iphone-home-screen` and `/zh-Hans/support/widget-iphone-home-screen` returned the same titles. The live zh-Hans page contains "尖端" twice.
- **What I could not verify.**
  - Apple's official localized UI terms below (Home Screen, Live Activities) come from my own knowledge, not Apple's glossary files: **UNVERIFIED**.
  - Search phrasing marked [N] in the seed data is my own judgement: **UNVERIFIED**.
  - I did no SERP or Search Console checks.

## 1. Cross-cutting evidence

**Home page**
- **English source.** Title "Left - Time Left, Habits, Focus, Fasting & Widgets for iPhone" (61 chars). Meta "Track time, habits, streaks, aims, fasting, focus sessions, and moods in Left…" (165 chars). These come from `index.html:39-40`. The h1 "See your time left, make it count" is at `index.html:330`, and the hero subtitle at `:331`.
- **Locales don't follow one title pattern.**
  - **"…Countdowns & Widgets":** de, fr, ko, nl, ro, ru, tr, zh-Hans, zh-Hant.
  - **"…Focus, Fasting":** es, es-419, hi, id, it, ja, pl, pt.
- **Titles and metas are too long for search results.**
  - Latin-script titles are 65-77 chars against roughly 60 visible.
  - Latin-script metas are 184-241 chars against roughly 155. For example fr is 73/241, es 75/225, ro 76/220 and it 77/217.
  - Every one starts with the glossary term ("Verbleibende Zeit", "Tiempo restante", "残り時間"…). None of those is a tracked search term.
- **The top local search terms never appear anywhere in the catalogs** (counted with grep across the whole catalog):

  | Locale | Missing term (seed popularity) | Count |
  |---|---|---|
  | ko | 디데이 (83) | 0 |
  | ko | 날짜 계산 | 0 |
  | zh-Hans | 倒数日 (83) | 0 |
  | zh-Hans | 打卡 | 0 |
  | zh-Hant | 倒數日 (71) | 1 |
  | ja | あと何日 | 0 |
  | ja | 習慣化 | 0 |
  | ja | 記念日 (69) | 3 |
  | de | Tage zählen | 0 |
  | de | Tage bis | 0 |
  | de | Gewohnheitstracker | 1 |
  | es / es-419 | contador de días | 0 |
  | pl | odliczanie dni (61, rank 39) | 0 |
  | pl | licznik dni | 0 |
  | ru | счётчик дней | 0 |
  | ru | трекер привычек | 0 |
  | tr | gün sayacı | 0 |
  | it | quanti giorni | 0 |
  | pt | contador de dias | 0 |

- **"Moods" is rendered with Apple's HealthKit "State of Mind" term.** Examples: de "Gemütszustand", fr "états d'esprit", ja "心の状態", zh "心理状态", ko "마음 상태", id "kondisi pikiran". That is accurate to the product, but it misses how people search (Stimmung, humeur, 気分, 心情, 기분, suasana hati).
- **43 English `alt`/`aria-label` strings appear unchanged on every locale home page.** Examples: "Habit tracker widgets in Left" and "Ahead countdown widgets showing dates worth looking forward to". The nav brand `aria-label="Left home"` is also English.

**Support article `widget-iphone-home-screen`**
- **The metadata was machine-translated with "iPhone Home Screen" left in English.** This holds in 15 of 17 locales; only fr and nl localized it.
- **The pattern repeats across the support set.** In 15 locales, 6 support titles and 7-9 descriptions per locale contain English "Home Screen", "Lock Screen" or "Notification Center". fr and nl have 2 titles and 0 descriptions.
- **Title and h1 contradict each other.** For example de has title "iPhone Home Screen" but h1 "iPhone-Startbildschirm".
- **Cause.** `scripts/patch-support-seo.mjs` rewrote the English meta. `scripts/apply-support-translations.mjs` then pushed translations from `support-meta-translations.json`, and that is visibly MT-quality.

**Links and `<html lang>`**
- `<html lang>` matches every locale: `es-ES` on /es/, `es-419`, `pt`, `zh-Hans`, `zh-Hant`.
- Canonicals point to the page itself (for example `https://getleft.app/de/support/widget-iphone-home-screen`).
- hreflang is complete, including x-default.
- Nav "Hilfe" and "Kontakt" point to `/de/support.html` and `/de/contact.html`, and support articles link to localized articles (35 localized links per article).
- **English fallbacks on every locale:**
  - nav/footer `/tools/` ("Werkzeuge"), even though `i18n/README.md` claims the tools pages are translated; no `<loc>/tools/` folder exists;
  - `/press.html` ("Presse");
  - `/privacy.html`;
  - `/tools/life-expectancy-calculator` from support.html.
- **No `og:locale` tag.** The JSON-LD `Organization.description` is in English on locale pages, and `MobileApplication.name` repeats the long page title instead of "Left".
- **Brazilian visitors get European Portuguese.** `partials/detect.html:18` (`p.indexOf('pt') === 0 → 'pt'`) sends pt-BR browsers to /pt/, which is configured as pt-PT. The hreflang is the generic `pt`, so Google treats it as Portuguese for all regions.

## 2. Scorecard

The "Search terms" column checks whether the title and meta use the words people actually search.

| Locale | Score | (a) Literal vs transcreated | Search terms | (c) Register vs config | (d) Errors |
|---|---|---|---|---|---|
| de | 3 | Home transcreated well. Support meta is MT. | Weak. Has "Countdowns", "Gewohnheiten". Missing Tage zählen, Gewohnheitstracker, Countdown App. | Informal du, consistent (config: informal). | Title/meta mix English "Home Screen" with "Startbildschirm"; Apple DE is "Home-Bildschirm" (UNVERIFIED). "Bestelle deine Werkzeuge neu" = "order again" (`de.json:479`). "Veranstaltung" for event, 7x, against "Ereignis" 46x. |
| es (es-ES) | 2 | Literal. Title/meta identical to es-419. | Missing "cuenta atrás" in title/meta. | Config informal, but support meta has 13 formal ("su/sus/Vea") and 14 informal. Title "a **su** iPhone", meta "a **tu**… **Vea**". | LatAm terms in es-ES: "agregar" 37x, "cuenta regresiva" 6x, "Actividades en Vivo" (`es.json:47`); Apple ES is "en directo" (UNVERIFIED). Support title says "agregar", h1 says "añadir". 1019 of 1294 strings identical to es-419. |
| es-419 | 3 | Literal. | Missing "cuenta regresiva" and "contador de días" in title/meta. | Same formal/informal split as es. | Leaks es-ES "cuenta atrás" (`es-419.json:613`). Support meta "iPhone Home Screen". |
| fr | 4 | Mostly transcreated. "Prends de bonnes habitudes" is natural. Support meta fully localized. | Has "comptes à rebours". Missing "compteur de jours", "combien de jours", "suivi d'habitudes". | Consistent tu (0 vous strings). | "Suis le temps" reads ambiguously. Meta is 241 chars, the longest. |
| hi | 3 | Literal, Sanskritized: "शेष समय", "उद्देश्य" for aims (means "purpose"). | IN storefront searches are all English or Hinglish. The Devanagari title misses "countdown", "habit tracker", "life calendar". | आप only (no config). | Support title "iPhone Home Screen". Spelling flips between बनाएं and बनाएँ. |
| id | 2 | Literal. | Has "hitung mundur" in subtitle only; it is missing from title/meta. | Home h1 uses "kamu", but feature h2 and all support meta use "Anda" (21 of 29). | Streak rendered three ways: rentetan, runtutan, streak. Broken word order "Lihat sekilas Left hitung mundur" (`id.json:983`). "Layar Beranda" is Android-ish; Apple uses "Layar Utama" (UNVERIFIED). |
| it | 3 | Literal but fluent. | Missing "conto alla rovescia" in title/meta (it is in the body 45x). Missing "quanti giorni mancano". | Informal, consistent. | Support title "iPhone Home Screen". "schermata principale" where Apple says "schermata Home" (UNVERIFIED). |
| ja | 3 | Home h1 natural ("大切に使おう"). "なる" alone is odd. "目的" for aims; aim h2 "数えられる限りの目標" is a mistranslation. | Title "残り時間、習慣、集中、断食" misses カウントダウン, 記念日, あと何日, 習慣化. | Neutral, fine. | Support title "iPhone Home Screen にウィジェット…". |
| ko | 3 | Mixed. "당신의 시간, 보이게." and "되어가세요" are awkward literals. | Major miss: 디데이 (83) and 날짜 계산기 appear nowhere. | Polite, fine. | "라이브 액티비티" (`ko.json:47`); Apple KR is "실시간 현황" (UNVERIFIED). Streak rendered as 연속 기록, 스트릭, 연속. Support title "iPhone Home Screen". |
| nl | 4 | Transcreated home. Support meta localized. | Has "aftellers". Should use "aftellen", "relatie teller", "vakantie aftellen". | Informal je, consistent. | "gewoontes" (title) vs "gewoonten" (meta, h2). Support title says "beginscherm", h1 says "startscherm". |
| pl | 3 | Literal, fluent. | Missing "odliczanie dni" and "licznik dni" (best page-one data). | Informal, consistent. | Support meta "do urządzenia iPhone Home Screen" = "to the device iPhone Home Screen" (`pl.json:983`). "passy" (meta) vs "serie" (subtitle). "post" for fasting is ambiguous. |
| pt (pt-PT) | 2 | Literal hybrid of pt-BR and pt-PT. | "contagem regressiva" is pt-BR; pt-PT is "contagem decrescente". | Config informal tu, but "você" 124 vs "teu/tua" 199. Home "Vê o teu…" vs "Construa…proteja…alcance" (`pt.json:96`). | pt-BR forms: "Atividades ao Vivo" (`pt.json:47`; pt-PT is "em direto", UNVERIFIED), "regressiva" 60x, gerunds ("Alterando"). Gender error "na ecrã inicial" (`pt.json:985`); should be "no ecrã principal". Support "Tuas contagens…" and "Configure teu". |
| ro | 2 | Mixed. | Has "numărători inverse". Missing "zile de la", "câte zile". | Home informal ("Urmărește") but feature h2 and support 28 of 29 formal ("adăugați", "dvs."). Not set in config. | "Observă. Acționează. Devii." uses indicative "you become", not imperative "Devino" (`ro.json:59,73`). "widget-uri" (title) vs "widgeturi" (meta). Support "Vedeți dintr-o privire Left numărătoarea" has broken order. |
| ru | 3 | Mostly literal. "Видь" is an unidiomatic imperative. | Has "обратные отсчёты". Missing "счётчик дней", "трекер привычек", "сколько дней осталось". | Config formal, but h1, eyebrow, og, habits h2 and steps use ты-imperatives (Видь, Делай, Сделай, Формируй, Замечай; `ru.json:53,65,86,173`), while meta and subtitle use вы. | Support title "на ваш iPhone Home Screen". "главный экран" where Apple says «Домой» (UNVERIFIED). |
| tr | 2 | Home h1 transcreated well ("değerini bil"). Support is MT. | Has "geri sayımlar". Missing "gün sayacı" (53). | Home meta informal "et", aim h2 and support formal "edin". | Brand suffixes broken: "Left'yu" 54x, "Left'nun" 14x, "Left'da" 13x, "Left'yi" 7x (correct: Left'i, Left'in, Left'te; `tr.json:307,324`). "iPhone Home Screen Cihazınıza" = "to your iPhone Home Screen device" (`tr.json:982,907`). "Zamanın, görünür kılındı." is ungrammatical (`tr.json:85`). English "Settings → Account" left in body. |
| zh-Hans | 2 | Literal. | Title "剩余时间、习惯、倒计时" misses 倒数日 (83), 小组件 in the meta sense, 纪念日, 打卡. | 你 on home, 您 in support (16 of 29). | "Tips" → "尖端" ("sharp point"; `zh-Hans.json:990`, live). 35 ASCII commas between CJK characters, e.g. h1 "看见剩余时间,让它值得" (`:53`). 小部件 258x vs Apple's 小组件 45x. Streak rendered as 连续记录, 连胜, 连击. Support title "iPhone Home Screen". |
| zh-Hant | 3 | Literal but fluent. | Has 倒數 and 小工具. Missing 倒數日, 紀念日, 交往天數 (rank 62). | 你 on home, 您 in support. | 32 ASCII commas, e.g. "你的時間,變得可見。" (`zh-Hant.json:85`). 連擊 vs 連續紀錄. Support title "iPhone Home Screen". |

**Brand handling.** "Left" is kept as "Left" everywhere, which is correct. Exceptions:
- the Turkish case suffixes above;
- "Aim" stays English in the habits chip but is translated in the aim chip (ro "obiectiv" lowercase, tr "hedef", id "tujuan"). That breaks the feature-name consistency.

## 3. Suggested titles and metas

Titles are about 60 chars or fewer and metas about 155 or fewer. Support title first, then home.

- **de**
  - Home title: "Left – Countdown-App & Gewohnheitstracker fürs iPhone"
  - Home title (alt): "Left – Tage zählen, Countdown & Habit Tracker Widgets"
  - Meta: "Zähle Tage bis Urlaub, Geburtstag oder Rente, tracke Gewohnheiten und Serien und sieh deine verbleibende Zeit als Widget auf iPhone und Apple Watch."
  - Support: "iPhone-Widget zum Home-Bildschirm hinzufügen | Left"
- **es (es-ES)**
  - Home title: "Left: cuenta atrás, hábitos y widgets para iPhone"
  - Meta: "Cuenta atrás de días para tu viaje, boda o cumpleaños, crea hábitos y rachas y mira tu tiempo restante en widgets de iPhone y Apple Watch."
  - Support: "Cómo añadir un widget a la pantalla de inicio del iPhone | Left"
- **es-419**
  - Home title: "Left: cuenta regresiva, hábitos y widgets para iPhone"
  - Meta: "¿Cuántos días faltan? Cuenta regresiva y contador de días para tu boda, viaje o cumpleaños, más hábitos y rachas en widgets de iPhone y Apple Watch."
  - Support: "Cómo agregar un widget a la pantalla de inicio del iPhone | Left"
- **fr**
  - Home title: "Left : compte à rebours, habitudes et widgets iPhone"
  - Meta: "Compte les jours avant tes vacances, un anniversaire ou le bac, suis tes habitudes et séries, et vois ton temps restant en widget sur iPhone."
- **it**
  - Home title: "Left: conto alla rovescia, abitudini e widget iPhone"
  - Meta: "Quanti giorni mancano a vacanze, compleanno o esami? Conto alla rovescia, conta giorni, abitudini e serie nei widget per iPhone e Apple Watch."
  - Support: "Come aggiungere un widget alla schermata Home dell'iPhone | Left"
- **pt (pt-PT)**
  - Home title: "Left: contagem decrescente, hábitos e widgets iPhone"
  - Meta: "Quantos dias faltam para as férias, o casamento ou o Natal? Contagem decrescente, contador de dias, hábitos e sequências em widgets para iPhone."
  - Support: "Como adicionar um widget ao ecrã principal do iPhone | Left"
  - Separately, add a pt-BR locale ("contagem regressiva", "Tela de Início").
- **nl**
  - Home title: "Left: aftellen, gewoontes en widgets voor iPhone"
  - Meta: "Tel af naar je vakantie, verjaardag of trouwdag, houd gewoontes en reeksen bij en zie je resterende tijd in widgets op iPhone en Apple Watch."
  - Support: "Een widget toevoegen aan het beginscherm van je iPhone | Left"
- **pl**
  - Home title: "Left: odliczanie dni, nawyki i widżety na iPhone'a"
  - Meta: "Odliczanie dni do wakacji, ślubu czy matury, licznik dni, nawyki i serie w widżetach na iPhone'a i Apple Watch. Zobacz, ile czasu ci zostało."
  - Support: "Jak dodać widżet do ekranu początkowego iPhone'a | Left"
- **ru (formal)**
  - Home title: "Left: обратный отсчёт, счётчик дней и привычки на iPhone"
  - Meta: "Сколько дней осталось до отпуска, свадьбы или дня рождения? Обратный отсчёт, счётчик дней, трекер привычек и виджеты для iPhone и Apple Watch."
  - Support: "Как добавить виджет на экран «Домой» iPhone | Left"
- **tr**
  - Home title: "Left: Geri Sayım, Gün Sayacı ve iPhone Widget'ları"
  - Meta: "Tatile, düğüne ya da sınava kaç gün kaldı? Geri sayım, gün sayacı, alışkanlık takibi ve serileri iPhone ve Apple Watch widget'larında gör."
  - Support: "iPhone Ana Ekranına Widget Nasıl Eklenir? | Left"
- **ja**
  - Home title: "Left - カウントダウン・記念日・習慣化ウィジェット"
  - Meta: "あと何日？記念日・受験・旅行までカウントダウン。付き合った日数のカウントアップや習慣化、ストリークもiPhoneとApple Watchのウィジェットで。"
  - Support: "iPhoneのホーム画面にウィジェットを追加する方法 | Left"
- **ko**
  - Home title: "Left - 디데이 위젯, 습관 기록, 남은 시간"
  - Meta: "기념일·수능·전역까지 디데이 카운트다운, 만난 지 며칠인지 커플 디데이, 습관과 루틴 기록까지 iPhone 위젯과 Apple Watch에서."
  - Support: "iPhone 홈 화면에 위젯 추가하는 방법 | Left"
- **zh-Hans**
  - Home title: "Left - 倒数日、纪念日、习惯打卡桌面小组件"
  - Meta: "距离生日、考试、纪念日还有多少天？倒数日、恋爱纪念日、习惯打卡与人生进度，放上 iPhone 桌面小组件和 Apple Watch。"
  - Support: "如何在 iPhone 主屏幕添加小组件 | Left"
- **zh-Hant**
  - Home title: "Left - 倒數日、紀念日、習慣打卡小工具"
  - Meta: "距離生日、考試、紀念日還有幾天？倒數日、交往天數、習慣打卡與人生進度，放上 iPhone 主畫面小工具與 Apple Watch。"
  - Support: "如何在 iPhone 主畫面加入小工具 | Left"
- **hi**
  - Home title: "Left - काउंटडाउन, आदत ट्रैकर और iPhone विजेट्स"
  - Meta: "जन्मदिन, शादी या परीक्षा में कितने दिन बाकी? काउंटडाउन, दिन गिनें, आदत ट्रैकर और स्ट्रीक्स iPhone विजेट्स और Apple Watch पर।"
  - Support: "iPhone होम स्क्रीन पर विजेट कैसे जोड़ें | Left"
- **id**
  - Home title: "Left - Hitung Mundur, Kebiasaan & Widget iPhone"
  - Meta: "Berapa hari lagi menuju ulang tahun, pernikahan, atau ujian? Hitung mundur, penghitung hari, kebiasaan, dan streak di widget iPhone dan Apple Watch."
  - Support: "Cara Menambahkan Widget ke Layar Utama iPhone | Left"
- **ro**
  - Home title: "Left: numărătoare inversă, obiceiuri și widgeturi iPhone"
  - Meta: "Câte zile mai sunt până la vacanță, nuntă sau examen? Numărătoare inversă, zile de la, obiceiuri și serii în widgeturi pentru iPhone și Apple Watch."
  - Support: "Cum adaugi un widget pe ecranul principal al iPhone-ului | Left"

## 4. Top 10 cross-locale problems, ranked by impact
1. **Home titles and metas lead with the glossary term ("Time Left" equivalents) instead of searched terms.** They miss 디데이, 倒数日/倒數日, odliczanie dni, gün sayacı, счётчик дней, あと何日, Tage zählen and similar in every locale. They are also too long: titles 65-77 chars and metas 184-241. This affects all 17 locales.
2. **Support metadata is MT with English "Home Screen", "Lock Screen" and "Notification Center"** in 15 locales (6 titles and 7-9 descriptions each). It produces nonsense such as tr "Home Screen Cihazınıza" and pl "do urządzenia iPhone Home Screen". Titles also contradict h1s. Cause: `apply-support-translations.mjs` and `support-meta-translations.json`.
3. **pt is a pt-BR/pt-PT hybrid, and all pt-BR visitors are routed to it** (`partials/detect.html:18`, hreflang `pt`). The bigger Brazil market gets European Portuguese mixed with Brazilian forms; pt-PT users get "Atividades ao Vivo" and "contagem regressiva".
4. **es-ES and es-419 are 79% identical** (1019 of 1294 strings): the same home title and meta, and LatAm terms in es-ES ("agregar" 37x, "regresiva" 6x, "Actividades en Vivo"). The two hreflang variants give Google little reason to differ.
5. **Register violations of `translation.config.json` and on-page mixing.**
   - ru (formal in config) uses ты on the h1 and steps.
   - pt mixes tu and você.
   - es support meta mixes su and tu.
   - ro, tr and id switch from informal on home to formal in feature h2 and support.
   - zh-Hans and zh-Hant use 你 on home and 您 in support.
6. **Hard errors visible on live pages.**
   - zh-Hans "尖端" for "Tips".
   - ro "Devii" in the main section heading.
   - de "Bestelle deine Werkzeuge neu".
   - tr "Zamanın, görünür kılındı."
   - pt "na ecrã inicial".
   - id and ro broken word order in support metas.
7. **Turkish brand suffixes on "Left" are wrong** about 90 times ("Left'yu" 54x, "Left'nun", "Left'da", "Left'yi"). Correct forms are Left'i, Left'in, Left'te, Left'e.
8. **Terminology inconsistency inside a single page.**
   - Streak: zh-Hans has three terms, ko three, id three, pl passy/serie.
   - Widget: zh-Hans 小部件 258x vs 小组件 45x.
   - nl gewoontes/gewoonten, beginscherm/startscherm; ro widget-uri/widgeturi.
   - Aim is kept as English "Aim" in one chip and translated in another.
9. **Non-Apple platform terms where Apple's iOS terms are what users see.** Examples: ko "라이브 액티비티", de "Startbildschirm", it "schermata principale", id "Layar Beranda", es-ES "Actividades en Vivo". "Moods" is rendered as Apple's State-of-Mind term rather than the searched "mood" word. The Apple terms themselves are UNVERIFIED against Apple's glossaries.
10. **Localized pages leak to English.**
    - On every locale: nav and footer `/tools/` (no localized tools exist, despite `i18n/README.md`), `/press.html`, `/privacy.html`.
    - 43 English image `alt`/`aria` strings per home page.
    - JSON-LD Organization description in English; no `og:locale`; zh-Hans and zh-Hant with 35 and 32 ASCII commas between CJK characters.

What is fine: `<html lang>`, canonicals and hreflang clusters are correct on every locale, and support and contact links are localized.
