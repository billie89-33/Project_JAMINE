import { createBrowserRouter, Navigate, Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Layouts
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/user/HomePage";
import CategoryPage from "../pages/user/CategoryPage";
import ProductDetailPage from "../pages/user/ProductDetailPage";

import CartPage from "../pages/user/CartPage";

// โครงสร้างหน้าเว็บจำลอง
const TempPage = ({ name }) => (
  <div className="p-10 font-bold text-xl text-purple-900">
    {name} Page (จำลอง)
  </div>
);

// 🔒 Wrapper สำหรับ Admin Routes - guard ให้เฉพาะ admin role
const AdminRouteGuard = () => {
  const { user } = useAuth();
  if (!user || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <AdminLayout />;
};

// 🔒 Wrapper สำหรับ Auth Routes - ไม่ให้ login user เข้าซ้ำ
const AuthRouteGuard = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return <AuthLayout />;
};

const router = createBrowserRouter([
  {
    // --- 1. กลุ่มหน้าลูกค้า (User Side) ---
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "category/:type", element: <CategoryPage /> },
      { path: "product/:productId", element: <ProductDetailPage /> },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      { path: "cart", element: <CartPage /> },
      //{ path: "checkout", element: <CheckoutPage /> },
      
    ],
  },

  {
    // --- 2. กลุ่มหน้าแอดมิน (Admin Side) - มีการ guard role ---
    path: "/admin",
    element: <AdminRouteGuard />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <TempPage name="Admin Analytics" /> },
      { path: "products", element: <TempPage name="Manage Products" /> },
    ],
  },

  {
    // --- 3. หน้ากลุ่ม Auth (ใช้ AuthLayout + Guard ไม่ให้ login user เข้า) ---
    element: <AuthRouteGuard />,
    children: [
      {
        path: "/login",
        element: (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <LoginPage />
            </div>
            <p className="text-sm text-center text-gray-600">
              ยังไม่มีบัญชี?{" "}
              <Link
                to="/register"
                className="text-blue-600 underline font-medium"
              >
                สมัครสมาชิก
              </Link>
            </p>
          </div>
        ),
      },
      {
        path: "/register",
        element: (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <RegisterPage />
            </div>
            <p className="text-sm text-center text-gray-600">
              มีบัญชีอยู่แล้ว?{" "}
              <Link to="/login" className="text-blue-600 underline font-medium">
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        ),
      },
    ],
  },

  {
    // --- 4. Catch All (404) ---
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
