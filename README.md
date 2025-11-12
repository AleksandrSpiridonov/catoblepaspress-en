# Quartz v4

> “[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important.” — Richard Hamming

Quartz is a set of tools that helps you publish your [digital garden](https://jzhao.xyz/posts/networked-thought) and notes as a website for free.
Quartz v4 features a from-the-ground rewrite focusing on end-user extensibility and ease-of-use.

🔗 Read the documentation and get started: https://quartz.jzhao.xyz/

[Join the Discord Community](https://discord.gg/cRFFHYye7t)

## Sponsors

<p align="center">
  <a href="https://github.com/sponsors/jackyzha0">
    <img src="https://cdn.jsdelivr.net/gh/jackyzha0/jackyzha0/sponsorkit/sponsors.svg" />
  </a>
</p>

## Localization Guide

The site ships with a bilingual navigation system for Russian (`ru`) and English (`en`) content. Pages are organised under `content/ru` and `content/en`. Each Markdown file should declare the language in its frontmatter, for example:

```markdown
---
title: Catoblepas Press
lang: en
---
```

The header language switcher automatically links between matching slugs (`/ru/...` ↔ `/en/...`) and remembers the visitor’s preference. When adding a translated page, mirror the path structure inside `content/en` and Quartz will expose it under `/en/…`. If no translation exists, the switcher falls back to the section landing page.
