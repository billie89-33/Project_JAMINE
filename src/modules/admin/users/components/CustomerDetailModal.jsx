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
    User as UserIcon,
    Edit3,
    Save,
    MapPin,
    ExternalLink,
    Clock
} from 'lucide-react';

/**
 * 🔍 CustomerDetailModal Component (v2.0)
 * หน้าต่างแสดงรายละเอียดเชิงลึก พร้อมโหมดแก้ไขและจัดการที่อยู่
 */
const CustomerDetailModal = ({ 
    isOpen, 
    onClose, 
    user, 
    summary, 
    onToggleStatus,
    onDelete,
    onUpdate,
    onViewOrders,
    isActionLoading,
    isEditMode,
    setIsEditMode,
    editForm,
    setEditForm,
    activeTab,
    setActiveTab
}) => {
    if (!isOpen || !user) return null;

    const tabs = [
        { id: 'summary', label: 'Summary', icon: <Clock size={14} /> },
        { id: 'addresses', label: 'Addresses', icon: <MapPin size={14} /> }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                
                {/* 1. Header Section */}
                <div className="relative h-40 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 flex-shrink-0">
                    <button 
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all z-10"
                    >
                        <X size={20} />
                    </button>
                    
                    {/* Avatar */}
                    <div className="absolute -bottom-10 left-10 p-2 bg-white rounded-[2rem] shadow-xl">
                        <div className={`w-28 h-24 rounded-3xl flex items-center justify-center text-4xl font-black text-white overflow-hidden ${
                            user.status === 'banned' ? 'bg-slate-400' : 'bg-gradient-to-br from-purple-500 to-indigo-500'
                        }`}>
                            {user.avatar?.url ? (
                                <img src={user.avatar.url} alt={user.name || user.username} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={40} strokeWidth={2.5} />
                            )}
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-10 flex gap-2">
                        {!isEditMode ? (
                            <button 
                                onClick={() => setIsEditMode(true)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-800 rounded-2xl text-xs font-black shadow-lg hover:bg-slate-50 transition-all"
                            >
                                <Edit3 size={14} />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsEditMode(false)}
                                    className="px-6 py-2.5 bg-white/20 text-white rounded-2xl text-xs font-black hover:bg-white/30 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={onUpdate}
                                    disabled={isActionLoading}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-2xl text-xs font-black shadow-lg hover:bg-emerald-600 transition-all disabled:opacity-50"
                                >
                                    {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Scrollable Content Area */}
                <div className="pt-14 px-10 pb-10 overflow-y-auto custom-scrollbar">
                    
                    {/* Tabs Navigation */}
                    <div className="flex items-center gap-2 mb-8 bg-slate-50 p-1.5 rounded-2xl w-fit">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all ${
                                    activeTab === tab.id 
                                        ? 'bg-white text-purple-600 shadow-sm' 
                                        : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'summary' && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                            {/* Profile Info Form / Display */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Display Name</label>
                                        {isEditMode ? (
                                            <input 
                                                type="text" 
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm font-bold"
                                            />
                                        ) : (
                                            <h2 className="text-2xl font-black text-slate-800 leading-none">{user.name || user.username}</h2>
                                        )}
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">@{user.username}</p>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Contact Details</label>
                                        <div className="space-y-3">
                                            {isEditMode ? (
                                                <>
                                                    <div className="flex items-center gap-3 p-1 bg-slate-50 rounded-2xl border border-slate-200">
                                                        <div className="p-2.5 text-slate-400"><Mail size={16} /></div>
                                                        <input 
                                                            type="email" 
                                                            value={editForm.email}
                                                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                                            className="bg-transparent border-none outline-none flex-1 text-xs font-bold text-slate-700 pr-4"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-3 p-1 bg-slate-50 rounded-2xl border border-slate-200">
                                                        <div className="p-2.5 text-slate-400"><Phone size={16} /></div>
                                                        <input 
                                                            type="text" 
                                                            value={editForm.phone}
                                                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                                            className="bg-transparent border-none outline-none flex-1 text-xs font-bold text-slate-700 pr-4"
                                                        />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Mail size={16} /></div>
                                                        {user.email}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={16} /></div>
                                                        {user.phone || 'No phone provided'}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 p-6 rounded-[2rem] border border-purple-100/50 flex items-center justify-between group">
                                        <div>
                                            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mb-1">Total Spent</span>
                                            <div className="text-2xl font-black text-slate-800">฿{(summary?.totalSpent || 0).toLocaleString()}</div>
                                        </div>
                                        <div className="p-4 bg-white rounded-2xl text-purple-600 shadow-sm"><CreditCard size={24} /></div>
                                    </div>
                                    <button 
                                        onClick={() => onViewOrders(user._id)}
                                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all text-left flex items-center justify-between group"
                                    >
                                        <div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Orders</span>
                                            <div className="text-2xl font-black text-slate-800">{summary?.totalOrders || 0}</div>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-purple-600 group-hover:bg-purple-50 transition-colors">
                                            <ExternalLink size={24} />
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Status & Delete */}
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] ${
                                        user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                    }`}>
                                        Status: {user.status}
                                    </span>
                                    <button 
                                        onClick={() => onToggleStatus(user._id, user.status)}
                                        className="text-xs font-black text-slate-400 hover:text-purple-600 transition-colors underline underline-offset-4"
                                    >
                                        {user.status === 'active' ? 'Ban this user' : 'Activate user'}
                                    </button>
                                </div>
                                <button 
                                    onClick={() => onDelete(user._id)}
                                    className="flex items-center gap-2 px-4 py-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-black transition-all"
                                >
                                    <Trash2 size={14} />
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'addresses' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Saved Delivery Addresses</h3>
                            {!user.addresses || user.addresses.length === 0 ? (
                                <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <MapPin size={32} className="mx-auto text-slate-300 mb-3" />
                                    <p className="text-sm font-bold text-slate-400">No addresses saved yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {user.addresses.map((addr, idx) => (
                                        <div key={idx} className={`p-6 rounded-3xl border transition-all ${
                                            addr.isDefault 
                                                ? 'bg-white border-purple-200 shadow-md ring-1 ring-purple-100' 
                                                : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200 shadow-sm'
                                        }`}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-slate-800">{addr.fullName}</span>
                                                    {addr.isDefault && (
                                                        <span className="px-2 py-0.5 bg-purple-600 text-white text-[8px] font-black uppercase rounded-md tracking-tighter">Default</span>
                                                    )}
                                                </div>
                                                <span className="text-xs font-bold text-slate-400">{addr.phone}</span>
                                            </div>
                                            <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                                {addr.address}, {addr.subDistrict}, {addr.district}, {addr.province}, {addr.postalCode}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailModal;
