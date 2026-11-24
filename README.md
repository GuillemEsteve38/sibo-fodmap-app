# Low FODMAP Guide

A small web app for following the low FODMAP diet, for people with SIBO or IBS. It tells you what you can eat, guides you through the reintroduction phases, and scans ingredient labels with your phone camera.

**Try it:** https://guillemesteve38.github.io/sibo-fodmap-app/

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

## Development

The whole app is one file, with no build step and no dependencies to install.

| File | What it is |
|------|------------|
| `index.html` | The app: styles, food data, Spanish translations (`ES`), reintroduction logic, label scanner |
| `manifest.json` | Home-screen install settings |
| `icon.svg`, `icon-*.png`, `apple-touch-icon.png` | App icons |

Run it locally with any static file server, for example:

```sh
python -m http.server 8080
```

Then open http://localhost:8080. The app runs self-checks on every load. If one fails, a red banner appears at the top of the app and the error is logged to the console.

All text is written in English and translated through `tr()`; the Spanish text lives in the `ES` object. When you add a food or any other text, add its Spanish version too. A self-check fails (red banner) if a food, note, dose or scanner result has no Spanish text, and any other missing text is logged to the console.

To publish, push to `main`. GitHub Pages deploys it in about a minute.
