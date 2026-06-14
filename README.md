# Chroma Glass Dashboard

*A sleek, frosted-glass dashboard shell—layered, luminous, and built for dark-mode clarity.*

[![HTML5](https://img.shields.io/badge/HTML5-0A84FF?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](LICENSE)

## Visual Preview

![Dashboard Preview](./screenshot.png)

> If you don’t have a screenshot yet, drop one at `./screenshot.png` and GitHub will render it automatically.

## Key Features

- **Modern Glassmorphism Aesthetic**
  - Uses `backdrop-filter` / `-webkit-backdrop-filter` for the frosted, translucent look.
- **Semi-transparent, layered UI**
  - Carefully tuned borders, gradients, shadows, and opacity for readability on **dark mode**.
- **Clean Vertical Navigation Layout**
  - **Dashboard (Home view)**
  - **Analytics (Data metrics container)**
  - **User Profile (Account management)**
  - **Settings (Application configurations)**
- **Highly responsive fluid layout structures**
  - Grid-based shell that collapses gracefully on smaller screens (sidebar → stacked content).

## Project Architecture

```text
├── dashboard.html
└── glass-dashboard.css
```

## Getting Started

### 1) Clone the repository

```bash
git clone <YOUR_REPO_URL>
cd <YOUR_REPO_FOLDER>
```

### 2) Launch locally

This project is intentionally lightweight and can be run **without a build step**.

- Open **`dashboard.html`** in any modern evergreen browser:
  - **Chrome**, **Edge**, or **Firefox**

That’s it—your glass dashboard will run instantly.

## Customization Guide

The dashboard is driven by CSS variables (defined in `styles.css` and consumed by `glass-dashboard.css`).

### Tune the glass feel

In `styles.css` (or any loaded stylesheet where the variables live), adjust variables such as:

- `--glass-blur` → controls frosted blur intensity (used by `backdrop-filter: blur(var(--glass-blur))`)
- `--glass-bg` → base surface opacity
- `--glass-border` → border visibility/contrast

Example (conceptual):

```css
:root{
  --glass-blur: 22px;
  --glass-bg: rgba(255, 255, 255, 0.06);
  --glass-border: rgba(255, 255, 255, 0.14);
}
```

### Adjust primary / neon branding colors

`styles.css` also defines neon accent tokens (used throughout the theme), including:

- `--mm-neon-cyan`
- `--mm-neon-pink`
- `--mm-neon-blue`
- `--mm-neon-violet`

Change those values to match your brand palette, and the UI will automatically re-theme.

## License

Distributed under the **MIT License**.

---

**Project Name:** *Chroma Glass Dashboard*
