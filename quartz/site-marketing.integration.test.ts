import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"
import { canonicalUrlForSlug } from "./util/seo"

test("production homepage exposes the English canonical and configuration contract", () => {
  assert.equal(
    canonicalUrlForSlug("en.catoblepaspress.ru", "index"),
    "https://en.catoblepaspress.ru/",
  )
  assert.equal(
    canonicalUrlForSlug("en.catoblepaspress.ru", "published/biastape"),
    "https://en.catoblepaspress.ru/published/biastape",
  )

  const config = readFileSync(join(process.cwd(), "quartz.config.yaml"), "utf8")
  assert.match(config, /locale: en-US/)
  assert.match(config, /baseUrl: en\.catoblepaspress\.ru/)
  assert.match(config, /provider: plausible/)

  const componentResources = readFileSync(
    join(process.cwd(), "quartz", "plugins", "emitters", "componentResources.ts"),
    "utf8",
  )
  assert.match(componentResources, /plausibleHost[^]*https:\/\/plausible\.io/)
  assert.match(componentResources, /script\.manual\.js/)
  assert.match(componentResources, /setAttribute\('data-domain', location\.hostname\)/)
  assert.match(componentResources, /document\.addEventListener\('nav'[^]*plausible\('pageview'\)/)
})

test("homepage offers the current English publishing and project routes", () => {
  const homepage = readFileSync(join(process.cwd(), "content", "index.md"), "utf8")
  const bookclub = readFileSync(join(process.cwd(), "content", "projects", "bookclub.md"), "utf8")

  assert.match(homepage, /title: Catoblepas Press/)
  assert.match(homepage, /\[\[published\/index\|books\]\]/)
  assert.match(homepage, /\[\[journal\/index\|journal\]\]/)
  assert.match(homepage, /\[\[bookclub\|Book Club\]\]/)
  assert.match(homepage, /\[\[filmclub\|Film Club\]\]/)
  assert.match(homepage, /## Contacts/)
  assert.match(bookclub, /## Book list/)
  assert.match(bookclub, /## Join/)
  assert.match(bookclub, /Telegram chat/)
})

test("English legal and contact navigation mirrors the current site structure", () => {
  const documents = readFileSync(join(process.cwd(), "content", "documents", "index.md"), "utf8")
  const privacy = readFileSync(join(process.cwd(), "content", "documents", "privacy.md"), "utf8")
  const cookies = readFileSync(join(process.cwd(), "content", "documents", "cookies.md"), "utf8")
  const contacts = readFileSync(join(process.cwd(), "content", "contacts.md"), "utf8")
  const orderPage = readFileSync(join(process.cwd(), "content", "published", "biastape.md"), "utf8")
  const robots = readFileSync(join(process.cwd(), "content", "robots.txt"), "utf8")

  assert.match(documents, /\[\[privacy\|Privacy Policy\]\]/)
  assert.match(documents, /\[\[cookies\|Cookies and Third-Party Services\]\]/)
  assert.match(documents, /\[\[personal-data-consent\|Consent to Personal Data Processing\]\]/)
  assert.match(documents, /\[\[editorialpolicy\|Editorial Policy\]\]/)
  assert.match(privacy, /en\.catoblepaspress\.ru/)
  assert.match(privacy, /Plausible’s Data Policy/)
  assert.doesNotMatch(privacy, /Yandex|Яндекс/)
  assert.match(cookies, /does not use cookies, browser cache, or local storage/)
  assert.match(contacts, /ungh@catoblepaspress\.ru/)
  assert.match(contacts, /vox@catoblepaspress\.ru/)
  assert.match(orderPage, /\[\[documents\/privacy\|Privacy Policy\]\]/)
  assert.match(
    orderPage,
    /\[\[documents\/personal-data-consent\|Consent to Personal Data Processing\]\]/,
  )
  assert.match(robots, /https:\/\/en\.catoblepaspress\.ru\/sitemap\.xml/)
})

test("English interviews index links only to translated interview routes", () => {
  const interviews = readFileSync(join(process.cwd(), "content", "interviews", "index.md"), "utf8")
  const lebedev = readFileSync(
    join(process.cwd(), "content", "interviews", "evgeny-lebedev-poetry.md"),
    "utf8",
  )
  const medvedev = readFileSync(
    join(process.cwd(), "content", "interviews", "evgeny-medvedev-artistic-perception.md"),
    "utf8",
  )
  const navka = readFileSync(
    join(process.cwd(), "content", "interviews", "marusya-navka-kosaya-beyka.md"),
    "utf8",
  )

  assert.match(interviews, /title: Interviews/)
  assert.match(interviews, /\[\[evgeny-lebedev-poetry\|“I would prefer/)
  assert.match(interviews, /\[\[evgeny-medvedev-artistic-perception\|/)
  assert.match(interviews, /\[\[marusya-navka-kosaya-beyka\|/)
  assert.match(lebedev, /youtube-nocookie\.com\/embed\/QFdVHm2m6Yw/)
  assert.match(lebedev, /\[\[№ 21 \(7\)\|issue 21\]\]/)
  assert.match(lebedev, /\[\[mistakes\|Mistakes of Youth\]\]/)
  assert.match(lebedev, /Interview by \[\[asp\|Aleksandr Spiridonov Jr\.\]\]/)
  assert.match(medvedev, /t\.me\/catoblepaspress\/175\?embed=1/)
  assert.match(medvedev, /\[\[№ 21 \(7\)\|issue 21\]\]/)
  assert.match(medvedev, /\[\[medvedevartist\|Evgeny Medvedev\]\]/)
  assert.match(medvedev, /## The Academy as a space for self-education/)
  assert.match(medvedev, /## The search for new possibilities/)
  assert.match(medvedev, /New Ideas in Visual Art/)
  assert.doesNotMatch(medvedev, /\[\[new-ideas-in-art\|/)
  assert.match(navka, /t\.me\/catoblepaspress\/247\?embed=1/)
  assert.match(navka, /\[\[№ 55 \(9\)\|/)
  assert.match(navka, /\[\[biastape\|/)
  assert.match(navka, /\[\[voxcatoblepae\|/)
  assert.equal((navka.match(/^## /gm) ?? []).length, 9)
})

test("English footer contains no Russian or obsolete cookie controls", () => {
  const footer = readFileSync(join(process.cwd(), "quartz", "components", "CustomFooter.tsx"), "utf8")
  assert.match(footer, /Created by/)
  assert.doesNotMatch(footer, /Создано|О cookie|cookie-settings/)
})

test("English journal index includes the current translated issues", () => {
  const journal = readFileSync(join(process.cwd(), "content", "journal", "index.md"), "utf8")
  const issue34 = readFileSync(join(process.cwd(), "content", "journal", "№ 34 (8).md"), "utf8")
  const issue55 = readFileSync(join(process.cwd(), "content", "journal", "№ 55 (9).md"), "utf8")

  assert.match(journal, /\[\[№ 34 \(8\)\|Issue № 34 \(8\)\]\]/)
  assert.match(journal, /\[\[№ 55 \(9\)\|Issue № 55 \(9\)\]\]/)
  assert.match(issue34, /data-telegram-post="catoblepaspress\/189"/)
  assert.match(issue34, /description: Thirty-fourth issue/)
  assert.match(issue55, /data-telegram-post="catoblepaspress\/247"/)
  assert.match(issue55, /\[\[biastape\|Bias Tape\]\]/)
})

test("Almighty is published as a clearly labelled Chapter 1 excerpt", () => {
  const almighty = readFileSync(join(process.cwd(), "content", "publications", "almighty.md"), "utf8")
  const publications = readFileSync(join(process.cwd(), "content", "publications", "index.md"), "utf8")

  assert.match(almighty, /description: A science-fiction novella — an excerpt from Chapter 1/)
  assert.match(almighty, /## Chapter 1/)
  assert.match(almighty, /Several weeks ago, Almighty disappeared\./)
  assert.match(almighty, /mailto:ungh@catoblepaspress\.ru/)
  assert.match(almighty, /translating or licensing the complete novella/)
  assert.match(publications, /\[\[almighty\|Almighty\]\] \(excerpt from Chapter 1\)/)
})

test("The Bridge on the Drina review is translated and linked from the English site", () => {
  const review = readFileSync(join(process.cwd(), "content", "publications", "thebridgeonthedrina.md"), "utf8")
  const publications = readFileSync(join(process.cwd(), "content", "publications", "index.md"), "utf8")
  const bookclub = readFileSync(join(process.cwd(), "content", "projects", "bookclub.md"), "utf8")

  assert.match(review, /Filipp Dvornik, 13 May 2026/)
  assert.match(review, /Every generation nourishes its own illusions about civilization/)
  assert.match(review, /And at last came 1914/)
  assert.match(review, /translated into English for this publication/)
  assert.match(publications, /Filipp Dvornik — \[\[thebridgeonthedrina\|The Bridge on the Drina\]\]/)
  assert.match(bookclub, /\[\[thebridgeonthedrina\\\|The Bridge on the Drina\]\]/)
})

test("English books catalogue mirrors current editions and ordering status", () => {
  const books = readFileSync(join(process.cwd(), "content", "published", "index.md"), "utf8")
  const medvedev = readFileSync(join(process.cwd(), "content", "published", "new-ideas-in-art.md"), "utf8")
  const lePetit = readFileSync(join(process.cwd(), "content", "published", "lebordeldesmuses.md"), "utf8")
  const biasTape = readFileSync(join(process.cwd(), "content", "published", "biastape.md"), "utf8")
  const anxiety = readFileSync(join(process.cwd(), "content", "published", "anxiety.md"), "utf8")
  const mistakes = readFileSync(join(process.cwd(), "content", "published", "mistakes.md"), "utf8")
  const editions = readFileSync(join(process.cwd(), "content", "published", "editions.base"), "utf8")

  assert.match(books, /!\[\[editions\.base\]\]/)
  assert.match(books, /\[\[new-ideas-in-art\|New Ideas in Visual Art/)
  assert.match(books, /mailto:ungh@catoblepaspress\.ru/)
  assert.match(medvedev, /status: Forthcoming/)
  assert.match(medvedev, /evgeny-medvedev-artistic-perception/)
  assert.match(lePetit, /status: Published/)
  assert.match(lePetit, /lebordeldesmuses\.epub/)
  assert.match(biasTape, /status: Available to order/)
  assert.match(biasTape, /Pre-order complete/)
  assert.match(biasTape, /\[!info\] How to order/)
  assert.match(biasTape, /kosaya-beyka-74111291/)
  assert.match(biasTape, /\[!warning\] 18\+/)
  assert.match(biasTape, /\[\[interviews\/marusya-navka-kosaya-beyka\|interview with Marusya Navka\]\]/)
  assert.doesNotMatch(biasTape, /420 RUB/)
  assert.match(anxiety, /author: Evgeny Lebedev/)
  assert.match(anxiety, /year: 2025/)
  assert.match(anxiety, /status: Published/)
  assert.match(mistakes, /author: Evgeny Lebedev/)
  assert.match(mistakes, /year: 2024/)
  assert.match(mistakes, /status: Published/)
  assert.match(editions, /displayName: Title/)
  assert.match(editions, /name: Cards/)
  assert.doesNotMatch(medvedev, /^cover:.*\[\[/m)
  assert.doesNotMatch(lePetit, /^cover:.*\[\[/m)
  assert.doesNotMatch(biasTape, /^cover:.*\[\[/m)
  assert.doesNotMatch(anxiety, /^cover:.*\[\[/m)
  assert.doesNotMatch(mistakes, /^cover:.*\[\[/m)
})
