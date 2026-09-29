# Digital Mirror

A complete Next.js App Router + TypeScript application inspired by the supplied four-view Filipino popular-culture reference. Uses responsive CSS, reusable components, Lucide icons, and locally bundled fonts and artwork.

## Run

Requires Node.js 20.9+ and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. For production, run `npm run build` followed by `npm start`.

## Pages and interactions

- `/`: illustrated time-portal home page.
- `/about`: museum introduction and purpose.
- `/galleries`: four linked Polaroid decade cards.
- `/galleries/2000s`: reference-inspired gallery detail, plus working 1990s, 2010s, and 2020s routes.
- Seven category buttons per decade, exhibit story dialogs with native keyboard/focus handling, responsive mobile navigation, and a persistent music player.
- Player includes actual audio, play/pause, previous/next, automatic track advance, seek, mute, and desktop volume. Mobile uses device volume.

## Assets and content

`public/portal.png` and `public/collage.png` are generated illustrations inspired by the reference, not archival photographs. Gallery entries are illustrative editorial placeholders rather than a sourced historical archive. No original reference screenshot is used as a page interface.

`public/audio/` contains three original, synthesized 32-second instrumental demos. They are not recordings of commercial OPM songs. Regenerate with `node scripts/generate-audio.mjs`, or replace them with appropriately licensed audio and update `components/shell.tsx`.

All visual assets, fonts, and audio are local; no API keys, remote media hosts, database, or external account is required at runtime. Font packages include their respective open-font licenses. No analytics or user data collection is included.

## Edit

- `lib/data.ts`: decades, categories, and exhibit descriptions.
- `app/globals.css`: colors, responsive layouts, scrapbook treatments.
- `components/shell.tsx`: shared navigation and persistent audio player.
- `components/gallery-detail.tsx`: category controls and story dialogs.
- `components/decade-card.tsx`: reusable Polaroid decade cards.

## Verify

```sh
npx playwright install chromium
# With the app running in another terminal:
npm run test:e2e
npm run build
```

Browser tests cover all seven routes at desktop and mobile widths, horizontal overflow, runtime errors, categories, dialogs, navigation, and audio controls/persistence. Screenshots are written to `test-results/`.
