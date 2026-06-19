import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, XCircle, Truck, Package, Trash2, ExternalLink, User, ShoppingBag, Loader2 } from 'lucide-react';
import { ORDER_STATUS, ORDER_TRANSITIONS } from '@/shared/constants';

/**
 * 📦 OrdersTable Component
 * ตารางแสดงรายการออเดอร์สำหรับ Admin พร้อมระบบเปลี่ยนสถานะ
 */
const OrdersTable = ({ orders, onUpdateStatus, onDelete, isLoading, isUpdating }) => {
  const navigate = useNavigate();

  // Helper สำหรับดึงสถานะที่เปลี่ยนไปได้ (รวมสถานะปัจจุบันด้วยเพื่อให้ dropdown แสดงค่าถูก)
  const getAllowedOptions = (currentStatus) => {
    const nextPossible = ORDER_TRANSITIONS[currentStatus] || [];
    return [currentStatus, ...nextPossible];
  };

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
      <div className="w-full h-96 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-slate-100 animate-pulse">
        <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">กำลังโหลดข้อมูลออเดอร์...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full py-24 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 shadow-inner animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
          <ShoppingBag size={48} />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">ไม่พบรายการสั่งซื้อ</h3>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest max-w-sm mx-auto">ดูเหมือนว่ายังไม่มีรายการสั่งซื้อตามเงื่อนไขที่คุณเลือก</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-2xl shadow-purple-100/20 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order Details</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Amount</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Order Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Date</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((order) => {
              const style = getStatusStyle(order.status);
              return (
                <tr key={order._id} className="hover:bg-slate-50/30 transition-all group">
                  {/* 1. Order ID */}
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 uppercase tracking-tighter">#{order.orderNumber || order._id.slice(-8)}</span>
                      <span className="text-[9px] font-mono text-slate-300 group-hover:text-purple-400 transition-colors" title={order._id}>{order._id}</span>
                    </div>
                  </td>

                  {/* 2. Customer */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 group-hover:scale-110 transition-transform">
                        <User size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700">
                          {order.shippingAddress?.fullName || order.userId?.name || 'Guest User'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{order.userId?.email || '-'}</span>
                      </div>
                    </div>
                  </td>

                  {/* 3. Amount */}
                  <td className="px-8 py-5 text-center">
                    <span className="text-sm font-black text-slate-800 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      ฿{(order.total || order.totalAmount || 0).toLocaleString()}
                    </span>
                  </td>

                  {/* 4. Status (with Dropdown) */}
                  <td className="px-8 py-5 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full border shadow-sm ${style.bg} ${style.color} ${style.border} text-[9px] font-black uppercase tracking-[0.15em]`}>
                        {style.icon}
                        {order.status}
                      </div>
                      
                      {/* Status Switcher (Strict Flow Control) */}
                      <select 
                        disabled={isUpdating}
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                        className="bg-white text-slate-500 text-[10px] font-black px-3 py-1.5 rounded-xl border border-slate-200 outline-none cursor-pointer hover:border-purple-300 hover:text-purple-600 transition-all uppercase disabled:opacity-50"
                      >
                        {getAllowedOptions(order.status).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* 5. Date */}
                  <td className="px-8 py-5 text-center">
                    <div className="flex flex-col text-slate-400">
                      <span className="text-xs font-black text-slate-600">{new Date(order.createdAt).toLocaleDateString('th-TH')}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5">{new Date(order.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>

                  {/* 6. Actions */}
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate(`/admin/order-details/${order._id}`)}
                        className="p-3 bg-purple-50 text-purple-600 rounded-[1rem] hover:bg-purple-600 hover:text-white hover:shadow-lg hover:shadow-purple-100 transition-all active:scale-90"
                        title="View Details"
                      >
                        <ExternalLink size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(order._id)}
                        className="p-3 bg-rose-50 text-rose-600 rounded-[1rem] hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-100 transition-all active:scale-90"
                        title="Delete Order"
                      >
                        <Trash2 size={18} />
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
