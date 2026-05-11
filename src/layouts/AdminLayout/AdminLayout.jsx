import { Outlet } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import AdminSidebar from './AdminSidebar'; // 🆕 นำเข้าชิ้นส่วน Sidebar ตัวใหม่

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans select-none">
      
      {/* แถบเมนูดร็อปดาวน์ฝั่งซ้าย */}
      <AdminSidebar />

      {/* ฝั่งขวา: พื้นที่แสดงผลเนื้อหาแต่ละเพจหลังบ้าน */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-sm font-medium">Admin</span>
            <ChevronRight size={14} />
            <span className="text-sm text-slate-800 font-bold">Management System</span>
          </div>
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">GM</div>
        </header>

        <section className="flex-1 p-10 overflow-y-auto bg-slate-50">
          <div className="max-w-6xl mx-auto">
             <Outlet /> 
          </div>
        </section>
      </main>

    </div>
  );
};

export default AdminLayout;