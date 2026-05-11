import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  LogOut 
} from 'lucide-react';
import SidebarSubMenu from './SidebarSubMenu';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // 📝 1. รวบรวมชุดข้อมูลเมนูทั้งหมดตามภาพตัวอย่างของคุณ
  const menuData = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    subNav: [
      
      { title: 'Analytics', path: 'analytics' } 
    ]
  },
  {
    title: 'Ecommerce',
    icon: <ShoppingBag size={20} />,
    subNav: [
      
      { title: 'Products', path: 'products' },
      { title: 'Product Details', path: 'product-details' },
      { title: 'Add Product', path: 'add-product' },
      { title: 'Order', path: 'order' },
      { title: 'Order Details', path: 'order-details' },
      { title: 'Advertising', path: 'advertising' },
      { title: 'Shipping', path: 'shipping' }
    ]
  }
];

  return (
    <aside className="w-72 bg-slate-900 shadow-2xl flex flex-col sticky top-0 h-screen">
      {/* ส่วนหัว Sidebar */}
      <div className="p-8 text-center border-b text-white">
        <h1 className="text-2xl font-black text-white tracking-widest uppercase">
          GM <span className="text-pink-600">JAMINE</span>
        </h1>
      </div>

      {/* โซนรายชื่อเมนูนำทาง */}
      <nav className="flex-grow p-6 space-y-3 overflow-y-auto">
        <p className="text-xs font-bold text-white uppercase tracking-widest mb-4">Main Menu</p>
        
        {menuData.map((item, index) => (
          <SidebarSubMenu key={index} item={item} />
        ))}
      </nav>

      {/* ปุ่มออกจากระบบด้านล่างสุด */}
      <div className="p-6 border-t text-white">
        <button 
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;