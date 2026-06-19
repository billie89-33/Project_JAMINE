

import { useState, useEffect } from 'react';
import { ProductCard } from '@/modules/products';
import { getProductsApi } from '@/modules/products/services/productApi';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductGrid = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true);
        // 🚀 แก้ไข: ใช้ 'best_seller' เพื่อให้ตรงกับ Logic ใน Backend (ซึ่งจะ sort ตาม -soldCount)
        const res = await getProductsApi({ limit: 8, sort: 'best_seller' });
        
        if (res.success) {
          // 🛡️ ป้องกันบัคสินค้าใหม่มาเนียน: กรองเอาเฉพาะสินค้าที่มียอดขายจริง (> 0) 
          // เพื่อให้เป็นส่วน "Best Seller" ที่แท้จริง
          const bestSellers = res.data.filter(p => p.soldCount > 0);
          
          if (bestSellers.length > 0) {
            // ถ้ามีสินค้าที่ขายได้จริง ให้เอาเฉพาะกลุ่มนั้น (สูงสุด 8 ชิ้น)
            setProducts(bestSellers.slice(0, 8));
          } else {
            // กรณีไม่มีสินค้าขายได้เลย (เช่น ร้านเพิ่งเปิด) ให้แสดงสินค้าใหม่ล่าสุดแทน 
            // แต่จะเอามาจาก res.data ที่ Backend ส่งมาเป็น -createdAt (fallback อัตโนมัติ)
            setProducts(res.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch home products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 w-full">
        <div className="flex items-center justify-between">
          <div className="h-10 bg-slate-100 rounded-2xl w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-[40px] p-8 h-[400px] border border-slate-100 animate-pulse">
              <div className="aspect-square bg-slate-50 rounded-3xl mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-50 rounded-full w-3/4"></div>
                <div className="h-4 bg-slate-50 rounded-full w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full relative">
      {/* 🔮 Decorative Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/30 blur-[100px] rounded-full -z-10"></div>

      {/* ✨ Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-purple-50 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-[2px] bg-gradient-to-r from-purple-600 to-transparent rounded-full"></span>
            <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em]">Top Trending</span>
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Sellers</span>
            <Sparkles className="text-amber-400 fill-amber-400" size={24} />
          </h2>
        </div>
        
        <button 
          onClick={() => navigate('/category/All')}
          className="group flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
        >
          Explore All Products
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 📦 Product Grid (2 Columns on home, matching original sidebar layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      
      {/* 🚀 Bottom Call to Action */}
      {products.length > 0 && (
        <div className="pt-4 flex justify-center">
          <button 
            onClick={() => navigate('/category/All')}
            className="px-10 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[24px] hover:bg-purple-600 hover:shadow-2xl hover:shadow-purple-200 transition-all active:scale-95 shadow-xl shadow-slate-100"
          >
            Load more items
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;