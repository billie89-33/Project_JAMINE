import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar/01_Navbar';
//import Footer from '../components/common/Footer';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ส่วนบน: Navbar ที่จะมีชื่อร้าน, ช่อง Search, และตะกร้า */}
      <Navbar />

      {/* ส่วนเนื้อหา: หน้า Home, ProductDetail, Cart จะมาโผล่ตรง <Outlet /> */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* ส่วนล่าง: Footer ของเว็บไซต์ */}
      
    </div>
  );
};

export default UserLayout;