# Promoxer

**Collective buying, localized.** An MVP demo for a mobile service that aggregates products
from global marketplaces, gives **personalized recommendations**, and lets users **join group
purchases** to unlock wholesale prices — with a conceptual **SIM/eSIM identity** layer for
secure, password-less sign-in.

Built as a zero-build, self-contained web app (React 18 + Babel via CDN). No Node, no npm,
no Python required.

## Run it

Double-click `start.cmd`, **or** from a terminal in this folder:

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then open **http://localhost:5173** in your browser. (Use a narrow window / device toolbar
for the intended mobile look — the app renders inside a phone frame.)

> The page must be opened over `http://` (not by double-clicking `index.html`), because the
> browser loads the `.jsx` source files over the network. `serve.ps1` is a tiny built-in
> static server for exactly this.

## Demo walkthrough (the user journey)

1. **SIM/eSIM verification** — tap *Verify with SIM/eSIM ID*; a secure device-linked ID is issued.
   An **EN / РУ language switch** sits top-right (also in Profile) — the whole UI is localized.
2. **Profile** — name, age, gender, city (localized to ₸ KZT), budget slider.
3. **Interests** — pick categories; these drive the recommendation ranking.
4. **Feed** — personalized, localized product cards aggregated from mock marketplaces
   (AliExpress, Amazon, Temu, eBay, SHEIN). Items matching your interests/budget rank first
   and show a *“Matches your interests”* reason. Live activity simulation: other buyers
   join open groups every few seconds, so progress bars move during the demo.
5. **Product detail** — individual vs. group price, savings, the **source USD price
   auto-converted to ₸** (1 USD = ₸512 mock rate), deal-window countdown, and group progress.
6. **Join group purchase** — opens a **local payment sheet** (Kaspi Pay / Halyk Bank /
   Visa-Mastercard) authorized via SIM/eSIM ID; the payment is *reserved*, charged only when
   the batch completes. When the minimum batch is reached the **wholesale price unlocks**
   for everyone — with confetti.
7. **My Groups / Profile** — joined groups with their payment reservations, total savings,
   your SIM/eSIM-verified profile, and a **“How Promoxer works”** sheet explaining the
   mechanics plus the Level-2 SIM/eSIM strategic vision.

State persists in `localStorage`. Use **Profile → Reset demo data** for a fresh walkthrough.

## Deploy with GitHub and Netlify

Promoxer is a zero-build static site. Netlify reads `netlify.toml` and publishes the repository
root directly, so no build command or dependency installation is required.

1. Create an empty GitHub repository named `promoxer`. Do not initialize it with another
   README, `.gitignore`, or license.
2. Initialize this folder and push it:

```powershell
git init
git add .
git commit -m "Initial Promoxer release"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/promoxer.git
git push -u origin main
```

3. In Netlify, choose **Add new project → Import an existing project → GitHub**.
4. Authorize GitHub, select the `promoxer` repository, and use:
   - Branch: `main`
   - Base directory: leave empty
   - Build command: leave empty
   - Publish directory: `.`
5. Select **Deploy Promoxer**.

Every later push to `main` automatically creates a new production deployment:

```powershell
git add .
git commit -m "Describe the update"
git push
```

## What’s mocked (per the hackathon brief)

Real SIM/eSIM provisioning, real marketplace APIs, payments/banking, logistics, and ML are
**conceptual only** — represented in the UI and architecture, not implemented. Mock data lives
in `src/data.js`; the transparent recommendation scoring is in `src/recommend.js`.

## Project structure

```
index.html          CDN React/Babel + script loading order
styles.css          mobile-first styling, phone frame, components
serve.ps1           dependency-free static server (PowerShell)
start.cmd           one-click launcher
src/
  data.js           cities, categories, marketplaces, FX rate, payment rails, ~16 mock products
  i18n.js           EN/RU dictionary with plural-aware t() — the localization layer
  recommend.js      scoreProduct() + recommendFeed() — explainable ranking (i18n reason keys)
  components.jsx     reusable UI (Icon set, ProductCard, Sheet, Confetti, LangSwitch, …)
  screens.jsx        SIM / Register / Interests / Feed / Detail / Payment / Groups / Profile
  app.jsx            store, routing, persistence, live group-activity simulation, mount
```
