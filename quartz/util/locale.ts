import { GlobalConfiguration } from "../cfg"
import { QuartzPluginData } from "../plugins/vfile"

const LANGUAGE_TO_LOCALE: Record<string, string> = {
  ru: "ru-RU",
  en: "en-US",
}

const SITE_TITLES: Record<string, string> = {
  ru: "Катоблепас",
  en: "Catoblepas Press",
}

function inferLanguageFromValue(value: unknown): string | undefined {
  if (!value) {
    return undefined
  }

  const normalized = value.toString().toLowerCase()
  if (normalized.length === 0) {
    return undefined
  }

  const langSegment = normalized.split("-")[0]
  if (langSegment in LANGUAGE_TO_LOCALE) {
    return langSegment
  }

  return undefined
}

export function inferLanguage(data: QuartzPluginData): string {
  const frontmatterLang = inferLanguageFromValue(data.frontmatter?.lang)
  if (frontmatterLang) {
    return frontmatterLang
  }

  const slug = data.slug ?? ""
  const slugWithoutPrefix = slug.startsWith("/") ? slug.slice(1) : slug
  const firstSegment = slugWithoutPrefix.split("/")[0]
  const slugLang = inferLanguageFromValue(firstSegment)
  if (slugLang) {
    return slugLang
  }

  return "ru"
}

export function createLocalizedConfig(
  baseCfg: GlobalConfiguration,
  data: QuartzPluginData,
): GlobalConfiguration {
  const language = inferLanguage(data)
  const locale = (LANGUAGE_TO_LOCALE[language] ?? baseCfg.locale) as GlobalConfiguration["locale"]
  const pageTitle =
    SITE_TITLES[language] ??
    SITE_TITLES[locale?.split("-")[0] ?? ""] ??
    baseCfg.pageTitle

  return {
    ...baseCfg,
    locale,
    pageTitle,
  }
}


