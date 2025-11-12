import { simplifySlug } from "../../util/path"

declare global {
  interface Window {
    quartzLang?: string
    quartzLanguages?: string[]
  }
}

const STORAGE_KEY = "preferredLanguage"
const SUPPORTED_LANGUAGES = ["ru", "en"] as const

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

function normalizeToSlug(pathname: string): string {
  const normalized = pathname.replace(/^\/|\/$/g, "")
  return normalized === "" ? "index" : normalized
}

function detectLanguageFromSlug(slug: string): SupportedLanguage {
  const normalized = simplifySlug(slug)
  const [firstSegment] = normalized.split("/")
  if (SUPPORTED_LANGUAGES.includes(firstSegment as SupportedLanguage)) {
    return firstSegment as SupportedLanguage
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage
  }

  return SUPPORTED_LANGUAGES[0]
}

function applyLanguage(lang: SupportedLanguage) {
  window.quartzLang = lang
  window.quartzLanguages = [...SUPPORTED_LANGUAGES]
  localStorage.setItem(STORAGE_KEY, lang)

  const locale = lang === "ru" ? "ru" : "en"
  document.documentElement.setAttribute("lang", locale)
  document.documentElement.dataset.language = lang
}

function handleLanguageSwitch(link: HTMLAnchorElement) {
  const lang = link.dataset.lang
  if (!lang || !SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
    return
  }

  applyLanguage(lang as SupportedLanguage)
}

function decorateLinks(root: Document | HTMLElement) {
  const links = root.querySelectorAll<HTMLAnchorElement>(".language-switcher__item")
  links.forEach((link) =>
    link.addEventListener("click", () => {
      handleLanguageSwitch(link)
    }),
  )
}

function shouldRedirectToLanguageHome(pathname: string, lang: SupportedLanguage) {
  if (lang === "ru") {
    return false
  }

  const normalized = pathname.replace(/\/+$/, "")
  if (normalized === "" || normalized === "/" || normalized === "/index" || normalized === "/index.html") {
    const target = `/${lang}/`
    if (!window.location.pathname.startsWith(target)) {
      window.location.replace(target)
      return true
    }
  }

  return false
}

function initializeFromLocation(pathname: string, allowRedirect = false) {
  const slug = normalizeToSlug(pathname)
  const lang = detectLanguageFromSlug(slug)

  if (allowRedirect && shouldRedirectToLanguageHome(window.location.pathname, lang)) {
    return
  }

  applyLanguage(lang)
}

document.addEventListener("DOMContentLoaded", () => {
  initializeFromLocation(window.location.pathname, true)
  decorateLinks(document)
})

document.addEventListener("nav", (event: CustomEventMap["nav"]) => {
  const slug = event.detail.url ?? "index"
  initializeFromLocation(slug)

  const root = document.getElementById("quartz-root")
  if (root) {
    decorateLinks(root)
  }
})

