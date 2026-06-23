import { 
  ShoppingCart, 
  Wallet, 
  Users, 
  Sparkles,
  AlertTriangle,
  Clock,
  PackageOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';

// 🛡️ Fix: Import siblings directly to avoid circular dependency via components/index.js
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import UserGrowthChart from './UserGrowthChart';
import SalesDonut from './SalesDonut';
import OrderStatusChart from './OrderStatusChart';
import RecentOrders from './RecentOrders';
import TopProducts from './TopProducts';
import LowStockProducts from './LowStockProducts';
import DashboardSkeleton from './DashboardSkeleton';

/**
 * 🚀 DashboardContainer (Optimized v2)
 * ส่วนแสดงผลหลักของหน้า Admin Dashboard พร้อมระบบแจ้งเตือน (Alerts)
 */
const DashboardContainer = () => {
    const navigate = useNavigate();
    const { 
        isLoading, 
        period, 
        setPeriod, 
        summary, 
        revenueData, 
        categorySales, 
        recentOrders, 
        topProducts,
        lowStock,
        orderStatus,
        userGrowth,
        lowStockCount,
        pendingOrdersCount
    } = useDashboard();

    if (isLoading) return <DashboardSkeleton />;

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
            
            {/* 1. Welcome Header & Filter */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">Store Analytics</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium ml-1">ภาพรวมประสิทธิภาพและความเคลื่อนไหวของร้านค้าคุณ</p>
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
            
            {/* 2. Top Stats Row (Main Metrics) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                <StatCard 
                    title="Total Revenue"
                    value={summary.balance.value}
                    trend={summary.balance.trend}
                    icon={<Wallet size={24} strokeWidth={2.5} />}
                />
                <div onClick={() => navigate('/admin/order')} className="cursor-pointer group">
                    <StatCard 
                        title="Total Orders"
                        value={summary.orders.value}
                        trend={summary.orders.trend}
                        icon={<ShoppingCart size={24} strokeWidth={2.5} />}
                        className="group-hover:border-purple-200 transition-all"
                    />
                </div>
                <div onClick={() => navigate('/admin/users')} className="cursor-pointer group">
                    <StatCard 
                        title="Total Customers"
                        value={summary.customers.value}
                        trend={summary.customers.trend}
                        icon={<Users size={24} strokeWidth={2.5} />}
                        className="group-hover:border-purple-200 transition-all"
                    />
                </div>
            </div>

            {/* 3. Urgent Alerts Row (Action Required) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div 
                    onClick={() => navigate('/admin/products')} // สมมติว่าไปหน้าสินค้าเพื่อเติมสต็อก
                    className="cursor-pointer group"
                >
                    <StatCard 
                        title="Low Stock Items"
                        value={lowStockCount}
                        icon={<AlertTriangle size={24} strokeWidth={2.5} />}
                        className="border-amber-200 bg-amber-50/30 group-hover:bg-amber-50 transition-colors"
                        valueClassName="text-amber-600"
                    />
                </div>
                <div 
                    onClick={() => navigate('/admin/order', { state: { filterStatus: 'Awaiting Payment' } })} // ไปหน้าออเดอร์เพื่อจัดการสถานะ
                    className="cursor-pointer group"
                >
                    <StatCard 
                        title="Pending Orders"
                        value={pendingOrdersCount}
                        icon={<Clock size={24} strokeWidth={2.5} />}
                        className="border-indigo-200 bg-indigo-50/30 group-hover:bg-indigo-50 transition-colors"
                        valueClassName="text-indigo-600"
                    />
                </div>
            </div>

            {/* 4. Time-series Analytics Row (Revenue & Growth) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
                <div className="lg:col-span-2 min-h-[500px]">
                    <RevenueChart 
                        data={revenueData} 
                        period={period} 
                        onPeriodChange={setPeriod} 
                    />
                </div>
                <div className="lg:col-span-2 min-h-[500px]">
                    <UserGrowthChart 
                        data={userGrowth} 
                        period={period} 
                        onPeriodChange={setPeriod} 
                    />
                </div>
            </div>

            {/* 5. Breakdown & Rankings Row (Sales Donut, Order Status, Top Products) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-1 min-h-[500px]">
                    <SalesDonut data={categorySales} />
                </div>
                <div className="lg:col-span-1 min-h-[500px]">
                    <OrderStatusChart data={orderStatus} />
                </div>
                <div className="lg:col-span-1">
                    <TopProducts products={topProducts} />
                </div>
            </div>

            {/* 6. Detail Lists Row (Recent Orders, Low Stock) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <RecentOrders orders={recentOrders} />
                </div>
                <div className="lg:col-span-1">
                    {lowStock.length > 0 ? (
                        <LowStockProducts products={lowStock} />
                    ) : (
                        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                            <PackageOpen size={48} className="mb-4 text-emerald-200" />
                            <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest mb-1">Stock is Healthy</h3>
                            <p className="text-xs font-medium">No products are currently low on stock.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer space */}
            <div className="h-10"></div>
        </div>
    );
};

export default DashboardContainer;
