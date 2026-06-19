import { useState } from "react";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";
import NavMenu from "./NavMenu";
import CartButton from "./CartButton";
import ProfileDropdown from "./ProfileDropdown";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-purple-700 text-white p-2 flex justify-between items-center relative z-[100] shadow-lg">
        {/* 🟢 ฝั่งซ้าย: โลโก้ และเมนูนำทางสินค้าหลัก */}
        <div className="flex items-center gap-2 md:gap-6">
          {/* 📱 Mobile Hamburger Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-white hover:bg-purple-600 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <BrandLogo />
          
          <div className="hidden md:block">
            <NavMenu />
          </div>
        </div>

        {/* ⚪ ตรงกลางบนจอคอม: แถบค้นหายาวเด่นชัด */}
        <SearchBar
          isMobileSearchOpen={isMobileSearchOpen}
          setIsMobileSearchOpen={setIsMobileSearchOpen}
        />

        {/* 🔴 ฝั่งขวา: รวบรวมชิ้นส่วนฝั่งขวาทั้งหมดให้อยู่ในกลุ่มคอนเทนเนอร์เดียวกัน */}
        <div className="flex items-center gap-1 md:gap-4">
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="md:hidden p-2 text-xl hover:bg-purple-600 rounded-full transition-colors"
          >
            🔍
          </button>

          <CartButton />
          <ProfileDropdown />
        </div>
      </nav>

      {/* 📱 Mobile Menu Drawer (Slide from Left) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] flex md:hidden">
          {/* 🖤 Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* 📦 Drawer Box */}
          <div className="relative w-[75%] max-w-sm bg-purple-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="p-4 flex justify-between items-center border-b border-purple-700/50 bg-purple-900/30">
              <span className="font-extrabold text-lg text-white tracking-widest uppercase">JAMINE MENU</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-purple-200 hover:text-white hover:bg-purple-600 rounded-lg transition-colors active:scale-95"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <NavMenu isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
