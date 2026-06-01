import { LineChart, ArrowUpRight } from 'lucide-react';

/**
 * 📈 RevenueChart Component
 * กราฟแสดงแนวโน้มรายได้ (พรีเมียม Area Chart Mock)
 */
const RevenueChart = ({ data, period, onPeriodChange }) => {
  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' }
  ];

  return (
    <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-purple-100/50 border border-purple-50 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <LineChart className="text-purple-600" size={24} />
            Revenue Trend
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">แนวโน้มรายได้</p>
        </div>
        
        {/* Period Filter */}
        <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => onPeriodChange(p.id)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                period === p.id 
                ? 'bg-white text-purple-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Visualization (Mock SVG Area Chart) */}
      <div className="flex-1 w-full relative min-h-[300px] mb-8 px-2">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(val => (
          <div key={val} className="absolute w-full h-[1px] bg-slate-50" style={{ bottom: `${val}%` }}>
            <span className="absolute -left-2 -top-2.5 text-[9px] font-bold text-slate-300 -translate-x-full">{val}k</span>
          </div>
        ))}

        {/* X-Axis Labels */}
        <div className="absolute -bottom-6 w-full flex justify-between px-4 text-[9px] font-bold text-slate-400">
           {data.map((d, i) => <span key={i}>{d.date}</span>)}
        </div>

        {/* Mock Area Chart SVG */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9333ea" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#9333ea" stopOpacity="0.0" />
                </linearGradient>
            </defs>
            {/* The Area */}
            <path d="M0,100 L0,70 Q20,80 40,50 T80,30 L100,20 L100,100 Z" fill="url(#purpleGradient)" />
            {/* The Line */}
            <path d="M0,70 Q20,80 40,50 T80,30 L100,20" fill="none" stroke="#9333ea" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Data Points */}
            <circle cx="0" cy="70" r="3" fill="white" stroke="#9333ea" strokeWidth="2" />
            <circle cx="40" cy="50" r="3" fill="white" stroke="#9333ea" strokeWidth="2" />
            <circle cx="80" cy="30" r="3" fill="white" stroke="#9333ea" strokeWidth="2" />
            <circle cx="100" cy="20" r="3" fill="white" stroke="#9333ea" strokeWidth="2" />
        </svg>
      </div>

      <div className="mt-8 pt-6 border-t border-purple-50 flex items-center justify-between">
         <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ยอดขายรวมช่วงนี้</p>
            <div className="flex items-center gap-3">
                <h4 className="text-2xl font-black text-slate-800">฿130,500</h4>
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={12}/> 
                    12%
                </div>
            </div>
         </div>
         <button className="text-[10px] font-black text-purple-600 bg-purple-50 px-4 py-2 rounded-xl hover:bg-purple-100 transition-colors uppercase tracking-widest">
            ดูรายละเอียด
         </button>
      </div>
    </div>
  );
};

export default RevenueChart;
