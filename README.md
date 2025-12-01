# GStore Careers Portal

## Overview

This project demonstrates a basic full‑stack job posting and application system with an admin dashboard for reviewing applications.

In a real production environment, additional features such as secure authentication, persistent databases, server‑side validation, and cloud deployment would be implemented.

---

## Features

### Public Users

* Browse available job vacancies
* View job descriptions
* Submit job applications with uploaded resume

### Admin User

* Login to access admin dashboard
* Review list of applications
* Filter applications by vacancy
* View applicant details

### Assignment Notes

* This project intentionally uses simplified logic and hardcoded values for demonstration.
* **Hardcoded Admin Credentials:**

  * **Email:** `admin@gstore.com`
  * **Password:** `admin123`
* These are visible in the source code (`frontend/src/services/auth.js`)

---

## Tech Stack

### Frontend

* React Vite
* React Router
* Basic CSS modules

### Backend

* Node.js + Express
* File‑based JSON storage (instead of a real database)

### In a real-world project, I would implement

* A dedicated database (PostgreSQL / MongoDB / Firebase)
* Real authentication (JWT + hashed passwords)
* File upload storage via AWS S3 or similar
* Centralized logging and analytics

---

## Running the Project

### 1. Backend

```
cd backend
npm install
node server.js
```

The backend runs on **http://localhost:5000**.

### 2. Frontend

```
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**.

---

## How the Admin Login Works

* No database or authentication service is used.
* Credentials are checked entirely in the browser using:

  * `ADMIN_EMAIL = "admin@gstore.com"`
  * `ADMIN_PASSWORD = "admin123"`
* Successful login sets `localStorage.setItem("isAdmin", "true")`.
* Protected routes simply check localStorage.

### In a real-world project, I would implement

* Secure sessions or JWT tokens
* Server‑side authentication verification
* Password hashing (bcrypt)
* Logout token invalidation
* Role-based access control

---

## Future Improvements

If this assignment were expanded into a real production project, I would enhance it with:

* **Database integration** for vacancies, applications, and users
* **File uploads** stored securely in cloud storage
* **Improved UI/UX** with a design system (Material UI, Tailwind, etc.)
* **Search and filters** for job vacancies
* **Email notifications** to applicants
=======
