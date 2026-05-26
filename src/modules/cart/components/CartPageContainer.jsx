
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import { OrderSummaryCard } from '@/shared/components';

export default function CartPageContainer() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // โหลดข้อมูลจาก localStorage เมื่อ Component Mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setProducts(savedCart);
  }, []);

  // ฟังก์ชันช่วยบันทึกลง localStorage
  const syncCart = (updatedCart) => {
    setProducts(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const increaseQty = (id) => {
    const updated = products.map(p => p.id === id ? { ...p, quantity: p.quantity + 1 } : p);
    syncCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = products.map(p => p.id === id && p.quantity > 1 ? { ...p, quantity: p.quantity - 1 } : p);
    syncCart(updated);
  };

  const removeProduct = (id) => {
    const updated = products.filter(p => p.id !== id);
    syncCart(updated);
  };

  const subtotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-10 md:py-16">
      {/* หัวข้อหน้าและ Progress ลำดับขั้นตอนแบบมินิมอล */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <p className="text-gray-400 text-sm mt-1">You have {products.length} items in your cart</p>
        </div>
        {/* Progress Step */}
        <div className="flex items-center gap-3 text-sm font-medium">
          <span className="text-indigo-600 flex items-center gap-1.5 font-semibold">
            <span className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-xs border border-indigo-200">1</span>
            Cart
          </span>
          <div className="w-8 h-px bg-gray-200"></div>
          <span className="text-gray-400 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center text-xs border border-gray-200">2</span>
            Checkout
          </span>
        </div>
      </div>

      {/* พื้นที่แสดงผลหลัก */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        {/* รายการสินค้าฝั่งซ้าย */}
        <div className="flex-1 w-full">
          {products.length > 0 ? (
            <div className="flex flex-col">
              {products.map((product) => (
                <CartItem 
                  key={product.id}
                  product={product}
                  onIncrease={increaseQty}
                  onDecrease={decreaseQty}
                  onRemove={removeProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
              Your cart is empty
            </div>
          )}
        </div>

        {/* สรุปราคาฝั่งขวา - เปลี่ยนไปใช้ OrderSummaryCard ตัวกลาง */}
        <div className="w-full lg:w-96 sticky top-6">
          <OrderSummaryCard 
            subtotal={subtotal}
            total={subtotal}
            buttonText="Proceed to Checkout"
            onAction={() => navigate('/checkout')}
            isDisabled={products.length === 0}
          />
        </div>
      </div>
    </div>
  );
}