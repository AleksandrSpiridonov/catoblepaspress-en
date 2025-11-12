import { classNames } from "../util/lang"
import { FullSlug, joinSegments, simplifySlug } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import languageScript from "./scripts/languageSwitcher.inline"

type LanguageOption = {
  code: string
  label: string
  locale: string
}

const languages: LanguageOption[] = [
  { code: "ru", label: "Русский", locale: "ru-RU" },
  { code: "en", label: "English", locale: "en-US" },
]

function normalizeSlug(slug?: string | null): string[] {
  if (!slug) {
    return []
  }

  const trimmed = slug.replace(/^\//, "").replace(/\/$/, "")
  return trimmed === "" ? [] : trimmed.split("/")
}

function extractBaseSegments(segments: string[]): string[] {
  if (segments.length === 0) {
    return []
  }

  const [prefix, ...rest] = segments
  if (prefix === "ru" || prefix === "en") {
    return rest
  }

  return segments
}

function buildCandidateSlug(lang: LanguageOption, baseSegments: string[]): string {
  const base =
    baseSegments.length === 0 ? "index" : joinSegments(...baseSegments.filter((segment) => segment.length > 0))

  if (lang.code === "ru") {
    return base === "" ? "index" : base
  }

  return joinSegments(lang.code, base === "" ? "index" : base)
}

function findMatchingSlug(
  candidateSlug: string,
  baseSegments: string[],
  lang: LanguageOption,
  allFiles: QuartzComponentProps["allFiles"],
): string {
  const simplifiedCandidate = simplifySlug(candidateSlug as unknown as FullSlug)

  const directMatch = allFiles.find(
    (file) => file.slug && simplifySlug(file.slug) === simplifiedCandidate,
  )
  if (directMatch?.slug) {
    return directMatch.slug
  }

  const normalizedBase = baseSegments.join("/")
  if (normalizedBase.length > 0) {
    const sameStructureMatch = allFiles.find((file) => {
      if (!file.slug) {
        return false
      }

      const fileSegments = normalizeSlug(file.slug)
      const fileBaseSegments = extractBaseSegments(fileSegments)
      const fileLang = (file.frontmatter?.lang ?? "ru").toString()
      return fileLang === lang.code && fileBaseSegments.join("/") === normalizedBase
    })

    if (sameStructureMatch?.slug) {
      return sameStructureMatch.slug
    }

    const aliasMatch = allFiles.find((file) => {
      const aliases: string[] = file.frontmatter?.aliases ?? []
      if (aliases.length === 0) {
        return false
      }

      const fileLang = (file.frontmatter?.lang ?? "ru").toString()
      if (fileLang !== lang.code) {
        return false
      }

      return aliases.some(
        (alias) =>
          simplifySlug(alias as unknown as FullSlug) ===
          simplifySlug(normalizedBase as unknown as FullSlug),
      )
    })

    if (aliasMatch?.slug) {
      return aliasMatch.slug
    }
  }

  const fallback = lang.code === "ru" ? "index" : joinSegments(lang.code, "index")
  return fallback
}

function slugToHref(slug: string): string {
  const simplified = simplifySlug(slug as unknown as FullSlug)
  if (simplified === "/") {
    return "/"
  }

  return simplified.startsWith("/") ? simplified : `/${simplified}`
}

export default (() => {
  const LanguageSwitcher: QuartzComponent = ({
    fileData,
    allFiles,
    displayClass,
  }: QuartzComponentProps) => {
    const slugSegments = normalizeSlug(fileData.slug)
    const frontmatterLang = fileData.frontmatter?.lang?.toString()
    const currentLanguageCode =
      (frontmatterLang && languages.find((lang) => lang.code === frontmatterLang)?.code) ??
      (slugSegments[0] === "en" ? "en" : "ru")
    const currentLanguage = languages.find((lang) => lang.code === currentLanguageCode) ?? languages[0]
    const baseSegments = extractBaseSegments(slugSegments)

    const items = languages.map((lang) => {
      const isActive = lang.code === currentLanguage.code
      const candidateSlug = buildCandidateSlug(lang, baseSegments)
      const resolvedSlug = findMatchingSlug(candidateSlug, baseSegments, lang, allFiles)

      return {
        isActive,
        lang,
        href: slugToHref(resolvedSlug),
      }
    })

    const labelText = currentLanguage.code === "ru" ? "Язык" : "Language"

    return (
      <nav class={classNames(displayClass, "language-switcher")}>
        <span class="language-switcher__label">{labelText}:</span>
        <div class="language-switcher__options" role="list">
          {items.map(({ isActive, lang, href }) => (
            <a
              role="listitem"
              class={classNames(
                undefined,
                "language-switcher__item",
                ...(isActive ? ["is-active"] : []),
              )}
              href={href}
              data-lang={lang.code}
              aria-current={isActive ? "true" : "false"}
              data-locale={lang.locale}
            >
              {lang.label}
            </a>
          ))}
        </div>
      </nav>
    )
  }

  LanguageSwitcher.css = `
    .language-switcher {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
    }

    .language-switcher__label {
      font-weight: 600;
      color: var(--gray);
    }

    .language-switcher__options {
      display: inline-flex;
      gap: 0.5rem;
      align-items: center;
    }

    .language-switcher__item {
      padding: 0.35rem 0.9rem;
      border-radius: 999px;
      border: 1px solid transparent;
      color: var(--darkgray);
      text-decoration: none;
      transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .language-switcher__item:hover,
    .language-switcher__item:focus-visible {
      border-color: var(--secondary);
      color: var(--secondary);
      background-color: color-mix(in srgb, var(--secondary) 15%, transparent);
      outline: none;
    }

    .language-switcher__item.is-active {
      background-color: var(--secondary);
      color: var(--light);
      border-color: var(--secondary);
    }

    @media (max-width: 600px) {
      .language-switcher {
        flex-wrap: wrap;
      }

      .language-switcher__label {
        width: 100%;
      }
    }
  `

  LanguageSwitcher.afterDOMLoaded = languageScript
  return LanguageSwitcher
}) satisfies QuartzComponentConstructor

