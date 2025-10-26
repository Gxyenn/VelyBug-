Vely Bug - Vercel Fullstack Package
==================================

This package contains your React frontend (preserved theme) and an Express backend packaged as a Vercel Serverless function.

Structure:
- frontend/    -> your React app (untouched visually)
- api/backend/ -> backend source (models/controllers/routes)
- api/index.js -> serverless Express wrapper (exports handler)
- package.json -> root scripts for vercel build
- vercel.json  -> vercel build & route config
- .env.example -> dummy env (replace with your real creds)

Important notes:
- I added .env.example with dummy MONGODB_URI, BOT_TOKEN and CHAT_ID. Replace them in Vercel dashboard as Environment Variables:
  - MONGODB_URI
  - BOT_TOKEN
  - CHAT_ID

Deploy steps (quick):
1. Push this repo to Git (GitHub/GitLab).
2. On Vercel, import the repo and deploy. Ensure Environment Variables are set in Project Settings.
3. Vercel will run the root "build" script which installs frontend deps and builds the React app, and also deploys api/index.js as a serverless function.
4. API endpoints are available under `https://<your-deploy>.vercel.app/api/...`

Notes on preserving theme:
- Frontend files are NOT modified except adding a local `.env.local` (see below) to make API base path relative to `/api` on production.
- In development, you can create `.env.local` in frontend with `REACT_APP_API_URL=http://localhost:3000/api` to test against local server.

If some frontend files have hardcoded absolute API URLs, you might need to replace them to use relative `/api` or `process.env.REACT_APP_API_URL`.


## Admin Password
You can set `adminPassword` in Settings (via PUT /api/settings) to protect admin actions from the UI. It's stored in the Settings document. In production, consider hashing or using environment-only secrets.
