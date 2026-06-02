import React from 'react';
import { PieChart as PieIcon } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

/**
 * 🍩 SalesDonut Component (Recharts Edition)
 * กราฟวงกลมแสดงสัดส่วนยอดขายตามหมวดหมู่แบบมืออาชีพ
 */
const SalesDonut = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.sales, 0);

  // Helper to map tailwind color classes to hex for Recharts
  const getColorHex = (twClass) => {
    const map = {
      'bg-purple-500': '#9333ea',
      'bg-indigo-500': '#6366f1',
      'bg-blue-400': '#60a5fa',
      'bg-cyan-400': '#22d3ee',
      'bg-rose-400': '#fb7185',
    };
    return map[twClass] || '#cbd5e1';
  };

  return (
    <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-purple-100/50 border border-purple-50 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <PieIcon className="text-indigo-500" size={24} />
          Category Sales
        </h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">สัดส่วนยอดขายจริง</p>
      </div>
      
      {/* Dynamic Donut Chart using Recharts */}
      <div className="relative flex-1 min-h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="sales"
              stroke="none"
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorHex(entry.color)} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontWeight: '900', fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text Overlaid on Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Items</span>
            <span className="text-3xl font-black text-slate-800">{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {data.map((item, index) => {
          const percentage = Math.round((item.sales / (total || 1)) * 100) || 0;
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
