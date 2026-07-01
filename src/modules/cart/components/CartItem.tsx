import React from 'react';
import { CartItemType } from '@/shared/contexts/CartContext';

interface CartItemProps {
  product: CartItemType;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ product, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-purple-50 py-10 last:border-0 group">
      {/* 🖼️ ข้อมูลสินค้า */}
      <div className="flex gap-6 flex-1">
        <div className="w-28 h-28 bg-slate-50 rounded-[24px] overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center p-4 transition-all group-hover:shadow-lg group-hover:shadow-purple-100/50">
          <img 
            src={product.image || 'https://via.placeholder.com/150'} 
            alt={product.name} 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col justify-between py-1">
          <div className="space-y-1">
            <h3 className="font-black text-slate-800 text-lg leading-tight group-hover:text-purple-600 transition-colors">{product.name}</h3>
            <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.2em]">{product.brand}</p>
          </div>
          <button 
            onClick={() => onRemove(product.id)}
            className="text-rose-400 text-[10px] font-black uppercase tracking-widest text-left hover:text-rose-600 transition-colors mt-4 bg-rose-50 px-3 py-1.5 rounded-xl w-fit"
          >
            Remove Item
          </button>
        </div>
      </div>

      {/* 🔢 ตัวปรับจำนวนและราคา */}
      <div className="flex items-center justify-between sm:justify-end gap-10 w-full sm:w-auto bg-slate-50/50 p-4 sm:p-0 rounded-2xl sm:bg-transparent">
        {/* ปุ่มเพิ่มลด */}
        <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
          <button 
            onClick={() => onDecrease(product.id)} 
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all font-black text-xl active:scale-90"
          >
            -
          </button>
          <span className="w-10 text-center font-black text-slate-700 text-sm font-mono">{product.quantity}</span>
          <button 
            onClick={() => onIncrease(product.id)} 
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all font-black text-xl active:scale-90"
          >
            +
          </button>
        </div>

        {/* ราคารวมของชิ้นนั้นๆ */}
        <div className="text-right min-w-[100px] flex flex-col">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total</span>
          <span className="text-2xl font-black text-slate-900">
            ฿{(product.price * product.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;