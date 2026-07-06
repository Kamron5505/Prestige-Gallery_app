# 🌹 Prestige Gallery — Premium Flower Shop

A luxury flower shop e-commerce platform with a premium, boutique feel. Built with React (Vite), Express, MongoDB, and Tailwind CSS.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite, Tailwind CSS, Framer Motion, Zustand, React Query, React Router |
| **Backend** | Node.js, Express, Mongoose, JWT Auth |
| **Database** | MongoDB |
| **Image Storage** | Cloudinary (with multer + multer-storage-cloudinary) |
| **Validation** | Zod (both frontend & backend) |

## Project Structure

```
prestige-gallery/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── store/          # Zustand stores (auth, cart)
│   │   ├── lib/            # API client
│   │   └── App.jsx         # Router setup
│   ├── tailwind.config.js  # Premium theme config
│   └── vite.config.js      # Vite + proxy setup
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API route handlers
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── validators/     # Zod schemas
│   │   ├── config/         # DB, Cloudinary config
│   │   ├── seeds/          # Seed data script
│   │   └── index.js        # Server entry point
│   └── .env                # Environment variables
└── README.md
```

## Prerequisites

- **Node.js** v18+
- **MongoDB** — local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier
- **Cloudinary** account (free tier) — [Get API keys](https://cloudinary.com/console)

## Setup Instructions

### 1. Clone & Install

```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Configure Environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your credentials:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Random string for access tokens |
| `JWT_REFRESH_SECRET` | Random string for refresh tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- **Admin:** admin@prestigegallery.com / admin123456
- **Customer:** customer@test.com / customer123456
- 6 categories & 12 sample products

### 4. Run Development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/v1

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both frontend & backend concurrently |
| `npm run dev:server` | Run backend only |
| `npm run dev:client` | Run frontend only |
| `npm run seed` | Seed database with sample data |
| `npm run build` | Build frontend for production |

## API Endpoints

### Auth
- `POST /api/v1/auth/register` — Register new user
- `POST /api/v1/auth/login` — Login
- `POST /api/v1/auth/refresh` — Refresh access token
- `POST /api/v1/auth/logout` — Logout
- `GET /api/v1/auth/me` — Get current user (auth)
- `PATCH /api/v1/auth/profile` — Update profile (auth)

### Products
- `GET /api/v1/products` — List products (filterable, sortable, paginated)
- `GET /api/v1/products/:slug` — Get product by slug
- `GET /api/v1/products/:id/related` — Get related products
- `POST /api/v1/products` — Create product (admin)
- `PUT /api/v1/products/:id` — Update product (admin)
- `DELETE /api/v1/products/:id` — Delete product (admin)

### Categories
- `GET /api/v1/categories` — List categories
- `POST /api/v1/categories` — Create category (admin)

### Favorites
- `GET /api/v1/favorites` — Get user favorites (auth)
- `POST /api/v1/favorites/:productId` — Add to favorites (auth)
- `DELETE /api/v1/favorites/:productId` — Remove from favorites (auth)

### Orders
- `POST /api/v1/orders` — Create order (auth or guest)
- `GET /api/v1/orders` — Get user orders (auth)
- `GET /api/v1/orders/:id` — Get order by ID (auth)
- `PUT /api/v1/orders/:id/status` — Update order status (admin)

## Pages & Routes

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Home — hero, featured bouquets, values, newsletter |
| `/catalog` | Filterable, sortable product grid |
| `/catalog/:slug` | Product detail with gallery |
| `/cart` | Shopping cart with promo codes |
| `/checkout` | Checkout with delivery & payment |
| `/events` | Wedding, anniversary, corporate events |
| `/login` | Sign in (split-screen layout) |
| `/register` | Create account |

### Authenticated Pages
| Route | Description |
|-------|-------------|
| `/account` | Profile management |
| `/account/favorites` | Saved products |
| `/account/orders` | Order history |

### Admin Pages
| Route | Description |
|-------|-------------|
| `/admin` | Product CRUD, order management, categories |

## Design System

- **Colors:** Charcoal/near-black, ivory/cream, gold accent, burgundy accent
- **Fonts:** Playfair Display (headings) + Inter (body)
- **Motion:** Framer Motion for page transitions, hover effects, scroll reveals
- **Components:** Custom buttons, glass-effect navbar, slide-in mobile drawer, skeleton loaders

## Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
```
Deploy the `client/dist` folder to Vercel.

### Backend (Render/Railway)
Deploy the `server/` folder with:
- Build command: `npm install`
- Start command: `node src/index.js`
- Set environment variables in the dashboard

## Promo Codes

- `PRESTIGE10` — 10% off any order
