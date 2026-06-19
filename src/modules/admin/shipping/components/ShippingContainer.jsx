import { useShipping } from '../hooks/useShipping';
import ShippingStats from './ShippingStats';
import ShippingTable from './ShippingTable';
import { Search, RefreshCcw } from 'lucide-react';

const ShippingContainer = () => {
    const { 
        stats, 
        orders, 
        loading, 
        filters, 
        handleFilterChange, 
        handleUpdateTracking,
        refreshData 
    } = useShipping();

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">การจัดส่งและโลจิสติกส์</h1>
                    <p className="text-slate-500 text-sm">จัดการเลขพัสดุและติดตามสถานะการจัดส่งสินค้า</p>
                </div>
                <button 
                    onClick={refreshData}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                >
                    <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                    <span>รีเฟรชข้อมูล</span>
                </button>
            </div>

            {/* Stats Section */}
            <ShippingStats stats={stats} />

            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="ค้นหาเลขที่คำสั่งซื้อ หรือ ชื่อลูกค้า..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                        value={filters.search}
                        onChange={(e) => handleFilterChange({ search: e.target.value })}
                    />
                </div>
                <div className="flex gap-2">
                    <select 
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm text-slate-600"
                        value={filters.status}
                        onChange={(e) => handleFilterChange({ status: e.target.value })}
                    >
                        <option value="">ทุกสถานะ (จัดส่ง)</option>
                        <option value="Paid">รอจัดส่ง (Paid)</option>
                        <option value="Processing">กำลังเตรียม (Processing)</option>
                        <option value="Shipped">ส่งแล้ว (Shipped)</option>
                        <option value="Delivered">ถึงผู้รับแล้ว (Delivered)</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <ShippingTable 
                orders={orders} 
                loading={loading} 
                onUpdateTracking={handleUpdateTracking} 
            />
        </div>
    );
};

export default ShippingContainer;
