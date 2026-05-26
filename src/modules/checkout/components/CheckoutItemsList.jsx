import React from 'react';

const CheckoutItemsList = ({ cartItems }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4 max-h-[350px] overflow-y-auto">
      <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider border-b border-gray-50 pb-2">Items in order</h3>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.id} className="flex gap-4 p-2 items-center border-b border-gray-50 last:border-b-0 pb-4 last:pb-0">
            <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-2 shrink-0">
              <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <span className="font-extrabold text-gray-900 text-xs truncate max-w-[150px]">{item.name}</span>
              <span className="text-[11px] text-gray-400 mt-0.5">จำนวน: {item.quantity} ชิ้น</span>
              <span className="text-xs font-black text-purple-600 mt-1">฿{item.price?.toLocaleString()}.00</span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-xs text-gray-400">ไม่มีสินค้าในตะกร้า</div>
      )}
    </div>
  );
};

export default CheckoutItemsList;
