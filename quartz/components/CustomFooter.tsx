import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links?: Record<string, string>
  copyrightText?: string | Record<string, string>
}

export default ((opts?: Options) => {
  const CustomFooter: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? {}
    const locale = cfg.locale ?? "ru-RU"
    const lang = locale.split("-")[0] ?? "ru"

    const defaultTexts: Record<string, string> = {
      ru: `© ${year} Издательство «Катоблепас»`,
      en: `© ${year} Catoblepas Press`,
    }

    let copyrightText: string
    if (!opts?.copyrightText) {
      copyrightText = defaultTexts[lang] ?? defaultTexts.ru
    } else if (typeof opts.copyrightText === "string") {
      copyrightText = opts.copyrightText
    } else {
      copyrightText =
        opts.copyrightText[locale] ??
        opts.copyrightText[lang] ??
        opts.copyrightText["ru"] ??
        opts.copyrightText["en"] ??
        defaultTexts[lang] ??
        defaultTexts.ru
    }

    return (
      <footer class={`${displayClass ?? ""}`}>
        <div class="footer-top">
          <p class="copyright">
            {copyrightText}
          </p>
          <ul class="footer-links">
            {Object.entries(links).map(([text, link]) => (
              <li>
                <a href={link}>{text}</a>
              </li>
            ))}
          </ul>
        </div>
        <p>
          <span dangerouslySetInnerHTML={{ __html: i18n(cfg.locale).components.footer.createdWith }} />{" "}
          <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a>
        </p>
      </footer>
    )
  }

  CustomFooter.css = style
  return CustomFooter
}) satisfies QuartzComponentConstructor
