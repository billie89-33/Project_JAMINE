import { NavLink } from 'react-router-dom';
import { useCart } from '@/shared/contexts/CartContext';
import { Trash2, Plus, Minus, X } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, summary, updateQuantity, removeItem, loading } = useCart();

  if (!isOpen) return null;

  const total = summary.total || 0;

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden">
      {/* 🖤 1. พื้นหลังมืดโปร่งแสง (เมื่อคลิกจะปิด Drawer) */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* 📦 2. ตัวกล่องตระกร้าสไลด์มาจากฝั่งขวา */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-slate-800 rounded-l-[40px] overflow-hidden border-l border-purple-50">
          
          {/* ส่วนหัว Drawer */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-purple-50/30">
            <div>
              <h2 className="text-lg font-black text-purple-900 flex items-center gap-2 uppercase tracking-widest">
                🛒 MY CART
              </h2>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-[0.2em] mt-1">
                {cartItems.length} ITEMS RESERVED
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 text-slate-400 hover:text-purple-600 rounded-2xl hover:bg-white transition-all hover:shadow-lg active:scale-90"
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>

          {/* รายการสินค้าภายในตะกร้า */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-purple-100">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-5 p-4 bg-slate-50/50 border border-slate-100 rounded-3xl relative group hover:border-purple-100 transition-all hover:shadow-xl hover:shadow-purple-200/20">
                  {/* Image */}
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden p-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="text-xs font-black text-slate-800 truncate uppercase tracking-tight group-hover:text-purple-600 transition-colors">{item.name}</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm scale-90 -ml-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                        >
                          <Minus size={14} strokeWidth={3} />
                        </button>
                        <span className="w-8 text-center font-black text-slate-700 text-[11px] font-mono">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                        >
                          <Plus size={14} strokeWidth={3} />
                        </button>
                      </div>
                      <p className="text-sm font-black text-slate-900">฿{item.price?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Quick Remove */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute -top-2 -right-2 p-2 bg-white border border-slate-100 text-slate-300 hover:text-rose-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                  >
                    <Trash2 size={12} strokeWidth={3} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-32 space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                  <X size={40} strokeWidth={1} />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">ไม่มีสินค้าในตะกร้า</p>
              </div>
            )}
          </div>

          {/* ส่วนสรุปราคาและปุ่มดำเนินการต่อ */}
          <div className="p-8 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Grand Total</span>
              <span className="text-2xl font-black text-slate-900">฿{total.toLocaleString()}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <NavLink 
                to="/cart" 
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-[20px] text-xs font-black uppercase tracking-widest hover:bg-purple-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                View Full Cart
              </NavLink>
              <button 
                onClick={() => { onClose(); window.location.href='/checkout'; }}
                disabled={cartItems.length === 0}
                className="w-full py-4 rounded-[20px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-purple-200 active:scale-95 disabled:opacity-50 disabled:grayscale"
              >
                Checkout Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
