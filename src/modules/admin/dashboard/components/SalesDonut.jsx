import React from 'react';

const SalesDonut = ({ data }) => {
  return (
    <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-slate-700/50 h-full">
      <h3 className="text-white font-bold mb-6">Total Sales</h3>
      
      {/* Placeholder for Donut Chart */}
      <div className="relative w-48 h-48 mx-auto mb-8">
        <div className="w-full h-full rounded-full border-[16px] border-slate-800 flex items-center justify-center">
            {/* Visual simulation of segments using CSS gradients or just a placeholder circle */}
            <div className="w-full h-full rounded-full border-[16px] border-blue-500 border-t-pink-500 border-r-orange-400 border-l-cyan-400 rotate-45"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-slate-400 text-xs">Total</span>
            <span className="text-white font-bold text-xl">$25.4k</span>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
              <span className="text-slate-300 text-sm">{item.name}</span>
            </div>
            <span className="text-white text-sm font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesDonut;
