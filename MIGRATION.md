# English site migration to Quartz 5

## Decisions

- The English site must mirror the Russian site's information architecture.
- The existing English `content/` is preserved during the framework migration.
- Missing English pages will be translated in later, reviewable batches.
- Deployment targets GitHub Pages only. There is no Fair deployment for the English site.
- The existing `v4` branch remains the rollback point until the Quartz 5 build is verified.

## Migration scope

1. Remove the accidentally committed Windows `Zone.Identifier` metadata file.
2. Replace the Quartz 4 framework and configuration with the current Russian Quartz 5 framework.
3. Adapt locale, domain, navigation labels, footer, analytics, and deployment for the English site.
4. Preserve the existing English content and media.
5. Install dependencies, build the site, and inspect representative generated pages.
6. Produce a Russian-to-English content parity inventory for the translation phase.

## Acceptance checks

- `npm ci` succeeds on Node.js 22.
- Quartz plugins install successfully.
- The production build completes from the repository root.
- The generated site uses `en-US` and `en.catoblepaspress.ru`.
- GitHub Pages is the only deployment target.
- Existing English pages and media remain tracked.
- Missing pages are recorded explicitly rather than silently copied in Russian.
