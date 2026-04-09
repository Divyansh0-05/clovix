# Clovix

Clovix is a fashion discovery platform that helps users find outfits that complement their skin tone. It combines skin-tone detection, a curated product catalog, account-based personalization, wishlists, and a "Personal Closet" experience that assembles complete looks instead of showing only individual products.

## Why Clovix

Choosing colors that actually suit you is hard, especially when shopping across multiple marketplaces. Clovix is built to make that easier by turning skin-tone detection into practical shopping recommendations.

With Clovix, users can:

- detect their skin tone directly in the browser using their camera
- get outfit recommendations tailored to warm, cool, or neutral undertones
- browse products fetched from external shopping sources
- save favorites to a personal wishlist
- generate complete ready-to-wear combinations in the Personal Closet
- create an account to persist preferences and skin-tone history

## Core Features

- Skin-tone detection with MediaPipe face detection and in-browser color analysis
- Personalized product recommendations filtered by skin tone and gender preference
- Authentication with JWT-based sessions
- Wishlist support for logged-in users
- Personal Closet page that builds full looks from catalog items
- Product detail modal with similar products and "You May Also Like" recommendations
- Backend catalog sync pipeline powered by SerpAPI
- Scheduled monthly sync jobs for catalog refresh and cleanup

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- MediaPipe Face Detection

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- SerpAPI integration
- node-cron for scheduled sync jobs

## Project Structure

```text
clovix/
├── src/                  # React frontend
├── server/
│   ├── config/           # DB connection
│   ├── middleware/       # Auth middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Product sync and external service logic
│   └── server.js         # Express entry point
├── package.json          # Frontend scripts and dependencies
└── README.md
```

## User Flow

1. A user lands on Clovix and can sign up, log in, or continue as a guest.
2. The user selects a gender preference to tailor recommendations.
3. They open the camera-based detector and Clovix estimates a skin-tone type.
4. Clovix fetches matching outfits from the backend catalog.
5. The user can save items to a wishlist, inspect product details, and view related recommendations.
6. In the Personal Closet view, Clovix combines pieces into complete looks based on the detected tone and selected catalog items.

## Local Development

### Prerequisites

- Node.js 18+ recommended
- npm
- MongoDB database
- SerpAPI key for catalog syncing

### 1. Clone the repository

```bash
git clone https://github.com/Divyansh0-05/clovix.git
cd clovix
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
cd ..
```

### 4. Configure environment variables

Create a root `.env` file for the frontend:

```env
VITE_API_URL=http://localhost:3000
```

Create `server/.env` for the backend:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SERPAPI_KEY=your_serpapi_key
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

## Running the App

### Start the backend

```bash
cd server
npm run dev
```

The API will run at `http://localhost:3000`.

### Start the frontend

Open a second terminal:

```bash
npm run dev
```

The frontend will usually run at `http://localhost:5173`.

## Available Scripts

### Frontend

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

### Backend

Inside `server/`:

- `npm start` - start the Express server
- `npm run dev` - start the server in watch mode

## API Overview

### Auth

- `POST /api/auth/register` - create a user account
- `POST /api/auth/login` - log in and receive a JWT
- `GET /api/auth/me` - fetch the current user profile
- `PUT /api/auth/gender` - update the saved gender preference

### Skin Tone

- `POST /api/skin-tone` - save the latest detected skin tone
- `GET /api/skin-tone/history` - fetch skin-tone history
- `GET /api/skin-tone/latest` - fetch the most recent skin-tone result

### Outfits

- `GET /api/outfits` - fetch outfits with optional filters
- `GET /api/outfits/:id` - fetch a single outfit
- `GET /api/outfits/:id/similar` - fetch similar and related items
- `GET /api/outfits/sources` - get catalog counts by source
- `POST /api/outfits/sync` - trigger a limited manual sync
- `POST /api/outfits/sync-batch` - sync a batch range

### Wishlist

- `POST /api/wishlist` - add an item to the wishlist
- `GET /api/wishlist` - fetch the current wishlist
- `DELETE /api/wishlist/:outfitId` - remove one item
- `DELETE /api/wishlist` - clear the wishlist

### Health

- `GET /api/health` - health check endpoint

## Catalog Syncing

Clovix includes a backend sync service that pulls shopping results from SerpAPI, normalizes product data, and stores it in MongoDB.

The backend also schedules monthly jobs to:

- run a full sync at the beginning of the month
- refresh batch segments later in the month
- clean up stale products after the final batch

This keeps the catalog updated without requiring a full manual refresh every time.

## Deployment Notes

- Frontend is built with Vite and can be deployed to platforms like Vercel.
- Backend is an Express API that needs access to MongoDB and SerpAPI credentials.
- Make sure deployed frontend domains are included in `ALLOWED_ORIGINS`.
- Production values should be stored in environment variables, never committed to the repo.

## Current Product Scope

Clovix currently focuses on:

- warm, cool, and neutral tone classification
- male and female catalog filtering
- Indian-market shopping queries and price ranges
- personalized clothing discovery with marketplace-linked products

## Future Improvements

- richer skin-tone analysis and better lighting compensation
- more personalization signals beyond gender and skin tone
- admin controls for product sync and catalog management
- enhanced closet styling logic and occasion-based recommendations
- stronger automated testing coverage

## Contributing

If you want to contribute:

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Open a pull request

## License

No license has been added yet. If this project is meant to be open source, adding a license file is recommended.
