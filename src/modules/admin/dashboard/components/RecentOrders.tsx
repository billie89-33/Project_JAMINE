import React from 'react';
import { ShoppingBag, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface RecentOrder {
    _id: string;
    customerName: string;
    date: string | Date;
    amount: number;
    status: string;
}

export interface RecentOrdersProps {
    orders: RecentOrder[];
}

/**
 * 📋 RecentOrders Component
 * แสดงรายการออเดอร์ล่าสุดใน Dashboard
 */
const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch(status) {
        case 'Delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        case 'Shipped': return 'text-blue-600 bg-blue-50 border-blue-100';
        case 'Processing': return 'text-amber-600 bg-amber-50 border-amber-100';
        case 'Awaiting Payment': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
        default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-purple-100/50 border border-purple-50 h-full">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <ShoppingBag className="text-purple-600" size={24} />
            Recent Orders
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">ออเดอร์ล่าสุด</p>
        </div>
        <button 
          onClick={() => navigate('/admin/order')}
          className="text-[10px] font-black text-purple-600 bg-purple-50 px-4 py-2 rounded-xl hover:bg-purple-100 transition-colors uppercase tracking-widest"
        >
            ดูทั้งหมด
        </button>
      </div>

      <div className="space-y-4">
        {orders?.map((order) => (
          <div 
            key={order._id} 
            onClick={() => navigate('/admin/order')} // ในอนาคตอาจชี้ไปที่ /admin/order-details พร้อม ID
            className="flex items-center justify-between p-5 rounded-[24px] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group cursor-pointer"
          >
            <div className="flex items-center gap-4">
                {/* 👤 Avatar Placeholder with Icon */}
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400 shadow-sm group-hover:bg-white group-hover:text-indigo-600 transition-all duration-300">
                    <User size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800">{order.customerName}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-slate-300">#{order._id.split('-')[1] || order._id}</span>
                        <span className="text-slate-200">•</span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Clock size={10} className="text-slate-300"/>
                            {new Date(order.date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-black text-slate-800">฿{order.amount?.toLocaleString() || 0}</span>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${getStatusColor(order.status)}`}>
                    {order.status}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
