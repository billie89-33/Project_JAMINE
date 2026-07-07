# 🌸 Project Jamine (Full-Stack E-Commerce Platform)

**Jamine** is a modern, high-performance, and fully featured E-Commerce platform built from scratch using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and strictly typed with **TypeScript**.

This project follows an **Enterprise Modular Architecture** to ensure high scalability, maintainability, and security for both the customer storefront and the administrative back-office.

---

## 🚀 Key Features

### 🛍️ Storefront & User Experience
- **Dynamic Product Discovery:** Advanced filtering, search functionality, and category-based navigation.
- **Seamless Cart System:** Real-time global state synchronization for the shopping cart using Custom Hooks.
- **Guest Browsing & Smart Interceptors:** Intelligent API interceptors allow guests to browse products without forced logins, gracefully handling 401 Unauthorized responses.
- **Responsive UI/UX:** Polished, professional design built with Tailwind CSS, fully optimized for mobile and desktop devices.

### 💳 Checkout & Order Management
- **Address Management:** Robust delivery address CRUD operations with default selection logic.
- **Secure Payments (PromptPay):** Instant QR code generation for secure and convenient mobile banking payments.
- **Strict Flow Control:** Order statuses (Pending, Paid, Shipped, Completed) are strictly validated on both frontend and backend to prevent illegal state transitions.

### 🛡️ Admin Dashboard (CMS)
- **Dynamic Data Visualization:** Real-time revenue charts, user growth metrics, and top product rankings.
- **Resilient Data Mapping:** Smart fallback logic in TypeScript ensures the UI never crashes even when backend data is incomplete or inconsistent (e.g., missing user names or mismatched `total` fields).
 - **Product & Content Management:** Complete CRUD capabilities for managing products, categories, stock, and news/banners.
- **Role-Based Access Control (RBAC):** Secure admin routes protected by React Context, with authentication tokens stored safely in HttpOnly Cookies.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19+ (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API & Custom Hooks
- **Icons:** Lucide React
- **API Client:** Axios (with Secure Interceptors)
- **Deployment:** Vercel

### Backend
- **Framework:** Node.js & Express.js
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (stored securely in HttpOnly Cookies)
- **File Storage:** Cloudinary (for product images & dynamic banners)
- **Deployment:** Render / Vercel (Serverless)

---

## 🏗️ Architecture Overview

The project is structured with strict separation of concerns, eliminating spaghetti code and making future features easy to implement.

### Frontend Architecture
1. **`src/shared/` (The Kernel):** Reusable UI components, global contexts (Auth, Cart), and core Axios interceptors.
2. **`src/modules/` (The Features):** Independent modules containing their own custom hooks, API services, and components (e.g., `cart`, `admin/dashboard`, `payment`).
3. **`src/pages/` (The Assembler):** Thin wrapper pages that compose modules and layouts into routable views.

### Backend Architecture
- **Controllers:** Handle HTTP requests, formatting responses, and input validation.
- **Services:** Contain the core business logic, calculations, and database interactions.
- **Models:** Mongoose schemas defining the data structure, validation rules, and relationships.
- **Middlewares:** Authentication verification, global error handling, and multipart/form-data parsing for uploads.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/billie89-33/Project_JAMINE.git
   cd Project_JAMINE
   ```

2. **Frontend Setup:**
   ```bash
   # Install dependencies
   npm install

   # Setup environment variables
   # Create a .env file based on .env.example
   VITE_API_URL=http://localhost:5000/api/v1
   
   # Start the frontend development server
   npm run dev
   ```

3. **Backend Setup:**
   *(Assuming the backend codebase is located in a `server` directory)*
   ```bash
   cd server
   
   # Install dependencies
   npm install
   
   # Setup environment variables (.env)
   MONGO_URI=mongodb://localhost:27017/jamine
   JWT_SECRET=your_super_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PORT=5000
   
   # Start the backend development server
   npm run dev
   ```

---

## 📜 Development Guidelines & Best Practices

- **Strict TypeScript (Zero Any):** The use of `any` is strictly prohibited. All API responses must be strongly typed using Interfaces or safely inferred via `unknown` with type assertions.
- **Financial Data Integrity:** All totals, discounts, and prices are calculated strictly on the backend. The frontend acts only as a presentation layer and uses `.toLocaleString()` for display formatting.
- **Security:** JWT Tokens must be stored in HttpOnly Cookies to prevent XSS attacks. LocalStorage is never used for sensitive session data.
- **Infinite Loop Prevention:** Strict dependency management is enforced in `useEffect` and `useMemo` hooks to prevent React rendering crashes.

---

## 📝 License
Copyright © 2026 Project Jamine. All rights reserved.
