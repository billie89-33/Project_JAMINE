import React from 'react';
import { PieChart as PieIcon } from 'lucide-react';
import ReactApexChart from 'react-apexcharts';

/**
 * 🍩 SalesDonut Component (ApexCharts Edition)
 * กราฟวงกลมแสดงสัดส่วนยอดขายตามหมวดหมู่แบบพรีเมียม
 */
const SalesDonut = ({ data }) => {
  const total = data?.reduce((sum, item) => sum + (item.sales || 0), 0) || 0;

  // Helper to map tailwind color classes to hex for ApexCharts
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

  // ⚙️ ApexCharts Configuration
  const series = data?.map(item => item.sales || 0) || [];
  
  const options = {
    chart: {
      type: 'donut',
      fontFamily: 'inherit',
      animations: {
        enabled: true,
        speed: 1000
      }
    },
    colors: data?.map(item => getColorHex(item.color)) || [],
    labels: data?.map(item => item.category) || [],
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
               show: true,
               fontSize: '9px',
               fontWeight: 900,
               color: '#94a3b8',
               offsetY: -10
            },
            value: {
               show: true,
               fontSize: '24px',
               fontWeight: 900,
               color: '#1e293b',
               offsetY: 5,
               formatter: (val) => parseInt(val).toLocaleString()
            },
            total: {
              show: true,
              label: 'Total Items',
              fontSize: '9px',
              fontWeight: 900,
              color: '#94a3b8',
              formatter: () => (total || 0).toLocaleString()
            }
          }
        }
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${val} ชิ้น`
      }
    }
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
      
      {/* Dynamic Donut Chart using ApexCharts */}
      <div className="relative flex-1 min-h-[250px] w-full mt-4">
        <ReactApexChart 
            options={options} 
            series={series} 
            type="donut" 
            height="100%" 
        />
      </div>

      {/* Legend & Details */}
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
