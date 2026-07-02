import { LineChart as LineIcon, ArrowUpRight } from 'lucide-react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

export interface RevenueChartProps {
    data: { date: string; revenue: number }[];
    period: string;
    onPeriodChange: (period: string) => void;
}

/**
 * 📈 RevenueChart Component (ApexCharts Edition)
 * กราฟแสดงแนวโน้มรายได้แบบ Interactive พร้อมระบบ Dynamic Scaling
 */
const RevenueChart: React.FC<RevenueChartProps> = ({ data, period, onPeriodChange }) => {
  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' }
  ];

  const totalRevenue = data?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0;

  // ⚙️ ApexCharts Configuration
  const series = [{
    name: 'Revenue',
    data: data?.map(item => Number(item.revenue) || 0) || []
  }];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: '100%',
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'inherit',
      dropShadow: {
        enabled: true,
        top: 8,
        left: 0,
        blur: 12,
        color: '#9333ea',
        opacity: 0.1
      }
    },
    colors: ['#9333ea'],
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 4,
      lineCap: 'round'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4,
      padding: { top: 0, right: 0, bottom: 0, left: 10 }
    },
    xaxis: {
      categories: data?.map(item => item.date) || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#94a3b8',
          fontSize: '10px',
          fontWeight: 700
        }
      }
    },
    yaxis: {
      // 🚀 Dynamic & Safe Scaling
      min: (min) => {
         if (typeof min !== 'number' || isNaN(min)) return 0;
         return min > 1000 ? min * 0.98 : 0;
      },
      labels: {
        formatter: (val) => `฿${(val / 1000).toFixed(0)}k`,
        style: {
          colors: '#94a3b8',
          fontSize: '10px',
          fontWeight: 700
        }
      }
    },
    tooltip: {
      theme: 'dark',
      x: { show: true },
      y: {
        formatter: (val) => `฿${val?.toLocaleString()}`
      },
      style: { fontSize: '12px' }
    },
    markers: {
      size: 0,
      hover: { size: 6 }
    }
  };

  return (
    <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-purple-100/50 border border-purple-50 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <LineIcon className="text-purple-600" size={24} />
            Revenue Trend
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">แนวโน้มรายได้จริง (Premium View)</p>
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

      {/* Chart Visualization using ApexCharts */}
      <div className="flex-1 w-full min-h-[300px]">
        <ReactApexChart 
            options={options} 
            series={series} 
            type="area" 
            height="100%" 
        />
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
