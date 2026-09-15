# Abdelhmeed Elshorbagy — The Register

A hand-built, dependency-free portfolio: semantic HTML, one CSS file, one small
JS file. No framework, no build step — deploy the folder to Vercel, Netlify,
Cloudflare Pages or GitHub Pages.

The design system, rules and motion grammar are documented in
[`DESIGN.md`](DESIGN.md). Read it before changing the look.

## Structure

```
index.html                  Home — record card, work ledger, project plates, record timeline, method, contact
404.html                    Not-found page (root-absolute paths; works at the domain root)
work/
  amwag-attendance.html     Case study — the check-in pipeline
  dose-fragrance.html       Case study — the narrowing conversation
archive/                    Unlinked, noindex. Amwag Travel app + Yosr LMS pages and their
                            restore snippets, pinned to legacy/main.css so they still render.
assets/
  css/main.css              The whole design system (tokens at the top)
  js/main.js                Sources toggle, copy email, timeline "now", screenshot viewer, wayfinding
  img/                      WebP screens (800/1600), decision crops, portrait
  og.png                    1200×630 share card
  favicon.svg               The AE mark
  Abdelhmeed-Elshorbagy-CV.pdf
robots.txt, sitemap.xml     Crawl rules (all search and AI bots allowed) and page list
llms.txt                    Plain-text profile for AI assistants
.vercelignore               Keeps tooling, archive and source files out of the deploy
DESIGN.md                   Design thesis, tokens, type, motion, how to add a case study
```

## Search and AI visibility

The official address is `https://www.abdelhmeed.com` (the bare domain redirects
there). Canonical links, Open Graph URLs, JSON-LD, the sitemap and `llms.txt`
all use it — if the primary host changes in Vercel, replace that string
everywhere. The home page carries `ProfilePage` + `Person` structured data
(names, role, employer, school, certificate, profiles); case studies carry
`Article` + `BreadcrumbList` linked to the same person `@id`. When a fact
changes, update it in the page text, the JSON-LD, `llms.txt` and the CV together.

## Behaviour

- **Sources** (header and record card): marks every claim as Shown, Documented,
  Stated or Withheld. The choice persists between pages (`localStorage`).
  Without JavaScript, marks are always visible.
- Screenshots open full size in a native `<dialog>`; without JavaScript the link
  opens the image.
- Page-to-page navigation uses cross-document view transitions where supported.
- Everything honours `prefers-reduced-motion`. No content is hidden behind
  scroll or animation.
- Fonts: Changa, Readex Pro and Martian Mono from Google Fonts.

## Before deploying — needs the owner

These are facts only you can confirm; the site does not guess them.

1. **Amwag Attendance dates.** The case study says "Built in the IT Specialist
   role, Feb 2025 – present". Replace with exact dates if you have them.
2. **Arabic labels.** Every Arabic word on the site is a short interface label
   (الاسم، البداية، الأعمال …). Please review them; nothing longer was written on
   your behalf.
3. **One set of facts everywhere.** The site now follows the current CV: IT Help
   Desk (Feb 2025 – present), Customer Service (Aug 2024 – Feb 2025), Ticketing
   (Jun – Aug 2023), `linkedin.com/in/elshorbagy`. Keep LinkedIn, GitHub and the
   CV saying exactly the same thing — search engines and AI assistants trust a
   person's facts only when their sources agree.
4. **Attendance evidence.** Screens were captured from a local instance with
   sample data, so the "in production" claim is marked *Stated*. Redacted
   production captures would upgrade it to *Shown*.
5. **DÖSE wording.** The store footer says "curated niche fragrances from around
   the world" and a product page says "Inspired by: Explorer Ultra Blue
   Montblanc", while the portfolio calls DÖSE "an Egyptian niche fragrance brand".
6. **Arabic name.** Not yet on the site. Add it to the Person `alternateName` list
   in `index.html`, to `llms.txt`, and to the About paragraph, spelled exactly as
   you write it.
7. **Archive.** `archive/amwag-travel.html` shows the booking app the home page
   lists as company-confidential. It is unlinked and `noindex`, but still
   reachable if deployed. Delete it or confirm it's publishable.
8. **Don't deploy source/tooling files**: `projects assets/`,
   `abdelhmeed photo.jpeg`, `Abdelhmeed Elshorbagy.pages`, `graphify-out/`,
   `CLAUDE.md`, `AGENTS.md`, `.claude/`.
