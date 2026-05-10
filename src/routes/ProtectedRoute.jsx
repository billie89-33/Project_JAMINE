import { Navigate, Outlet } from 'react-router-dom';

// 💡 เพิ่มการรับค่า props ชื่อ children เข้ามาใช้งาน
const ProtectedRoute = ({ isAllowed, redirectPath = '/login', children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  // ✨ ถ้ามีการส่งแบบครอบแท็กให้ดึง children มาแสดง ถ้าไม่มีให้ใช้ <Outlet /> ตามปกติ
  return children ? children : <Outlet />;
};

export default ProtectedRoute;