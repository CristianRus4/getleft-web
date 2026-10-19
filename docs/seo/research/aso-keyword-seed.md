# Left App Store listing locales and keyword seed data (read-only collection, 2026-10-19)

## 0. Sources and caveats

- **Nothing was written.** I only read files and ran read commands: `elevate aso …` (`app/listing/keywords`), `asc versions list`, `asc localizations list` (version and app-info), `asc apps info list`, `curl` against getleft.app, and `git show/log`.
- **App Store Connect auth works.** `asc auth doctor` shows 4 profiles OK (default "Cntxt Admin").
- **There are two App Store versions to compare.**
  - **Live:** `996ea910-ea15-4184-bfc3-6fa32b1df7d7`, version 2026.9.9, READY_FOR_DISTRIBUTION, 46 version localizations. Created 2026-10-06.
  - **Pending:** `425bd8e0-7352-43a9-87fc-6d2c976208c4`, version 2026.10, WAITING_FOR_REVIEW, 50 version localizations. Created 2026-10-13.
  - App info records: `5a33639d…` is live (49 locales) and `4b88918a…` is pending (50 locales).
  - **Keyword fields differ a lot between live and pending.** Do not treat the live set as final.
- **Web repo has no ASO keyword history.** `git log --all -- docs/aso` returns nothing, and `docs/aso` never existed in `/Users/cristian/Developer/Webs/getleft-web`. Commit 458c5d23 only moved `docs/nexus/{PROJECT,TRANSLATIONS,WEBSITE}.md` to `docs/`, replaced `docs/nexus/translation.config.json` with `docs/translation.config.json`, and deleted the nexus sync workflows and `sync.mjs`.
- **The real ASO record is in the app repo**, under `/Users/cristian/Developer/Apps/Left-app/docs/aso/`: `config.json`, `plan.json`, `product-context.md`, `research/*`, `events/*`, `listing-checks/*`, `observations/*`. I read `product-context.md`, `plan.md` and `research/2026-10-15-keyword-overhaul/cntxt800-corrected-evaluation.md`.
  - Not opened: `research/2026-10-08-nine-locale-additions/{keyword-proposal,intent-searches,candidate-decisions}.json`, `research/2026-10-14-english-localizations/README.md`, and `docs/nexus/aso` in the app repo (UNVERIFIED contents).
- **Elevate tracked keywords** (`elevate aso keywords list --app left`):
  - 2,978 rows over 43 storefronts. Every row has role=`watch`; none is `protected`, `target` or `guardrail`.
  - Only 809 rows have a popularity value (provider `astro`, plus 60 `asc-public-rank`). Observation dates are 2026-10-14 to 2026-10-18.
  - Popularity is Astro's 0-100 style score. A rank of `-` means not found. Observed ranks reach about 247, so the search depth is probably 250 (UNVERIFIED).
  - `b28:N` means rank is missing today but the best rank in the last 28 days was N.
  - **Fasting is untracked.** No tracked keyword contains fasting/intermittent/ayuno/jeûne/断食/단식. "focus" appears once (US, pop 62).
- **Elevate live-listing read (2026-10-15 to 2026-10-18).** It matches ASC live for every locale I compared, including the ones truncated in my ASC print.

## 1. Store listing locales: name, subtitle, keyword field

- **Name and subtitle** come from app info. Where live and pending differ, both are shown.
- **Keywords: LIVE** is version 2026.9.9. **PEND** is 2026.10, waiting for review.
- **Description first line:** I only checked it exists per locale; it is the "time-awareness app … your time is limited, and seeing it changes how you use it" copy translated in every locale.
- **Primary locale** is en-US. Categories are PRODUCTIVITY, with UTILITIES as secondary.
- **Auto tags** from Apple are "Device Customization" and "Timers".

### English
| Locale | Name | Subtitle | Keywords |
|---|---|---|---|
| en-US | Left: Widgets for Time Left | Countdown, Habits, Streaks | LIVE=PEND: year progress,days since,life in weeks,memento mori,adhd,planner,life calendar,date calculator,goals |
| en-AU | live: Left - Time Left Widgets / pend: Left: Widgets for Time Left | Countdown, Habits, Streaks | LIVE none / PEND: memento,mori,adhd,planner,daily,calendar,date,calculator,christmas,vacation,until,wedding,routine |
| en-CA | live: Left - Time Widgets / pend: Left: Widgets for Time Left | same | LIVE none / PEND: tracker,counter,christmas,vacation,goals,date,calculator,deadline,routine,birthday,exam,together |
| en-GB | live: Left - Countdown Tools / pend: Left: Widgets for Time Left | live: Habits, Streaks, Days Since / pend: Countdown, Habits, Streaks | LIVE none / PEND: days,since,weeks,life,year,progress,tracker,counter,exam,birthday,goals,anniversary,together,holiday |

### European
| Locale | Name | Subtitle | LIVE keywords | PEND keywords |
|---|---|---|---|---|
| de-DE | Left - Zeit-Widgets | Countdown, Tage, Gewohnheiten | year progress,days since,life in weeks,memento mori,adhd,planner,life calendar,zusammen seit | memento mori,adhs,planner,kalender,zusammen seit,urlaub,rente,jahrestag,zähler,routine,geburtstag |
| es-ES | Left - Widgets de Tiempo | Cuenta Atrás, Rachas, Hábitos | year progress,days since,life in weeks,memento mori,adhd,planner,life calendar,cumpleaños | hora,muerte,cumpleaños,tdah,rutina,objetivos,dias,contador,vida,semanas,boda,navidad,aniversario |
| es-MX | Left - Widgets de Tiempo | Cuenta Regresiva y Hábitos | …life calendar,contador,dias (same English base) | contador,dias,boda,cumpleaños,aniversario,navidad,faltan,cuantos,juntos,racha,rutina,agenda,tdah |
| fr-FR | Left - Widgets Temps | Compte à Rebours, Habitudes | …life calendar,compteur de jours | memento mori,planner,compteur,jours,combien,calendrier,vie,anniversaire,vacances,objectifs,bac,suivi |
| fr-CA | live: Left: Widgets pour Temps Rest. / pend: Left: Widgets du temps restant | Suivi d'habitudes et temps | …life calendar,anniversaire | year progress,days since,life in weeks,memento mori,adhd,planner,calendar,anniversaire,décompte |
| it | Left - Widget Tempi | Countdown, Giorni, Abitudini | days since,wiget,widgets,habit tracker,countdown app,conto alla rovescia,conta giorni,scadenze | conta,conto,rovescia,quanti,mancano,scadenze,wiget,planner,adhd,calendario,vita,obiettivi,compleanno |
| pt-BR | Left - Widgets de Tempo | Contagem Regressiva, Hábitos | …life calendar,contador,dias | contador,dias,lembretes,aniversário,casamento,natal,juntos,namoro,metas,rotina,diários,enem,prazo |
| pt-PT | Left - Widgets de Tempo | Hábitos, sequências e tempo | …life calendar,lembretes | contador,dias,faltam,quantos,lembretes,aniversário,casamento,natal,juntos,contagem,decrescente |
| nl-NL | Left: Widgets for Time Left (English fallback) | Countdown, Habits, Streaks | …life calendar,relatie teller | aftellen,relatie,teller,vakantie,dagen,sinds,planner,adhd,memento mori,kalender,verjaardag,gewoontes |
| ca | Left - Widgets Temps | Hàbits, ratxes i el teu temps | compte enrere,hàbits,ratxes,widget,planificador,dies des de,vida en setmanes,tdah,rutina | juntos,novios,calendario,progreso,año,metas,examen,vacaciones,jubilación,memento,mori,widget,pareja (Spanish words in a Catalan locale) |
| pl | Left - Widgety na czas | Odliczanie, Nawyki, Serie | countdown,timeleft,licznik,dni,kalendarz,życia,postęp,roku,memento mori,urodziny,przypomnienia | licznik,dni,kalendarz,życia,postęp,roku,memento mori,urodziny,przypomnienia,planer,matura,ślub |
| ru | Left - Виджеты времени | Обратный отсчет, привычки | countdown,timeleft,счетчик,дней,трекер,прогресс,года,недели,жизни,memento mori,привычек,отношений | счетчик,дней,трекер,привычек,отношений,widget,home,screen,lock,clock,death,stoic,hourglass,mortality |
| uk | Left - Віджети часу | Зворотний відлік, звички | countdown,timeleft,лічильник,днів,календар,життя,прогрес,року,memento mori,трекер звичок,нагадування | лічильник,днів,календар,життя,прогрес,року,memento mori,звичок,нагадування,річниця,весілля,іспит |
| ro | Left - Widgeturi Timp | Obiceiuri, serii și timp | progres an,zile de la,numărătoare inversă,viața în săptămâni,memento mori,adhd,planificator,calendar | same |
| cs | Left - Widgety pro čas | Návyky, série a čas | průběh roku,dní od,odpočet,život v týdnech,memento mori,adhd,plánovač,countdown,počítadlo dní | …plánovač,narozeniny,počítadlo |
| sk | Left - Widgety na Čas | Návyky, série a čas | priebeh roka,dní od,odpočet,život v týždňoch,memento mori,adhd,plánovač,countdown,pripomienky | …plánovač,narodeniny,pripomienky |
| da | Left - Tid tilbage-widget | Vaner, streaks og tid | årsfremgang,dage siden,nedtælling,livet i uger,memento mori,adhd,planlægger,countdown,kalender | …planlægger,fødselsdag,kalender |
| no | Left - Widget for tid | Vaner, streaks og tid | årsfremdrift,dager siden,nedtelling,livet i uker,memento mori,adhd,planlegger,countdown,kalender | …planlegger,bursdag,kalender |
| sv | Left - Widgets för tid | Vanor, streaks och tid | årsförlopp,dagar sedan,nedräkning,livet i veckor,memento mori,adhd,planerare,countdown,kalender | …planerare,födelsedag,kalender |
| fi | Left - Ajastin-widgetit | Tavat, putket ja aika | vuoden eteneminen,päivää sitten,lähtölaskenta,elämä viikkoina,memento mori,adhd,kalenteri | same |
| el | Left - Χρόνος Απομένει | Συνήθειες, σερί και χρόνος | πρόοδος έτους,μέρες από,αντίστροφη μέτρηση,ζωή σε εβδομάδες,memento mori,δεπυ,ημερολόγιο | same |
| hr | Left - Widgeti za Vrijeme | Navike, nizovi i vrijeme | napredak godine,dana od,odbrojavanje,život u tjednima,memento mori,adhd,planer,countdown,kalendar | …planer,rođendan,kalendar |
| hu | Left - Idő Widgetek | Szokások, sorozatok, idő | év előrehaladása,napok óta,visszaszámlálás,élet hetekben,memento mori,adhd,tervező,naptár | same |
| sl-SI | Left: Widgets for Time Left (English fallback) | Habit Tracker, Streaks & Time | odštevanje,navade,nizi,widget,planer,življenje,čas,adhd,opomniki | odštevanje,navade,nizi,planer,življenje,čas,adhd,opomniki,rojstni dan,obletnica,cilji,koledar |
| tr | live: Left - Zaman Süresi Wid. / pend: Left - Zaman Widget'ları | Geri Sayım, Alışkanlıklar | countdown,timeleft,gün,sayacı,yıl,ilerleme,hayat,takvim,kalan,memento mori,düğün,rutin,hatırlatıcı | gün,sayacı,yıl,ilerleme,hayat,takvim,kalan,memento mori,düğün,rutin,hatırlatıcı,sınav,hedef,tatil |

### Asia, Middle East, Indic
| Locale | Name | Subtitle | LIVE keywords | PEND keywords |
|---|---|---|---|---|
| ja | Left - 残り時間ウィジェット | カウントダウン・習慣・人生 | days since,記念日,あと何日,習慣化,習慣化アプリ,目標管理,日付計算,日数計算,記念日カウント,countdown,カウントアップ,付き合った日数,widget,習慣トラッカー,交際記念日 | 記念日,記念日カウント,習慣化アプリ,あと何日,カウントアップ,習慣トラッカー,付き合った日数,目標管理,日付計算,日数計算,日付カウントダウン,受験,結婚式,交際記念日,カレンダー,今年の残り |
| ko | Left - 남은 시간 위젯 | 디데이 위젯, 습관 기록 | …life calendar,날짜 계산기,기념일,목표 | 날짜,계산기,기념일,커플,루틴,목표,생일,잠금화면,달력,캘린더,카운트다운,수능,연애,인생,진행률,일정,만난지,며칠,시험,전역,군대,100일,졸업,여행,결혼,제대 |
| zh-Hans | Left - 时间小组件 | 倒计时・习惯打卡・人生进度 | countdown,timeleft,日期计算,纪念日,距离天数,生日倒计时,还有多少天,人生日历,倒数日,恋爱纪念日,天数计算器,日期计算器,倒计时小组件,习惯养成,生日提醒,打卡记录 | 日期计算,纪念日,距离天数,生日倒计时,还有多少天,人生日历,倒数日,恋爱纪念日,天数计算器,日期计算器,倒计时小组件,习惯养成,生日提醒,打卡记录,桌面,锁屏,时间管理,自律,目标,倒数 |
| zh-Hant | Left - 倒數計時小工具 | 習慣打卡・人生進度・紀念日 | countdown,timeleft,日期計算,距離天數,還有幾天,人生日曆,生日提醒,週年,戀愛紀念日,交往天數,倒數日,習慣養成,倒數計時器,時間管理,自律 | 日期計算,距離天數,還有幾天,人生日曆,生日提醒,週年,戀愛紀念日,交往天數,倒數日,習慣養成,倒數計時器,時間管理,自律,桌面,鎖定畫面,目標,生日,考試,學測,情侶,婚禮,畢業,退休,旅行 |
| id | Left - Widget Sisa Waktu | Hitung Mundur, Kebiasaan | countdown,timeleft,hari,penghitung,kalender,hidup,progres,tahun,memento mori,pengingat,planner | hari,penghitung,kalender,hidup,progres,tahun,memento mori,pengingat,planner,pernikahan,ujian |
| ms | Left - Widget Masa | Tabiat, streak dan masa | kira detik,tabiat,streak,widget,perancang,hari sejak,life in weeks,adhd,pengingat,countdown,kalendar | kira detik,perancang,hari sejak,adhd,pengingat,kalendar,planner,memento mori,matlamat,ulang tahun |
| th | Left - วิดเจ็ตเวลา | นับถอยหลัง สร้างนิสัย นับวัน | countdown,timeleft,ปฏิทินชีวิต,วันเกิด,วันสำคัญ,คำนวณวัน,ความคืบหน้า,memento mori,เตือนความจำ | ปฏิทินชีวิต,วันเกิด,วันสำคัญ,คำนวณวัน,ความคืบหน้า,memento mori,เตือนความจำ,ครบรอบ,สอบ,เป้าหมาย |
| vi | Left - Tiện ích thời gian | Đếm Ngược, Thói Quen | countdown,timeleft,đếm ngày,lịch cuộc đời,kỷ niệm,tiến độ,năm,memento mori,mục tiêu,nhắc nhở | ngày,kỷ niệm,nhắc nhở,counter,love,together,dating,sober,quit,tracker,routine,smoking,couple |
| ar-SA | Left - ويدجيت للوقت | العد التنازلي والعادات | countdown,timeleft,عداد الأيام,تقويم الحياة,ذكرى,تقدم,السنة,memento mori,مواعيد | birthday,anniversary,wedding,christmas,baby,graduation,retirement,trip,vacation,deadline,pregnancy (all English) |
| he | Left - ווידג'טים לזמן שנשאר | הרגלים, רצפים וזמן | התקדמות שנה,ימים מאז,ספירה לאחור,חיים בשבועות,ממנטו מורי,קשב וריכוז,מתכנן,ווידג'ט,לוח | same |
| ur-PK | (new in pending) Left - باقی وقت کے ویجیٹس | عادات، اسٹریکس اور الٹی گنتی | not in live | ramadan,eid,fasting,iftar,sehri,روزہ,رمضان,عید,دن,سالگرہ,یاد دہانی,مقصد,کیلنڈر,زندگی,شادی,امتحان |
| hi | Left - समय के लिए विजेट्स | आदतें, स्ट्रीक्स और समय | साल प्रगति,दिन गिनें,काउंटडाउन,जीवन सप्ताह,आदत ट्रैकर,स्ट्रीक,प्लानर,adhd,विजेट,life calendar | काउंटडाउन,दिन गिनें,साल प्रगति,जीवन सप्ताह,आदत ट्रैकर,कितने,बाकी,सालगिरह,widget,calendar,planner |
| bn-BD, gu-IN, kn-IN, ml-IN, mr-IN, or-IN, pa-IN, ta-IN, te-IN | name "Left: Widgets for Time Left" in English for all nine except none localized | "Habit Tracker, Streaks & Time" (English) | Native-script words for countdown/habit/streak/widget/plan/life/time/reminder, plus adhd, life calendar, countdown, planner. Example bn-BD: কাউন্টডাউন,অভ্যাস,স্ট্রিক,উইজেট,পরিকল্পনা,জীবন,সময়,adhd,রিমাইন্ডার | Same native words plus event words (e.g. te-IN: …sober,quit,smoking,motivation; mr-IN: …jee,neet,upsc,board,study; ml-IN: …diwali,festival,event) |

**Notes on the data above**
- **Locale and name differences:** live has 49 app-info locales including en-AU/CA/GB, while live version localizations carry only 46. The three English variants have no live keyword field.
- **Pending ur-PK** is new. Pending adds en-AU/CA/GB keyword fields.
- **Why English words appear in non-English fields.** `cntxt800-corrected-evaluation.md` (15 Oct 2026) says each storefront also searches extra languages. The US searches es-MX, fr-FR, pt-BR and ko; en-GB becomes an extra searched language in DE, FR, NL, IT, ES, MX, BR, KR, PT and AT. A local keyword that displaces English can cost installs.
  - US search first-time downloads rose about 72% when the extra fields were localized; local-field effects elsewhere were mixed.
  - Two 2026.11 experiments are planned, not applied: complementing the US extra fields, and restoring local terms in de-DE, es-ES, ca, nl-NL, pt-PT and fr-CA.
- **Website** currently serves hreflang for: en, de, es-ES, es-419, fr, hi, id, it, ja, ko, nl, pl, pt, ro, ru, tr, zh-Hans, zh-Hant, x-default (verified by `curl` of https://getleft.app/).
- **Website `translation.config.json`** (`/Users/cristian/Developer/Webs/getleft-web/docs/translation.config.json`) has the same locales and protected terms Left, Apple, Todoist. Its glossary has the single entry "Time Left", which the app repo's `docs/translation.config.json` pins per locale.
  - Examples: de Verbleibende Zeit, es/es-419 Tiempo restante, fr Temps restant, it Tempo restante, ja 残り時間, ko 남은 시간, nl Resterende tijd, pl Pozostały czas, pt Tempo restante, ro Timp rămas, ru Оставшееся время, tr Kalan zaman, zh-Hans 剩余时间, zh-Hant 剩餘時間, hi शेष समय, id Waktu tersisa.

## 2. Tracked keywords by storefront, top 15 by popularity

Format: `keyword [popularity / rank / intent]`. The intent label is the agent classification in Elevate: cor=core, adj=adjacent, gen=generic, amb=ambiguous. `b28:N` is the best 28-day rank, `-` is unranked. Source: Elevate keywords (Astro), observed 2026-10-14 to 2026-10-18.

- **US** (83 with popularity): countdown [72/-/cor]; habit tracker [67/-/cor]; planner [67/-/gen]; focus [62/-/gen]; lifetime [62/-/amb]; countdown widget [60/-/cor]; habit [60/-/gen]; streaks [57/-/amb]; death clock ai [55/-/amb]; reminder [55/-/gen]; love counter [53/-/adj]; birthday countdown [51/-/cor]; days since [51/-/cor]; countdown app free [49/-/cor]; countdown: widget [49/-/amb]
- **GB** (67): countdown [74]; habit tracker [66]; widget [64]; holiday countdown [63]; planner [62]; widgets [60]; goals [53]; quit smoking [52]; exam countdown [51]; days since [48]; daily planner [46]; timeleft [46/17]; count down [45]; countdown widget [45]; countdown app [42]
- **AU** (59): countdown [67]; widget [65]; habit tracker [64]; planner [60]; countdown widget [59]; widgets [57]; daily planner [54]; quit smoking [52]; days since [43]; adhd planner [38]; countdown app [35]; countdown widget free [34]; goals [34]; vacation countdown [33]; age calculator [31]
- **CA** (53): countdown [67]; habit tracker [65]; widget [65]; journal [64]; countdown widget [61]; planner [61]; agenda [58]; calendrier [57]; widgets [56]; daily planner [54]; vacation countdown [51]; left [50/2]; quit smoking [50]; timeleft [50/13]; days since [43]
- **DE** (56): countdown [71]; habit tracker [64]; widget [62]; countdown widget [59/85]; erinnerung [59]; planner [57]; widgets [57]; zusammen seit [49/59]; geburtstag [48]; timeleft [43/6]; left [41/1]; day counter [40]; days since [40/183]; habits [40]; countdown widget free [39]
- **ES** (44): countdown [73]; calendario [71]; cuenta atras [62/b28:114]; widget [60/b28:46]; habit tracker [58]; widgets [56]; widgets iphone [55]; countdown app [54]; planner [46]; timeleft [46/6]; la hora de tu muerte [41]; left [41/1]; vida [41]; countdown widget free [39]; days since [36/109]
- **IT** (40): countdown [75/95]; widget [67/146]; habit tracker [63]; diario [60]; planner [58]; countdown widget [56/29]; tempo [52]; timeleft [49/7]; widgets [41/43]; wiget [40/46]; conto alla rovescia [37/b28:100]; days since [37/66]; left [34/1]; goals [33]; habit tracker free [32]
- **FR** (39): calendrier [71]; countdown [68]; widget [68]; compte à rebours [61/142]; journal [61]; habit tracker [60]; planner [57]; timeleft [55/7]; widgets [53/203]; goals [41]; habits [39]; countdown app [36]; countdown widget [36/78]; days since [34]; vacances [34]
- **JP** (35): 記念日 [69/147]; カウントダウン [68/186]; widget [51/166]; planner [49]; countdown widget [48/b28:187]; timeleft [44/9]; countdown [43/234]; days since [42/b28:97]; widgets [42/102]; 習慣化アプリ [41/224]; 記念日カウント [39/168]; 習慣化 [36/171]; カレンダー ウィジェット [35]; あと何日 [34]; カウントアップ [28]
- **CN** (27): 倒数日 [83/149]; 倒计时 [73]; 小组件 [69/b28:129]; countdown [67]; 纪念日 [67/240]; 桌面小组件 [63]; widget [60]; countdown app [54]; countdown widget [48]; 倒数 [44]; 恋爱纪念日 [41/188]; 打卡记录 [39]; 日期计算器 [39/b28:184]; 时间管理 [38]; 自律打卡 [35]
- **BR** (24): planner [63]; widget [61]; lembretes [59]; calendário [57]; contagem regressiva [56]; countdown [56]; habit tracker [56]; widgets [56]; countdown widget [48]; timeleft [47/16]; widgets iphone [44]; vida [37]; contador de dias [30]; day counter widget [24/b28:208]; habitos diarios [15]
- **MX** (23): calendario [68]; countdown [62]; agenda [61]; recordatorios [61]; widget [60/199]; embarazo [57]; widgets [57/b28:234]; habit tracker [55]; habitos [53/244]; vida [53]; cuenta regresiva [52]; cronometro [49]; widgets iphone [48/168]; contador de dias [47/b28:51]; boda [43]
- **KR** (19): 디데이 [83]; 디데이 위젯 [66/b28:205]; 루틴 [66]; 일정 [64]; 기록 [60]; 날짜 [58/239]; 날짜 계산기 [54/82]; 커플 디데이 [53]; countdown app [47]; widget [42/b28:159]; timeleft [40/16]; countdown [38]; planner [38]; 기념일 [38/b28:86]; 목표 [31]
- **RU** (17): дневник [69]; календарь [68]; трекер привычек [60]; счетчик дней [53]; счетчик отношений [53/209]; обратный отсчет [51]; widget [45]; countdown app [44]; countdown [43]; отсчет дней [42/b28:129]; widgets [39]; сколько мы вместе [38]; цели [32]; обратный отсчёт [24]; сколько дней осталось [23]
- **NL** (16): countdown [75/b28:214]; widget [68/b28:67]; habit tracker [66]; planner [63]; kalender [59]; countdown widget [58/199]; aftellen [57]; widgets [54/143]; relatie teller [48/66]; timeleft [40/7]; days since [37/81]; day counter [36]; habits [36]; vakantie aftellen [30]; countdown app [29/b28:148]
- **TW** (15): 倒數日 [71/103]; 紀念日 [63]; 倒數 [62]; timeleft [58/b28:25]; 戀愛紀念日 [55/218]; 倒數計時 [53/b28:224]; widget [48/77]; 交往天數 [46/62]; countdown [40]; widgets [38/103]; 小工具 [36]; 時間管理 [30/b28:239]; 自律 [26]; 倒數計時器 [22/64]; 習慣養成 [19/b28:122]
- **TR** (12): countdown [59]; günlük [58]; widget [58]; hatırlatıcı [54]; gün sayacı [53]; geri sayım [52]; tatil [49]; düğün geri sayım [45]; timeleft [39/6]; widgets [39]; rutin [19]; countdown widget [16]
- **PL** (10): countdown [64/b28:167]; odliczanie dni [61/39]; dziennik [59]; przypomnienia [59/85]; licznik dni [55/149]; odliczanie [54/47]; wakacje [52]; days since [36/62]; countdown widget [32/57]; urodziny [22/65]
- **ID** (6): widget [63/170]; catatan [62]; countdown [59/b28:160]; planner [36/b28:167]; pengingat [27]; widgets [23/185]
- **IN** (7, all English): age calculator [54]; widget [47]; life calendar [46]; widgets [45]; countdown [44]; countdown widget [44/163]; planner [43]
- **CH** (12): countdown [69]; widget [63]; planner [56]; countdown widget [54/202]; widgets [42/b28:159]; timeleft [36/11]; death clock [35]; compte à rebours [33]; days since [29/b28:240]; wochenplaner [24]; lifetime [21/b28:80]; countdown app [20/b28:186]
- **Nordics:** NO kalender [74]; countdown [71]; dagbok [60]; påminnelse [57]; nedtelling [56/b28:227]; adhd [38]; days since [38]; planlegger [21]. DK kalender [74]; nedtælling [62/67]; dagbog [61]; countdown [59]; påmindelse [56]; adhd [40]; days since [40/170]. SE kalender [73]; countdown [69]; dagbok [61]; påminnelse [58]; nedräkning [54/86]; adhd [40]; days since [39/135]. FI kalenteri [67]; päiväkirja [56]; days since [35/155]; adhd [29].
- **Others (few entries):**
  - **CZ:** countdown [62]; připomínky [59]; kalendář [57]; deník [56]; left [53/1]; days since [34/154]; adhd [33/235]; plánovač [24/b28:233].
  - **SK:** countdown [59]; pripomienky [54/184]; days since [30/122]; adhd [25].
  - **HR:** kalendar [66/198]; countdown [63]; planer [58]; days since [23/88]; adhd [20/222].
  - **HU:** naptár [70/b28:163]; emlékeztető [58]; napló [58]; days since [32/157]; adhd [28].
  - **RO:** calendar [69]; jurnal [56]; days since [34/75]; adhd [30/192].
  - **SI:** widget [45/90]; planer [44]; days since [22/77]; adhd [19/173].
  - **PT:** lembretes [58]; calendário [52]; vida [35]; days since [29/145].
  - **VN:** lịch [72]; countdown [55/119]; đếm ngày [54/46]; nhắc nhở [32/30]; mục tiêu [20/126].
  - **TH:** countdown [58]; บันทึก [35]; เตือนความจำ [34/23].
  - **IL:** יומן [65]; לוח שנה [65/72]; ספירה לאחור [57/146]; days since [31/b28:247].
  - **UA:** трекер звичок [66/236]; щоденник [63]; нагадування [61/70]; widget [58]; countdown [57]; обратный отсчет [54/24]; трекер привычек [43]; days since [33/88]; timeleft [29/16].
  - **SA:** countdown [69/126]; التقويم الهجري [64]; timeleft [58/8]; حياة [58]; time left [55/4]; widget [55/b28:144]; العد التنازلي [54/b28:15]; planner [42]; مواعيد [42/b28:99].
  - **AE:** countdown [59/b28:53]; widget [57/b28:23]; تقويم [35/b28:207]; العد التنازلي [32/b28:36]; countdown widget [32/114]; days since [28/114].
  - **EG:** countdown [73]; timeleft [57/6]; widget [57]; countdown widget [55]; العد التنازلي [53].
  - **SG:** countdown [58]; widget [58]; planner [54]; timeleft [49/5]; countdown widget [41]; widgets [38/104]; age calculator [37]; 倒数日 [35/40]; 倒计时 [27/140].
  - **MY:** countdown [70/180]; widget [66/116]; countdown widget [56/58]; planner [56]; 倒数日 [47]; nota [41]; kalendar [39/83]; widgets [39/24].
  - **NZ:** countdown app [69]; widget [68]; countdown widget [64]; countdown [61]; habit tracker [61]; widgets [54]; timeleft [38/18]; days since [34]; holiday countdown [23].
  - **GR:** days since [27] only.

**Cross-market data points**
- `timeleft` ranks 4-18 in about 20 storefronts. These ranks come from a keyword that is in the live keyword field in a few locales; the ASC fields above are the evidence for which.
- `left` ranks #1-2 in DE, CA, ES, IT, CZ, so the brand name ranks.
- Strongest page-one data is local-term ranks: 날짜 계산기 (KR) 82, العد التنازلي (SA) b28:15, đếm ngày (VN) 46, 交往天數 (TW) 62, odliczanie dni (PL) 39.

## 3. Seed glossary per language, topics 1-10

Tags: **[D]** = tracked keyword with popularity, so it comes from data (the number is the best storefront popularity). **[L]** = appears only in the live or pending listing text or keyword field (no popularity data). **[N]** = my own linguistic suggestion, no evidence in either source (UNVERIFIED).

Topics: countdown/days until, widget, habit tracker, streak, goal/aim, time left/life calendar/year progress, date calculator, fasting, focus timer, ADHD.

**English (US/GB/AU/CA)**
- countdown: countdown [D 74], countdown app [D 42], countdown widget [D 60], days until [D 9], how many days until [D 11 AU], days left [D 8], days since [D 51], holiday countdown [D 63], exam countdown [D 51], birthday countdown [D 51], vacation countdown [D 51]
- widget: widget [D 65], widgets [D 60]
- habit: habit tracker [D 67], habit [D 60]
- streak: streaks [D 57], streak tracker [D 31], streak counter [D 17]
- goal: goals [D 53], goal tracker [D 8], aim [D 9]
- time left: timeleft [D 58], time left [D 55 SA], life calendar [D 46 IN], year progress [D 10; L], life in weeks [L], memento mori [L; D 9], death clock [D 35]
- date calc: age calculator [D 54], date calculator [D 7; L], date counter [D 16]
- fasting: [N] intermittent fasting timer, fasting tracker, fasting widget (zero tracked)
- focus: focus [D 62 US]; [N] focus timer, pomodoro
- ADHD: adhd planner [D 38], adhd [L]

**German (de)**
- countdown: countdown [D 71], countdown widget [D 59], tage bis [D 7], tage zählen [D 10], tage zähler [D 7], days since [D 40], zusammen seit [D 49], Countdown/Tage [L subtitle]
- widget: widget [D 62], widgets [D 57], Zeit-Widgets [L]
- habit: habit tracker [D 64], habits [D 40], Gewohnheiten [L], routine [L]
- streak: streak [D 7]
- goal: goals [D 32], ziele [D 6]
- time left: timeleft [D 43], Verbleibende Zeit [glossary], year progress/life calendar/life in weeks (English kept) [L]
- date calc: date countdown [D 6]
- ADHD: adhs planer [D 24], adhs [L pending]
- fasting/focus: [N] Intervallfasten, Fokus-Timer

**Spanish (es-ES, es-MX/419)**
- countdown: cuenta atrás [D 62 ES], cuenta regresiva [D 52 MX], countdown [D 73], contador de dias [D 47 MX], días para / faltan [L pending], cuántos días [L]
- widget: widget [D 60], widgets iphone [D 55]
- habit: habit tracker [D 58], hábitos [D 53 MX], rutina [L]
- streak: racha [D 14], rachas [L]
- goal: metas diarias [D 11], objetivos [L]
- time left: timeleft [D 46], la hora de tu muerte [D 41], vida [D 41], semanas/vida [L], tiempo restante [glossary]
- date calc: [N] calculadora de fechas
- ADHD: tdah [D 31 ES], [L]
- fasting/focus: [N] ayuno intermitente, temporizador de enfoque

**French (fr)**
- countdown: compte à rebours [D 61], countdown [D 68], days until [D 9], combien de jours [L], compteur de jours [L], vacances [D 34]
- widget: widget [D 68], widgets [D 53]
- habit: habit tracker [D 60], habits [D 39], suivi d'habitudes [L]
- streak: streak [D 6], [N] série
- goal: goals [D 41], objectifs [D 6]
- time left: timeleft [D 55], vie [D 26], memento mori [D 9], temps restant [glossary]
- date calc: [N] calcul de dates
- ADHD: adhd [L], [N] TDAH
- fasting/focus: [N] jeûne intermittent, minuteur de concentration

**Italian (it)**
- countdown: countdown [D 75], conto alla rovescia [D 37], quanti giorni mancano [D 8], conta giorni [L], days since [D 37]
- widget: widget [D 67], wiget [D 40], widgets [D 41]
- habit: habit tracker [D 63], abitudini [L]
- streak: streak [D 8]
- goal: obiettivi [D 13], goals [D 33]
- time left: timeleft [D 49], tempo restante [glossary], calendario/vita [L]
- ADHD: adhd [L]
- date calc/fasting/focus: [N]

**Portuguese (pt-PT/pt-BR)**
- countdown: contagem regressiva [D 56 BR], contador de dias [D 30], faltam / quantos dias [L], countdown [D 56]
- widget: widget [D 61]
- habit: habit tracker [D 56], hábitos [L], habitos diarios [D 15], rotina [L]
- streak: streak [D 7]; sequências [L pt-PT]
- goal: metas [D 13]
- time left: timeleft [D 47], vida [D 37], tempo restante [glossary]
- date calc: days since [D 29 PT]; rest [N]
- ADHD/fasting/focus: [N] (adhd absent from pt keyword fields)

**Dutch (nl)**
- countdown: aftellen [D 57], countdown [D 75], vakantie aftellen [D 30], relatie teller [D 48], days since [D 37], day counter [D 36]
- widget: widget [D 68], widgets [D 54]
- habit: habit tracker [D 66], gewoontes [L]
- streak/goal/date calc/fasting/focus: [N]
- time left: timeleft [D 40], resterende tijd [glossary]
- ADHD: adhd [L]

**Polish (pl)**
- countdown: odliczanie dni [D 61, rank 39], odliczanie [D 54], licznik dni [D 55], countdown [D 64], days since [D 36]
- widget: [L] widgety
- habit: nawyki [L]
- streak: serie [L]
- time left: pozostały czas [glossary]
- other topics: [N]

**Russian (ru)**
- countdown: обратный отсчет [D 51], счетчик дней [D 53], отсчет дней [D 42], сколько дней осталось [D 23], счетчик отношений [D 53], сколько мы вместе [D 38]
- habit: трекер привычек [D 60], привычек [L]
- goal: цели [D 32]
- widget: widget [D 45]; виджеты [L]
- time left: оставшееся время [glossary], жизни/недели/прогресс года [L]
- other topics: [N]

**Turkish (tr)**
- countdown: geri sayım [D 52], gün sayacı [D 53], düğün geri sayım [D 45], countdown [D 59]
- widget: widget [D 58]
- habit: alışkanlıklar [L], rutin [D 19]
- goal: hedef [L]
- time left: kalan zaman [glossary]
- other topics: [N]

**Japanese (ja)**
- countdown: カウントダウン [D 68], あと何日 [D 34], カウントアップ [D 28], 記念日 [D 69], 記念日カウント [D 39], days since [D 42]
- widget: widget [D 51], ウィジェット [L], カレンダー ウィジェット [D 35]
- habit: 習慣化アプリ [D 41], 習慣化 [D 36], 習慣トラッカー [L]
- goal: 目標管理 [D 21]
- time left: 残り時間 [glossary], 人生 [L], life left [D 10]
- date calc: 日付計算 [D 18], 日数計算 [D 17]
- streak, fasting, focus, ADHD: [N]

**Korean (ko)**
- countdown: 디데이 [D 83], 디데이 위젯 [D 66], 커플 디데이 [D 53], 기념일 [D 38]
- widget: 위젯 [L]
- habit: 루틴 [D 66], 습관 [L]
- goal: 목표 [D 31]
- time left: 남은 시간 [glossary]
- date calc: 날짜 계산기 [D 54, rank 82], 날짜 [D 58]
- other topics: [N]

**Simplified Chinese (zh-Hans)**
- countdown: 倒数日 [D 83], 倒计时 [D 73], 倒数 [D 44], 还有多少天 [L], 距离天数 [L], 纪念日 [D 67]
- widget: 小组件 [D 69], 桌面小组件 [D 63]
- habit: 打卡记录 [D 39], 习惯养成 [L], 自律打卡 [D 35]
- time left: 人生日历 [L], 剩余时间 [glossary]
- date calc: 日期计算器 [D 39], 天数计算器 [D 26], 时间管理 [D 38]
- other topics: [N]

**Traditional Chinese (zh-Hant)**
- countdown: 倒數日 [D 71], 倒數 [D 62], 倒數計時 [D 53], 倒數計時器 [D 22], 還有幾天 [L], 距離天數 [L], 紀念日 [D 63], 交往天數 [D 46]
- widget: 小工具 [D 36]
- habit: 習慣養成 [D 19]
- goal: 目標 [L]
- time left: 人生日曆 [L], 剩餘時間 [glossary]
- date calc: 日期計算 [L], 時間管理 [D 30], 自律 [D 26]
- other topics: [N]

**Indonesian (id)**
- countdown: countdown [D 59], hitung mundur [L subtitle], penghitung [L], hari [L]
- widget: widget [D 63]
- habit: kebiasaan [L]
- goal/time left: waktu tersisa [glossary]; hidup/progres tahun [L]
- other topics: [N]

**Hindi (hi)** (no tracked data)
- countdown: काउंटडाउन [L], दिन गिनें [L], कितने बाकी [L]
- widget: विजेट [L]
- habit: आदत ट्रैकर [L], आदतें [L]
- streak: स्ट्रीक [L]
- time left: शेष समय [glossary], साल प्रगति [L], जीवन सप्ताह [L]
- ADHD: adhd [L]
- others: [N]

**Romanian (ro)**
- countdown: numărătoare inversă [L], zile de la [L], days since [D 34]
- habit: obiceiuri [L]
- time left: timp rămas [glossary], viața în săptămâni [L], progres an [L]
- ADHD: adhd [D 30]

**Not in the website's locales but in the listing:** ar, he, vi, th, ca, cs, da, no, sv, fi, el, hr, hu, sk, sl, uk, ms, ur-PK and the 8 other Indic locales. Their terms are in section 1 [L] and section 2 [D].

## 4. Gaps for the plan

- **No data at all for fasting or focus timer.** Only "focus" (US, pop 62) is tracked. The 2026.10 pending field only has fasting in ur-PK. `product-context.md` calls focus and planning adjacent fit, not direct.
- **ADHD is tracked everywhere but the keyword is weak.** Popularity is 19-40. It sits in about 20 locale keyword fields, and ranks are poor (adhd rank 173-235 in several countries).
- **Streak is low volume.** "streak" is 6-8 popularity in most markets except "streaks" in the US (57) and "streak tracker" (31).
- **Highest-value terms by popularity for the site:** countdown / countdown widget / habit tracker / planner / widget in English storefronts; 디데이, 倒数日/倒數日, 記念日/カウントダウン in East Asia; calendrier/calendario/kalender-type generic terms are popular but marked generic, so low fit.
- **Left does not rank well for most core terms.** Few core countdown or habit-tracker keywords have a rank under 100.

Key file paths: `/Users/cristian/Developer/Apps/Left-app/docs/aso/` (`config.json`, `product-context.md`, `plan.md`, `research/2026-10-15-keyword-overhaul/cntxt800-corrected-evaluation.md`), `/Users/cristian/Developer/Apps/Left-app/docs/translation.config.json`, `/Users/cristian/Developer/Webs/getleft-web/docs/translation.config.json`.
