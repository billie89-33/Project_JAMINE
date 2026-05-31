import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ShoppingCart, Zap, ShieldCheck, Truck, Package } from 'lucide-react';

const ProductMainInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const navigate = useNavigate();

  if (!product) return null;

  // 1. Data Mapping (v2 Standard)
  const displayName = product.modelName || product.name || 'Unknown Product';
  const displayPrice = product.price || 0;
  const displayStock = product.stock ?? product.quantity ?? 0;
  
  const hasMultipleImages = product?.images && product.images.length > 0;
  const currentImage = hasMultipleImages
    ? product.images[activeImgIndex]
    : product?.image?.url || 'https://via.placeholder.com/600';

  const handleQuantity = (type) => {
    if (type === "inc" && quantity < displayStock) setQuantity(quantity + 1);
    if (type === "dec" && quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    try {
      const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
      const productId = product._id || product.id;
      const existingProductIndex = currentCart.findIndex(item => item.id === productId);

      if (existingProductIndex > -1) {
        currentCart[existingProductIndex].quantity += quantity;
      } else {
        currentCart.push({
          id: productId,
          name: displayName,
          description: product.description || `Category: ${product.category}`,
          price: displayPrice,
          quantity: quantity,
          image: currentImage
        });
      }

      localStorage.setItem('cart', JSON.stringify(currentCart));
      return true;
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      return false;
    }
  };

  const onAddToCartClick = () => {
    if (handleAddToCart()) {
      toast.success(`เพิ่มลงตะกร้าแล้ว!`, {
        icon: '🛒',
        style: { borderRadius: '15px', fontWeight: 'bold' }
      });
    }
  };

  const onBuyNowClick = () => {
    if (handleAddToCart()) {
      navigate('/cart');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-xl shadow-purple-100/20">
      
      {/* 📸 Left: Product Gallery */}
      <div className="space-y-6">
        <div className="w-full aspect-square bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-center p-10 relative overflow-hidden group">
          <img
            src={currentImage}
            alt={displayName}
            className="max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Featured Badge */}
          {product.isFeatured && (
            <div className="absolute top-6 left-6 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest animate-bounce">
              ⭐ Featured
            </div>
          )}
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
                <img src={img} alt="thumb" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 📝 Right: Info & Actions */}
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="bg-purple-100 text-purple-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
              {product.category}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" /> Official Warranty
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-black text-purple-600 uppercase tracking-[0.2em]">{product.brand}</p>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
              {displayName}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              SKU: {product.sku || product._id?.slice(-8).toUpperCase()}
            </p>
          </div>

          <div className="py-6 border-y border-slate-50 flex items-baseline gap-4">
            <span className="text-4xl font-black text-slate-900">
              ฿{displayPrice.toLocaleString()}
            </span>
            <span className="text-slate-300 line-through text-lg font-bold">
              ฿{(displayPrice * 1.2).toLocaleString()}
            </span>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex items-center gap-3 text-slate-600 font-medium text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <Truck size={16} className="text-purple-500" /> จัดส่งฟรีทั่วประเทศ
            </div>
            <div className="flex items-center gap-3 text-slate-600 font-medium text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <Zap size={16} className="text-purple-500" /> ผ่อน 0% นาน 10 เดือน
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-6 mt-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-100 w-max">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleQuantity("dec")}
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl font-black text-slate-400 hover:text-purple-600 hover:border-purple-200 transition-all active:scale-90 shadow-sm"
              >
                -
              </button>
              <span className="w-8 text-center text-lg font-black text-slate-700 font-mono">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantity("inc")}
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl font-black text-slate-400 hover:text-purple-600 hover:border-purple-200 transition-all active:scale-90 shadow-sm"
              >
                +
              </button>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Stock</span>
              <span className={`text-xs font-bold ${displayStock > 5 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {displayStock.toLocaleString()} UNITS
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onAddToCartClick}
              className="flex-[1.2] flex items-center justify-center gap-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest py-5 rounded-[24px] hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-100"
            >
              <ShoppingCart size={18} strokeWidth={2.5} /> Add to Cart
            </button>
            <button
              onClick={onBuyNowClick}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest py-5 rounded-[24px] hover:shadow-xl hover:shadow-purple-200 transition-all active:scale-95"
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
