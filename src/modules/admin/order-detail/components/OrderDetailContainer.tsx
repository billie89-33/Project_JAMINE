import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Package, 
    User, 
    MapPin, 
    CreditCard, 
    Truck, 
    Clock,
    Info
} from 'lucide-react';
import { useOrderDetail } from '../hooks/useOrderDetail';
import { ORDER_STATUS, ORDER_TRANSITIONS } from '@/shared/constants';

/**
 * 🚀 OrderDetailContainer (Admin)
 * หน้าจอแสดงรายละเอียดออเดอร์และระบบจัดการขนส่ง (Shipping Management)
 * ปรับปรุงให้ตรงกับ Backend Model: subtotal, shippingFee, total, priceAtPurchase
 */
const OrderDetailContainer = () => {
    const navigate = useNavigate();
    const { 
        order, 
        isLoading, 
        isUpdating,
        trackingNumber, 
        setTrackingNumber, 
        handleUpdateStatus 
    } = useOrderDetail();

    const getAvailableStatuses = (currentStatus: string) => {
        const nextPossible = (ORDER_TRANSITIONS as unknown as Record<string, string[]>)[currentStatus] || [];
        return [currentStatus, ...nextPossible];
    };

    if (isLoading || !order) {
        return (
            <div className="max-w-[1200px] mx-auto min-h-[600px] flex flex-col items-center justify-center animate-pulse">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-purple-600 font-bold uppercase tracking-widest text-sm">กำลังโหลดข้อมูลออเดอร์...</p>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case ORDER_STATUS.PAID: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case ORDER_STATUS.PENDING: return 'text-amber-600 bg-amber-50 border-amber-100';
            case ORDER_STATUS.PROCESSING: return 'text-indigo-600 bg-indigo-50 border-indigo-100';
            case ORDER_STATUS.SHIPPED: return 'text-blue-600 bg-blue-50 border-blue-100';
            case ORDER_STATUS.DELIVERED: return 'text-green-600 bg-green-50 border-green-100';
            case ORDER_STATUS.CANCELLED: return 'text-rose-600 bg-rose-50 border-rose-100';
            default: return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto animate-in fade-in duration-700">
            
            {/* 🔙 Navigation Header */}
            <div className="flex items-center justify-between mb-8">
                <button 
                    onClick={() => navigate('/admin/order')}
                    className="flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-colors group"
                >
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:bg-purple-50 transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Back to Orders</span>
                </button>
            </div>

            {/* 📦 Order Header Card */}
            <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-purple-100/30 border border-purple-50 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner border border-purple-100">
                        <Package size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                                {order.orderNumber || order._id.slice(-8)}
                            </h1>
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${getStatusBadge(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                            <Clock size={12}/> สั่งซื้อเมื่อ: <p className="font-semibold text-slate-800">{new Date(order.createdAt as string).toLocaleString('th-TH')}</p>
                        </p>
                    </div>
                </div>

                {/* Status Switcher for Admin (Strict Flow Control) */}
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">Update Status</span>
                    <select 
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        disabled={isUpdating}
                        className="bg-white text-purple-600 text-xs font-black px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm outline-none cursor-pointer hover:border-purple-200 transition-colors uppercase"
                    >
                        {getAvailableStatuses(order.status).map((s: string) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 🛒 Left Column: Items & Customer Info */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Items Table */}
                    <div className="bg-white rounded-[32px] shadow-xl shadow-purple-100/30 border border-purple-50 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
                            <Package className="text-slate-400" size={20}/>
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Order Items</h3>
                        </div>
                        <div className="overflow-x-auto p-2">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 rounded-xl">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-l-xl">Product</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Price</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">QTY</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right rounded-r-xl">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {order.items?.map((item, idx) => {
                                        // 🛡️ strictly Match with Backend Model (priceAtPurchase)
                                        const itemPrice = item.priceAtPurchase || 0;
                                        const itemModel = item.modelName || 'Unknown Product';
                                        const itemBrand = item.brand || '';
                                        const itemImage = item.image || 'https://via.placeholder.com/150';

                                        return (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                                                            <img 
                                                                src={itemImage} 
                                                                alt={itemModel} 
                                                                className="w-full h-full object-cover" 
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{itemBrand}</p>
                                                            <p className="text-sm font-bold text-slate-700 leading-tight">{itemModel}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-sm font-bold text-slate-600">฿{itemPrice.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-sm font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">x{item.quantity}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-sm font-black text-purple-600">฿{(itemPrice * item.quantity).toLocaleString()}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex gap-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                                <User size={20} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer Details</h4>
                                <p className="text-sm font-bold text-slate-800">
                                    {order.shippingAddress?.fullName || (order.userId as { name?: string; username?: string })?.name || (order.userId as { name?: string; username?: string })?.username || 'Guest'}
                                </p>
                                <p className="text-xs text-slate-500">{(order.userId as { name?: string; email?: string; phone?: string })?.email || '-'}</p>
                                <p className="text-xs text-slate-500 mt-1">{order.shippingAddress?.phone || (order.userId as { name?: string; email?: string; phone?: string })?.phone || '-'}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex gap-4">
                            <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Shipping Address</h4>
                                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                    {order.shippingAddress?.fullName}<br/>
                                    {order.shippingAddress?.address}<br/>
                                    {order.shippingAddress?.subDistrict} {order.shippingAddress?.district}<br/>
                                    {order.shippingAddress?.province} {order.shippingAddress?.postalCode}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🚚 Right Column: Shipping Management & Summary */}
                <div className="space-y-8">
                    
                    {/* Shipping Tracking Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[32px] p-6 shadow-2xl shadow-indigo-200 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Truck size={100} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Truck size={20} className="text-white" />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-white/90">Shipping Tracker</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">
                                        Tracking Number (เลขพัสดุ)
                                    </label>
                                    <input 
                                        type="text" 
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="e.g. TH0123456789"
                                        className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all font-mono font-bold text-sm"
                                        disabled={order.status === ORDER_STATUS.DELIVERED || order.status === ORDER_STATUS.CANCELLED}
                                    />
                                </div>
                                
                                <button 
                                    onClick={() => handleUpdateStatus(ORDER_STATUS.SHIPPED)}
                                    disabled={
                                        isUpdating || 
                                        !trackingNumber.trim() || 
                                        (order.status === ORDER_STATUS.SHIPPED && trackingNumber.trim() === (order.trackingNumber || ''))
                                    }
                                    className="w-full py-3 bg-white text-indigo-600 hover:bg-indigo-50 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {order.status === ORDER_STATUS.SHIPPED 
                                        ? (trackingNumber.trim() === (order.trackingNumber || '') ? '✓ จัดส่งแล้ว' : 'Update Tracking') 
                                        : 'Mark as Shipped'}
                                </button>

                                <div className="flex items-start gap-2 mt-4 p-3 bg-indigo-900/40 rounded-xl border border-indigo-400/30">
                                    <Info size={14} className="text-indigo-300 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-indigo-200 leading-relaxed font-medium">
                                        การกด <strong>Mark as Shipped</strong> จะเปลี่ยนสถานะออเดอร์เป็น จัดส่งแล้ว พร้อมบันทึกเลขพัสดุให้ลูกค้าตรวจสอบ
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <CreditCard size={14}/> Payment Summary
                        </h4>
                        <div className="space-y-3 text-sm font-medium text-slate-500 border-b border-slate-100 pb-4 mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>฿{(order.subtotal || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping Fee</span>
                                <span className="text-emerald-500 font-bold">฿{(order.shippingFee || 0).toLocaleString()}</span>
                            </div>
                            {(order.discount || 0) > 0 && (
                                <div className="flex justify-between text-rose-500">
                                    <span>Discount</span>
                                    <span>- ฿{(order.discount || 0).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center text-slate-800">
                            <span className="text-xs font-black uppercase tracking-widest">Total</span>
                            <span className="text-2xl font-black text-purple-600">฿{(order.total || 0).toLocaleString()}</span>
                        </div>
                    </div>

                </div>
            </div>
            <div className="h-10"></div>
        </div>
    );
};

export default OrderDetailContainer;
