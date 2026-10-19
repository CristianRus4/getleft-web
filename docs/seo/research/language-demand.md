# Language and topic evidence for getleft.app (research memo, read-only)

Evidence gathered 2026-10-19. I changed no files and ran no write commands. StatCounter figures are all "September 2026, all platforms" unless noted. The WebSearch tool is not a true Google SERP, so item 3 shows who gets indexed and surfaced, not verified Google ranks. Treat those rankings as UNVERIFIED.

## 0. Current state of the site (read from the repo and live site)

- **Localized homepages and support:** The repo has 18 locale folders. These are de, es, es-419, fr, hi, id, it, ja, ko, nl, pl, pt, ro, ru, tr, zh-Hans and zh-Hant. Each holds 32 files: `index.html`, `contact.html`, `support.html` and about 29 `support/*.html` pages (`git ls-files de` in `/Users/cristian/Developer/Webs/getleft-web`).
- **Tools and blog are English-only:** `git ls-files | grep -c '^de/tools'` returns 0. `tools/` has 60 files, including `age-calculator.html`, `days-between-two-dates.html` and `christmas-countdown-widget.html`. `blog/` has 48 files, including `adhd-body-doubling-apps.html`, `adhd-morning-routine-iphone.html` and `adhd-reward-system.html`.
- **Hreflang is live, and it includes `es-419`:** `curl https://getleft.app/` shows `hreflang` entries for x-default, en, es-ES, es-419, de, fr, it, pt, ja, nl, pl, tr, ru, zh-Hans, zh-Hant, ko, id, ro and hi. `sitemap.xml:9` and `sitemap.xml:32` also use `es-419`.
- **`es-419` is probably invalid:** My WebFetch of Google's hreflang page says "codes like `es-419` aren't supported". I did not read that line in the original, so verify it. If it holds, Google may ignore those annotations. `es-MX` would be the valid alternative.
- **Missing Hindi/Portuguese regionality:** There is no `pt-BR` versus `pt-PT` split and no `en-IN` or `hi-IN` region codes.

## 1. India: English or Hindi?

**What the sources show**
- **Search share:** StatCounter has Google at 96.63% of Indian search (September 2026), with Bing at 1.92% ([StatCounter India](https://gs.statcounter.com/search-engine-market-share/all/india)). Google is the only engine that matters, so the language question comes down to query language.
- **I found no current English-versus-Hindi split of Google queries.** Treat that as UNVERIFIED. The old Google figures are:
  - Local-language searches were 2% of searches in 2014 and 20% in 2019, covering all Indian languages combined (2020 "Year in Search" coverage via [Think with Google](https://thinkwithgoogle.com/intl/en-apac/marketing-strategies/search/year-in-search-2020-india)).
  - Hindi smartphone queries were up 2.3x, and Google expected Indian-language users to be about 75% of internet users by 2021 ([Inc42, 9 May 2019](https://inc42.com/buzz/most-of-india-prefers-using-hindi-for-search-says-google)). That is a Google forecast and has not been checked against later data.
- **IAMAI/Kantar:** About 57% of users prefer Indian languages, with Hindi first ([Business Standard](https://www.business-standard.com/india-news/use-of-indian-languages-key-for-increasing-internet-access-in-india-report-124031000395_1.html)). Another outlet describes the 57% as urban users ([The Week/PTI](https://www.theweek.in/wire-updates/business/2025/01/16/dcm51-biz-iamai-internet-usage-report.amp.html)). The two framings conflict. The same report counts 886M active users.
- **iPhone owners skew premium:** Apple reached a record 9% of Indian smartphone shipments in 2025, and phones above ₹30,000 were 23% of shipments (Counterpoint, via a [Yahoo Finance summary](https://finance.yahoo.com/news/apple-iphone-just-had-best-050000323.html)). The same search says 60% of iPhone sales come from outside tier-1 cities. I found no data on the English share among iPhone owners (UNVERIFIED).
- **Web content is mostly English:** 55.6% of domains use English as their main language ([Rest of World, 2023](https://restofworld.org/stat-of-the-day/internet-languages-web)).

**Judgement (my inference, not sourced):**
- India is 21% of Left's downloads, and iPhone owners there are mostly English-comfortable.
- Indian users also tend to search app and tool topics in English or mixed Hinglish.
- A `/hi/` site will likely draw little organic traffic. The existing `hi/` homepage and support pages are cheap to keep, but I would not expand them into tools or blog.
- Better India levers are English pages with India-flavoured topics, such as date formats (dd/mm/yyyy), festival countdowns (Diwali, Holi), and exam-date countdowns.
- **Recommendation:** English carries India. Confidence: medium. The 21% share is solid, but the English-versus-Hindi split rests on inference.

## 2. Search-engine share and Google SEO viability by language

| Language / market | StatCounter, Sep 2026 | Google SEO viable? |
|---|---|---|
| Spanish, Spain | Google 93.81%, Bing 3.49% ([Spain](https://gs.statcounter.com/search-engine-market-share/all/spain)) | Yes |
| Spanish, Mexico | Google 88.08%, Bing 9.43% ([Mexico](https://gs.statcounter.com/search-engine-market-share/all/mexico)) | Yes |
| Portuguese, Brazil | Google 88.41%, Bing 9.63% ([Brazil](https://gs.statcounter.com/search-engine-market-share/all/brazil)) | Yes |
| Portuguese, Portugal | Google 87.34%, Bing 10.18% ([Portugal](https://gs.statcounter.com/search-engine-market-share/all/portugal)) | Yes, but small market |
| Chinese, mainland | Baidu 46.65%, Bing 21.76%, Yandex 14.98%, Haosou 12.26%, Google 1.46% ([China](https://gs.statcounter.com/search-engine-market-share/all/china)) | No. Google is blocked on the mainland (one source says since 2010). Google SEO would not reach these users. |
| Chinese, Hong Kong | Google 90.44% ([HK](https://gs.statcounter.com/search-engine-market-share/all/hong-kong)) | Yes (zh-Hant) |
| Chinese, Taiwan | Google 79.48%, Yahoo 11.37%, Bing 8.24% ([Taiwan](https://gs.statcounter.com/search-engine-market-share/all/taiwan)) | Yes (zh-Hant) |
| Japanese | Google 59.27%, Bing 31.41%, Yahoo Japan 7.61% ([Japan](https://gs.statcounter.com/search-engine-market-share/all/japan)) | Yes. Bing is unusually large on desktop (June 2026: Bing 46.69%, Google 45.9%), and Google is 77.61% on mobile in July 2026 (search snippets of StatCounter). |
| Korean | Google 47.97%, Naver 43.06% ([Korea](https://gs.statcounter.com/search-engine-market-share/all/south-korea)) | Partial. StatCounter on mobile (July 2026, search snippet) has Naver 68.18% and Google 27.33%. InternetTrend (July 2026) has Naver 66.69% and Google 26.10%. Naver SEO is a different discipline, and Naver favours its own blog and café content. |
| Russian | Yandex 70.33%, Google 28.12% ([Russia](https://gs.statcounter.com/search-engine-market-share/all/russian-federation)) | Weak. Google reaches about 28% of searchers, and Yandex needs separate optimisation. Left's 20 top storefronts do not include Russia. |
| Turkish | Google 73.42%, Yandex 25.19% ([Turkey](https://gs.statcounter.com/search-engine-market-share/all/turkey)) | Yes, though Yandex is meaningful |
| Indonesian | Google 92.26% ([Indonesia](https://gs.statcounter.com/search-engine-market-share/all/indonesia)) | Yes |
| Thai | Google 99.37% ([Thailand](https://gs.statcounter.com/search-engine-market-share/all/thailand)) | Yes |
| Vietnamese | Google 92.99%, Cốc Cốc 5.92% ([Viet Nam](https://gs.statcounter.com/search-engine-market-share/all/viet-nam)) | Yes |
| Arabic (Saudi Arabia) | Google 94.46% ([Saudi Arabia](https://gs.statcounter.com/search-engine-market-share/all/saudi-arabia)) | Yes. Left has no Arabic storefront in its top 20 and the site has no Arabic. |
| German (reference) | Google 87.84%, Bing 6.49% ([Germany](https://gs.statcounter.com/search-engine-market-share/all/germany)) | Yes |
| French (reference) | Google 88.16%, Bing 5.47% ([France](https://gs.statcounter.com/search-engine-market-share/all/france)) | Yes |

Caveats:
- StatCounter measures page-view referrals, not queries.
- The Korea and Japan device splits come from search snippets, not from the StatCounter pages I fetched.
- Korea's overall figure (Google 47.97%) is much higher than other sources show for Naver, because the measurement methods differ.

## 3. Who ranks for date-calculator, countdown and habit queries (localized)

These came from WebSearch, so the order and ranks are UNVERIFIED. Each row lists the localized query and the domains returned.

| Query | Domains surfaced |
|---|---|
| German: `Tage bis Weihnachten Countdown` | abacktools.com/de, miniwebtool.com/de, Apple App Store listings, futurezone.at (a news site) |
| German: `Altersrechner Tage zwischen zwei Daten berechnen` | finanz-tools.de, rechner-portal.de, smart-rechner.de, miniwebtool.com/de, omnicalculator.com/de, tool.teamzlab.com/de, alucare.fr/de |
| Spanish: `cuántos días faltan para Navidad calculadora de edad` | hacecuentas.com (several pages), omnicalculator.com/es, news sites (elsalvador.com, radioagricultura.cl, tusbuenasnoticias.com) |
| French: `calculer nombre de jours entre deux dates calculateur d'âge` | calendriergratuit.fr, omnicalculator.com/fr, alcuinfonds.be, gambin.co, App Store |
| Japanese: `日数計算 2つの日付の間 年齢計算 クリスマスまであと何日` | App Store (日付電卓 and others), miniwebtool.com/ja, toolsbase.dev/ja |
| Portuguese: `calculadora de dias entre datas calcular idade quantos dias faltam para o Natal` | valorfinal.com.br, numerando.com.br, omnicalculator.com/pt, miniwebtool.com/br, calculacentro.com |
| German habit: `Gewohnheiten tracker App iPhone ADHS Habit Tracker deutsch` | App Store listings (Productive, Today, Calma ADHS), mwm.ai, appfollow.io, clickup.com/de |
| Spanish habit: `app para TDAH rutinas hábitos mejores apps` | geekflare.com/es, tuapppara.com, ar-pay.com, wwwhatsnew.com, evernote.com/es-es, App Store |
| Japanese countdown widget: `カウントダウン ウィジェット iPhone おすすめ アプリ 習慣 記録` | App Store, lifehacker.jp, mwm.ai, app-liv.jp |
| German widget: `Countdown Widget iPhone App Tage bis Urlaub` | App Store (Countsy, Countdown Widget and others), appgefahren.de |

**Reading the evidence (my inference):**
- **Incumbents are weak.** timeanddate and calculator.net did not appear in any of these six languages. Omni Calculator and miniwebtool appear in nearly every language. Other hits are small national calculator sites (hacecuentas, calendriergratuit, valorfinal, finanz-tools), so localized tool pages look rankable against small sites.
- **Machine-translated tool sites are indexed.** miniwebtool, toolsbase, teamzlab and abacktools all carry localized pages. That shows such pages get indexed, not that they rank well.
- **Countdown-widget queries are dominated by App Store listings**, so the opportunity is in tools and informational pages, not "widget" money terms.
- **Habit/ADHD queries are dominated by listicles and App Store pages.** Quality local editorial content is the opening there.

## 4. Google guidance on localized and programmatic pages

- **Scaled content abuse:** Pages generated at scale mainly to manipulate rankings, with little value to users, are spam. The page names AI generation as one method. It also lists "synonymizing, translating, or other obfuscation techniques" among automated transformations that produce many pages from others' content. Source: [Spam policies](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content) (via WebFetch summary).
- **Doorway abuse:** Pages made to rank for similar queries and funnel users to a less useful destination. Examples include near-duplicate regional or city pages. Source: [Spam policies, doorway abuse](https://developers.google.com/search/docs/essentials/spam-policies#doorway-abuse) (anchor inferred).
- **Generative AI content:**
  - AI is allowed if it adds value.
  - Fact-check outputs.
  - Mass-producing AI pages without adding value may violate the scaled-content policy.
  - The page says nothing on machine translation.
  - Source: [Using generative AI content](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content).
- **Hreflang:**
  - Annotations must be reciprocal and self-referencing.
  - Use fully qualified URLs.
  - Add `x-default` for a fallback.
  - Use one method (HTML, headers or sitemap) and not several.
  - Localized versions count as duplicates only if the main content stays untranslated.
  - Source: [Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions).
- **Multilingual pages:** Google detects language from visible content, not `lang` or the URL. Use one language per page, and avoid translating only the boilerplate. Source: [Managing multi-regional sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites).
- **Enforcement context:** Secondary sources describe the June 2026 spam update as applying to all languages and regions. I could not confirm this on Google's own pages (UNVERIFIED).
- **Implication:** Localized tool pages are fine if each has real localized content, such as local date formats, local holidays and local examples, and is not a word-for-word swap. Mass-producing hundreds of near-identical per-city or per-keyword variants is the risk.

## 5. Recommended language priority

Priority is by Left's downloads, Google reach and competition, in order. Each row also says which content to build.

1. **English (India, US, UK, Canada, Australia): confidence high.**
   - Covers about 50% of downloads (India 21%, US 17%, UK 5%, Canada 3.4%, Australia 3.1%).
   - Put effort into more English tools and the blog first.
   - Treat India-specific topics as English content.
2. **German: confidence high.**
   - 5% of downloads and Google at 87.84%.
   - German tool queries are served by small and generic sites.
   - Localize the top 5 to 10 tools and 2 to 3 ADHD/habit posts.
3. **Spanish, split Spain and Mexico: confidence high.**
   - Spain 3.2% and Mexico 4%; Google is 94% and 88% there.
   - Fix hreflang first: replace `es-419` with `es-MX` if Google rejects it.
   - Localize tools and habit content.
4. **French: confidence medium-high.** 3.5% of downloads. Localize the tools.
5. **Italian: confidence medium.** 3% of downloads. Search results for it were not checked.
6. **Brazilian Portuguese: confidence medium.** 1.6% of downloads, Google 88%. The site's `pt` page does not distinguish Brazil from Portugal, so use `pt-BR`.
7. **Japanese: confidence medium.** 1.2% of downloads. Google is only 59% overall, and Bing is large on desktop. Japanese tool sites are mostly App Store pages and miniwebtool.
8. **Traditional Chinese (Hong Kong and Taiwan): confidence medium-low.**
   - Hong Kong is 1.5% of downloads and Google is 90%.
   - zh-Hans for the mainland is not worth Google SEO, because Google is blocked there. The 1% of China downloads come from the App Store.
9. **Turkish, Indonesian, Thai, Vietnamese: confidence low-medium.** Each is about 1% of downloads or less, and Google is the main engine in all four. Keep the homepage and support pages. Vietnamese and Thai are not on the site at all.
10. **Korean: confidence low.** Not in the top 20 downloads, and Naver is about two-thirds of mobile search.
11. **Russian: confidence low.** Not in the top 20, and Yandex holds about 70% of search.
12. **Arabic: confidence low.** Not in the top 20 and not on the site.
13. **Hindi: confidence low-medium.** Keep the existing pages, but do not expand.

## Gaps (UNVERIFIED)

- **Language share:** I found no current English-versus-Hindi split of Google queries in India, and no data on the English share among iPhone owners.
- **Real SERPs:** I did not observe real Google SERPs. WebSearch is US-only, so the localized rankings in section 3 are unconfirmed.
- **Search volumes:** I did not check keyword search volumes. The Elevate and aso-engine tools were out of scope for this task.
- **hreflang and `es-419`:** I did not confirm the `es-419` claim in Google's original text.
