# DESIGN — The Register

## Thesis

The portfolio is kept like a register an operation depends on. Every entry is
dated, every claim is marked by what backs it, and work that can't be shown is
recorded as **withheld** instead of dressed up.

It belongs to Abdelhmeed specifically: he started at Amwag Travel's ticketing
desk, where booking records are written, and now builds the system that decides
whether an attendance record is allowed to exist ("Every record earns its
trustworthiness before it exists"). His case studies already refuse invented
metrics, and his products are bilingual forms.

## Rules — judge every change against these

1. **Every block is an entry**: label · value · source. Labels are bilingual
   (English + Arabic twin) and live in the label column.
2. **The frame is ink on stone.** Colour belongs only to evidence (a project's own
   stock) and to the audit layer (sources). Nothing else gets colour.
3. **Evidence is never decorated.** No tilt, device mockups, glow or shadow —
   a 1px frame and a provenance line (where the capture came from).
4. **Mono only for machine strings** (capture hosts and paths). Never for labels.
5. **Motion reports a state change.** A line draws or a mark stamps in when
   something becomes true. Nothing moves on scroll; no entrance animations.
6. **Nothing unsourced.** Every claim is Shown, Documented, Stated or Withheld.

If an element can't be justified by these rules, remove it.

## Tokens

| Token | Stone (default) | `.stock-att` (Amwag navy) | `.stock-dose` (DÖSE walnut) |
|---|---|---|---|
| `--ground` | `#ECEDEA` | `#0C121C` | `#2B1611` |
| `--ink` | `#131513` (15.6:1) | `#E3E8EF` (15.2:1) | `#F2E8DA` (14.1:1) |
| `--ink-2` | `#51544F` (6.5:1) | `#9CA7B5` (7.7:1) | `#CDB8A2` (9.0:1) |
| `--rule` | `#131513` | `#4A566B` | `#7A4A38` |
| `--rule-2` (quiet rules) | `#C4C6C0` | `#263041` | `#4A2A20` |
| `--audit` (sources) | `#086A35` (5.7:1) | `#7BD8A2` | `#A6E3BC` |

Stock classes redefine the tokens, so any component placed inside a plate, title
block or band inherits the product's material automatically.

## Type

- **Changa** 400–800 — display, headings, controls, and Arabic section twins.
  Latin and Arabic drawn as one family; condensed, signage-like.
- **Readex Pro** 300–600 — body text and Arabic labels.
- **Martian Mono** 400, width 87.5 — provenance lines only.
- Scale: name `clamp(3rem, 7.6vw, 6rem)/.86` 800 · sheet heading
  `clamp(2.25rem, 5vw, 4rem)` 700 · lead `clamp(1.5rem, 2.7vw, 2.375rem)` 500 ·
  body `1rem/1.62` · labels `.8125rem`.
- Arabic: always `lang="ar" dir="rtl"`, never letter-spaced, line-height ≥ 1.6.

## The mark

AE, where the A has no crossbar and the E has no middle arm: one thinner line
(stroke 3.3 against 5) supplies both — and keeps going as the header rule and the
colophon rule. The favicon ends the line at the E.

## Sources (the audit layer)

| Mark | Means | Links to |
|---|---|---|
| **Shown** | a screen or photo on this site | the exhibit |
| **Documented** | written up in a case study | the section |
| **Stated** | the owner's own account; no public artefact | — |
| **Withheld** | exists, under NDA or company confidentiality | — |

Markup: `<span class="claim">…</span><a class="src" href="…"><b>Shown</b> 3 screens</a>`.
Marks are hidden until the Sources toggle is on (the choice persists between
pages), and always visible without JavaScript and in print.

## Composition

- **Home**: record card (name, began, now, sources, contact) → ledger index of
  all work (public, withheld, closed) → one plate per public project on its own
  stock → record (timeline of three parallel lines: operations, commerce,
  study) → method (each principle proven by a quote from the work) and
  capabilities → contact → colophon.
- **Case study**: title block on the project's stock → summary entries → sticky
  contents rail → chapters of clauses. Evidence bands bleed from the content
  column off the right edge of the page.
- **Per-project grammar**: Amwag Attendance tells its story as the *check-in
  pipeline* (five steps, each proven by a screen). DÖSE tells it as the
  *narrowing conversation* (each quiz question set physically narrower).

## Motion grammar

| What | Trigger | Behaviour |
|---|---|---|
| Ledger row rule | hover / focus | 3px ink line draws left → right, 220ms linear |
| Nav and contents marker | hover / current section | line draws, 220ms linear |
| Sources | toggle | underline colours in 220ms; marks stamp in over 180ms in 3 steps |
| Entry → record | navigation | cross-document view transition morphs the title, 320ms `cubic-bezier(.2,0,0,1)` |
| Everything else | — | cuts |

Never: scroll reveals, parallax, loaders, hover lifts, magnetic buttons, cursor
effects. Reduced motion sets every transition and animation to zero and turns off
view transitions; states still change.

## Adding a case study

1. Copy `work/amwag-attendance.html`; set the title block and bands to a stock
   class (add a new `.stock-*` token block if the product has its own material).
2. Give the `h1` a `view-transition-name`, and use the same name on the plate
   title on the home page.
3. Add a ledger row and a plate in `index.html`.
4. Mark every claim with a source.

## Images

- Screens are WebP at 800 and 1600 wide:
  `ffmpeg -i in.png -vf "scale='min(1600,iw)':-2" -c:v libwebp -quality 78 out-1600.webp`
- Crop to the decision, not the whole screen:
  `ffmpeg -i in.png -vf "crop=W:H:X:Y" -c:v libwebp -quality 85 crop-name.webp`
- Always set `width` and `height`. Originals stay in `projects assets/` (not
  referenced by the site).
