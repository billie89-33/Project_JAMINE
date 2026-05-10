import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 
import { Outlet } from "react-router-dom";

// Layouts
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

// โครงสร้างหน้าเว็บจำลองเดิมของคุณ
const TempPage = ({ name }) => <div className="p-10 font-bold text-xl text-purple-900">{name} Page (จำลอง)</div>;

// ✨ เพิ่ม Layout จำลองสำหรับหน้า Auth (มีโครงกล่องตรงกลางและปุ่มสลับหน้า)
const TempAuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-800">MY STORE</h1>
          <p className="text-sm text-slate-500 mt-1">กรุณาเข้าสู่ระบบหรือสมัครสมาชิกเพื่อใช้งาน</p>
        </div>
        
        {/* หน้า Login / Register ย่อยจะมาแสดงผลตรง Outlet นี้ */}
        <Outlet /> 
      </div>
    </div>
  );
};

// 🔒 1. คอมโพเนนต์พิเศษสำหรับคัดกรองและปกป้องสิทธิ์แต่ละหน้าเว็บ
const ProtectedRouteWrapper = ({ allowedRole = null, redirectPath = "/login" }) => {
  const { user } = useAuth();

  // เงื่อนไขที่ 1: ตรวจสอบว่ามีการล็อกอินเข้าสู่ระบบแล้วหรือยัง
  let isAllowed = !!user;

  // เงื่อนไขที่ 2: ถ้าเข้าเงื่อนไขแรกผ่าน และระบุบทบาทเฉพาะเจาะจง (เช่น หน้าแอดมิน)
  if (isAllowed && allowedRole && user?.role !== allowedRole) {
    isAllowed = false;
  }

  return <ProtectedRoute isAllowed={isAllowed} redirectPath={redirectPath} />;
};

// 🔒 คอมโพเนนต์พิเศษป้องกันไม่ให้ผู้ใช้ที่ล็อกอินแล้วเข้าหน้า Login / Register ซ้ำซ้อน
const GuestRouteWrapper = () => {
  const { user } = useAuth();
  // ถ้าล็อกอินแล้วกดเข้าหน้า Auth จะโดนดีดส่งกลับไปที่หน้าแรกสุด (Home) อัตโนมัติ
  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  {
    // --- 1. กลุ่มหน้าลูกค้า (User Side) ---
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <TempPage name="Home" /> },
      
      // หน้าที่ต้อง Login ก่อนถึงจะเห็น (Nested Protected)
      {
        element: <ProtectedRoute isAllowed={true} />, 
        children: [
          // { path: "checkout", element: <TempPage name="Checkout" /> },
          // { path: "profile", element: <TempPage name="User Profile" /> },
        ],
      },
    ],
  },

  {
     // --- 2. กลุ่มหน้าแอดมิน (Admin/GM Side) ---
  path: "/admin",
  element: <ProtectedRoute isAllowed={true} redirectPath="/" />, // ปล่อยให้คืนค่า <Outlet /> โล่งๆ
  children: [
    {
      // ใช้ Layout ครอบกลุ่มหน้าทั้งหมดด้านในอีกทีหนึ่ง
      element: <AdminLayout />, 
      children: [
        { index: true, element: <TempPage name="Admin Dashboard" /> },
        // { path: "add-product", element: <TempPage name="Add Product" /> },
      ]
    }
  ],
},

  {
    // --- 3. หน้ากลุ่ม Auth (ใช้ Layout จำลองร่วมกัน) ✨ ---
    element: <TempAuthLayout />,
    children: [
      {
        path: "/login",
        element: (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded text-center text-blue-700 font-bold">
              🔑 ฟอร์ม Login (จำลอง)
            </div>
            <p className="text-sm text-center text-slate-600">
              ยังไม่มีบัญชี? <a href="/register" className="text-blue-600 underline font-medium">สมัครสมาชิก</a>
            </p>
          </div>
        )
      },
      {
        path: "/register",
        element: (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded text-center text-green-700 font-bold">
              📝 ฟอร์ม Register (จำลอง)
            </div>
            <p className="text-sm text-center text-slate-600">
              มีบัญชีอยู่แล้ว? <a href="/login" className="text-blue-600 underline font-medium">เข้าสู่ระบบ</a>
            </p>
          </div>
        )
      }
    ]
  },

  {
    // --- 4. Catch All (404) ---
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;