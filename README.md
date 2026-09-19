# LinkHub

> **Branded Short-Link & Bio-Link Hub**  
> A high-performance URL shortening engine with custom vanity slugs and real-time click telemetry analytics, paired with a customizable mobile-first "Link-in-Bio" creator page manager.

---

## Overview

**LinkHub** is an all-in-one developer and creator platform combining:
1. **URL Shortener**: High-speed short links with automatic 6-character code generation, custom vanity slugs, and instant QR code generation/downloads.
2. **Click Analytics & Telemetry**: Non-blocking asynchronous click tracking, referrer capture, device classification (Mobile, Desktop, Tablet), and HMAC-SHA256 IP privacy hashing.
3. **Link-in-Bio Profile Hub**: Highly customizable personal profile pages with 3 distinct themes (*Minimal Light*, *Dark Slate*, and *Gradient*), custom social media links, bio links, and a standalone public route (`/bio/:username`).
4. **Coss UI Design System**: Component primitives styled with Tailwind CSS v4 and built on accessible `@base-ui/react` primitives.

---

## Features

### Authentication & Account Security
- **Pair-Token Authentication**: 15-minute short-lived JWT Access Tokens and 7-day Refresh Tokens stored in secure `httpOnly`, `SameSite=Lax` cookies.
- **Refresh Token Rotation**: Single-use refresh tokens hashed in MongoDB with automated previous session revocation.
- **Simulated Email Verification**: Secure verification token flow for assessment testing without external SMTP dependencies.
- **Password Reset**: Single-use, time-limited hashed reset tokens with automated invalidation of existing active sessions.
- **Protected Dashboard Routes**: Seamless client-side route guarding with silent session re-authentication.

### URL Shortener Engine
- **Automatic 6-Character Codes**: Unique Base62 random short codes generated with collision retry loops.
- **Custom Vanity Slugs**: Alphanumeric and hyphen custom alias support (e.g. `/r/summer-sale`) with duplicate detection and reserved route shielding.
- **Strict Protocol Validation**: Only `http://` and `https://` destination URLs accepted; dangerous protocols (`javascript:`, `data:`, `file:`) rejected.
- **Fast 302 Redirection**: Direct HTTP 302 Found redirects with non-blocking asynchronous click telemetry.

### Click Telemetry & Analytics Pipeline
- **Real-Time Telemetry**: Captures timestamp, HTTP referrer header, device classification (`Mobile`, `Desktop`, `Tablet`), and HMAC-SHA256 visitor IP hashes.
- **Dashboard Aggregations**: Clicks over time, top performing links, top traffic referrers, device distribution, and recent activity log.
- **Flexible Time Ranges**: Query analytics across `7d`, `30d`, and `90d` historical windows.

### Link Library Management
- **Search & Pagination**: Server-side MongoDB regex searching and clean limit/page offset pagination.
- **One-Click Clipboard Copy**: Instantly copy full branded short URLs.
- **QR Code Generator**: Client-side QR canvas rendering with instant PNG download.
- **Safe Deletion**: Ownership-scoped link removal with confirmation dialogs.

### Link-in-Bio Creator Hub
- **Live Preview Builder**: Real-time interactive phone simulator reflecting live profile changes.
- **Theme Engine**: Support for 3 distinct themes:
  - **Minimal Light**: Clean white card with slate typography and soft borders.
  - **Dark Slate**: Rich dark slate surface with glowing subtle highlights.
  - **Gradient**: Vibrant purple-to-indigo mesh gradient background.
- **Social & Bio Links**: Custom icon mappings for GitHub, Instagram, LinkedIn, YouTube, Twitter/X, and custom external links.
- **Standalone Public Profile**: Lightning-fast, mobile-first `/bio/:username` public endpoint.

---

## Tech Stack

### Frontend
- **Framework**: React 19, Vite 6
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4, Plus Jakarta Sans & Caveat typography
- **Component Primitives**: Coss UI primitives built on `@base-ui/react` (`Button`, `Card`, `Input`, `DropdownMenu`, `Badge`)
- **Icons**: Lucide React
- **QR Generation**: `qrcode.react`

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: `jsonwebtoken`, `bcryptjs`, `express-rate-limit`, `helmet`, `cookie-parser`, `cors`

---

## Architecture

```text
Browser / Client (React + Vite)
       │
       ├──────────────────────── (HTTP Requests + Credentials) ───────────────────────┐
       ▼                                                                               ▼
Express API Gateway (`/api/v1`)                                               Public Redirect (`/r/:shortCode`)
       │                                                                               │
       ├─ Helmet Security Headers                                                      ├─ Redirect Rate Limiter (100 req/1m)
       ├─ Strict CORS (`CLIENT_URL` + credentials)                                     ├─ MongoDB ShortLink Lookup
       ├─ JSON / Cookie Parsers                                                        ├─ Async Telemetry (`recordClick` without await)
       │                                                                               └─ HTTP 302 Found Redirect ──► Destination URL
       ├─ Rate Limiters
       │    ├─ Auth Limiter (50 req/15m)
       │    └─ Creation Limiter (30 req/15m)
       │
       ├─ Pair-Token Auth Middleware (`requireAuth`)
       │    └─ Validates `accessToken` cookie ──► Decodes `req.user.userId`
       │
       ├─ Route Controllers
       │    ├─ `authController` (Signup, Login, Refresh, Logout, Password Reset)
       │    ├─ `linkController` (ShortLink CRUD, Vanity Slugs, Search, Pagination)
       │    ├─ `analyticsController` (7d/30d/90d Aggregations, Referrers, Devices)
       │    └─ `bioController` (BioProfile CRUD, Public Bio Presentation)
       │
       ▼
MongoDB Database (Mongoose Schemas: User, ShortLink, Click, BioProfile, RefreshToken)
```

---

## Project Structure

```text
LINKHUB/
├── public/                     # Static brand assets & sample avatars
├── src/                        # React Frontend Source
│   ├── components/             # Reusable UI & Feature Components
│   │   ├── analytics/          # Analytics charts, device stats, referrer cards
│   │   ├── bio/                # Bio builder preview, theme selector, modals
│   │   ├── settings/           # Profile, security, and appearance settings
│   │   ├── ui/                 # Coss UI primitives (@base-ui/react)
│   │   └── ProtectedRoute.jsx  # Client-side auth route guard
│   ├── context/                # AuthContext & global state provider
│   ├── layouts/                # DashboardLayout & MainLayout
│   ├── pages/                  # Route view components
│   │   ├── LandingPage.jsx     # Branded landing page & previews
│   │   ├── LinksPage.jsx       # Link Library & Shortener dashboard
│   │   ├── AnalyticsPage.jsx   # Telemetry & metrics dashboard
│   │   ├── BioBuilderPage.jsx  # Link-in-Bio editor & live phone preview
│   │   ├── PublicBioPage.jsx   # Standalone public /bio/:username view
│   │   ├── SettingsPage.jsx    # User profile & account security
│   │   ├── LoginPage.jsx       # User login view
│   │   ├── SignupPage.jsx      # User registration view
│   │   ├── ForgotPasswordPage.jsx # Password reset request view
│   │   └── ResetPasswordPage.jsx  # Password reset submission view
│   ├── lib/                    # Utility helpers (`cn`)
│   ├── App.jsx                 # App routes and providers
│   ├── main.jsx                # React DOM root entry point
│   └── index.css               # Tailwind CSS v4 styling & tokens
│
├── server/                     # Express Backend Source
│   ├── config/                 # MongoDB database connection (`db.js`)
│   ├── controllers/            # Request handlers (auth, link, analytics, bio)
│   ├── middleware/             # Auth guard, rate limiters, central error handler
│   ├── models/                 # Mongoose models (User, ShortLink, Click, BioProfile, RefreshToken)
│   ├── routes/                 # Express API routes (auth, link, analytics, bio, health)
│   ├── services/               # Background services (clickService telemetry)
│   ├── utils/                  # Token utilities, Base62 generator, slug validators
│   ├── .env.example            # Backend environment variables template
│   ├── app.js                  # Express app initialization & middleware stack
│   └── server.js               # HTTP server listener
│
├── .env.example                # Frontend environment template
├── .gitignore                  # Git ignore rules (protects all .env files)
├── package.json                # Frontend package dependencies
└── README.md                   # Project documentation
```

---

## Authentication & Security

### 1. Token Lifetimes & Storage
- **Access Token**: `15 minutes` (Signed with `JWT_ACCESS_SECRET`, payload containing `{ userId }`).
- **Refresh Token**: `7 days` (Signed with `JWT_REFRESH_SECRET`).
- **Storage Strategy**: Strictly stored in `httpOnly`, `SameSite=Lax` cookies (`secure: true` in production). Zero tokens stored in `localStorage` or `sessionStorage`.

### 2. Refresh Token Rotation & Invalidation
- Refresh tokens are stored as SHA-256 hashes in MongoDB.
- On every `/refresh` request, the previous token session is revoked and replaced with a new pair.
- Logout immediately revokes the active session and clears auth cookies.
- Password resets revoke all active refresh sessions for the account.

### 3. Password Hashing & Account Verification
- Passwords encrypted with `bcryptjs` (salt work factor 10) and excluded from default queries (`select: false`).
- Password reset tokens are time-limited (1 hour) and hashed.
- Email verification simulation is integrated for assessment compliance.

### 4. Rate Limiting (`express-rate-limit`)
- **Link Creation (`POST /api/v1/links`)**: `30 requests per 15 minutes per IP`.
- **Redirect Engine (`GET /r/:shortCode`)**: `100 requests per 1 minute per IP`.
- **Authentication (`/api/v1/auth/*`)**: `50 requests per 15 minutes per IP`.
- **Standard Headers & 429 Payload**: Returns standard `RateLimit-*` headers with a clean JSON body:
  ```json
  {
    "success": false,
    "message": "Too many requests. Please try again later."
  }
  ```

### 5. Input Validation, URL Safety & Ownership Isolation
- **Strict Protocol Filtering**: Only `http://` and `https://` URLs accepted. `javascript:`, `data:`, and `file:` protocols rejected with `400 Bad Request`.
- **Custom Slug Security**: Alphanumeric and hyphen validation (`/^[a-zA-Z0-9-_]{2,30}$/`) with reserved route protection (`api`, `login`, `signup`, `admin`, etc.).
- **Strict Ownership Scoping**: All authenticated queries (`/api/v1/links`, `/api/v1/analytics`, `/api/v1/bio/me`) strictly scope database operations by `req.user.userId`.
- **Visitor Privacy**: Click telemetry hashes visitor IP addresses using HMAC-SHA256 (`IP_HASH_SECRET`), ensuring no raw IP addresses are persisted.
- **Security Headers**: `helmet` configured with cross-origin resource policy, preventing clickjacking, MIME sniffing, and XSS.

---

## Database Design

```text
User (Model)
 ├── _id (ObjectId)
 ├── email (String, unique, indexed)
 ├── password (String, select: false)
 ├── name (String)
 ├── username (String, unique, indexed)
 ├── isEmailVerified (Boolean)
 ├── ShortLinks (1-to-Many via ShortLink.user)
 │     └── Clicks (1-to-Many via Click.shortLink)
 ├── BioProfile (1-to-1 via BioProfile.user)
 └── RefreshTokens (1-to-Many via RefreshToken.user)
```

### Models & Indexes

| Model | Key Fields | Indexes & Constraints |
| :--- | :--- | :--- |
| **`User`** | `email`, `password`, `name`, `username`, `isEmailVerified` | `email` (unique), `username` (unique) |
| **`ShortLink`** | `user`, `originalUrl`, `shortCode`, `createdAt` | `shortCode` (unique), compound index `{ user: 1, createdAt: -1 }` |
| **`Click`** | `shortLink`, `timestamp`, `referrer`, `deviceType`, `ipHash` | compound index `{ shortLink: 1, timestamp: -1 }` |
| **`BioProfile`** | `user`, `username`, `avatar`, `displayName`, `bio`, `socialLinks`, `bioLinks`, `theme` | `user` (unique), `username` (unique) |
| **`RefreshToken`** | `user`, `tokenHash`, `expiresAt`, `revokedAt` | `tokenHash` (unique), TTL index `{ expiresAt: 1 }`, `{ user: 1, revokedAt: 1 }` |

---

## API Documentation

All API endpoints are versioned under `/api/v1` except for the public redirect engine at `/r/:shortCode`.

### 1. Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Auth | Request Body / Query | Success Response (200/201) | Errors |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/signup` | None | `{ name, username, email, password }` | `{ success: true, message: "...", user, simulatedVerificationToken }` | `400`, `409` |
| `POST` | `/api/v1/auth/verify-email` | None | Query `?token=...` or Body `{ token }` | `{ success: true, message: "Email verified successfully..." }` | `400` |
| `POST` | `/api/v1/auth/login` | None | `{ email, password }` | `{ success: true, message: "...", user }` *(Sets cookies)* | `400`, `401` |
| `POST` | `/api/v1/auth/refresh` | Cookie | *(Requires `refreshToken` cookie)* | `{ success: true, message: "...", user }` *(Rotates cookies)* | `401` |
| `POST` | `/api/v1/auth/logout` | Cookie | *(Requires `refreshToken` cookie)* | `{ success: true, message: "Logged out successfully" }` | `200` |
| `GET` | `/api/v1/auth/me` | JWT Cookie | None | `{ success: true, user }` | `401` |
| `POST` | `/api/v1/auth/forgot-password` | None | `{ email }` | `{ success: true, message: "...", simulatedResetToken }` | `400` |
| `POST` | `/api/v1/auth/reset-password` | None | `{ token, newPassword }` | `{ success: true, message: "Password reset successful..." }` | `400` |

### 2. URL Shortener Endpoints (`/api/v1/links` & `/r/:shortCode`)

| Method | Endpoint | Auth | Parameters / Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/links` | Required | `{ originalUrl, customSlug? }` | Creates short link (30 req/15m rate limit). Returns `{ success: true, link: { id, originalUrl, shortCode, shortUrl, createdAt } }`. |
| `GET` | `/api/v1/links` | Required | Query `?search=...&page=1&limit=10` | Returns paginated links for authenticated user: `{ success: true, links: [...], pagination: { total, page, limit, totalPages } }`. |
| `DELETE` | `/api/v1/links/:id` | Required | Path `:id` | Deletes short link if owned by authenticated user. Returns `{ success: true, message: "..." }`. |
| `GET` | `/r/:shortCode` | None | Path `:shortCode` | Public redirect (100 req/1m rate limit). Records async telemetry and responds with `302 Found` `Location: <originalUrl>`. |

### 3. Dashboard Analytics Endpoints (`/api/v1/analytics`)

| Method | Endpoint | Auth | Query Parameters | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/analytics/overview` | Required | `?range=7d\|30d\|90d` | Aggregates total clicks, unique visitors, average daily clicks, returning visitors. |
| `GET` | `/api/v1/analytics/clicks-over-time` | Required | `?range=7d\|30d\|90d` | Returns chronological array of `{ date, clicks }` for chart plotting. |
| `GET` | `/api/v1/analytics/top-links` | Required | `?range=7d\|30d\|90d` | Returns top 5 clicked short links with percentage share. |
| `GET` | `/api/v1/analytics/top-referrers` | Required | `?range=7d\|30d\|90d` | Returns top traffic sources (e.g. Direct, Google, Twitter). |
| `GET` | `/api/v1/analytics/devices` | Required | `?range=7d\|30d\|90d` | Returns device distribution counts and percentages (`Mobile`, `Desktop`, `Tablet`). |
| `GET` | `/api/v1/analytics/recent` | Required | `?limit=10` | Returns latest click events with device and referrer details. |

### 4. Link-in-Bio Endpoints (`/api/v1/bio`)

| Method | Endpoint | Auth | Request Body / Path | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/bio/me` | Required | None | Retrieves authenticated user's BioProfile data: `{ success: true, data: { profile } }`. |
| `PUT` | `/api/v1/bio/me` | Required | `{ username, displayName, bio, avatar, theme, socialLinks, bioLinks }` | Upserts authenticated user's BioProfile. Validates theme (`Minimal Light`, `Dark Slate`, `Gradient`). |
| `GET` | `/api/v1/bio/:username` | None | Path `:username` | Public bio lookup. Returns clean public fields without sensitive credentials. |

### 5. Health Check Endpoint

| Method | Endpoint | Auth | Response (200 OK) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | None | `{ "success": true, "message": "LinkHub API is running" }` |

---

## Frontend Routes

### Public Routes
- `/`: Branded landing page with features overview and interactive product previews.
- `/login`: User authentication login page.
- `/signup`: New user registration page.
- `/forgot-password`: Account recovery request page.
- `/reset-password`: Account password reset page.
- `/bio/:username`: Standalone, mobile-first public Link-in-Bio profile page.
- `/features`, `/pricing`, `/blog`, `/about`: Platform information pages.

### Protected Dashboard Routes (Requires Authentication)
- `/links`: Main URL shortening engine, Link Library management, QR preview/download, and search.
- `/analytics`: Real-time telemetry dashboard with clicks-over-time charts, device breakdowns, and top referrers.
- `/bio-builder`: Interactive Link-in-Bio creator with live phone simulator and theme switcher.
- `/settings`: Account profile, appearance preferences, and security settings.

---

## Environment Variables

### Server Configuration (`server/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Express server port | `5000` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/linkhub` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |
| `PUBLIC_APP_URL` | Branded base URL for short links | `http://localhost:5173` |
| `JWT_ACCESS_SECRET` | Secret key for signing 15m access tokens | `your_jwt_access_secret_here` |
| `JWT_REFRESH_SECRET` | Secret key for signing 7d refresh tokens | `your_jwt_refresh_secret_here` |
| `JWT_ACCESS_EXPIRES_IN` | Access token duration | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token duration | `7d` |
| `PASSWORD_RESET_SECRET` | Secret key for signing password reset tokens | `your_password_reset_secret_here` |
| `IP_HASH_SECRET` | HMAC secret key for hashing visitor IPs | `your_ip_hash_hmac_secret_here` |
| `NODE_ENV` | Runtime environment | `development` |

---

## Local Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0 or higher running locally or a MongoDB Atlas URI

### Step-by-Step Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/bg-bhavesh06/Branded-Short_Link--Bio_Link-Hub.git
   cd Branded-Short_Link--Bio_Link-Hub
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Configure Environment Variables**:
   Create `server/.env` based on `server/.env.example`:
   ```bash
   cp server/.env.example server/.env
   ```
   *(Ensure MongoDB is running on `mongodb://127.0.0.1:27017/linkhub` or provide your connection URI).*

---

## Running the Application

Open two terminal windows:

### Terminal 1: Backend Server (Port 5000)
```bash
cd server
npm run dev
```
*Backend server starts at `http://localhost:5000`.*

### Terminal 2: Frontend Client (Port 5173)
```bash
npm run dev
```
*Frontend application starts at `http://localhost:5173`.*

---

## Testing

The backend includes test suites verifying:
- **Authentication & Token Rotation**: Access/refresh token issuance, rotation, and session invalidation.
- **Short Links & 302 Redirects**: 6-character short code generator, vanity slugs, URL validation, and HTTP 302 redirection.
- **Click Telemetry**: Non-blocking asynchronous click logging, referrer tracking, device classification, and HMAC IP hashing.
- **Rate Limiting**: IP-based rate limiting on creation (`POST /api/v1/links`) and redirect (`GET /r/:shortCode`).
- **Resource Ownership**: Scoped database queries isolating links, analytics, and bios between users.

---

## Build

To compile and validate the production bundle:

```bash
npm run build
```

**Result**: 0 errors. Generates optimized HTML, CSS, and minified JavaScript assets in `dist/`.

---

## Deployment

LinkHub is designed for seamless, containerless production deployment on modern cloud platforms (such as Render, Railway, Vercel, Netlify, or AWS).

### 1. MongoDB Atlas Configuration
1. Create a free or dedicated cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user with read/write privileges.
3. Whitelist inbound IP addresses (`0.0.0.0/0` for serverless/cloud platforms).
4. Obtain the connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/linkhub?retryWrites=true&w=majority
   ```

---

### 2. Backend Deployment (e.g., Render / Railway)
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start` *(Executes `node server.js`)*
- **Health Check Path**: `/api/v1/health`

#### Required Backend Environment Variables:
| Variable | Value (Production) | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables secure HTTPS cookies and disables stack traces in error responses |
| `PORT` | `5000` (or host assigned) | Express listening port |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas connection string |
| `CLIENT_URL` | `https://your-frontend-domain.com` | Exact frontend origin for CORS with credentials |
| `PUBLIC_APP_URL` | `https://your-frontend-domain.com` | Base URL used for generated short links & QR codes |
| `JWT_ACCESS_SECRET` | *(64-char random hex string)* | Secret for signing 15m access tokens |
| `JWT_REFRESH_SECRET` | *(64-char random hex string)* | Secret for signing 7d refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | Access token lifespan |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token lifespan |
| `PASSWORD_RESET_SECRET` | *(64-char random hex string)* | Secret for signing password reset tokens |
| `IP_HASH_SECRET` | *(64-char random hex string)* | Secret for HMAC-SHA256 privacy IP hashing |

---

### 3. Unified All-in-One Vercel Deployment (Frontend + Backend)
LinkHub is pre-configured with `vercel.json` and `api/index.js` to deploy **both the React frontend and Express serverless backend together** in one single Vercel project:
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Framework preset: `Vite`.
3. Set your Production Environment Variables in Vercel Dashboard:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://...` (your Atlas connection string)
   - `CLIENT_URL`: `https://your-vercel-domain.vercel.app`
   - `PUBLIC_APP_URL`: `https://your-vercel-domain.vercel.app`
   - `JWT_ACCESS_SECRET`: `your_access_secret`
   - `JWT_REFRESH_SECRET`: `your_refresh_secret`
   - `PASSWORD_RESET_SECRET`: `your_reset_secret`
   - `IP_HASH_SECRET`: `your_ip_secret`
4. Click **Deploy**. Vercel will automatically build the React Vite UI into static assets and deploy the backend APIs (`/api/v1/*`) and short-link redirect engine (`/r/:shortCode`) as serverless functions.

---

### 4. Alternative: Separate Frontend & Backend (Render / Railway + Vercel / Netlify)
- **Backend (Render / Railway)**: Root `server`, Build `npm install`, Start `npm start`.
- **Frontend (Vercel / Netlify)**: Root `./`, Build `npm run build`, Output `dist`. Set `VITE_API_URL` to your backend URL and `VITE_APP_URL` to your frontend URL.

---

### 5. Production Security & HTTPS Requirements
- **HTTPS Enforced**: When `NODE_ENV=production`, authentication cookies (`accessToken`, `refreshToken`) automatically set `secure: true`. Both frontend and backend are served over HTTPS.
- **CORS Alignment**: `CLIENT_URL` on the backend must precisely match the domain hosting the frontend to allow credentialed cookies.
- **Secrets Management**: Never commit `.env` files to source control. Configure all sensitive keys directly through your cloud provider's Environment Variables dashboard.

---

## Key Technical Decisions

1. **Pair-Token Auth in `httpOnly` Cookies**: Prevents XSS token theft by ensuring access and refresh tokens cannot be accessed via JavaScript `document.cookie` or browser `localStorage`.
2. **Refresh Token Rotation with Hash Storage**: Stores SHA-256 hashes of refresh tokens rather than raw tokens in MongoDB. Each refresh invalidates the prior token to protect against token replay attacks.
3. **Non-Blocking Asynchronous Click Telemetry**: Telemetry logging executes asynchronously during `GET /r/:shortCode` without awaiting database writes, guaranteeing near-instant 302 redirection speeds.
4. **HMAC-SHA256 IP Hashing**: Hashes visitor IP addresses using a dedicated secret (`IP_HASH_SECRET`) to ensure strict visitor privacy compliance while enabling unique visitor analytics calculations.
5. **Client-Side QR Canvas Rendering**: Leverages `qrcode.react` on the frontend to render and export high-resolution PNG QR codes instantly without placing rendering load on the Express backend.
6. **Server-Side Pagination & Regex Searching**: Avoids fetching entire collections into memory by performing pagination and indexed search queries directly in MongoDB.
7. **Modular Rate Limiting**: Employs separate `express-rate-limit` configurations for creation (30 req/15m) and redirect (100 req/1m) routes to accommodate differing traffic patterns.
8. **Helmet Security Headers**: Applies security headers across all API routes to safeguard against MIME sniffing, clickjacking, and cross-site scripting vulnerabilities.

---

## Important Notes

- **Simulated Verification Flow**: Email verification and password reset flows generate secure simulated tokens in responses for testing and assessment evaluation without requiring third-party SMTP relay setup.
- **QR Public Short URL**: QR codes dynamically encode the full short URL (`${PUBLIC_APP_URL}/r/${shortCode}`) to ensure instant smartphone camera scanning.
- **Environment Isolation**: `.env` files are strictly excluded from Git tracking via `.gitignore`.

---

## License

MIT © 2026 LinkHub
