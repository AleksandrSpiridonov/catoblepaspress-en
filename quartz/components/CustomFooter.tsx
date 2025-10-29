import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
  copyrightText?: string
}

export default ((opts?: Options) => {
  const CustomFooter: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    const copyrightText = opts?.copyrightText ?? `© ${year} Издательство Катоблепас`
    
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
