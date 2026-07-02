<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/utensils-crossed.svg" width="80" height="80" alt="TableFlow Logo">
  <h1>TableFlow</h1>
  <p><strong>A Next-Generation Restaurant Reservation & Table Allocation Platform</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 🚀 Overview
TableFlow is a full-stack, enterprise-grade restaurant reservation platform built with a modern monorepo architecture. It elegantly solves the complex problem of dynamic table allocation by automatically pairing parties with the most optimal table sizes while guaranteeing zero double-bookings via atomic database transactions.

## ✨ Features
- **Smart Allocation Engine:** Automatically assigns the smallest available table that fits the party size.
- **Atomic Transactions:** Uses Mongoose sessions to prevent race conditions and double-bookings.
- **Role-based Dashboards:** Separate workflows for `CUSTOMER` (booking) and `ADMIN` (management).
- **Premium UI:** Built with shadcn/ui, Tailwind CSS, and Framer Motion for a flawless user experience.
- **RESTful API:** Clean architecture pattern for the Node.js backend.

## 🏗️ Monorepo Architecture
TableFlow is organized as a monorepo for developer velocity:
- `/backend`: The Express + Node.js + MongoDB API.
- `/frontend`: The Next.js 15 App Router client.

## ⚙️ Quick Start

### 1. Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas cluster URL

### 2. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=your_atlas_connection_string
JWT_SECRET=supersecretkey_change_in_production
JWT_EXPIRE=30d
NODE_ENV=development
```

### 3. Installation
Install both frontend and backend dependencies using the root workspace command:
```bash
npm run install:all
```

### 4. Database Seeding (Optional)
To populate your database with 10 tables and an Admin user:
```bash
cd backend
npm run seed
cd ..
```

### 5. Running the Application
Start both the API and the Client simultaneously using `concurrently`:
```bash
npm run dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API Docs (Swagger):** [http://localhost:5000/api/docs](http://localhost:5000/api/docs)

## 🔐 Default Credentials
If you ran the seed script, you can log in as Admin:
- **Email:** admin@tableflow.com
- **Password:** password123

## 🛠️ Built With
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, Axios.
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, express-validator, Swagger.

---
<div align="center">
  <i>Designed for flawless dining experiences.</i>
</div>