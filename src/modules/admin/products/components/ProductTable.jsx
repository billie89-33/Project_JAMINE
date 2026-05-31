import { Edit3, Trash2, Calendar, Box, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 📦 ProductTable Component
 * ตารางแสดงรายการสินค้าแบบ Full-width พรีเมียม
 */
const ProductTable = ({ products, onDelete, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white/50 rounded-3xl border border-purple-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-purple-600 font-bold animate-pulse">กำลังโหลดข้อมูลสินค้า...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-purple-100">
        <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Box size={40} className="text-purple-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700">ไม่พบข้อมูลสินค้า</h3>
        <p className="text-slate-400">ลองเปลี่ยนหมวดหมู่หรือเพิ่มสินค้าใหม่ลงระบบ</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl shadow-purple-100/50 border border-purple-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-purple-50">
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">ข้อมูลสินค้า</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">หมวดหมู่</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">สต็อก</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">ราคา (฿)</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">อัปเดตล่าสุด</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-purple-50/30 transition-colors group">
                {/* 1. ข้อมูลสินค้า (รูป + ชื่อ) */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border border-purple-50 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={product.image?.url || 'https://via.placeholder.com/150'} 
                        alt={product.modelName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-black text-purple-600 mb-0.5">{product.brand}</p>
                      <p className="text-sm font-bold text-slate-700 leading-tight">{product.modelName}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">{product.sku}</p>
                    </div>
                  </div>
                </td>

                {/* 2. หมวดหมู่ */}
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase">
                    <Tag size={10} />
                    {product.category}
                  </span>
                </td>

                {/* 3. สต็อก */}
                <td className="px-6 py-4 text-center">
                  <div className={`text-sm font-black ${product.stock <= 5 ? 'text-rose-500' : 'text-slate-600'}`}>
                    {product.stock.toLocaleString()}
                    <p className="text-[10px] text-slate-300 font-medium">UNIT</p>
                  </div>
                </td>

                {/* 4. ราคา */}
                <td className="px-6 py-4 text-center">
                  <div className="text-sm font-black text-purple-700 bg-purple-50 py-1.5 px-3 rounded-xl inline-block">
                    ฿{product.price.toLocaleString()}
                  </div>
                </td>

                {/* 5. วันที่ */}
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center gap-0.5 text-slate-400">
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                      <Calendar size={10} />
                      {new Date(product.updatedAt).toLocaleDateString('th-TH')}
                    </div>
                    <span className="text-[9px] font-medium">
                      {new Date(product.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                    </span>
                  </div>
                </td>

                {/* 6. ปุ่มจัดการ */}
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                      className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-100 transition-all active:scale-90"
                      title="แก้ไขสินค้า"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(product._id)}
                      className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-100 transition-all active:scale-90"
                      title="ลบสินค้า"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
