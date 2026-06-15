# Tours Management System (MERN Stack)

A production-level tours management platform with role-based access control, secure authentication, and a modern animated UI.

## 🚀 Features
- **Clean MVC Architecture** (Node.js/Express/MongoDB)
- **Modern Premium UI** (React/Vite/TailwindCSS)
- **Secure Authentication** (JWT, Bcrypt)
- **Role-Based Authorization** (Traveler, Guide, Lead-Guide, Admin)
- **Tours CRUD** for staff members
- **Booking System** with real-time seat availability
- **Animated Interactions** (Framer Motion)

## 🛠 Tech Stack
- **Frontend**: React, TailwindCSS, Framer Motion, Axios, Lucide Icons, React Router
- **Backend**: Node.js, Express, MongoDB/Mongoose, JWT, Nodemon

## 🏁 Getting Started

### Prerequisites
- Node.js installed
- MongoDB running on `mongodb://localhost:27017/tours-management-system`

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Seed Initial Data
```bash
cd backend
node seedData.js
```

## 👥 Default Accounts (for testing)
- **Admin**: `admin@tours.com` / `password123`
- **Guide**: `guide@tours.com` / `password123`

## 📁 Project Structure
```text
backend/
├── controllers/    # API Logics
├── models/         # Database Schemas
├── routes/          # API Endpoints
├── middleware/      # Auth & Error filters
├── utils/           # Shared classes

frontend/
├── src/
│   ├── components/  # Reusable UI (TourCard, BookingCard, BookingItem, StatCard, etc.)
│   ├── pages/       # Screen views
│   ├── services/    # API & Static Assets
│   └── store/       # Global State (Auth)
```
