# LinkHub

<div align="right">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://branded-linkhub.vercel.app/)
[![Screen Recording](https://img.shields.io/badge/🎥_Screen_Recording-Google_Drive-34A853?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/1dusKDS4eNDpVt-eeEM9buLeY0kvuhVjb/view?usp=sharing)
[![GitHub Repo](https://img.shields.io/badge/💻_GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/bg-bhavesh06/Branded-Short_Link--Bio_Link-Hub)
[![Resume](https://img.shields.io/badge/📄_Author_Resume-Google_Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/1-XtzpBTlgYUGDmD2kSXwELL7GeLwkhLo/view?usp=sharing)

</div>

> **Branded Short-Link & Bio-Link Hub**  
> A high-performance URL shortening engine with custom vanity slugs and real-time click telemetry analytics, paired with a full-featured, mobile-first "Link-in-Bio" creator studio and QR customization suite.

---

### 🔗 Quick Links

| Resource | Link |
| :--- | :--- |
| 🚀 **Live Production Application** | [branded-linkhub.vercel.app](https://branded-linkhub.vercel.app/) |
| 🎬 **Demo & Screen Recording** | [Watch Video on Google Drive](https://drive.google.com/file/d/1dusKDS4eNDpVt-eeEM9buLeY0kvuhVjb/view?usp=sharing) |
| 📂 **GitHub Source Code** | [bg-bhavesh06/Branded-Short_Link--Bio_Link-Hub](https://github.com/bg-bhavesh06/Branded-Short_Link--Bio_Link-Hub) |
| 📄 **Developer Resume** | [View Resume on Google Drive](https://drive.google.com/file/d/1-XtzpBTlgYUGDmD2kSXwELL7GeLwkhLo/view?usp=sharing) |

---

## ⚡ Quick Start & Run Commands

Follow these simple steps to get LinkHub running locally on your machine.

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Git**: Installed on your system

---

### 2. Clone the Repository
```bash
git clone https://github.com/bg-bhavesh06/Branded-Short_Link--Bio_Link-Hub.git
cd Branded-Short_Link--Bio_Link-Hub
```

---

### 3. Install All Dependencies
Install dependencies across the root monorepo, server, and frontend in one step:
```bash
npm run install:all
```
*(Or manually run `npm install` inside the root, `server/`, and `frontend/` folders)*

---

### 4. Configure Environment Variables

Create a `.env` file in the `server` directory:
```bash
# On Linux/macOS
cp server/.env.example server/.env

# On Windows (PowerShell)
Copy-Item server/.env.example server/.env
```

Ensure `server/.env` contains the following:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/linkhub
CLIENT_URL=http://localhost:5173
PUBLIC_APP_URL=http://localhost:5173
JWT_ACCESS_SECRET=your_jwt_access_secret_linkhub_dev_key_2026
JWT_REFRESH_SECRET=your_jwt_refresh_secret_linkhub_dev_key_2026
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PASSWORD_RESET_SECRET=your_password_reset_secret_linkhub_dev_key_2026
IP_HASH_SECRET=your_ip_hash_hmac_secret_linkhub_dev_key_2026
NODE_ENV=development
```

---

### 5. Run the Application

#### Option A: One-Command Start (Recommended)
Run both backend and frontend concurrently from the root directory:
```bash
npm run dev
```

#### Option B: Separate Terminal Sessions

**Terminal 1 (Backend API - Port 5000):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend Client - Port 5173):**
```bash
cd frontend
npm run dev
```

---

### 6. Access the App
Open your browser and navigate to:
- **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
- **Backend API Health:** [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

## 🚀 Overview

**LinkHub** is a unified developer and creator platform combining:
1. **Branded URL Shortener**: High-speed short links with automatic 6-character Base62 code generation, custom vanity slugs (e.g. `/r/summer-sale`), strict protocol safety checks, and instant QR code generation/downloads.
2. **Interactive QR Code Customizer**: Slide-over customization drawer with frame pills, color presets, brand badges, and high-resolution PNG exports.
3. **Click Telemetry & Analytics Engine**: Non-blocking asynchronous click tracking, referrer capture, device classification (Mobile, Desktop, Tablet), and HMAC-SHA256 IP privacy hashing.
4. **Link-in-Bio Creator Studio**: 4-step wizard workflow (Templates, Information, Customize, Share & QR), client-side image compression, skill highlights, project showcases, direct contact methods, social media links, and a standalone public route (`/bio/:username`).
5. **Modern UX & Security**: Seamless pair-token JWT authentication in `httpOnly` cookies, automatic dashboard redirection on login/signup, and 6-second auto-dismissing notifications with manual `(X)` close buttons.

---

## ✨ Features

### 🔐 Authentication & Session Security
- **Pair-Token Authentication**: 15-minute short-lived JWT Access Tokens and 7-day Refresh Tokens stored in secure `httpOnly`, `SameSite=Lax` cookies.
- **Refresh Token Rotation**: Single-use refresh tokens hashed with SHA-256 in MongoDB with automated prior session invalidation.
- **Instant Redirection**: Automatic redirection to the main dashboard (`/links`) upon registration or login.
- **Password Reset Flow**: Single-use, time-limited hashed reset tokens with automated session clearing.
- **Protected Client Routes**: Seamless client-side route guarding with silent session re-authentication.

### 🔗 URL Shortener Engine
- **Automatic 6-Character Codes**: Unique Base62 random short codes generated with collision retry loops.
- **Custom Vanity Slugs**: Alphanumeric and hyphen custom alias support with duplicate detection and reserved route shielding.
- **Strict Protocol Validation**: Only `http://` and `https://` destination URLs accepted; dangerous protocols (`javascript:`, `data:`, `file:`) rejected.
- **Fast 302 Redirection**: Direct HTTP 302 Found redirects with non-blocking asynchronous click telemetry.
- **QR Customizer Drawer**: Interactive drawer to customize QR foreground/background colors, frame pills, frame text, and center brand badges.

### 📊 Click Telemetry & Analytics Pipeline
- **Real-Time Telemetry**: Captures timestamp, HTTP referrer header, device classification (`Mobile`, `Desktop`, `Tablet`), and HMAC-SHA256 visitor IP hashes.
- **Dashboard Aggregations**: Clicks over time, top performing links, top traffic referrers, device distribution, and recent activity log.
- **Flexible Time Ranges**: Query analytics across `7d`, `30d`, and `90d` historical windows.

### 📱 Link-in-Bio Creator Studio
- **4-Step Wizard Workflow**:
  - **1. Templates**: Multiple curated templates (*Creator*, *Professional*, *Portfolio*, *Minimal*).
  - **2. Information**: Avatar with client-side canvas compression, cover/hero banner, display name, username slug (`/bio/:username`), job title, company, pronouns, bio description, resume/CV link, status tag, skills & highlights, project showcase, contact methods (email, phone, location), and social profiles.
  - **3. Customize**: 3 distinct themes (*Minimal Light*, *Dark Slate*, *Gradient*), button styles (*Rounded*, *Soft Card*, *Outline*), and layout styling.
  - **4. Share & QR**: Live published status pulse, copy bio link, open public page, native Web Share API integration, high-res QR download, and safe delete/reset bio modal.
- **Persistent Publishing**: Bio published status remains live across browser sessions and only resets upon explicit deletion.
- **Standalone Public Bio Page**: Mobile-first, standalone public profile route (`/bio/:username`) displaying the published bio or a clean 404 screen if removed.

### 🔔 Notification & Toast System
- **6-Second Auto-Dismissal**: All error alerts, success banners, and floating toasts automatically disappear after 6 seconds (`6000ms`).
- **Interactive Close Button (`X`)**: Instant manual dismissal option on every notification popup.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19, Vite 6
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4, Plus Jakarta Sans typography
- **Component Primitives**: Coss UI primitives built on `@base-ui/react` (`Button`, `Card`, `Input`, `Badge`)
- **Icons**: Lucide React
- **QR Generation**: `qrcode.react`

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security & Utilities**: `jsonwebtoken`, `bcryptjs`, `express-rate-limit`, `helmet`, `cookie-parser`, `cors`

---

## 🏗 Architecture

```text
Browser / Client (React 19 + Vite 6)
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
       │    ├─ `linkController` (ShortLink CRUD & Pagination)
       │    ├─ `analyticsController` (7d/30d/90d Aggregations, Referrers, Devices)
       │    └─ `bioController` (BioProfile CRUD, Unpublish, Public Presentation)
       │
       ▼
MongoDB Database (Mongoose Schemas: User, ShortLink, Click, BioProfile, RefreshToken)
```

---

## 📂 Project Structure

```text
LINKHUB/
├── frontend/                     # React 19 / Vite 6 client application
│   ├── public/                   # Static assets & public files
│   ├── src/
│   │   ├── components/           # UI & feature components
│   │   │   ├── analytics/        # Analytics charts, device distribution, referrer cards
│   │   │   ├── bio/              # Bio builder preview, cards, customizer panel, modals
│   │   │   ├── links/            # QR code customizer drawer & link cards
│   │   │   ├── settings/         # Profile, password, and security settings
│   │   │   ├── ui/               # Base UI primitives (Button, Card, Input)
│   │   │   └── ProtectedRoute.jsx# Client-side route protection
│   │   ├── context/              # AuthContext & session provider
│   │   ├── layouts/              # DashboardLayout & MainLayout
│   │   ├── lib/                  # API endpoints configuration & constants
│   │   ├── pages/                # Page components (Links, BioBuilder, Analytics, Auth)
│   │   ├── App.jsx               # Router configuration & route tree
│   │   ├── main.jsx              # Application entry point
│   │   └── index.css             # Tailwind CSS v4 design system
│   ├── index.html                # Vite HTML root
│   ├── vite.config.js            # Vite bundler configuration
│   └── package.json              # Frontend dependencies & build scripts
│
├── server/                       # Node.js / Express backend
│   ├── config/                   # MongoDB connection (`db.js`)
│   ├── controllers/              # Request handlers (auth, links, analytics, bio)
│   ├── middleware/               # Auth middleware, rate limiters, error handling
│   ├── models/                   # Mongoose models (User, ShortLink, Click, BioProfile, RefreshToken)
│   ├── routes/                   # API route definitions
│   ├── services/                 # Background telemetry & click logging services
│   ├── utils/                    # Token generators, Base62 encoding, slug validators
│   ├── app.js                    # Express app initialization & middleware stack
│   ├── server.js                 # HTTP server listener (port 5000)
│   ├── package.json              # Server dependencies & scripts
│   └── .env.example              # Server environment template
│
├── api/                          # Vercel serverless function entrypoint
│   └── index.js                  # Handler delegating to server/app.js
│
├── vercel.json                   # Vercel unified deployment configuration
├── package.json                  # Root monorepo scripts
└── README.md                     # Project documentation
```

---

## 📡 API Endpoints

### 1. Authentication (`/api/v1/auth`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/signup` | None | Registers user, provisions default bio, sets JWT cookies, and returns user object. |
| `POST` | `/api/v1/auth/login` | None | Authenticates user and issues `accessToken` & `refreshToken` in `httpOnly` cookies. |
| `POST` | `/api/v1/auth/refresh` | Cookie | Rotates refresh token and issues new token pair. |
| `POST` | `/api/v1/auth/logout` | Cookie | Revokes refresh token session and clears authentication cookies. |
| `GET` | `/api/v1/auth/me` | Cookie | Returns current authenticated user profile. |
| `POST` | `/api/v1/auth/forgot-password` | None | Generates simulated password reset token. |
| `POST` | `/api/v1/auth/reset-password` | None | Resets user password and invalidates active refresh sessions. |

### 2. URL Shortener (`/api/v1/links` & `/r/:shortCode`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/links` | Required | Creates a short link with auto-generated code or custom alias. |
| `GET` | `/api/v1/links` | Required | Returns user's paginated links with search filtering (`?search=&page=&limit=`). |
| `DELETE` | `/api/v1/links/:id` | Required | Deletes user's short link. |
| `GET` | `/r/:shortCode` | None | Public redirect endpoint (302 Found) with asynchronous click telemetry logging. |

### 3. Click Analytics (`/api/v1/analytics`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/analytics/overview` | Required | Aggregated stats: total clicks, unique visitors, daily average, returning visitors. |
| `GET` | `/api/v1/analytics/clicks-over-time` | Required | Time-series click data for chart visualization (`?range=7d\|30d\|90d`). |
| `GET` | `/api/v1/analytics/top-links` | Required | Top 5 clicked links with percentage shares. |
| `GET` | `/api/v1/analytics/top-referrers` | Required | Traffic sources breakdown (Direct, Google, YouTube, Instagram, etc.). |
| `GET` | `/api/v1/analytics/devices` | Required | Device classification distribution (`Mobile`, `Desktop`, `Tablet`). |
| `GET` | `/api/v1/analytics/recent` | Required | Recent click event stream. |

### 4. Link-in-Bio Studio (`/api/v1/bio`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/bio/me` | Required | Retrieves the authenticated user's BioProfile data. |
| `PUT` | `/api/v1/bio/me` | Required | Upserts user's BioProfile (social links, bio links, highlights, projects, contact info, theme). |
| `DELETE` | `/api/v1/bio/me` | Required | Unpublishes and deletes user's BioProfile from database. |
| `GET` | `/api/v1/bio/:username` | None | Public bio page lookup. Returns clean public fields or 404 if deleted. |

### 5. Health Check

| Method | Endpoint | Auth | Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | None | `{ "success": true, "message": "LinkHub API is running" }` |

---

## 🚀 Production Build & Deployment

### Build Validation
```bash
cd frontend
npm run build
```
*Builds production-ready static assets in `frontend/dist/` with 0 errors.*

### Unified Vercel Deployment
LinkHub is pre-configured with `vercel.json` and `api/index.js` for one-click full-stack deployment on Vercel:
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set your production environment variables (`MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`, `PUBLIC_APP_URL`, `IP_HASH_SECRET`, `NODE_ENV=production`).
4. Click **Deploy**. Vercel will host the frontend UI and deploy the backend API as serverless functions.

---

## 📜 License

MIT © 2026 LinkHub
