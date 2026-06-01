import { 
  ShoppingCart, 
  Wallet, 
  Users, 
  Sparkles
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';

// 🛡️ Fix: Import siblings directly to avoid circular dependency via components/index.js
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import SalesDonut from './SalesDonut';
import RecentOrders from './RecentOrders';
import TopProducts from './TopProducts';

/**
 * 🚀 DashboardContainer
 * ส่วนแสดงผลหลักของหน้า Admin Dashboard (Full Layout)
 */
const DashboardContainer = () => {
    const { 
        isLoading, 
        period, 
        setPeriod, 
        summary, 
        revenueData, 
        categorySales, 
        recentOrders, 
        topProducts 
    } = useDashboard();

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
            
            {/* 1. Welcome Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">System Overview</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800">
                        Analytics Dashboard
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium ml-1">ยินดีต้อนรับกลับมา! นี่คือสรุปความเคลื่อนไหวของร้านค้าคุณ</p>
                </div>

                <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">Filter By</span>
                    <select 
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="bg-slate-50 text-slate-700 text-xs font-black px-4 py-2 rounded-xl border-none outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>
            
            {/* 2. Top Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                <StatCard 
                    title="Total Revenue (Balance)"
                    value={summary.balance.value}
                    trend={summary.balance.trend}
                    icon={<Wallet size={24} strokeWidth={2.5} />}
                />
                <StatCard 
                    title="Total Orders"
                    value={summary.orders.value}
                    trend={summary.orders.trend}
                    icon={<ShoppingCart size={24} strokeWidth={2.5} />}
                />
                <StatCard 
                    title="New Customers"
                    value={summary.customers.value}
                    trend={summary.customers.trend}
                    icon={<Users size={24} strokeWidth={2.5} />}
                />
                <StatCard 
                    title="Active Sessions"
                    value={842}
                    trend="+12%"
                    icon={<Sparkles size={24} strokeWidth={2.5} />}
                />
            </div>

            {/* 3. Charts & Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
                <div className="lg:col-span-2 min-h-[500px]">
                    <RevenueChart 
                        data={revenueData} 
                        period={period} 
                        onPeriodChange={setPeriod} 
                    />
                </div>
                <div className="lg:col-span-1 min-h-[500px]">
                    <SalesDonut data={categorySales} />
                </div>
            </div>

            {/* 4. Bottom Data Row: Recent Orders & Top Selling */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <RecentOrders orders={recentOrders} />
                <TopProducts products={topProducts} />
            </div>

            {/* Footer space */}
            <div className="h-10"></div>
        </div>
    );
};

export default DashboardContainer;
