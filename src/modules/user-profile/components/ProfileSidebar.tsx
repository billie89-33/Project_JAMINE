import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  MapPin, 
  ShoppingBag, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * 🧭 ProfileSidebar Component
 * เมนูนำทางด้านข้างสำหรับหน้า User Profile
 */
interface ProfileSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ activeTab, onTabChange }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'me', label: 'My Profile', icon: <User size={18} /> },
    { id: 'addresses', label: 'Address Book', icon: <MapPin size={18} /> },
    { id: 'orders', label: 'Order History', icon: <ShoppingBag size={18} /> },
  ];

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      navigate('/');
    }
  };

  return (
    <div className="w-full lg:w-80 flex flex-col gap-6">
      {/* 💳 Profile Menu Card */}
      <div className="bg-white rounded-[40px] p-6 shadow-xl shadow-purple-100/30 border border-purple-50 overflow-hidden relative group">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-purple-100 transition-colors duration-500"></div>
        
        <nav className="relative z-10 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 mb-4">Account Settings</p>
          
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-[24px] transition-all duration-300 group/btn ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200' 
                  : 'text-slate-500 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${
                  activeTab === item.id ? 'bg-white/20' : 'bg-slate-50 group-hover/btn:bg-white'
                }`}>
                  {item.icon}
                </div>
                <span className="text-sm font-black uppercase tracking-wider">{item.label}</span>
              </div>
              <ChevronRight size={14} className={`transition-transform duration-300 ${
                activeTab === item.id ? 'translate-x-1' : 'opacity-0 group-hover/btn:opacity-100 translate-x-[-10px] group-hover/btn:translate-x-0'
              }`} />
            </button>
          ))}
        </nav>

        {/* 🚀 Logout Area */}
        <div className="mt-8 pt-6 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 text-rose-500 hover:bg-rose-50 rounded-[24px] transition-all duration-300 font-black text-sm uppercase tracking-widest group/out"
          >
            <div className="p-2 bg-rose-50 group-hover/out:bg-white rounded-xl transition-colors">
              <LogOut size={18} />
            </div>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* 💡 Help & Status Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
        <div className="relative z-10">
          <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-2">Support</h4>
          <p className="text-sm font-bold leading-relaxed mb-6">Need help with your order? Our support team is here for you.</p>
          <button className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10">
            Contact Support
          </button>
        </div>
        {/* Glow Effect */}
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
