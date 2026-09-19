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

## 🔒 Security Architecture & Hardening (Phase 9)

LinkHub implements end-to-end security hardening, granular IP-based rate limiting, pair-token authentication, and resource isolation.

### 1. Granular Rate Limiting (`express-rate-limit`)
LinkHub uses dedicated rate limiters per traffic pattern rather than a single blunt global limiter:
- **Link Creation Limiter (`POST /api/v1/links`)**: `30 requests per 15 minutes per IP`. Shields the database and URL shortening engine from automated link flood attacks.
- **Redirect Limiter (`GET /r/:shortCode`)**: `100 requests per 1 minute per IP`. Accommodates high-volume legitimate redirect traffic while protecting against DoS.
- **Authentication Limiter (`/api/v1/auth/*`)**: `50 requests per 15 minutes per IP`. Mitigates credential stuffing, brute-force login attempts, and password reset spam.
- **Standard Headers & 429 Responses**: Returns standard `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset` headers with a clean JSON payload:
  ```json
  {
    "success": false,
    "message": "Too many requests. Please try again later."
  }
  ```

### 2. Token Lifetimes & Storage
- **Access Token**: `15 minutes` (Signed with `JWT_ACCESS_SECRET`, payload containing minimal `{ userId }`).
- **Refresh Token**: `7 days` (Signed with `JWT_REFRESH_SECRET`).
- **Cookie Security**: Auth tokens are strictly stored in `httpOnly`, `SameSite=Lax` cookies (`secure: true` in production). Zero tokens in `localStorage` or `sessionStorage` to eliminate XSS token theft.

### 3. Refresh Token Rotation & Session Revocation
- Refresh tokens are single-use credentials stored as SHA-256 hashes in MongoDB.
- On every `/refresh` request, the previous token session is revoked and replaced with a new pair.
- Logout immediately revokes the session and clears all authentication cookies.
- Password resets revoke all active refresh sessions for the user account.

### 4. Password Hashing & Account Security
- Passwords are encrypted with `bcryptjs` (salt work factor 10) and excluded from default queries (`select: false`).
- Password reset tokens are time-bounded (1 hour) and hashed.
- Email verification simulation is integrated for assessment compliance without external SMTP dependencies.

### 5. Input Validation, URL Safety & Ownership
- **Strict Protocol Validation**: Only `http://` and `https://` URLs are accepted. `javascript:`, `data:`, `file:`, and unsafe protocols are rejected.
- **Custom Slug Security**: Alphanumeric and hyphen validation (`/^[a-zA-Z0-9-_]{3,30}$/`) with reserved slug protection (`api`, `login`, `signup`, `admin`, etc.).
- **Strict Ownership Isolation**: All authenticated endpoints (`/api/v1/links`, `/api/v1/analytics`, `/api/v1/bio/me`) strictly scope database queries by `req.user.userId`. Cross-user data access or deletion is impossible.
- **Privacy Preservation**: Click telemetry utilizes HMAC-SHA256 IP hashing (`IP_HASH_SECRET`) to ensure zero plaintext visitor IP addresses are stored.

### 6. HTTP & Transport Security
- **Helmet**: Adds standard security headers (Content Security Policy, frameguard, XSS filter, cross-origin resource policy).
- **CORS**: Restricted to the explicit frontend origin (`CLIENT_URL`) with `credentials: true`. Wildcard `*` origins with credentials are prohibited.
- **Secrets & Git Protection**: All secrets (`MONGODB_URI`, `JWT_*`, `IP_HASH_SECRET`) are loaded exclusively from `.env`, which is strictly ignored by Git.

---

### Authentication API Endpoints (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/signup` | Register new user, hash password with bcrypt (salt 10), and trigger simulated email verification | Rate Limited |
| `POST` | `/api/v1/auth/verify-email` | Verify email address using verification token (Simulated flow for assessment) | Rate Limited |
| `POST` | `/api/v1/auth/login` | Authenticate user, issue 15m access token & 7d refresh token in `httpOnly` cookies | Rate Limited |
| `POST` | `/api/v1/auth/refresh` | Rotate refresh token, revoke previous session in DB, issue new token pair | Rate Limited / Cookie |
| `POST` | `/api/v1/auth/logout` | Revoke active refresh session in DB and clear `httpOnly` auth cookies | Rate Limited / Cookie |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile data | Yes (`requireAuth`) |
| `POST` | `/api/v1/auth/forgot-password` | Generate simulated password reset token with generic enumeration-safe response | Rate Limited |
| `POST` | `/api/v1/auth/reset-password` | Reset password, hash new password, invalidate all existing active sessions | Rate Limited |

---

## ⚡ Getting Started

### 1. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Configuration
Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/linkhub
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=your_super_secret_access_jwt_key
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PASSWORD_RESET_SECRET=your_super_secret_reset_jwt_key
NODE_ENV=development
```

### 3. Run the Development Servers
```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm run dev

# Terminal 2: Frontend Vite App (Port 5173)
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📄 License
MIT © 2026 LinkHub
