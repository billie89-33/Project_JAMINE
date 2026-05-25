import { Navigate, Outlet, useLocation  } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

// 💡 เพิ่มการรับค่า props ชื่อ children เข้ามาใช้งาน
const ProtectedRoute = ({ isAllowed, redirectPath = '/login', children }) => {
 const { user } = useAuth();
 const location = useLocation();


  // ⚠️ คำแนะนำ: ถ้าตอนนี้คุณกำลังแต่ง UI หน้าตะกร้าสินค้าอยู่ ให้พิมพ์แก้บรรทัดล่างนี้เป็น const isAuthenticated = true; ไปก่อนได้เลยครับชั่วคราว
  const isAuthenticated = !!user;

 if (!isAuthenticated) {
    toast.error("กรุณาเข้าสู่ระบบก่อนเข้าถึงหน้านี้", { id: "auth-guard" });
    return <Navigate to={redirectPath} state={{ from: location.pathname }} replace />;
  }

    // 🔄 4. วาร์ปส่งตัวไปหน้าล็อกอิน พร้อมแนบกระดานชนวนบอกทาง (state) ไปด้วยว่าเขากดมาจากหน้าไหน
    return (
      <Navigate 
        to={redirectPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // ✨ ถ้ามีการส่งแบบครอบแท็กให้ดึง children มาแสดง ถ้าไม่มีให้ใช้ <Outlet /> ตามปกติ
  return children ? children : <Outlet />;
};

export default ProtectedRoute;