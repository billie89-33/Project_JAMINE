import React from 'react';
import { Clock, CheckCircle2, XCircle, Truck, Package, Trash2, ExternalLink, User, ShoppingBag } from 'lucide-react';
import { ORDER_STATUS } from '@/shared/constants';

/**
 * 📦 OrdersTable Component
 * ตารางแสดงรายการออเดอร์สำหรับ Admin พร้อมระบบเปลี่ยนสถานะ
 */
const OrdersTable = ({ orders, onUpdateStatus, onDelete, isLoading }) => {

  const getStatusStyle = (status) => {
    switch (status) {
      case ORDER_STATUS.PAID:
        return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <CheckCircle2 size={12} /> };
      case ORDER_STATUS.PENDING:
        return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: <Clock size={12} /> };
      case ORDER_STATUS.PROCESSING:
        return { color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: <Package size={12} /> };
      case ORDER_STATUS.SHIPPED:
        return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: <Truck size={12} /> };
      case ORDER_STATUS.DELIVERED:
        return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: <CheckCircle2 size={12} /> };
      case ORDER_STATUS.CANCELLED:
        return { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: <XCircle size={12} /> };
      default:
        return { color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', icon: <Clock size={12} /> };
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-purple-50">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-black text-purple-600 uppercase tracking-widest">กำลังโหลดข้อมูลออเดอร์...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100 shadow-inner">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
          <ShoppingBag size={40} />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">ไม่พบรายการสั่งซื้อ</h3>
        <p className="text-slate-400 text-xs font-bold max-w-sm mx-auto">ดูเหมือนว่ายังไม่มีรายการสั่งซื้อตามเงื่อนไขที่คุณเลือก</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl shadow-purple-100/50 border border-purple-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-purple-50">
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Amount</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Date</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {orders.map((order) => {
              const style = getStatusStyle(order.status);
              return (
                <tr key={order._id} className="hover:bg-purple-50/30 transition-colors group">
                  {/* 1. Order ID */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">#{order.orderNumber || order._id.slice(-8)}</span>
                      <span className="text-[9px] font-mono text-slate-300 truncate w-24" title={order._id}>{order._id}</span>
                    </div>
                  </td>

                  {/* 2. Customer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <User size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{order.userId?.name || 'Guest User'}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{order.userId?.email || '-'}</span>
                      </div>
                    </div>
                  </td>

                  {/* 3. Amount */}
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-black text-slate-800">฿{(order.total || 0).toLocaleString()}</span>
                  </td>

                  {/* 4. Status (with Dropdown) */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${style.bg} ${style.color} ${style.border} text-[9px] font-black uppercase tracking-widest`}>
                        {style.icon}
                        {order.status}
                      </div>
                      
                      {/* Status Switcher (Dropdown-like select) */}
                      <select 
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                        className="bg-slate-50 text-slate-500 text-[9px] font-black px-2 py-1 rounded-lg border-none outline-none cursor-pointer hover:bg-slate-100 transition-colors uppercase"
                      >
                        {Object.values(ORDER_STATUS).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* 5. Date */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col text-slate-400">
                      <span className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString('th-TH')}</span>
                      <span className="text-[9px] font-medium">{new Date(order.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</span>
                    </div>
                  </td>

                  {/* 6. Actions */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className="p-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all active:scale-90"
                        title="View Details"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(order._id)}
                        className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all active:scale-90"
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
