import { ShoppingCart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 🃏 ProductCard Component
 * แสดงข้อมูลสินค้าแต่ละชิ้นแบบพรีเมียม (User Side)
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  
  // จัดการราคา (ถ้าไม่มีให้เป็น 0)
  const price = product.price || 0;

  return (
    <div className="group bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-500 overflow-hidden flex flex-col h-full">
      
      {/* 1. Image Section */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 p-6 flex items-center justify-center">
        <img 
          src={product.image?.url || 'https://via.placeholder.com/300'} 
          alt={product.modelName}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-purple-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button 
            onClick={() => navigate(`/product/${product._id}`)}
            className="p-3 bg-white text-purple-600 rounded-2xl shadow-xl hover:bg-purple-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            <Eye size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Brand Tag */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-slate-100">
          <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{product.brand}</span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-purple-600 transition-colors">
            {product.modelName}
          </h3>
          <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-widest">
            {product.category}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Price</span>
            <span className="text-lg font-black text-slate-900">
              ฿{price.toLocaleString()}
            </span>
          </div>
          
          <button className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-200 transition-all active:scale-90">
            <ShoppingCart size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
