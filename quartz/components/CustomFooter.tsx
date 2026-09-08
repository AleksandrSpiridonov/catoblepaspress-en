import { version } from "../../package.json"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

interface Options {
  copyrightText: string
  links: Record<string, string>
}

const CustomFooter: QuartzComponentConstructor<Options> = (opts) => {
  const Footer: QuartzComponent = ({ displayClass }) => (
    <footer class={displayClass ?? ""}>
      <div class="footer-top">
        <p class="copyright">{opts.copyrightText}</p>
        <ul class="footer-links">
          {Object.entries(opts.links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </div>
      <p>
        Created by <a href="/authors/asp">Aleksandr Spiridonov Jr.</a> with{" "}
        <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a>
      </p>
    </footer>
  )

  Footer.afterDOMLoaded = `
    const initIssueReaders = () => {
      document.querySelectorAll('.issue-reader').forEach(reader => {
        if (reader.dataset.ready) return
        reader.dataset.ready = 'true'
        const track = reader.querySelector('.issue-pages')
        const pages = Array.from(track.querySelectorAll('.issue-page'))
        const prev = reader.querySelector('[data-issue-prev]')
        const next = reader.querySelector('[data-issue-next]')
        const status = reader.querySelector('[data-issue-status]')
        let current = 0
        const update = () => {
          const left = track.getBoundingClientRect().left
          current = pages.reduce((best, page, i) => Math.abs(page.getBoundingClientRect().left-left) < Math.abs(pages[best].getBoundingClientRect().left-left) ? i : best, 0)
          status.textContent = (current + 1) + ' / ' + pages.length
          prev.disabled = current === 0
          next.disabled = current === pages.length - 1
          pages.forEach((page, i) => { if (i !== current) page.querySelector('video')?.pause() })
        }
        const go = delta => {
          const target = pages[Math.max(0, Math.min(pages.length-1, current+delta))]
          track.scrollBy({left:target.getBoundingClientRect().left-track.getBoundingClientRect().left,behavior:'instant'})
          update()
        }
        prev.addEventListener('click', () => go(-1))
        next.addEventListener('click', () => go(1))
        track.addEventListener('scroll', update, {passive:true})
        track.addEventListener('keydown', event => {
          if(event.target === track && ['ArrowLeft','ArrowRight'].includes(event.key)){
            event.preventDefault(); go(event.key === 'ArrowRight' ? 1 : -1)
          }
        })
        update()
      })
    }
    initIssueReaders()
    document.addEventListener('nav', initIssueReaders)
  `
  return Footer
}

export default CustomFooter
