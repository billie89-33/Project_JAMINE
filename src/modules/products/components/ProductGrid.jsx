import ProductCard from './ProductCard';
import { PackageSearch } from 'lucide-react';

/**
 * 📦 ProductGrid Component
 * ส่วนจัดการเลย์เอาต์การแสดงผลรายการสินค้าแบบ Grid
 */
const ProductGrid = ({ products, loading }) => {
  
  if (loading) {
    return ( 
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-[32px] border border-slate-100 p-6 space-y-6 animate-pulse">
            <div className="aspect-square bg-slate-100 rounded-2xl"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded-full w-1/2"></div>
            </div>
            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <div className="h-6 bg-slate-100 rounded-full w-20"></div>
              <div className="h-10 bg-slate-100 rounded-xl w-10"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full py-32 flex flex-col items-center justify-center bg-white rounded-[40px] border-2 border-dashed border-slate-100 text-center px-6">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
          <PackageSearch size={48} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">ไม่พบสินค้าที่คุณต้องการ</h3>
        <p className="text-slate-400 max-w-xs font-medium leading-relaxed">
          ลองปรับเปลี่ยนตัวกรอง หรือค้นหาแบรนด์อื่นที่เรามีจำหน่าย
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-8">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
