import React, { useState } from 'react';
import { ShoppingBag, ExternalLink, Clock, CheckCircle2, XCircle, Package, Truck, CreditCard } from 'lucide-react';
import { useOrderHistory } from '../hooks/useOrderHistory';
import { ORDER_STATUS } from '@/shared/constants';
import OrderDetailsModal from './OrderDetailsModal';

const OrderHistoryList = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { 
    orders, 
    isLoading, 
    activeFilter, 
    setActiveTab, 
    getRemainingTime, 
    handlePayNow, 
    handleTrackOrder 
  } = useOrderHistory();

  const filterTabs = [
    { id: 'all', label: 'ทั้งหมด', icon: <ShoppingBag size={14} /> },
    { id: 'pending', label: 'รอชำระเงิน', icon: <Clock size={14} /> },
    { id: 'shipping', label: 'กำลังจัดส่ง', icon: <Truck size={14} /> },
    { id: 'completed', label: 'สำเร็จ', icon: <CheckCircle2 size={14} /> },
    { id: 'cancelled', label: 'ยกเลิก', icon: <XCircle size={14} /> },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case ORDER_STATUS.PAID:
        return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case ORDER_STATUS.PENDING:
        return 'text-amber-500 bg-amber-50 border-amber-100';
      case ORDER_STATUS.SHIPPED:
        return 'text-blue-500 bg-blue-50 border-blue-100';
      case ORDER_STATUS.CANCELLED:
        return 'text-slate-400 bg-slate-50 border-slate-100';
      default:
        return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-purple-100/30 border border-purple-50 flex flex-col items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black text-purple-600 uppercase tracking-widest">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 🧭 Filter Tabs */}
      <div className="bg-white p-2 rounded-[24px] shadow-lg shadow-purple-100/20 border border-purple-50 flex flex-wrap gap-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeFilter === tab.id 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-200' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[40px] shadow-xl shadow-purple-100/30 border border-purple-50">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-8 mb-8">
           <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
             <ShoppingBag size={20} />
           </div>
           <div>
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Order History</h3>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
               Showing {activeFilter} orders ({orders.length})
             </p>
           </div>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
             {orders.map((order) => {
               const remainingTime = getRemainingTime(order.expiresAt);
               const firstItem = order.items?.[0] || {};
               const statusStyle = getStatusStyle(order.status);

               return (
                 <div key={order._id} className="group p-6 bg-slate-50/50 hover:bg-white border border-transparent hover:border-purple-100 rounded-[32px] transition-all duration-300 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                   
                   {/* Left: Product Thumbnail & Order Info */}
                   <div className="flex items-center gap-5">
                      <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                        {firstItem.image ? (
                           <img src={firstItem.image} alt={firstItem.modelName} className="w-full h-full object-cover" />
                        ) : (
                           <Package size={32} strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-2">
                           <h4 className="text-sm font-black text-slate-800 uppercase tracking-tighter">
                             {order.orderNumber || order._id.slice(-8)}
                           </h4>
                           <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-tighter ${statusStyle}`}>
                             {order.status}
                           </span>
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold">
                           {order.items?.length || 0} รายการ • สั่งซื้อเมื่อ {new Date(order.createdAt).toLocaleDateString()}
                         </p>
                         
                         {/* ⏳ Expiry Timer for Awaiting Payment */}
                         {order.status === ORDER_STATUS.PENDING && remainingTime && (
                           <div className={`mt-2 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${remainingTime === 'Expired' ? 'text-rose-500' : 'text-amber-500'}`}>
                              <Clock size={10} /> 
                              {remainingTime === 'Expired' ? 'หมดเวลาชำระเงิน' : `ชำระเงินภายใน: ${remainingTime}`}
                           </div>
                         )}
                      </div>
                   </div>

                   {/* Right: Amount & Actions */}
                   <div className="flex items-center justify-between xl:justify-end gap-10">
                      <div className="text-left xl:text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                         <p className="text-lg font-black text-purple-600">฿{(order.total || order.totalAmount || order.total_amount || 0).toLocaleString()}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                         {/* 💳 Primary Action: Pay Now */}
                         {order.status === ORDER_STATUS.PENDING && remainingTime !== 'Expired' && (
                           <button 
                             onClick={() => handlePayNow(order)}
                             className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-amber-200 hover:scale-105 active:scale-95 transition-all"
                           >
                             <CreditCard size={14} /> Pay Now
                           </button>
                         )}

                         {/* 🚚 Primary Action: Track Order */}
                         {order.status === ORDER_STATUS.SHIPPED && order.trackingNumber && (
                           <button 
                             onClick={() => handleTrackOrder(order.trackingNumber)}
                             className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
                           >
                             <Truck size={14} /> Track Order
                           </button>
                         )}

                         <button 
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center gap-1.5 px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-purple-600 transition-colors"
                         >
                           Details <ExternalLink size={12} />
                         </button>
                      </div>
                   </div>
                 </div>
               );
             })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6 text-slate-200 border-2 border-dashed border-slate-100">
              <ShoppingBag size={40} strokeWidth={1.5} />
            </div>
            <h4 className="text-lg font-black text-slate-800 mb-2 uppercase tracking-tight">
              No orders found
            </h4>
            <p className="text-slate-400 text-xs font-bold max-w-[250px] leading-relaxed mb-8">
              Looks like there's nothing here yet. Explore our products to start shopping!
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-200 hover:scale-105 transition-all active:scale-95">
              Explore Products
            </button>
          </div>
        )}
      </div>

      {/* 🔮 Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};

export default OrderHistoryList;
