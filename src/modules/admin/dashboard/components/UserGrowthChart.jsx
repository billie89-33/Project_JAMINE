import { Users, UserPlus } from 'lucide-react';
import ReactApexChart from 'react-apexcharts';

/**
 * 📈 UserGrowthChart Component
 * กราฟแสดงสถิติการสมัครสมาชิกใหม่แบบ Area Chart
 */
const UserGrowthChart = ({ data, period, onPeriodChange }) => {
  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' }
  ];

  const totalNewUsers = data?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;

  // ⚙️ ApexCharts Configuration
  const series = [{
    name: 'New Customers',
    data: data?.map(item => Number(item.count) || 0) || []
  }];

  const options = {
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
        color: '#0ea5e9', // Sky blue 500
        opacity: 0.15
      }
    },
    colors: ['#0ea5e9'],
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
      labels: {
        formatter: (val) => Math.round(val),
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
        formatter: (val) => `${val?.toLocaleString()} users`
      },
      style: { fontSize: '12px' }
    },
    markers: {
      size: 0,
      hover: { size: 6 }
    }
  };

  return (
    <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-sky-100/50 border border-sky-50 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Users className="text-sky-500" size={24} />
            Customer Growth
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">สถิติลูกค้าใหม่</p>
        </div>
        
        {/* Period Filter (Shares same state as Revenue) */}
        <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
          {periods.map(p => (
            <button
              key={p.id}
              onClick={() => onPeriodChange(p.id)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                period === p.id 
                ? 'bg-white text-sky-600 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="flex-1 w-full min-h-[300px]">
        <ReactApexChart 
            options={options} 
            series={series} 
            type="area" 
            height="100%" 
        />
      </div>

      <div className="mt-8 pt-6 border-t border-sky-50 flex items-center justify-between">
         <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">สมาชิกลงทะเบียนใหม่</p>
            <div className="flex items-center gap-3">
                <h4 className="text-2xl font-black text-slate-800">{totalNewUsers.toLocaleString()}</h4>
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                    <UserPlus size={12}/> 
                    New
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default UserGrowthChart;
