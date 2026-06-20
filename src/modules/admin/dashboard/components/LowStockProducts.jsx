import { AlertTriangle, PackageOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * ⚠️ LowStockProducts Component
 * แสดงรายการสินค้าที่สต็อกเหลือน้อยกว่ากำหนด (Threshold)
 */
const LowStockProducts = ({ products }) => {
    const navigate = useNavigate();

    if (!products || products.length === 0) {
        return null; // ถ้าไม่มีสินค้าใกล้หมดสต็อก ไม่ต้องแสดง Component นี้
    }

    return (
        <div className="bg-white rounded-[32px] shadow-xl shadow-amber-100/30 border border-amber-50 overflow-hidden h-full flex flex-col animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="p-6 border-b border-amber-50/50 flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                        <AlertTriangle size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Low Stock Alert</h3>
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Restock needed soon</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-widest">
                    {products.length} Items
                </div>
            </div>

            {/* List */}
            <div className="p-2 flex-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-1">
                    {products.map((product) => (
                        <div 
                            key={product._id}
                            onClick={() => navigate(`/admin/product/edit/${product._id}`)}
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-amber-50/50 transition-colors cursor-pointer group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <PackageOpen size={20} />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-800 truncate">{product.name}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{product.brand}</p>
                            </div>

                            <div className="text-right">
                                <div className={`inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-lg text-xs font-black shadow-sm border ${
                                    product.stock === 0 
                                        ? 'bg-rose-50 text-rose-600 border-rose-200' 
                                        : 'bg-amber-50 text-amber-600 border-amber-200'
                                }`}>
                                    {product.stock}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LowStockProducts;
