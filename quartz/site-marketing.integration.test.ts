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
