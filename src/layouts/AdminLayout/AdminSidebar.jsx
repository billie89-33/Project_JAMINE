import { useAuth } from '@/shared/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  LogOut,
  Home
} from 'lucide-react';
import SidebarSubMenu from './SidebarSubMenu';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // ... (menuData remains unchanged)

  return (
    <aside className="w-72 bg-slate-900 shadow-2xl flex flex-col sticky top-0 h-screen">
      {/* ... (Header and Nav remain unchanged) */}

      {/* ปุ่มกลับหน้าหลักและออกจากระบบด้านล่างสุด */}
      <div className="p-6 border-t space-y-2">
        <Link 
          to="/"
          className="flex items-center gap-3 w-full p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-all text-sm font-medium group"
        >
          <Home size={20} className="group-hover:scale-110 transition-transform" />
          <span>Back to Store</span>
        </Link>

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