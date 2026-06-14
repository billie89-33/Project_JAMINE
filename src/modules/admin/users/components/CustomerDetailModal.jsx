import React from 'react';
import { 
    X, 
    Mail, 
    Phone, 
    Calendar, 
    Shield, 
    ShoppingBag, 
    CreditCard,
    UserX,
    UserCheck,
    Trash2,
    Loader2,
    User as UserIcon
} from 'lucide-react';

/**
 * 🔍 CustomerDetailModal Component
 * หน้าต่างแสดงรายละเอียดเชิงลึกของลูกค้า
 */
const CustomerDetailModal = ({ 
    isOpen, 
    onClose, 
    user, 
    summary, 
    onToggleStatus,
    onDelete,
    isActionLoading 
}) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-purple-600 to-indigo-600">
                    <button 
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                    
                    {/* Avatar */}
                    <div className="absolute -bottom-12 left-10 p-1.5 bg-white rounded-3xl shadow-lg">
                        <div className={`w-24 h-24 rounded-[1.5rem] flex items-center justify-center text-3xl font-black text-white overflow-hidden ${
                            user.status === 'banned' ? 'bg-slate-400' : 'bg-gradient-to-br from-purple-500 to-indigo-500'
                        }`}>
                            {user.avatar?.url ? (
                                <img src={user.avatar.url} alt={user.name || user.username} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={48} strokeWidth={2.5} />
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-16 px-10 pb-10">
                    {/* Profile Basic Info */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800">{user.name || user.username}</h2>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">@{user.username}</p>
                            <div className="mt-3 flex items-center gap-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                    user.status === 'active' 
                                        ? 'bg-emerald-50 text-emerald-600' 
                                        : 'bg-rose-50 text-rose-600'
                                }`}>
                                    <Shield size={12} className="mr-1.5" />
                                    {user.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => onToggleStatus(user._id, user.status)}
                                disabled={isActionLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                    user.status === 'active'
                                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                }`}
                            >
                                {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : (user.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />)}
                                {user.status === 'active' ? 'Ban User' : 'Activate User'}
                            </button>
                            <button 
                                onClick={() => onDelete(user._id)}
                                disabled={isActionLoading}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-black transition-all"
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                                    <ShoppingBag size={18} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Orders</span>
                            </div>
                            <div className="text-2xl font-black text-slate-800">{summary?.totalOrders || 0}</div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                                    <CreditCard size={18} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Spent</span>
                            </div>
                            <div className="text-2xl font-black text-slate-800">฿{(summary?.totalSpent || 0).toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="text-slate-400"><Mail size={18} /></div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</div>
                                    <div className="text-sm font-bold text-slate-700">{user.email}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="text-slate-400"><Phone size={18} /></div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Number</div>
                                    <div className="text-sm font-bold text-slate-700">{user.phone || 'Not Provided'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="text-slate-400"><Calendar size={18} /></div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Member Since</div>
                                    <div className="text-sm font-bold text-slate-700">{new Date(user.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailModal;
