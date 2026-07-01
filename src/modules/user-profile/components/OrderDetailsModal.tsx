import React from 'react';
import { X, Package, Truck, ExternalLink, MapPin } from 'lucide-react';
import { ORDER_STATUS } from '@/shared/constants';
import { Order } from '@/types';

const OrderDetailsModal: React.FC<{ order: Order; onClose: () => void }> = ({ order, onClose }) => {
    if (!order) return null;

    const isShipped = order.status === ORDER_STATUS.SHIPPED || order.status === ORDER_STATUS.DELIVERED;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Order Details</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.orderNumber || order._id}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* 🚚 Tracking Section (Only show if shipped) */}
                    {isShipped && order.trackingNumber && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-[24px] border border-indigo-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Tracking Number</p>
                                    <p className="text-sm font-black text-indigo-900 font-mono tracking-wider">{order.trackingNumber}</p>
                                </div>
                            </div>
                            <a 
                                href={`https://track.jamine.com/${order.trackingNumber}`} // Mock link
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-colors shadow-md shadow-indigo-200"
                            >
                                Track Package <ExternalLink size={14} />
                            </a>
                        </div>
                    )}

                    {/* 📦 Order Items */}
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Package size={14} /> Items in your order
                        </h4>
                        <div className="space-y-4">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-[20px] border border-slate-100">
                                    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-slate-100 shrink-0">
                                        <img src={item.image || 'https://via.placeholder.com/150'} alt={item.modelName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{item.brand}</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{item.modelName}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs font-black text-slate-800">฿{(item.priceAtPurchase || item.price || 0).toLocaleString()}</span>
                                            <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-100">Qty: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-black text-purple-600">฿{((item.priceAtPurchase || item.price || 0) * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 📍 Shipping Address */}
                    {order.shippingAddress && (
                        <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MapPin size={14} /> Delivery Address
                            </h4>
                            <div className="p-5 bg-slate-50 rounded-[20px] border border-slate-100">
                                <p className="text-sm font-bold text-slate-800 mb-1">{order.shippingAddress.fullName}</p>
                                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                    {order.shippingAddress.addressLine1} {order.shippingAddress.addressLine2}<br/>
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                </p>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer (Summary) */}
                <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <div className="flex flex-col gap-2 mb-4 text-xs font-bold text-slate-500">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>฿{(order.totalAmount || order.total || order.total_amount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-emerald-500">Free</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-rose-500">
                                <span>Discount</span>
                                <span>- ฿{(order.discount || 0).toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                        <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Total Paid</span>
                        <span className="text-2xl font-black text-purple-600">฿{(order.totalAmount || order.total || order.total_amount || 0).toLocaleString()}</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrderDetailsModal;
