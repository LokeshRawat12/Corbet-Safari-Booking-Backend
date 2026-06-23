# Corbet Booking Backend

This folder contains a minimal backend API for the Corbet Booking frontend project.

## ✅ What it provides

- REST API for **zones** (list + detail)
- REST API for **bookings** (create + list + detail)
- JSON file persistence via **lowdb** (no external database required)
- Validation + error handling + CORS support

## 🚀 Getting started

From the `backend/` folder:

```bash
npm install
npm run seed    # creates initial data (zones + sample bookings)
npm run dev     # start server in dev mode (nodemon)
```

The server runs on `http://localhost:4000` by default.

## 📡 API Endpoints

### Zones
- `GET /api/zones` - list all zones
- `GET /api/zones/:slug` - fetch a specific zone

### Bookings
- `GET /api/bookings` - list all bookings
- `GET /api/bookings/:id` - fetch a single booking
- `POST /api/bookings` - create a new booking

## 🧠 Notes

- Data is stored in `backend/src/db.json`.
- Running `npm run seed` will reset that file to the seeded state.
