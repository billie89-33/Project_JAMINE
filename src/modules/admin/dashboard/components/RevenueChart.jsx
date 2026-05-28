import React from 'react';

const RevenueChart = () => {
  const filters = ['All', '1M', '6M', '1Y'];
  const [activeFilter, setActiveFilter] = React.useState('6M');

  return (
    <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-slate-700/50">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-white font-bold">Revenue</h3>
        <div className="flex bg-slate-800 p-1 rounded-lg gap-1">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                activeFilter === filter 
                ? 'bg-slate-700 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Visualization Placeholder */}
      <div className="h-64 w-full relative mb-6">
        {/* Simple SVG/CSS visualization of a line chart to match the UI feel */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-slate-700"></div>
        <div className="absolute top-0 left-0 h-full w-[1px] bg-slate-700"></div>
        
        {/* Grid lines */}
        {[0, 20, 40, 60, 80, 100].map(val => (
            <div key={val} className="absolute w-full h-[1px] bg-slate-800/50" style={{ bottom: `${val}%` }}>
                <span className="absolute -left-8 -top-2 text-[10px] text-slate-500">{val}</span>
            </div>
        ))}

        {/* Waves/Lines simulation with SVG */}
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 80 Q 25 60, 50 75 T 100 20" fill="none" stroke="#ec4899" strokeWidth="2" />
            <path d="M0 90 Q 25 70, 50 85 T 100 40" fill="none" stroke="#06b6d4" strokeWidth="2" />
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800">
        <div>
          <p className="text-slate-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500"></span> Current Week
          </p>
          <p className="text-white font-bold">$235,965</p>
        </div>
        <div>
          <p className="text-slate-500 text-[10px] font-bold uppercase mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Past Week
          </p>
          <p className="text-white font-bold">$198,214</p>
        </div>
        <div>
          <p className="text-slate-500 text-[10px] font-bold uppercase mb-1">Today's Earning</p>
          <p className="text-white font-bold">$2,562.30</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
