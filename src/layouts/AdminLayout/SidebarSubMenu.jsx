import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const SidebarSubMenu = ({ item, activeLink, normalLink }) => {
  const [subnav, setSubnav] = useState(false);
  const showSubnav = () => setSubnav(!subnav);

  return (
    <div className="space-y-1">
      {/* หัวข้อเมนูหลัก (เช่น Dashboard, Ecommerce) */}
      <button
        onClick={showSubnav}
        className="w-full flex items-center justify-between p-3 text-white hover:bg-slate-800 hover:text-white rounded-lg transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          {item.icon}
          <span className="font-medium">{item.title}</span>
        </div>
        {/* ไอคอนลูกศรแสดงสถานะ กาง/พับ */}
        <span className="text-[10px] text-slate-500 transition-transform duration-200">
          {subnav ? '▲' : '▼'}
        </span>
      </button>

      {/* รายการเมนูย่อย (แสดงผลเมื่อกดเปิดกางออกมา) */}
      {subnav && (
        <div className="pl-9 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {item.subNav.map((subItem, index) => (
            <NavLink
              key={index}
              to={subItem.path}
              className={({ isActive }) => 
                `block p-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm font-bold' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`
              }
            >
              {subItem.title}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarSubMenu;