
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import { OrderSummaryCard } from '@/shared/components';
import { useCart } from '../hooks/useCart';
import { ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';

export default function CartPageContainer() {
  const navigate = useNavigate();
  const { 
    cartItems: products, 
    summary, 
    loading, 
    updateQuantity, 
    removeItem 
  } = useCart();

  const increaseQty = (id) => {
    const item = products.find(p => p.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const decreaseQty = (id) => {
    const item = products.find(p => p.id === id);
    if (item && item.quantity > 1) updateQuantity(id, item.quantity - 1);
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={48} className="text-purple-600 animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Syncing your cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-10 md:py-20 relative">
      
      {/* 🏔️ Decorative Background Glow */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-purple-100/20 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      {/* 🏷️ Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 text-white p-2.5 rounded-2xl shadow-lg shadow-purple-200">
              <ShoppingBag size={20} strokeWidth={3} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Shopping Cart</h1>
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">
            You have <span className="text-purple-600">{products.length} items</span> reserved in your bag
          </p>
        </div>

        {/* Navigation Step Indicator */}
        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-purple-50 shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-purple-100">
            <span className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center text-[10px] font-black">01</span>
            <span className="text-xs font-black uppercase tracking-widest">Cart</span>
          </div>
          <div className="w-4 h-[2px] bg-slate-200 rounded-full"></div>
          <div className="flex items-center gap-2 px-4 py-2 text-slate-400 opacity-50">
            <span className="w-5 h-5 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black">02</span>
            <span className="text-xs font-black uppercase tracking-widest">Checkout</span>
          </div>
        </div>
      </div>

      {/* 📦 Main Grid Area */}
      <div className="flex flex-col lg:flex-row items-start gap-12">
        
        {/* Left: Cart Items List */}
        <div className="flex-1 w-full space-y-4">
          <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-2xl shadow-purple-100/30 border border-purple-50">
            {products.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {products.map((product) => (
                  <CartItem 
                    key={product.id}
                    product={product}
                    onIncrease={increaseQty}
                    onDecrease={decreaseQty}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                  <ShoppingBag size={48} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-800">ตะกร้าของคุณยังว่างอยู่</h3>
                  <p className="text-slate-400 max-w-xs mx-auto text-sm font-medium">ลองเลือกชมสินค้าพรีเมียมของเราและเพิ่มลงในตะกร้าได้เลยครับ</p>
                </div>
                <button 
                  onClick={() => navigate('/')}
                  className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-600 transition-all active:scale-95 shadow-xl shadow-slate-100"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {products.length > 0 && (
            <button 
              onClick={() => navigate('/')}
              className="group flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-all font-black text-[10px] uppercase tracking-[0.2em] px-4 py-2"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Keep Shopping
            </button>
          )}
        </div>

        {/* Right: Summary Card */}
        <div className="w-full lg:w-[400px] lg:sticky lg:top-8">
          <OrderSummaryCard 
            subtotal={summary.subtotal}
            shipping={summary.shippingFee}
            total={summary.total}
            buttonText="Checkout Now"
            onAction={() => navigate('/checkout')}
            isDisabled={products.length === 0}
          />
          
          <div className="mt-8 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex items-start gap-4">
            <div className="text-indigo-500 mt-1">🛡️</div>
            <div className="space-y-1">
              <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Safe & Secure</h4>
              <p className="text-[9px] text-indigo-600 font-bold leading-relaxed">ข้อมูลของคุณถูกเข้ารหัสและป้องกันด้วยมาตรฐานสูงสุด ทุกรายการสั่งซื้อมีการรับประกันสินค้าแท้ 100%</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}