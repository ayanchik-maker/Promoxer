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
2. **Profile** — name, age, gender, city (localized to ₸ KZT), budget slider.
3. **Interests** — pick categories; these drive the recommendation ranking.
4. **Feed** — personalized, localized product cards aggregated from mock marketplaces
   (AliExpress, Amazon, Temu, eBay, SHEIN). Items matching your interests/budget rank first
   and show a *“Matches your interests”* reason.
5. **Product detail** — individual vs. group price, savings, group progress to the minimum batch.
6. **Join group purchase** — joining advances the progress bar; when the minimum batch is
   reached the **wholesale price unlocks** for everyone.
7. **My Groups / Profile** — track joined groups, total savings, and your SIM/eSIM-verified profile.

State persists in `localStorage`. Use **Profile → Reset demo data** for a fresh walkthrough.

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
  data.js           cities, categories, marketplaces, ~16 mock products
  recommend.js      scoreProduct() + recommendFeed() — explainable ranking
  components.jsx     reusable UI (PhoneFrame, ProductCard, ProgressBar, SimBadge, …)
  screens.jsx        SIM / Register / Interests / Feed / Detail / Groups / Profile
  app.jsx            store, routing, localStorage persistence, mount
```
