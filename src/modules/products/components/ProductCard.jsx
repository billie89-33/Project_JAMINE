import { ShoppingCart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/modules/cart';

/**
 * 🃏 ProductCard Component
 * แสดงข้อมูลสินค้าแต่ละชิ้นแบบพรีเมียม (User Side)
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // จัดการราคา (ถ้าไม่มีให้เป็น 0)
  const price = product.price || 0;
  const isOutOfStock = product.status === 'out_of_stock' || product.stock === 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // ป้องกันการ navigate ไปหน้า detail
    if (isOutOfStock) return;
    await addToCart(product._id || product.id, 1);
  };

  return (
    <div 
      onClick={() => navigate(`/product/${product._id || product.id}`)}
      className={`group bg-white rounded-[32px] border border-purple-50 shadow-sm transition-all duration-500 overflow-hidden flex flex-col h-full relative cursor-pointer ${isOutOfStock ? 'opacity-80 grayscale-[20%]' : 'hover:shadow-[0_20px_50px_rgba(124,58,237,0.15)] hover:-translate-y-1'}`}
    >
      
      {/* 🌟 Decorative Corner Glow */}
      {!isOutOfStock && <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/20 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-purple-300/30 transition-colors duration-700"></div>}

      {/* 1. Image Section with Vibrant Gradient */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/30 p-8 flex items-center justify-center">
        <img 
          src={product.image?.url || 'https://via.placeholder.com/300'} 
          alt={product.modelName}
          className={`w-full h-full object-contain transition-transform duration-700 z-10 ${!isOutOfStock ? 'group-hover:scale-110' : ''}`}
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center gap-2 backdrop-blur-[2px]">
          <button 
            className="p-4 bg-white text-purple-600 rounded-[20px] shadow-2xl hover:bg-purple-600 hover:text-white transition-all transform translate-y-6 group-hover:translate-y-0 duration-500 flex items-center gap-2 font-black text-xs uppercase tracking-widest"
          >
            <Eye size={18} strokeWidth={3} />
            View Detail
          </button>
        </div>

        {/* Brand Tag / Out of Stock Tag */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-20">
          <div className="px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-xl shadow-lg shadow-purple-100/50 border border-white">
            <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 uppercase tracking-[0.15em]">{product.brand}</span>
          </div>
          {isOutOfStock && (
            <div className="px-3 py-1.5 bg-rose-500/90 backdrop-blur-md rounded-xl shadow-lg shadow-rose-200 border border-rose-400">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.1em]">Out of Stock</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-6 flex flex-col flex-grow relative z-10">
        <div className="flex-grow space-y-2">
          <h3 className="text-sm font-black text-slate-700 line-clamp-2 leading-relaxed transition-colors duration-300 group-hover:text-purple-600">
            {product.modelName}
          </h3>
          
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className={`w-4 h-[1.5px] ${isOutOfStock ? 'bg-slate-200' : 'bg-purple-200'}`}></span>
              <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${isOutOfStock ? 'text-slate-400' : 'text-purple-400'}`}>
                {product.category}
              </p>
            </div>
            
            {/* 📊 Dynamic Stock Indicator */}
            {!isOutOfStock && product.stock > 0 && product.stock <= 5 && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                <span className="text-[10px] font-bold text-orange-500 animate-pulse">
                  🔥 สินค้าใกล้หมด! (เหลือ {product.stock} ชิ้น)
                </span>
              </div>
            )}
            
            {!isOutOfStock && product.stock > 5 && (
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] font-bold text-emerald-600">
                  ✓ มีสินค้า ({product.stock} ชิ้น)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-purple-50 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1 ml-0.5">Premium Price</span>
            <span className={`text-xl font-black flex items-start ${isOutOfStock ? 'text-slate-400' : 'text-slate-900'}`}>
              <span className={`text-xs mt-1 mr-0.5 ${isOutOfStock ? 'text-slate-400' : 'text-purple-600'}`}>฿</span>
              {price.toLocaleString()}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`group/cart relative p-4 rounded-2xl transition-all duration-300 overflow-hidden ${
              isOutOfStock 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-purple-600 active:scale-90 shadow-xl shadow-slate-100 hover:shadow-purple-200'
            }`}
          >
            <ShoppingCart size={20} strokeWidth={2.5} className="relative z-10" />
            {!isOutOfStock && <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover/cart:opacity-100 transition-opacity duration-300"></div>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
