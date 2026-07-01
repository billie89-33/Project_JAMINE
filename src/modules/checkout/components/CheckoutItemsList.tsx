import React from 'react';

interface CheckoutItem {
  id?: string;
  modelName?: string;
  name?: string;
  priceAtPurchase?: number;
  price?: number;
  image?: string;
  quantity?: number;
}

interface CheckoutItemsListProps {
  cartItems?: CheckoutItem[];
}

const CheckoutItemsList: React.FC<CheckoutItemsListProps> = ({ cartItems }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4 max-h-[350px] overflow-y-auto">
      <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider border-b border-gray-50 pb-2">Items in order</h3>
      {cartItems && cartItems.length > 0 ? (
        cartItems.map((item, index) => {
          // 🛡️ Data Mapping: รองรับทั้งหน้า Checkout (live) และหน้า Payment (snapshot)
          const name = item.modelName || item.name;
          const price = item.priceAtPurchase || item.price || 0;
          const image = item.image; // ทั้งคู่ใช้ field image เป็น string URL
          
          return (
            <div key={item.id || index} className="flex gap-4 p-2 items-center border-b border-gray-50 last:border-b-0 pb-4 last:pb-0">
              <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-2 shrink-0 overflow-hidden">
                <img src={image} alt={name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <span className="font-extrabold text-gray-900 text-xs truncate" title={name}>{name}</span>
                <div className="flex justify-between items-end mt-1">
                  <span className="text-[10px] text-slate-400 font-bold">Qty: {item.quantity}</span>
                  <span className="text-xs font-black text-purple-600">฿{price?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-6 text-xs text-gray-400 font-bold uppercase tracking-widest italic">No items found</div>
      )}
    </div>
  );
};

export default CheckoutItemsList;
