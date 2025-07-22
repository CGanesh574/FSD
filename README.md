# README.md
Here is the complete `README.md` file based on the information you provided, formatted in Markdown:

---

# MERN Real Estate Platform

A full-stack real estate web application built with the **MERN** stack (MongoDB, Express.js, React, Node.js). Users can browse, create, update, and manage property listings for sale or rent.

---

## 🌟 Features

* 🔐 User authentication (Sign Up, Sign In, Google OAuth via Firebase)
* 🏠 Create, update, and delete property listings
* 🔍 Search and filter listings
* 📬 Contact property owners
* 👤 Profile management
* 🖼️ Image upload for listings
* 📱 Responsive UI built with Tailwind CSS

---

## 🔧 Tech Stack

### Frontend:

* React
* Vite
* Redux Toolkit
* Tailwind CSS
* Firebase (Authentication)

### Backend:

* Node.js
* Express.js
* MongoDB
* JSON Web Tokens (JWT)

### Others:

* Multer (for image upload)
* PostCSS

---

## 📁 Folder Structure

```
mern-real-estate-main/
├── backend/         # Node.js + Express API
├── frontend/        # React + Vite client
├── assets/          # Screenshots and assets for documentation
└── images/          # Sample property images
```

---

## 🚀 Getting Started

### ✅ Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) and npm
* [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
* Firebase project for OAuth (optional)

### 🛠️ Installation

1. **Clone the repository:**
git clone https://github.com/CGanesh574/FSD.git
cd mern-real-estate-main

2. **Install backend & frontend dependencies:**

            cd backend
            npm install

            cd ../frontend
            npm install

### ▶️ Running the App

1. **Start the backend server:**
               cd backend
               npm start

2. **Start the frontend app:**
            cd ../frontend
            npm run dev
3. **Visit the app:**
Open your browser and go to:
👉 [http://localhost:5173](http://localhost:5173)
