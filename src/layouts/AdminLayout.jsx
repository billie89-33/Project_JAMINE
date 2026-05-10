import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  PackagePlus, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';  

const AdminLayout = () => {
  const navigate = useNavigate();

  // สไตล์สำหรับปุ่มเมนูที่กำลังใช้งานอยู่ (Active)
  const activeLink = "flex items-center gap-3 p-3 bg-slate-700 text-white rounded-lg transition-all duration-200 shadow-md";
  const normalLink = "flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-700/50 hover:text-white rounded-lg transition-all duration-200";

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      
      {/* --- 1. Sidebar (แถบเมนูข้าง) --- */}
      <aside className="w-72 bg-slate-900 shadow-2xl flex flex-col sticky top-0 h-screen">
        <div className="p-8 text-center border-b border-slate-800">
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">
            GM <span className="text-blue-500">Panel</span>
          </h1>
        </div>

        <nav className="flex-grow p-6 space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
          
          {/* ปุ่ม Dashboard */}
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? activeLink : normalLink}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
            {/* คุณสามารถเพิ่มไอคอนชี้ได้ถ้าต้องการ */}
          </NavLink>

          {/* ปุ่ม Manage Banners (หน้าที่คุณส่งรูปมา) */}
          <NavLink to="/admin/manage-banners" className={({ isActive }) => isActive ? activeLink : normalLink}>
            <ImageIcon size={20} />
            <span>Manage Banners</span>
          </NavLink>

          {/* ปุ่ม Add Product */}
          <NavLink to="/admin/add-product" className={({ isActive }) => isActive ? activeLink : normalLink}>
            <PackagePlus size={20} />
            <span>Add Product</span>
          </NavLink>
        </nav>

        {/* ปุ่ม Logout ด้านล่างสุด */}
        <div className="p-6 border-t border-slate-800">
          <button 
            onClick={() => { /* ใส่ logic logout ตรงนี้ */ }}
            className="flex items-center justify-between w-full p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </div>
          </button>
        </div>
      </aside>

      {/* --- 2. Main Content (ส่วนเนื้อหาที่จะเปลี่ยนไปตาม Page) --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header ของส่วนจัดการ */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-sm font-medium">Admin</span>
            <ChevronRight size={14} />
            <span className="text-sm text-slate-800 font-bold">Management System</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              GM
            </div>
          </div>
        </header>

        {/* เนื้อหาหน้าลูกจะมาโผล่ตรง <Outlet /> */}
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