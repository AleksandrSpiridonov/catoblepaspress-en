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
