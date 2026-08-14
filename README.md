# Bella Modest Wear

Premium modest-fashion e-commerce platform inspired by Arabian, Pakistani and
Indo-Islamic luxury fashion.

**Status:** Phase 1 — Foundation (see roadmap below)

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS v4, React Router, Framer Motion, Three.js / React Three Fiber, Axios, Lucide React
**Backend:** Node.js, Express 5, MySQL (mysql2), JWT, bcryptjs
**Database:** MySQL

## Project Structure

```
bella-modest-wear/
├── client/          React + Vite frontend
│   └── src/
│       ├── components/   ui/ (reusable primitives), three/ (3D)
│       ├── sections/     Navbar, Hero, Footer, homepage blocks
│       ├── layouts/      MainLayout
│       ├── pages/        route-level pages
│       ├── routes/       React Router config
│       ├── services/     Axios instance + API services
│       ├── constants/    design tokens (JS), categories
│       └── styles/       Tailwind theme tokens (tokens.css)
└── server/          Express + MySQL backend
    └── src/
        ├── config/       env.js, db.js
        ├── middleware/   errorHandler.js
        ├── routes/       health.routes.js (+ future modules)
        ├── utils/        ApiError, ApiResponse, asyncHandler
        └── app.js, server.js
```

## Setup

### 1. Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
```

### 2. Backend
```bash
cd server
npm install
cp .env.example .env   # fill in DATABASE_* and JWT_* values
npm run dev             # http://localhost:5000
```

### 3. Database
Create the MySQL database referenced in `server/.env` (`DATABASE_NAME`):
```sql
CREATE DATABASE bella_modest_wear;
```
Full schema arrives in Phase 3 (auth) and Phase 4 (products/orders/etc).

## Verifying it works
- Frontend: open http://localhost:5173
- Backend health check: `curl http://localhost:5000/api/health`
  → `{ "success": true, "data": { "database": "connected" | "disconnected" } }`

## Roadmap
| Phase | Scope |
|---|---|
| 1 ✅ | Project foundation, design system, homepage shell, Express+MySQL foundation |
| 2 | Auth (JWT), account dashboard, protected routes |
| 3 | Product catalog backend + shop/product pages |
| 4 | Cart + Wishlist |
| 5 | Checkout, Orders, Coupons |
| 6 | Admin panel |
| 7 | Payments (Razorpay/COD priority) |
| 8 | Reviews, Blog, Lookbook, Newsletter |
| 9 | Multilingual/RTL, SEO, performance, security audit |
| 10 | Final QA, deployment prep |

## Environment Variables
See `client/.env.example` and `server/.env.example` for the full list.
Payment, OAuth, email and Cloudinary keys are required starting Phase 2/6/7 — not needed yet.
