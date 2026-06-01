import { PieChart } from 'lucide-react';

/**
 * 🍩 SalesDonut Component
 * กราฟวงกลมแสดงสัดส่วนยอดขายตามหมวดหมู่
 */
const SalesDonut = ({ data }) => {
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.sales, 0);

  return (
    <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-purple-100/50 border border-purple-50 h-full flex flex-col">
      <div className="mb-8">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <PieChart className="text-indigo-500" size={24} />
          Category Sales
        </h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">สัดส่วนยอดขายตามหมวดหมู่</p>
      </div>
      
      {/* Mock Donut Chart Visualization */}
      <div className="relative w-48 h-48 mx-auto mb-10 mt-4">
        {/* CSS Conic Gradient for Donut */}
        <div className="w-full h-full rounded-full" style={{
            background: `conic-gradient(
                #9333ea 0% 40%, 
                #6366f1 40% 65%, 
                #60a5fa 65% 85%, 
                #22d3ee 85% 100%
            )`
        }}></div>
        {/* Inner Circle to make it a Donut */}
        <div className="absolute inset-5 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Items</span>
            <span className="text-3xl font-black text-slate-800">{total}</span>
        </div>
      </div>

      <div className="space-y-4 mt-auto">
        {data.map((item, index) => {
          const percentage = Math.round((item.sales / total) * 100) || 0;
          return (
            <div key={index} className="flex justify-between items-center group cursor-default">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm group-hover:scale-125 transition-transform`}></div>
                <span className="text-slate-600 font-bold text-sm">{item.category}</span>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-slate-400 text-[10px] font-bold">{item.sales} ชิ้น</span>
                 <span className="text-slate-800 font-black text-xs bg-slate-50 px-2.5 py-1 rounded-lg min-w-[3rem] text-center border border-slate-100">
                    {percentage}%
                 </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SalesDonut;
