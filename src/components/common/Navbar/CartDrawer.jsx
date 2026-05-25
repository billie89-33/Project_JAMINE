import { NavLink } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // จำลองข้อมูลสินค้า (อนาคตดึงมาจาก CartContext เช่นเดียวกัน)
  const cartItems = [
    { id: 1, name: "Gaming Keyboard RGB", price: 1290, qty: 1, img: "🎹" }, 
    { id: 2, name: "Wireless Gaming Mouse", price: 590, qty: 2, img: "🖱️" }
  ];

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden">
      {/* 🖤 1. พื้นหลังมืดโปร่งแสง (เมื่อคลิกจะปิด Drawer) */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* 📦 2. ตัวกล่องตระกร้าสไลด์มาจากฝั่งขวา */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-slate-800">
          
          {/* ส่วนหัว Drawer */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
            <h2 className="text-sm font-black text-purple-900 flex items-center gap-2">
              🛒 ตะกร้าสินค้าของคุณ
            </h2>
            <button 
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors text-xs"
            >
              ✕ ปิด
            </button>
          </div>

          {/* รายการสินค้าภายในตะกร้า */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl relative">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-xl shadow-sm">
                  {item.img}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">จำนวน: {item.qty} ชิ้น</p>
                  <p className="text-xs font-black text-purple-700 mt-1">{item.price.toLocaleString()} บาท</p>
                </div>
              </div>
            ))}
          </div>

          {/* ส่วนสรุปราคาและปุ่มดำเนินการต่อ */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-500">ราคารวมทั้งสิ้น:</span>
              <span className="text-sm font-black text-slate-900">{total.toLocaleString()} บาท</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <NavLink 
                to="/cart" 
                onClick={onClose}
                className="block text-center bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                ดูตะกร้าเต็ม
              </NavLink>
              <NavLink 
                to="/checkout" 
                onClick={onClose}
                className="block text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-xs font-bold transition-colors shadow-md shadow-purple-200"
              >
                สั่งซื้อสินค้า
              </NavLink>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;