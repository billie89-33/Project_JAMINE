import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NavMenu = () => {
  const [isCatOpen, setIsCatOpen] = useState(false);
  const location = useLocation();

  // เช็คว่า URL ปัจจุบันกำลังอยู่ในหน้าหมวดหมู่สินค้าหรือไม่ (เช่น /category/notebook)
  const isCategoryActive = location.pathname.startsWith('/category');

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
            className="absolute top-8 left-0 w-40 bg-white rounded-lg shadow-xl border border-slate-100 py-1 text-slate-700 z-50 animate-in fade-in slide-in-from-top-1 duration-100"
          >
            {[
              { name: "Notebook", slug: "Notebook" },
              { name: "Keyboard", slug: "Keyboard" },
              { name: "Computer", slug: "Computer" },
              { name: "Monitor", slug: "Monitor" },
              { name: "Gaming Mouse", slug: "Gaming Mouse" },
              { name: "Graphics Card", slug: "Graphics Card" },
              { name: "RAM", slug: "RAM" },
              { name: "CPU", slug: "CPU" },
              { name: "Mainboard", slug: "Mainboard" }
            ].map((cat) => (
              <NavLink
                key={cat.slug}
                to={`/category/${cat.slug}`}
                onClick={() => setIsCatOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-1.5 text-xs font-medium transition-colors hover:bg-purple-50 hover:text-purple-700 ${
                    isActive ? "text-purple-700 bg-purple-50 font-bold" : "text-slate-600"
                  }`
                }
              >
                {cat.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavMenu;