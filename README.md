# Thai Banknotes Catalogue

A museum-quality digital archive of Thai banknotes — designed to evoke the aesthetic of antique books, engravings and gold leaf.

## File Structure

```
thai-banknotes/
├── index.html          — Main page (hero, features, timeline, series)
├── catalog.html        — Full banknote catalogue with filters
├── signature.html      — Signature index
├── css/
│   └── main.css        — All styles (CSS variables, components, responsive)
├── js/
│   └── main.js         — Interactivity (scroll, filters, search, animations)
├── assets/
│   ├── images/         — Place banknote photos here (see list below)
│   └── textures/       — Paper texture PNG for overlay
└── README.md
```

## Required Images (assets/images/)

| File | Dimensions | Purpose |
|------|-----------|---------|
| `lotus-logo.png` | 72×72 | Logo fallback |
| `grand-palace-engraving.png` | 1920×1080+ | Hero background |
| `timeline-panorama.png` | 1400×400 | Timeline panoramic image |
| `feature-series.png` | 400×300 | Features card |
| `feature-notes.png` | 400×300 | Features card |
| `feature-commemorative.png` | 400×300 | Features card |
| `feature-signature.png` | 400×300 | Features card |
| `thai-banknotes-paper-texture.png` | 1200×1200 | Repeating overlay |

> Without these images the site works fully with SVG/CSS placeholders built in.

## Colour Palette

| Token | HEX |
|-------|-----|
| `--gold` | `#C6A75E` |
| `--burgundy` | `#7B2C2C` |
| `--dark-brown` | `#3D2E24` |
| `--bg-archive` | `#efe9db` |
| `--bg-page` | `#f6f2e7` |

## Typography

- **Cinzel** — headings, navigation, buttons
- **Playfair Display** — hero subtitle, card titles, italic accents
- **Source Serif 4** — body text

## Features

- Fixed header with scroll detection and blur backdrop
- Full-screen hero with animated crown SVG, shimmer text, scroll indicator and stats band
- Intersection Observer scroll reveals with staggered delays
- Interactive timeline with hover effects
- 17-series grid with hover top-border animation
- Banknote catalogue with era filter pills and grid/list toggle
- Signature search with live filtering
- Search overlay (keyboard ⎋ to close)
- Hamburger mobile navigation
- Fully responsive: desktop → tablet → mobile
