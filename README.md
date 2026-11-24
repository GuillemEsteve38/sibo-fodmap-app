# Low FODMAP Guide

[![Self-checks](https://github.com/GuillemEsteve38/sibo-fodmap-app/actions/workflows/selfcheck.yml/badge.svg)](https://github.com/GuillemEsteve38/sibo-fodmap-app/actions/workflows/selfcheck.yml)

A small web app for following the low FODMAP diet, for people with SIBO or IBS. It tells you what you can eat, guides you through the reintroduction phases, and scans ingredient labels with your phone camera.

**Try it:** https://guillemesteve38.github.io/sibo-fodmap-app/

**Status:** feature-complete and in daily use. Updated when the food data or the protocol needs it.

<!-- Screenshots: drop three phone screenshots in docs/ (foods list, a scan verdict, the reintroduce
     calendar), then delete this comment and the one below to show them.
| Foods | Scan a label | Reintroduce |
|---|---|---|
| ![Foods list](docs/foods.png) | ![Scan result](docs/scan.png) | ![Reintroduction calendar](docs/reintroduce.png) |
-->

> This app is general guidance, not medical advice. The low FODMAP diet works best with a doctor or dietitian. For SIBO it supports treatment; it does not replace it.

## Features

- **Foods:** about 290 foods rated Low, Moderate or High, with the FODMAP group (fructose, lactose, fructans, GOS, sorbitol, mannitol) and safe portions. Search, filter by level and category, plus a list of hidden FODMAPs to look for on labels.
- **Scan Label:** take a photo of an ingredients list. The text is read on your phone and checked against a list of FODMAP ingredients in Spanish and English, including E-numbers for polyols. You get a verdict and the ingredients that caused it. You can also type or paste ingredients.
- **My Plan:** the three phases of the diet.
  1. **Eliminate:** day counter and progress for the 2–6 week low FODMAP phase.
  2. **Reintroduce:** 10 tests (lactose, fructose, sorbitol, mannitol, fructose + sorbitol, GOS, wheat bread, wheat pasta, onion, garlic). Each runs 3 days with increasing doses. You log symptoms once a day (with undo for today's entry), the test stops at moderate symptoms, and then there are 4 rest days.
  3. **Personalise:** your results. The Foods and Scan tabs then mark foods as tolerated, small portions or avoid, based on your own tests.
- **English and Spanish:** switch with the EN / ES buttons at the top. The app starts in Spanish when your phone is set to Spanish, and remembers your choice. Food search works with Spanish or English names, with or without accents.
- Light and dark mode, iPhone and Android home-screen install.

## Install on your phone

Open the link above, then:

- **iPhone (Safari):** Share → **Add to Home Screen**.
- **Android (Chrome):** ⋮ menu → **Add to Home screen** or **Install app**.

Install it on the home screen. iPhone Safari can delete website data after 7 days without a visit, but home-screen apps keep their data.

## Privacy

- Your diet progress is stored only on your device (`localStorage`). There is no account, no server and no tracking.
- Label photos are read on the device. They are never uploaded.
- The first scan downloads the open-source OCR library [Tesseract.js](https://github.com/naptha/tesseract.js) 5.1.1 and its Spanish and English language data from the jsDelivr CDN. This needs an internet connection. The main script is pinned with a Subresource Integrity hash, so the browser refuses it if the file is ever changed. To upgrade the version, update the hash too.
- Clearing your browser data deletes your progress. Use **My Plan → Back up data** to save a backup file, and **Restore backup** to load it again, for example on a new phone.
- On iPhone, the home-screen app and Safari keep separate data. Use the one you installed.

## Sources

Food ratings and the reintroduction protocol come from:

- *IBS and the Low FODMAP diet*, a UK hospital dietetics diet sheet.
- *Dieta baja en FODMAPs*, Sociedad Española de Endocrinología y Nutrición (SEEN), Hospital La Paz, Madrid.
- The [IBS Diets FODMAP food list](https://www.ibsdiets.org/fodmap-diet/fodmap-food-list/), for extra foods and portion sizes.

Where sources disagree, the stricter rating is used. For exact portions, use the [Monash University FODMAP app](https://www.monashfodmap.com/).

## Tests

The app checks itself. 19 self-checks run on every load, over the parts where a quiet mistake would
matter most:

- **The label matcher:** that `leche sin lactosa` and `lactose-free milk` pass while plain `leche`
  is flagged, that `maltodextrina` is not read as malt, that `fosfato` is not read as FOS, that
  `trazas de leche` is ignored, that polyol E-numbers are caught, and that each flagged ingredient
  reports the right position in the list.
- **The reintroduction state machine:** that an unfinished test has no result, that one moderate
  score fails a test, that three clean days pass it, and that a partial result reports the last
  dose tolerated.
- **Restored backups:** that a backup file with an out-of-range symptom score is rejected instead
  of corrupting your progress.
- **The data itself:** no duplicate food names, every challenge food exists in `FOODS`, and every
  food, note, dose and scanner result has Spanish text.

If a check fails, the app shows a red banner instead of showing results that might be wrong.

The same checks run in CI on every push: `tools/selfcheck.mjs` loads the app in headless Chromium
and fails the build if any check failed or the page threw. Run it yourself with the app served at
port 8080:

```sh
npm install --prefix tools
./tools/node_modules/.bin/playwright install chromium
node tools/selfcheck.mjs
```

Playwright is only used by CI. The app itself still has no dependencies.

## Development

The whole app is one file, with no build step and no dependencies to install.

| File | What it is |
|------|------------|
| `index.html` | The app: styles, food data, Spanish translations (`ES`), reintroduction logic, label scanner |
| `manifest.json` | Home-screen install settings |
| `icon.svg`, `icon-*.png`, `apple-touch-icon.png` | App icons |
| `tools/selfcheck.mjs` | Runs the app's self-checks in headless Chromium for CI |
| `.github/workflows/selfcheck.yml` | Runs that on every push |

Run it locally with any static file server, for example:

```sh
python -m http.server 8080
```

Then open http://localhost:8080. The app runs self-checks on every load. If one fails, a red banner appears at the top of the app and the error is logged to the console.

All text is written in English and translated through `tr()`; the Spanish text lives in the `ES` object. When you add a food or any other text, add its Spanish version too. A self-check fails (red banner) if a food, note, dose or scanner result has no Spanish text, and any other missing text is logged to the console.

To publish, push to `main`. GitHub Pages deploys it in about a minute.
