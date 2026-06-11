import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getCategoriesApi } from '@/modules/products/services/productApi';
import { useApi } from '@/shared/hooks/useApi';

const NavMenu = () => {
  const [isCatOpen, setIsCatOpen] = useState(false);
  const location = useLocation();

  // เช็คว่า URL ปัจจุบันกำลังอยู่ในหน้าหมวดหมู่สินค้าหรือไม่
  const isCategoryActive = location.pathname.startsWith('/category');

  // 🎣 ดึงข้อมูลหมวดหมู่จาก API
  const { data: categories, loading, execute: fetchCategories } = useApi(getCategoriesApi);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="flex items-center gap-4 text-sm font-medium pl-4 border-l border-purple-600/60">
      {/* 1. เมนู Home */}
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          `transition-colors hover:text-white ${isActive ? "text-white font-bold" : "text-purple-200"}`
        }
      >
        Home
      </NavLink>

      {/* 2. เมนู Category พร้อมดรอปดาวน์หมวดหมู่สินค้า */}
      <div 
        className="relative py-1" 
        onMouseEnter={() => setIsCatOpen(true)}
        onMouseLeave={() => setIsCatOpen(false)}
      >
        <button
          onClick={() => setIsCatOpen(!isCatOpen)}
          className={`flex items-center gap-1 transition-colors hover:text-white py-1 ${
            isCatOpen || isCategoryActive ? "text-white font-bold" : "text-purple-200"
          }`}
        >
          Category
          <span className={`text-[10px] transition-transform duration-200 ${isCatOpen ? "rotate-180" : ""}`}>▼</span>
        </button>

        {isCatOpen && (
          <div 
            className="absolute top-8 left-0 w-40 bg-white rounded-lg shadow-xl border border-slate-100 py-1 text-slate-700 z-50 animate-in fade-in slide-in-from-top-1 duration-100 max-h-80 overflow-y-auto"
          >
            {loading ? (
              <div className="px-4 py-2 text-xs text-slate-400">Loading...</div>
            ) : categories && categories.length > 0 ? (
              categories.map((cat) => {
                const name = typeof cat === 'object' ? cat.name : cat;
                return (
                  <NavLink
                    key={name}
                    to={`/category/${name}`}
                    onClick={() => setIsCatOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-1.5 text-xs font-medium transition-colors hover:bg-purple-50 hover:text-purple-700 ${
                        isActive ? "text-purple-700 bg-purple-50 font-bold" : "text-slate-600"
                      }`
                    }
                  >
                    {name}
                  </NavLink>
                );
              })
            ) : (
              <div className="px-4 py-2 text-xs text-slate-400">No categories</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavMenu;