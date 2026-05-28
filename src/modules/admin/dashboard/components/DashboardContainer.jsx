import { 
  ShoppingCart, 
  DollarSign, 
  Users, 
  CreditCard 
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import StatCard from './StatCard.jsx';
import RevenueChart from './RevenueChart.jsx';
import SalesDonut from './SalesDonut.jsx';

const DashboardContainer = () => {
    const { stats, salesByCategory } = useDashboard();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Analytics</h2>
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Orders"
                    value={stats.orders.value}
                    trend={stats.orders.trend}
                    linkText="View Orders"
                    icon={<ShoppingCart size={20} />}
                    trendColor={stats.orders.color}
                />
                <StatCard 
                    title="Profit"
                    value={stats.profit.value}
                    trend={stats.profit.trend}
                    linkText="View Earnings"
                    icon={<DollarSign size={20} />}
                    trendColor={stats.profit.color}
                />
                <StatCard 
                    title="Customer"
                    value={stats.customers.value}
                    trend={stats.customers.trend}
                    linkText="All Customer"
                    icon={<Users size={20} />}
                    trendColor={stats.customers.color}
                />
                <StatCard 
                    title="Balance (Total sale amount)"
                    value={stats.balance.value}
                    trend=""
                    linkText="Withdraw Money"
                    icon={<CreditCard size={20} />}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>
                <div className="lg:col-span-1">
                    <SalesDonut data={salesByCategory} />
                </div>
            </div>
        </div>
    );
};

export default DashboardContainer;
