# AE — Abdelhmeed Elshorbagy · Portfolio

A bespoke, dependency-free portfolio: semantic HTML, one custom CSS design
system, and vanilla JS for motion. No frameworks, no build step — open
`index.html` or deploy the folder as-is to Vercel, Netlify, Cloudflare Pages,
or GitHub Pages.

## Structure

```
index.html                  Home — hero, work, expertise, philosophy, about, timeline, contact
404.html                    Custom not-found page (uses root-absolute paths — works when deployed)
work/
  amwag-attendance.html     Case study 01 — attendance governance platform
  dose-fragrance.html       Case study 02 — DÖSE Shopify experience
  amwag-travel.html         Bilingual transportation booking app (ARCHIVED:
                            unlinked for now — restore snippets from
                            _disabled-amwag-travel-snippets.html)
  yosr-platform.html        Arabic-first LMS (DISABLED: unlinked for now,
                            pending content update — restore snippets
                            from _disabled-yosr-snippets.html)
assets/
  css/main.css              Full design system (tokens at the top)
  js/main.js                Intro, nav, reveals, hero canvas, capability map, copy-email
  favicon.svg               AE monogram favicon
  og.svg                    Social share card — EXPORT TO og.png (1200×630) before deploying
                            and update the og:image meta tags; most platforms won't render SVG.
```

## The AE mark

Three strokes: the A's diagonal, the E's frame, and one continuous crossbar
that starts on the A and becomes the E's middle arm — one line running through
both letters (design ↔ engineering, connected). The crossbar is always the
accent blue (#55b7ff). Reused via `<use href="#ae-mark">` on every page.

## Content placeholders still to fill in (searchable as `placeholder-tag`)

Filled already: education (Minya National University, 2024–2028), Amwag role
(IT Specialist, Feb 2025 — Present), DÖSE dates (Oct 2025 — Present), LinkedIn
/ GitHub URLs, CV PDF, portrait photo, case-study screenshots.

Remaining:

- Timeline dates on the Amwag Travel and Amwag Attendance case-study pages
- Amwag Travel (mobile app) is archived (homepage card removed, case study
  unlinked; only Attendance is public) — restore from
  `_disabled-amwag-travel-snippets.html` when it should be shown again
- Yosr is fully disabled (homepage card + timeline entry removed, case study
  unlinked) — restore from `_disabled-yosr-snippets.html` after its content update
- Export `assets/og.svg` to og.png (1200×630) and update the og:image meta tag

Delete the `<span class="placeholder-tag">` elements as you fill each item in.

## Design tokens

Edit once in `:root` at the top of `assets/css/main.css`:
graphite `#090b10`, panel `#10141d`, ink `#eceff4`, accent `#55b7ff`.
Type: Clash Display (display) · General Sans (body) · JetBrains Mono (labels),
loaded from Fontshare / Google Fonts.

## Behavior notes

- Intro plays once per session (sessionStorage), is skippable (button / Esc),
  and never plays for `prefers-reduced-motion` users.
- Hero canvas pauses when off-screen; all motion honors reduced-motion.
- Arabic version: the architecture is ready (bilingual content already appears
  in the work visuals); add a `/ar/` mirror with `dir="rtl"` when Arabic copy
  exists. Per the content plan, no language switcher until then.

## Porting to Framer (if desired)

- Colors/type map 1:1 to Framer color & text styles (see `:root` tokens).
- Case studies map to a CMS collection: title, category, role, stack tags,
  and the 12 narrative sections as rich-text fields; `work/*.html` is the
  reusable page template.
- The hero canvas and capability map become code components
  (`assets/js/main.js` sections 5 and 6 contain the logic).
