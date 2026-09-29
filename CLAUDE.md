# Inner Narrative Coach — project guide for Claude sessions

This is the live website of Anne-Kristin Vaudour, Jungian coach in Singapore
(https://innernarrativecoach.org). Static HTML/CSS/JS, hosted on Netlify,
deployed automatically from the `master` branch of this repository.

The people driving sessions here are NOT technical. They describe changes in
plain language, often via voice-to-text (expect typos like "low" for "logo"),
and often paste screenshots of what they see. Interpret intent generously,
make the change, and ship it. They consider a change done only when it is
live on the website.

## The golden workflow (every edit)

1. Make the change.
2. If CSS changed: bump the cache-buster `style.css?v=YYYYMMDDNN` in ALL
   *.html files (they must stay in sync). Same pattern for changed images.
3. If you touched inline `<script>` blocks: syntax-check them
   (`node --check` on the extracted script).
4. Commit with a clear message, then get it onto `master` and push
   (if the harness assigns you a working branch, fast-forward merge it into
   master and push both). The owner has standing permission: ALWAYS push to
   master without asking. Netlify deploys in ~1 minute.
5. Tell the user what changed and remind them to hard-refresh
   (mobile Chrome: menu → reload, or use an incognito tab).

If the user says a change was wrong or asks to undo: `git revert` the
offending commit (never force-push history away), push, confirm.

## Site map and funnel (do not break this logic)

The site is a sales funnel with one spine:
quiz/Letter (cold) → Let's Connect message (call.html) → Archetypal Reading
(the-reading.html, S$489 flagship) → packages (work-with-me.html).
Teams track runs separately (for-teams.html). Every page has ONE primary CTA,
always the next step down the spine.

- index.html — homepage, Reading-first hero
- the-reading.html — flagship sales page
- work-with-me.html — services (owner's own copy, keep wording): Archetypal
  Reading S$489 (signature "Vaudour Method"; delivers Archetypal Evaluation,
  Archetypal Map, custom fantasy portrait), 1:1 Coaching S$220/60 min (public,
  owner's decision), Deep Dive Package S$1,100 (1 Reading + 3 coaching
  sessions, "Recommended"), Deep Transformation Package S$2,100 (10 sessions).
  Fantasy Portraits: Mini S$188 / Signature S$376 / Premium S$655.
- call.html — "Let's Connect" page: Netlify form `lets-connect` (Full Name,
  Email, WhatsApp optional, "What would you like to talk about?"). The owner
  removed Calendly on purpose: people reach her by form, WhatsApp or email.
  Do not reintroduce a booking widget. All "Let's Connect" buttons link here.
- quiz.html — 12-question archetype quiz, in-browser scoring
- archetypes.html + archetype-*.html — 12-archetype library (generated set;
  keep structure consistent across all 12 when editing one)
- interest.html — offer-interest form + newsletter signup landing
- for-teams.html — corporate offers (keynote from S$3,000, half-day S$4,500,
  full-day S$8,000) + Netlify enquiry form
- about.html, podcast.html, resources.html (Journal), contact.html
- ops.html — PRIVATE operations dashboard. Never link it from public pages,
  keep its `noindex` meta. It reads Netlify form submissions via API token


## Couplings that break silently — check before renaming anything

- Netlify form names are load-bearing: `newsletter`, `quiz-results`,
  `offer-interest`, `team-enquiry`, `lets-connect`. ops.html's FORMS array and the Netlify
  dashboard notifications depend on these exact names.
- The nav, footer, newsletter band ("The Inner Letter"), and WhatsApp float
  are duplicated in every HTML file. A change to any of them must be applied
  to ALL pages (script it with Python; don't hand-edit 25 files).
- netlify.toml: publish ".", 404 → index.html.

## Conventions

- NO em dashes anywhere on the site (owner rule). Use commas or colons.
- Voice: Anne's first person; warm, plain, unhurried; no hype, no pressure.
  One ask per section. "Not now" is always framed as an acceptable answer.
- WhatsApp contact: https://wa.me/6598860234 with a URL-encoded pre-filled
  message. WhatsApp is the floating bubble, never the primary CTA.
- Languages EN · DE · IT are a differentiator; keep the chips near prices.
- Design system: css/style.css only (no frameworks). Fonts: Cormorant
  Garamond (headings) + Inter (body). Accent: deep petrol navy #102D3F for labels,
  links, badges, newsletter band. Buttons are warm copper (--btn #A0602F,
  hover #85491F, outline buttons #8F522A for contrast), matching the copper logo; on dark backgrounds copper buttons
  get a light copper edge (#D9A273). Breakpoints:
  1024 / 960 / 768 / 480. Mobile is reviewed on Android Chrome; check that
  nav (80px, logo 68px; 72px/60px under 480px) and hero right-alignment hold.
- Images live in images/, kebab-case names. When the user pastes/attaches an
  image to add to the site: find the attachment on disk, copy it into
  images/ with a descriptive name, keep files under ~500KB (Pillow is
  available via pip for resizing), and add a cache-buster query when
  replacing an existing image.
- Meta/OG: every page has description + og tags with absolute
  https://innernarrativecoach.org image URLs; keep them updated when a
  page's purpose changes.

## Contacts and accounts

- Owner email: annek.vaudour@gmail.com (appears on contact page and in ops
  templates). Netlify hosts the site; forms and their notifications are
  configured in the Netlify dashboard.
