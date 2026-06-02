import React from 'react';
import { LineChart as LineIcon, ArrowUpRight } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

/**
 * 📈 RevenueChart Component (Recharts Edition)
 * กราฟแสดงแนวโน้มรายได้แบบ Interactive
 */
const RevenueChart = ({ data, period, onPeriodChange }) => {
  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' }
  ];

  const totalRevenue = data?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0;

  // Custom Tooltip Design
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-700">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{payload[0].payload.date}</p>
          <p className="text-sm font-black text-white">฿{(payload[0].value || 0).toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-purple-100/50 border border-purple-50 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <LineIcon className="text-purple-600" size={24} />
            Revenue Trend
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">แนวโน้มรายได้จริง</p>
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

      {/* Chart Visualization using Recharts */}
      <div className="flex-1 w-full min-h-[300px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#9333ea" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 pt-6 border-t border-purple-50 flex items-center justify-between">
         <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ยอดขายรวมช่วงนี้</p>
            <div className="flex items-center gap-3">
                <h4 className="text-2xl font-black text-slate-800">฿{(totalRevenue || 0).toLocaleString()}</h4>
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={12}/> 
                    {(totalRevenue > 50000 ? '+12.5%' : '+3.2%')}
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
