
/**
 * 📊 StatCard Component
 * แสดงตัวเลขสถิติแบบย่อใน Dashboard (พรีเมียมเวอร์ชัน)
 * รองรับการปรับแต่งสีพื้นหลังและตัวเลขผ่าน props
 */
const StatCard = ({ title, value, trend, icon, className = '', valueClassName = '' }) => {
  const isPositive = trend?.startsWith('+');
  const trendColor = isPositive ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50';

  return (
    <div className={`bg-white rounded-[32px] p-6 lg:p-8 shadow-xl shadow-purple-100/50 border border-purple-50 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 ${className}`}>
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center text-purple-600 shadow-inner">
          {icon}
        </div>
        {trend && (
          <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${trendColor}`}>
            {trend}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{title}</p>
        <h3 className={`text-3xl font-black text-slate-800 ${valueClassName}`}>
          {typeof value === 'number' && title.includes('Revenue') 
            ? `฿${value.toLocaleString()}` 
            : value?.toLocaleString() || 0}
        </h3>
      </div>
    </div>
  );
};

export default StatCard;
