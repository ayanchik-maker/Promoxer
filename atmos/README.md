# Atmos

A mobile app for monitoring temperature and humidity sensors, implemented from the
Claude Design project [`Dashboard.dc.html`](https://claude.ai/design/p/6329670a-6c0d-4fa8-a4f5-18df0077b54c?file=Dashboard.dc.html).

Zero-build, like the Promoxer app at the repository root: React 18 + Babel via CDN,
no Node, no npm.

## Run it

From the repository root:

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then open **http://localhost:5173/atmos/**. (Promoxer stays at `/`.)

The UI renders inside a simulated iPhone frame on wide screens and goes full-bleed
below 460px, so a device-toolbar viewport shows the real mobile layout.

## Screens

| Screen | Reached from |
| --- | --- |
| Welcome / login | app start — Google, email or phone all sign in |
| Dashboard | Dashboard tab — greeting, online/alert counters, sensor cards with sparklines |
| Rooms | Rooms tab — compact device list, `+` starts pairing |
| History | History tab — sensor chips select the 24h chart |
| Settings | Settings tab or the dashboard avatar |
| Sensor detail | tapping any sensor card or row |
| Alerts & thresholds | the ALERTS counter, Settings, or a detail screen's *Thresholds* |
| Pairing | the `+` in Rooms, or the empty state |
| Empty state | shown in place of the browsing tabs when no sensors are paired |

## What works

- **EN / RU** throughout, switched in Settings.
- **°C / °F**, converting readings, chart axes, min/avg/max and thresholds alike.
- **Thresholds** — the sliders drive the `ABOVE LIMIT` badge and the dashboard alert count.
- **Activation** — deactivating a sensor greys its reading and clears its warning.
- **Pairing** — scanning → network list → password → connecting → naming, appending a
  real new sensor with its own generated history.

Sensor readings come from a seeded PRNG (`src/data.js`), so every reload draws the same
24-point history. There is no persistence: state resets on refresh.

## Structure

```
index.html        CDN React/Babel + script loading order
styles.css        keyframes, range inputs, :active press states, mobile breakpoint
src/
  data.js         seeded series maths, palette, mock sensors, networks, EN/RU strings
  ios-frame.jsx   iPhone bezel, status bar, dynamic island, home indicator
  screens.jsx     one component per screen, plus the tab bar and shared chart bits
  app.jsx         state, renderVals() derivation, routing, mount
```
