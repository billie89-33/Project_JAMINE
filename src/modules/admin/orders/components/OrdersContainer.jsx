import { ShoppingBag, Filter, RefreshCw, Search } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import OrdersTable from './OrdersTable';
import { ORDER_STATUS } from '@/shared/constants';
import { Pagination } from '@/shared/components/Pagination';

/**
 * 🚀 OrdersContainer
 * ตัวควบคุมหลักของหน้าจัดการออเดอร์สำหรับ Admin - Refactored v2.0
 */
const OrdersContainer = () => {
  const {
    orders,
    isLoading,
    isUpdating,
    status,
    keyword,
    page,
    totalPages,
    totalItems,
    handleStatusFilterChange,
    handleSearchChange,
    handleUpdateStatus,
    handleDeleteOrder,
    handlePageChange,
    refreshOrders
  } = useOrders();

  const filterOptions = [
    { label: 'All Orders', value: '' },
    { label: 'Pending', value: ORDER_STATUS.PENDING },
    { label: 'Paid', value: ORDER_STATUS.PAID },
    { label: 'Processing', value: ORDER_STATUS.PROCESSING },
    { label: 'Shipped', value: ORDER_STATUS.SHIPPED },
    { label: 'Delivered', value: ORDER_STATUS.DELIVERED },
    { label: 'Cancelled', value: ORDER_STATUS.CANCELLED },
  ];

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
      
      {/* 1. Header & Primary Actions */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag size={16} className="text-purple-600" />
            <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">Ecommerce Management</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
            Order Management
          </h1>
          <p className="text-slate-400 mt-1 font-medium ml-1">ควบคุมดูแลรายการสั่งซื้อทั้งหมด ตรวจสอบการชำระเงิน และบริหารการจัดส่ง</p>
        </div>

        <button 
            onClick={refreshOrders}
            className="hidden md:flex items-center gap-2 px-5 py-3 bg-white text-slate-400 hover:text-purple-600 rounded-2xl shadow-sm border border-slate-100 transition-all group"
            title="Refresh Data"
        >
            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Refresh</span>
        </button>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="mb-8 flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
            <input 
                type="text" 
                placeholder="ค้นหาออเดอร์จาก ID หรือ ชื่อลูกค้า..." 
                value={keyword}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-500/5 focus:border-purple-300 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
            />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 text-slate-400">
                    <Filter size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                </div>
                <select 
                    value={status}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                    className="bg-slate-50 text-slate-700 text-xs font-black px-6 py-2.5 rounded-xl border-none outline-none cursor-pointer hover:bg-slate-100 transition-colors uppercase min-w-[140px]"
                >
                    {filterOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {/* 3. Main Data Table */}
      <div className="mb-8">
        <OrdersTable 
            orders={orders}
            isLoading={isLoading}
            isUpdating={isUpdating}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteOrder}
        />
      </div>

      {/* 4. Pagination Section */}
      {!isLoading && orders.length > 0 && (
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <Pagination 
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                loading={isLoading}
            />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                แสดงผล {orders.length} จากทั้งหมด {totalItems.toLocaleString()} รายการ
            </p>
        </div>
      )}

      {/* Footer space */}
      <div className="h-10"></div>
    </div>
  );
};

export default OrdersContainer;
