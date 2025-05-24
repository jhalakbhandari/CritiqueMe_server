# CritiqueMe_server
# Node.js Backend Project

This project is a backend API built with **Express.js**, **MongoDB**, **Prisma**, and **Passport.js** for user authentication using **Google OAuth 2.0**.

## 🧰 Tech Stack

- **Node.js** + **Express** – Web server and routing
- **MongoDB** – Database
- **Prisma** – ORM for MongoDB
- **Passport.js** – Authentication middleware
- **Google OAuth 2.0** – Third-party login
- **TypeScript** – Typed JavaScript

---

## 📁 Project Structure

project-root/
│
├── .env # Environment variables (DB URL, Google creds)
├── package.json # Dependencies and scripts
├── tsconfig.json # TypeScript configuration
├── schema.prisma # Prisma schema (defines models and DB connection)
│
├── src/
│ ├── index.ts # Entry point (starts server, applies middleware)
│ ├── config/
│ │ ├── passport.ts # Passport Google strategy setup
│ │ └── prisma.ts # Prisma client setup
│ ├── routes/
│ │ ├── index.ts # Base routes
│ │ └── authroutes.ts # Auth routes (/auth/google, /callback)
│ └── ...
└── ...

---

## 📦 Installation
git clone https://github.com/your-repo-name.git
cd project-folder
npm install

---

## ▶️ Running the App
npx prisma generate
npx prisma db push
npm run dev

---

## 📌 Notes
This project uses Prisma with a MongoDB provider.
The Prisma client is initialized in config/prisma.ts.
Authentication is handled in config/passport.ts using Google strategy.

---

## ✅ TODO

