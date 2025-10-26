Vely Bug - Fullstack package
===========================

This archive contains your original frontend (untouched) and the new backend.

Structure:
- frontend/    -> your original React app (theme and UI preserved)
- backend/     -> Node.js + Express + MongoDB backend (API server)

Important:
- I did NOT modify UI/theme files. The frontend is copied as-is.
- To run backend:
  1. cd backend
  2. cp .env.example .env and edit MONGO_URI, PORT if needed
  3. npm install
  4. npm run dev (or npm start)

- To run frontend (example):
  1. cd frontend
  2. Create file .env.local with content:
     REACT_APP_API_URL=http://localhost:3000/api
  3. npm install
  4. npm start

If your frontend already includes API base URLs hardcoded, replace them to use REACT_APP_API_URL or contact me and I'll patch specific files (without changing UI).

Developer: Gxyenn DEV (provided seed developer key 'Gxyenn969')
