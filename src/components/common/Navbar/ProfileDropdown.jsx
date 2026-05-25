import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../features/auth';
import { NavLink, Link } from 'react-router-dom';

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
        className="flex items-center h-10 gap-2 bg-purple-800 hover:bg-purple-600 px-2.5 py-1 rounded-lg transition-all border border-purple-500/30 shadow-md"
      >
        <span className="text-md font-semibold tracking-wide">User Profile</span>
        <span className={`text-[12px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-11 right-0 w-56 bg-white rounded-xl shadow-2xl border border-purple-100 overflow-hidden text-slate-700 z-50 animate-in fade-in zoom-in-95 duration-150">
          
          {user ? (
            <div className="px-3.5 py-2.5 bg-purple-50/50 border-b border-purple-50">
              <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">Signed in as</p>
              <p className="text-xs font-bold text-slate-800 truncate mt-0.5">
                {user?.email || "กำลังโหลดข้อมูล..."}
              </p>
            </div>
          ) : (
            <div className="px-3.5 py-3 bg-slate-50 border-b border-slate-100 text-center">
              <p className="text-xs text-slate-500 mb-2">ยินดีต้อนรับสู่ร้านค้า</p>
              <div className="flex gap-2 justify-center">
                <Link to="/login" className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-bold transition-colors">
                  เข้าสู่ระบบ
                </Link>
                <Link to="/register" className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-bold transition-colors">
                  สมัครสมาชิก
                </Link>
              </div>
            </div>
          )}

          <div className="py-1">
            <p className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Settings</p>
            <a href="#profile" className="flex items-center px-3.5 py-1.5 text-xs font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors">
               <span className="mr-2.5 text-sm">👤</span> My Profile
            </a>
            <a href="#billing" className="flex items-center px-3.5 py-1.5 text-xs font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors">
               <span className="mr-2.5 text-sm">💳</span> Billing & Plans
            </a>
            <a href="#security" className="flex items-center px-3.5 py-1.5 text-xs font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors">
               <span className="mr-2.5 text-sm">🛡️</span> Security & Privacy
            </a>
            
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="flex items-center px-3.5 py-1.5 text-xs font-bold hover:bg-purple-50 text-purple-600 transition-colors border-t border-slate-100/60 mt-1">
                 <span className="mr-2.5 text-sm">⚙️</span> Admin Panel
              </NavLink>
            )}
          </div>

          <div className="py-1 border-t border-slate-100 bg-slate-50/30">
            <p className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Support</p>
            <a href="#help" className="flex items-center px-3.5 py-1.5 text-xs font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors">
               <span className="mr-2.5 text-sm">📖</span> Documentation
            </a>
          </div>

          {user && (
            <div className="border-t border-slate-100">
              <button 
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center"
              >
                <span className="mr-2.5 text-sm">🚀</span> Sign Out
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;