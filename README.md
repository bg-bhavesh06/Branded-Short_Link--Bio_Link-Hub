# LinkHub — Branded Short-Link & Bio-Link Hub

> **Project Brief 04 — Bitly + Linktree Hybrid**  
> A high-speed URL shortening engine with custom vanity slugs and click telemetry analytics, alongside a customizable "Link-in-Bio" creator hub manager.

---

## 🚀 Overview

**LinkHub** is an all-in-one platform built for modern creators, developers, and brands. It combines:
1. **URL Shortener**: High-speed short links with custom vanity slugs and instant QR code generation.
2. **Link-in-Bio**: Clean, mobile-first customizable personal profile hub pages.
3. **Click Analytics & Telemetry**: Click counters, referrers, and device distribution metrics.
4. **Coss UI Primitives**: Accessible, headless-first UI components styled with Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), JavaScript
- **Styling**: Tailwind CSS v4, Plus Jakarta Sans & Caveat typography
- **Component Primitives**: Coss UI primitives built on `@base-ui/react`
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Backend (Upcoming)**: Node.js, Express.js, MongoDB (Mongoose)
- **Security & Auth (Upcoming)**: Pair Token Auth (short-lived JWT access token 15m + long-lived refresh token 7d in httpOnly cookies), express-rate-limit

---

## 📁 Project Structure

```text
LINKHUB/
├── public/
│   ├── favicon.svg                # Brand icon
│   └── avatar-bhavesh.jpg         # Profile demo avatar
├── src/
│   ├── components/
│   │   ├── ui/                    # Genuine Coss UI primitives (@base-ui/react)
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   └── badge.jsx
│   │   ├── Navbar.jsx             # Coss UI DropdownMenu + responsive mobile drawer
│   │   ├── Hero.jsx               # Headline with gradient, CTA, value propositions
│   │   ├── UrlShortenerPreview.jsx# Interactive demo with working clipboard copy
│   │   ├── BioPreview.jsx         # Bhavesh Link-in-Bio mobile card mockup
│   │   ├── FeatureCard.jsx        # Individual Coss UI feature card
│   │   ├── FeaturesSection.jsx    # 4 creator features grid
│   │   ├── TrustedCreators.jsx    # Creator platform brands
│   │   └── Footer.jsx             # Comprehensive multi-column navigation
│   ├── layouts/
│   │   └── MainLayout.jsx         # Shared layout with header and footer
│   ├── pages/
│   │   ├── LandingPage.jsx        # Complete assembled landing page
│   │   ├── LinksPage.jsx          # /links module preview
│   │   ├── BioBuilderPage.jsx     # /bio-builder module preview
│   │   ├── AnalyticsPage.jsx      # /analytics module preview
│   │   ├── FeaturesPage.jsx       # /features module preview
│   │   ├── PricingPage.jsx        # /pricing with plans
│   │   ├── BlogPage.jsx           # /blog with creator articles
│   │   ├── AboutPage.jsx          # /about with mission & specs
│   │   ├── LoginPage.jsx          # /login auth placeholder
│   │   └── SignupPage.jsx         # /signup auth placeholder
│   ├── lib/
│   │   └── utils.js               # cn helper (clsx + tailwind-merge)
│   ├── App.jsx                    # Route definitions
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Tailwind styles and theme tokens
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## ⚡ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/bg-bhavesh06/Branded-Short_Link--Bio_Link-Hub.git
cd Branded-Short_Link--Bio_Link-Hub
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
npm run preview
```

---

## 📄 License
MIT © 2026 LinkHub
