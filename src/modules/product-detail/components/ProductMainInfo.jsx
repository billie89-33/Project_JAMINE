import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ShoppingCart, Zap, ShieldCheck, Truck, Package } from 'lucide-react';
import { useCart } from '@/modules/cart';

const ProductMainInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  if (!product) return null;

  // 1. Data Mapping (v2 Standard)
  const displayName = product.modelName || product.name || 'Unknown Product';
  const displayPrice = product.price || 0;
  const displayStock = product.stock ?? product.quantity ?? 0;
  const isOutOfStock = product.status === 'out_of_stock' || displayStock === 0;
  
  const hasMultipleImages = product?.images && product.images.length > 0;
  const currentImage = hasMultipleImages
    ? product.images[activeImgIndex]
    : product?.image?.url || 'https://via.placeholder.com/600';

  const handleQuantity = (type) => {
    if (isOutOfStock) return;
    if (type === "inc" && quantity < displayStock) setQuantity(quantity + 1);
    if (type === "dec" && quantity > 1) setQuantity(quantity - 1);
  };

  const onAddToCartClick = async () => {
    if (isOutOfStock) return;
    await addToCart(product._id || product.id, quantity);
  };

  const onBuyNowClick = async () => {
    if (isOutOfStock) return;
    await addToCart(product._id || product.id, quantity);
    navigate('/cart');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl shadow-purple-100/20">
      
      {/* 📸 Left: Product Gallery */}
      <div className="space-y-6">
        <div className={`w-full aspect-square bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-center p-10 relative overflow-hidden group ${isOutOfStock ? 'opacity-80 grayscale-[20%]' : ''}`}>
          <img
            src={currentImage}
            alt={displayName}
            className={`max-h-full object-contain transition-transform duration-700 ${!isOutOfStock ? 'group-hover:scale-105' : ''}`}
          />
          
          {/* Featured Badge / Out of Stock Badge */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
            {product.isFeatured && !isOutOfStock && (
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest animate-bounce">
                ⭐ Featured
              </div>
            )}
            {isOutOfStock && (
              <div className="bg-rose-500/90 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-rose-200 border border-rose-400 uppercase tracking-widest backdrop-blur-md">
                Out of Stock
              </div>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        {hasMultipleImages && product.images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImgIndex(index)}
                className={`w-20 h-20 flex-shrink-0 bg-slate-50 rounded-2xl p-2 border-2 transition-all ${
                  activeImgIndex === index 
                    ? "border-purple-600 shadow-lg shadow-purple-100 translate-y-[-2px]" 
                    : "border-transparent hover:border-slate-200"
                }`}
              >
                <img src={img} alt="thumb" className={`w-full h-full object-contain ${isOutOfStock ? 'opacity-80 grayscale-[20%]' : ''}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 📝 Right: Info & Actions */}
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${isOutOfStock ? 'bg-slate-100 text-slate-400' : 'bg-purple-100 text-purple-600'}`}>
              {product.category}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck size={14} className={isOutOfStock ? 'text-slate-400' : 'text-emerald-500'} /> Official Warranty
            </span>
          </div>

          <div className="space-y-2">
            <p className={`text-sm font-black uppercase tracking-[0.2em] ${isOutOfStock ? 'text-slate-400' : 'text-purple-600'}`}>{product.brand}</p>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
              {displayName}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              SKU: {product.sku || product._id?.slice(-8).toUpperCase()}
            </p>
          </div>

          <div className="py-6 border-y border-slate-50 flex items-baseline gap-4">
            <span className={`text-4xl font-black ${isOutOfStock ? 'text-slate-400' : 'text-slate-900'}`}>
              ฿{displayPrice.toLocaleString()}
            </span>
            {!isOutOfStock && (
              <span className="text-slate-300 line-through text-lg font-bold">
                ฿{(displayPrice * 1.2).toLocaleString()}
              </span>
            )}
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className={`flex items-center gap-3 font-medium text-xs p-3 rounded-2xl border ${isOutOfStock ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
              <Truck size={16} className={isOutOfStock ? 'text-slate-400' : 'text-purple-500'} /> จัดส่งฟรีทั่วประเทศ
            </div>
            <div className={`flex items-center gap-3 font-medium text-xs p-3 rounded-2xl border ${isOutOfStock ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
              <Zap size={16} className={isOutOfStock ? 'text-slate-400' : 'text-purple-500'} /> ผ่อน 0% นาน 10 เดือน
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-6 mt-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-100 w-max">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleQuantity("dec")}
                disabled={isOutOfStock}
                className={`w-10 h-10 flex items-center justify-center border rounded-xl font-black transition-all shadow-sm ${isOutOfStock ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed' : 'bg-white border-slate-200 text-slate-400 hover:text-purple-600 hover:border-purple-200 active:scale-90'}`}
              >
                -
              </button>
              <span className={`w-8 text-center text-lg font-black font-mono ${isOutOfStock ? 'text-slate-400' : 'text-slate-700'}`}>
                {isOutOfStock ? 0 : quantity}
              </span>
              <button
                onClick={() => handleQuantity("inc")}
                disabled={isOutOfStock}
                className={`w-10 h-10 flex items-center justify-center border rounded-xl font-black transition-all shadow-sm ${isOutOfStock ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed' : 'bg-white border-slate-200 text-slate-400 hover:text-purple-600 hover:border-purple-200 active:scale-90'}`}
              >
                +
              </button>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
              <span className={`text-xs font-bold ${isOutOfStock ? 'text-rose-500' : displayStock > 5 ? 'text-emerald-500' : 'text-orange-500'}`}>
                {isOutOfStock ? 'OUT OF STOCK' : `${displayStock.toLocaleString()} IN STOCK`}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onAddToCartClick}
              disabled={isOutOfStock}
              className={`flex-[1.2] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest py-5 rounded-[24px] transition-all shadow-xl ${isOutOfStock ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-slate-100'}`}
            >
              <ShoppingCart size={18} strokeWidth={2.5} /> Add to Cart
            </button>
            <button
              onClick={onBuyNowClick}
              disabled={isOutOfStock}
              className={`flex-1 font-black text-xs uppercase tracking-widest py-5 rounded-[24px] transition-all ${isOutOfStock ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-xl hover:shadow-purple-200 active:scale-95'}`}
            >
              Buy Now
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <Package size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Authentic Product Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMainInfo;
