# 🌸 Project Jamine (Frontend)

**Jamine** is a modern, high-performance E-commerce platform built with React and Vite. This project follows an **Enterprise Modular Architecture**, ensuring high scalability, maintainability, and security for high-traffic commerce operations.

---

## 🚀 Key Features

### 🛍️ Shopping Experience
- **Modular Cart System:** Seamless cart management with global state synchronization.
- **Dynamic Product Discovery:** Advanced filtering and category-based navigation.
- **Real-time Search:** Lightning-fast product search functionality.

### 💳 Checkout & Payments
- **Explicit Address Management:** Robust delivery address CRUD with default selection logic.
- **PromptPay QR Integration:** Instant QR code generation for secure mobile banking payments.
- **Financial Integrity:** Backend-driven totals and snapshots to prevent price tampering.

### 🛡️ Core Infrastructure
- **Feature-driven Architecture:** Decoupled modules for independent feature scaling.
- **Resilient API Layer:** Standardized request/response handling with automatic error recovery.
- **Responsive UI/UX:** Polished, professional design with optimized mobile experience.

---

## 🛠️ Technology Stack

- **Framework:** [React 19+](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **State Management:** React Context API (Modular Pattern)
- **Styling:** Vanilla CSS / Modern CSS Modules
- **Icons:** [Lucide React](https://lucide.dev/)
- **Routing:** [React Router 7+](https://reactrouter.com/)
- **API Client:** Axios (with Secure Interceptors)

---

## 🏗️ Architecture Overview

The project is structured into three primary layers:

1.  **`src/shared/` (The Kernel):** Reusable UI components, global contexts, and core API configurations.
2.  **`src/modules/` (The Features):** Independent modules containing their own hooks, services, and components (e.g., `cart`, `checkout`, `payment`).
3.  **`src/pages/` (The Assembler):** Thin page components that compose modules and layouts into routable views.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/billie89-33/Project_JAMINE.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your backend API URL:
   ```env
   VITE_API_URL=https://your-api-endpoint.com/api/v1
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📜 Development Guidelines

- **Standardization:** All financial displays must use `.toLocaleString()` with 2 decimal places.
- **Security:** Never calculate totals on the frontend; always trust the backend snapshot.
- **Clean Code:** Use Barrel Files (`index.js`) for module public APIs and the `@/` alias for all internal imports.

---

## 📝 License
Copyright © 2026 Project Jamine. All rights reserved.
