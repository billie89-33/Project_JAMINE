import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getCategoriesApi } from '@/modules/products/services/productApi';
import { useApi } from '@/shared/hooks/useApi';

const NavMenu = ({ isMobile = false, onClose }) => {
  const [isCatOpen, setIsCatOpen] = useState(false);
  const location = useLocation();

  // เช็คว่า URL ปัจจุบันกำลังอยู่ในหน้าหมวดหมู่สินค้าหรือไม่
  const isCategoryActive = location.pathname.startsWith('/category');

  // 🎣 ดึงข้อมูลหมวดหมู่จาก API
  const { data: categories, loading, execute: fetchCategories } = useApi(getCategoriesApi);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Wrapper Class สำหรับ Mobile และ Desktop
  const containerClass = isMobile 
    ? "flex flex-col gap-2 p-4 text-base font-medium" 
    : "flex items-center gap-4 text-sm font-medium pl-4 border-l border-purple-600/60";

  return (
    <div className={containerClass}>
      {/* 1. เมนู Home */}
      <NavLink 
        to="/" 
        onClick={isMobile ? onClose : undefined}
        className={({ isActive }) => 
          `transition-colors hover:text-white ${isMobile ? "py-3 border-b border-purple-700/50" : ""} ${isActive ? "text-white font-bold" : "text-purple-200"}`
        }
      >
        Home
      </NavLink>

      {/* 2. เมนู Category พร้อมดรอปดาวน์หมวดหมู่สินค้า */}
      <div 
        className={`relative ${isMobile ? "" : "py-1"}`} 
        onMouseEnter={!isMobile ? () => setIsCatOpen(true) : undefined}
        onMouseLeave={!isMobile ? () => setIsCatOpen(false) : undefined}
      >
        <button
          onClick={() => setIsCatOpen(!isCatOpen)}
          className={`flex items-center gap-1 transition-colors hover:text-white w-full text-left ${isMobile ? "py-3 border-b border-purple-700/50 justify-between" : "py-1"} ${
            isCatOpen || isCategoryActive ? "text-white font-bold" : "text-purple-200"
          }`}
        >
          Category
          <span className={`text-[10px] transition-transform duration-200 ${isCatOpen ? "rotate-180" : ""}`}>▼</span>
        </button>

        {isCatOpen && (
          <div 
            className={
              isMobile 
                ? "bg-purple-900/50 rounded-lg mt-2 py-2 animate-in fade-in slide-in-from-top-2 duration-200" 
                : "absolute top-8 left-0 w-40 bg-white rounded-lg shadow-xl border border-slate-100 py-1 text-slate-700 z-50 animate-in fade-in slide-in-from-top-1 duration-100 max-h-80 overflow-y-auto"
            }
          >
            {loading ? (
              <div className={`px-4 py-2 text-xs ${isMobile ? "text-purple-300" : "text-slate-400"}`}>Loading...</div>
            ) : categories && categories.length > 0 ? (
              categories.map((cat) => {
                const name = typeof cat === 'object' ? cat.name : cat;
                return (
                  <NavLink
                    key={name}
                    to={`/category/${name}`}
                    onClick={() => {
                      setIsCatOpen(false);
                      if (isMobile && onClose) onClose();
                    }}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm font-medium transition-colors ${
                        isMobile 
                          ? isActive ? "text-white bg-purple-600/50 font-bold" : "text-purple-200 hover:bg-purple-800 hover:text-white"
                          : isActive ? "text-purple-700 bg-purple-50 font-bold" : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
                      }`
                    }
                  >
                    {name}
                  </NavLink>
                );
              })
            ) : (
              <div className={`px-4 py-2 text-xs ${isMobile ? "text-purple-300" : "text-slate-400"}`}>No categories</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavMenu;