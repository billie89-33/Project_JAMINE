import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { NavLink, Link } from 'react-router-dom';
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  LogOut, 
  LayoutDashboard,
  LogIn,
  UserPlus
} from 'lucide-react';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center h-10 gap-2 bg-purple-800 hover:bg-purple-600 px-3 py-1 rounded-xl transition-all border border-purple-500/30 shadow-md group"
      >
        <div className="w-6 h-6 rounded-full bg-purple-700 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
          <User size={14} className="text-purple-100" strokeWidth={2.5} />
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-purple-50">Profile</span>
        <span className={`text-[10px] text-purple-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-60 bg-white rounded-[24px] shadow-2xl border border-purple-50 overflow-hidden text-slate-700 z-50 animate-in fade-in zoom-in-95 duration-200">
          
          {user ? (
            <div className="px-5 py-4 bg-purple-50/30 border-b border-purple-50/50">
              <p className="text-[9px] font-black text-purple-400 uppercase tracking-[0.2em]">Logged in as</p>
              <p className="text-xs font-black text-slate-800 truncate mt-1">
                {user?.username || user?.email || "User"}
              </p>
            </div>
          ) : (
            <div className="px-5 py-5 bg-slate-50 border-b border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Welcome to Jamine</p>
              <div className="flex flex-col gap-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-200"
                >
                  <LogIn size={14} /> Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <UserPlus size={14} /> Register
                </Link>
              </div>
            </div>
          )}

          <div className="py-2">
            <p className="px-5 py-2 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Management</p>
            <Link 
              to="/profile?tab=me" 
              onClick={() => setIsOpen(false)}
              className="flex items-center px-5 py-3 text-[11px] font-bold text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-all group"
            >
               <User size={16} className="mr-3 text-slate-400 group-hover:text-purple-500" strokeWidth={2.5} /> 
               Personal Info
            </Link>
            <Link 
              to="/profile?tab=orders" 
              onClick={() => setIsOpen(false)}
              className="flex items-center px-5 py-3 text-[11px] font-bold text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-all group"
            >
               <Package size={16} className="mr-3 text-slate-400 group-hover:text-purple-500" strokeWidth={2.5} /> 
               Order History
            </Link>
            <Link 
              to="/profile?tab=addresses" 
              onClick={() => setIsOpen(false)}
              className="flex items-center px-5 py-3 text-[11px] font-bold text-slate-600 hover:bg-purple-50 hover:text-purple-700 transition-all group"
            >
               <MapPin size={16} className="mr-3 text-slate-400 group-hover:text-purple-500" strokeWidth={2.5} /> 
               Address Book
            </Link>
            
            {user?.role === 'admin' && (
              <div className="mt-2 pt-2 border-t border-slate-50">
                <NavLink 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-5 py-3 text-[11px] font-black text-purple-600 hover:bg-purple-50 transition-all group"
                >
                   <LayoutDashboard size={16} className="mr-3 text-purple-400 group-hover:text-purple-600" strokeWidth={2.5} /> 
                   Admin Dashboard
                </NavLink>
              </div>
            )}
          </div>

          {user && (
            <div className="border-t border-slate-50 mt-1">
              <button 
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-5 py-4 text-[11px] font-black text-rose-500 hover:bg-rose-50 transition-all flex items-center group"
              >
                <LogOut size={16} className="mr-3 text-rose-300 group-hover:text-rose-500" strokeWidth={2.5} /> 
                Sign Out Account
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;