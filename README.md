# Premium Fancy Number Auction Platform (MERN)

Full-stack MERN auction platform with JWT auth, admin controls, bidding workflows, payment simulation, watchlist, CSV export and analytics charts.

## Project Structure

```txt
auctionsystem/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    server.js
  src/
    components/
      auction/
      common/
      layout/
      routing/
    context/
    hooks/
    pages/
    services/
    styles/
    utils/
    App.js
    index.js
```

## Setup

### Backend

1. `cd backend`
2. Copy `.env.example` to `.env`
3. `npm install`
4. `npm run dev`

### Frontend

1. `cd ..`
2. Copy `.env.example` to `.env`
3. `npm install`
4. `npm start`

## Key APIs (Thunder Client Ready)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)

### Auctions
- `GET /api/auctions`
- `GET /api/auctions/featured`
- `GET /api/auctions/category/:type`
- `GET /api/auctions/:id`
- `POST /api/auctions` (admin)
- `PUT /api/auctions/:id` (admin)
- `PATCH /api/auctions/:id/status` (admin)
- `DELETE /api/auctions/:id` (admin)
- `GET /api/auctions/admin/export/csv` (admin)

### Bids
- `POST /api/bids` (auth)
- `GET /api/bids/auction/:auctionId`
- `GET /api/bids/me` (auth)
- `GET /api/bids/admin/all` (admin)

### Payments
- `POST /api/payments/mock` (auth)
- `GET /api/payments/me` (auth)
- `GET /api/payments/admin/all` (admin)
