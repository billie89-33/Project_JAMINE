import { TrendingUp, Package } from 'lucide-react';

/**
 * 🔥 TopProducts Component
 * แสดงรายการสินค้าขายดี พร้อมลำดับความนิยม
 */
const TopProducts = ({ products }) => {
  return (
    <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-purple-100/50 border border-purple-50 h-full flex flex-col">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-rose-500" size={24} />
            Top Selling
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">สินค้าขายดี 3 อันดับแรก</p>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {products?.map((product, index) => (
          <div key={product._id} className="flex items-center gap-5 relative group cursor-default">
            {/* Rank Badge */}
            <div className={`absolute -left-2 -top-2 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-4 border-white z-10 shadow-md transition-transform group-hover:scale-110
                ${index === 0 ? 'bg-amber-400 text-white' : 
                  index === 1 ? 'bg-slate-300 text-white' : 
                  index === 2 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {index + 1}
            </div>

            <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0 group-hover:border-purple-200 transition-all shadow-sm">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-purple-500 uppercase tracking-widest mb-1">Rank #{index + 1}</p>
                <p className="text-sm font-bold text-slate-700 truncate mb-2">{product.name}</p>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-slate-800">฿{product.price?.toLocaleString() || 0}</span>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg">
                        <Package size={12} className="text-slate-400"/>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{product.sold} <span className="text-slate-300 font-medium">Sold</span></span>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-10 py-4 bg-slate-50 hover:bg-purple-50 text-slate-400 hover:text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-transparent hover:border-purple-100">
          ดูรายงานวิเคราะห์สินค้า
      </button>
    </div>
  );
};

export default TopProducts;
