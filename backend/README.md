Backend for Auction System

Commands:

Install dependencies:

```powershell
cd backend
npm install
```

Start server:

```powershell
node server.js
```

Seed DB:

```powershell
node seed.js
```

Health endpoints:
- GET /api -> API ready
- GET /api/db-status -> mongoose connection status
- GET /api/plates -> list plates
- POST /api/auth/register -> register user
- POST /api/auth/login -> login user
- POST /api/bids -> place a bid
