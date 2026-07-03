import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ExternalLink } from 'lucide-react';
import { Order, User } from '@/types';
import { QuickTrackingPayload } from '../../services';

interface ShippingTableProps {
    orders: Order[];
    loading: boolean;
    onUpdateTracking: (orderId: string, trackingData: QuickTrackingPayload) => void;
}

const ShippingTable = ({ orders, loading, onUpdateTracking }: ShippingTableProps) => {
    const navigate = useNavigate();
    const [trackingInput, setTrackingInput] = useState<Record<string, string>>({});

    const handleInputChange = (orderId: string, value: string) => {
        setTrackingInput(prev => ({ ...prev, [orderId]: value }));
    };

    const handleSubmit = (orderId: string) => {
        const trackingNumber = trackingInput[orderId];
        if (!trackingNumber) return;
        
        onUpdateTracking(orderId, {
            trackingNumber,
            status: 'Shipped'
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Order Details</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Tracking Number</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                                    No shipping orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order: Order) => (
                                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">#{order.orderNumber}</div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* 🧼 Clean Mode: แสดงเฉพาะชื่อผู้รับ (Recipient Name) */}
                                        <div className="text-sm font-black text-slate-800 uppercase tracking-tight">
                                            {order.shippingAddress?.fullName || (order.userId as User)?.name || 'Unknown'}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                            {(order.userId as User)?.email || 'Guest Customer'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            order.status === 'Paid' ? 'bg-blue-50 text-blue-600' :
                                            order.status === 'Shipped' ? 'bg-purple-50 text-purple-600' :
                                            'bg-slate-50 text-slate-600'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.status === 'Paid' || order.status === 'Processing' ? (
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter Tracking #"
                                                    className="text-sm border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48"
                                                    value={trackingInput[order._id] || ''}
                                                    onChange={(e) => handleInputChange(order._id, e.target.value)}
                                                />
                                                <button 
                                                    onClick={() => handleSubmit(order._id)}
                                                    className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700 transition-colors"
                                                    disabled={!trackingInput[order._id]}
                                                >
                                                    <Truck size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm text-slate-700 font-mono">
                                                {order.trackingNumber || 'N/A'}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => navigate(`/admin/order-details/${order._id}`)}
                                            className="text-slate-400 hover:text-blue-600 transition-colors"
                                        >
                                            <ExternalLink size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShippingTable;
