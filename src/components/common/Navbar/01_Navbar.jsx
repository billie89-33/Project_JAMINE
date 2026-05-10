import { useState } from 'react'; // ✨ 1. เติมบรรทัดนี้เพื่อแก้ไขบั๊ก useState is not defined
import BrandLogo from './02_BrandLogo';
import NavMenu from './03_NavMenu';
import CartButton from './04_CartButton';
import ProfileDropdown from './05_ProfileDropdown';
import SearchBar, { MobileSearchButton } from './06_SearchBar';

const Navbar = () => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <nav className="bg-purple-700 text-white p-2 flex justify-between items-center relative z-[100] shadow-lg">
      
      {/* 🟢 ฝั่งซ้าย: โลโก้ และเมนูนำทางสินค้าหลัก */}
      <div className="flex items-center gap-6">
        <BrandLogo />
        <NavMenu />
      </div>

      {/* ⚪ ตรงกลางบนจอคอม: แถบค้นหายาวเด่นชัด */}
      <SearchBar isMobileSearchOpen={isMobileSearchOpen} setIsMobileSearchOpen={setIsMobileSearchOpen} />

      {/* 🔴 ฝั่งขวา: รวบรวมชิ้นส่วนฝั่งขวาทั้งหมดให้อยู่ในกลุ่มคอนเทนเนอร์เดียวกันอย่างถูกต้อง ไม่แตกบล็อกซ้ำซ้อน */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* ✨ ไอคอนแว่นขยายบนมือถือ */}
        <MobileSearchButton onClick={() => setIsMobileSearchOpen(true)} />
        
        {/* ✨ ปุ่มรถเข็นตะกร้าสินค้า */}
        <CartButton />
        
        {/* ✨ เมนูดรอปดาวน์ Profile */}
        <ProfileDropdown />
      </div>

    </nav>
  );
};

export default Navbar;