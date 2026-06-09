import React from 'react';
import { ShoppingBag, Filter, RefreshCw } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import OrdersTable from './OrdersTable';
import { ORDER_STATUS } from '@/shared/constants';

/**
 * 🚀 OrdersContainer
 * ตัวควบคุมหลักของหน้าจัดการออเดอร์สำหรับ Admin
 */
const OrdersContainer = () => {
  const {
    orders,
    isLoading,
    status,
    handleStatusFilterChange,
    handleUpdateStatus,
    handleDeleteOrder,
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
      
      {/* 1. Header & Quick Actions */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag size={16} className="text-purple-600" />
            <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">Ecommerce Management</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
            Order Management
          </h1>
          <p className="text-slate-400 mt-1 font-medium ml-1">จัดการคำสั่งซื้อ สถานะการชำระเงิน และการจัดส่งสินค้า</p>
        </div>

        <div className="flex items-center gap-3">
            <button 
                onClick={refreshOrders}
                className="p-3 bg-white text-slate-400 hover:text-purple-600 rounded-2xl shadow-sm border border-slate-100 transition-all hover:rotate-180 duration-500"
                title="Refresh Data"
            >
                <RefreshCw size={20} />
            </button>
            <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 text-slate-400">
                    <Filter size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
                </div>
                <select 
                    value={status}
                    onChange={(e) => handleStatusFilterChange(e.target.value)}
                    className="bg-slate-50 text-slate-700 text-xs font-black px-4 py-2 rounded-xl border-none outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                >
                    {filterOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {/* 2. Order Stats Summary (Optional - can add later) */}

      {/* 3. Main Data Table */}
      <div className="mb-10">
        <OrdersTable 
            orders={orders}
            isLoading={isLoading}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteOrder}
        />
      </div>

      {/* Footer space */}
      <div className="h-10"></div>
    </div>
  );
};

export default OrdersContainer;
