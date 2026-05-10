import BrandLogo from './02_BrandLogo';
import NavMenu from './03_NavMenu';
import CartButton from './04_CartButton';
import ProfileDropdown from './05_ProfileDropdown';

const Navbar = () => {
  return (
    <nav className="bg-purple-700 text-white p-2 flex justify-between items-center relative z-[100] shadow-lg">
      
      {/* ฝั่งซ้าย: โลโก้ และเมนูนำทางสินค้าหลัก */}
      <div className="flex items-center gap-6">
        <BrandLogo />
        <NavMenu />
      </div>

      {/* ฝั่งขวา: ปุ่มรถเข็นตะกร้าสินค้า และเมนูดรอปดาวน์ Profile */}
      <div className="flex items-center gap-4">
        <CartButton />
        <ProfileDropdown />
      </div>

    </nav>
  );
};

export default Navbar;