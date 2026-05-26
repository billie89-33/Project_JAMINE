import { useState } from 'react';
import CartDrawer from './CartDrawer';

const CartButton = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const cartCount = 3; 

  return (
    <>
      {/* ปุ่มใสโปร่งสบายตาแบบไม่มีกรอบ */}
      <button 
        onClick={() => setIsDrawerOpen(true)}
        className="relative p-2 text-purple-100 hover:text-white transition-colors flex items-center justify-center rounded-lg"
      >
        {/* ✨ ไอคอนรูปถุงชอปปิ้ง (Shopping Bag Icon) ลายเส้นสากล คมชัด 100% */}
        <svg 
          xmlns="w3.org" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.8} 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" 
          />
        </svg>

        {/* ตัวเลขแจ้งเตือน (Badge) จัดวางตำแหน่งให้แมตช์เข้ากับทรงของถุงพอดี */}
        {cartCount > 0 && (
          <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-purple-700 shadow-sm">
            {cartCount}
          </span>
        )}
      </button>

      {/* แถบสไลด์ข้างตะกร้าสินค้า (Drawer) ยังคงเปิดใช้งานได้เหมือนเดิม */}
      <CartDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </>
  );
};

export default CartButton;