import React from 'react';

const StatCard = ({ title, value, trend, linkText, icon, trendColor = 'text-green-400' }) => {
  return (
    <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg border border-slate-700/50">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white">{value}</h3>
            <span className={`text-xs font-semibold ${trendColor}`}>
              {trend}
            </span>
          </div>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg text-blue-400">
          {icon}
        </div>
      </div>
      <a href="#" className="text-blue-500 text-xs font-semibold hover:underline flex items-center gap-1">
        {linkText}
      </a>
    </div>
  );
};

export default StatCard;
