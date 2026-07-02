import React from 'react';
import { PackageSearch } from 'lucide-react';
import { ORDER_STATUS } from '@/shared/constants';

export interface OrderStatusData {
    status: string;
    count: number;
}

export interface OrderStatusChartProps {
    data: OrderStatusData[];
}

/**
 * 📊 OrderStatusChart
 * กราฟแสดงสัดส่วนสถานะออเดอร์ เพื่อให้เห็นคอขวด (Bottleneck) ของการจัดส่ง
 */
const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ data }) => {
    // 1. เรียงลำดับสถานะให้ถูกต้องตาม Flow
    const STATUS_FLOW = [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.PAID,
        ORDER_STATUS.PROCESSING,
        ORDER_STATUS.SHIPPED,
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.CANCELLED
    ];

    // 2. Map color to status
    const getStatusStyle = (status: string) => {
        switch (status) {
            case ORDER_STATUS.PENDING: return { bg: 'bg-amber-500', bgLight: 'bg-amber-100', text: 'text-amber-700' };
            case ORDER_STATUS.PAID: return { bg: 'bg-emerald-500', bgLight: 'bg-emerald-100', text: 'text-emerald-700' };
            case ORDER_STATUS.PROCESSING: return { bg: 'bg-indigo-500', bgLight: 'bg-indigo-100', text: 'text-indigo-700' };
            case ORDER_STATUS.SHIPPED: return { bg: 'bg-blue-500', bgLight: 'bg-blue-100', text: 'text-blue-700' };
            case ORDER_STATUS.DELIVERED: return { bg: 'bg-green-500', bgLight: 'bg-green-100', text: 'text-green-700' };
            case ORDER_STATUS.CANCELLED: return { bg: 'bg-rose-500', bgLight: 'bg-rose-100', text: 'text-rose-700' };
            default: return { bg: 'bg-slate-500', bgLight: 'bg-slate-100', text: 'text-slate-700' };
        }
    };

    // 3. จัดกลุ่มและคำนวณยอดรวม
    const totalOrders = data?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;
    
    // สร้าง Object เพื่อ map count
    const countMap: Record<string, number> = {};
    data?.forEach(item => {
        countMap[item.status] = item.count;
    });

    return (
        <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-indigo-100/50 border border-indigo-50 h-full flex flex-col animate-in fade-in zoom-in-95 duration-500">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <PackageSearch className="text-indigo-500" size={24} />
                        Order Pipeline
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">สัดส่วนสถานะการจัดส่ง</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Active</p>
                    <p className="text-2xl font-black text-indigo-600 leading-none">{totalOrders}</p>
                </div>
            </div>

            <div className="flex-1 space-y-5 mt-2">
                {STATUS_FLOW.map((status) => {
                    const count = countMap[status] || 0;
                    const percentage = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                    const style = getStatusStyle(status);

                    return (
                        <div key={status} className="group">
                            <div className="flex justify-between items-end mb-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${style.bgLight} ${style.text}`}>
                                    {status}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-700">{count}</span>
                                    <span className="text-[10px] font-black text-slate-400 w-8 text-right">{percentage}%</span>
                                </div>
                            </div>
                            
                            {/* Progress Bar Container */}
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${style.bg} transition-all duration-1000 ease-out`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monitor bottlenecks in Processing & Shipped stages.</p>
            </div>
        </div>
    );
};

export default OrderStatusChart;
