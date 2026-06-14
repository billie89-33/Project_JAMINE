import React from 'react';
import { 
    Search, 
    Filter, 
    Eye, 
    UserX, 
    UserCheck, 
    Trash2,
    Mail,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2,
    User as UserIcon
} from 'lucide-react';

/**
 * 👥 CustomerList Component
 * ส่วนแสดงผลตารางรายชื่อลูกค้าพร้อมระบบ Filter
 */
const CustomerList = ({ 
    users, 
    isLoading, 
    pagination, 
    page, 
    setPage, 
    keyword, 
    setKeyword, 
    status, 
    setStatus,
    onViewDetail,
    onToggleStatus
}) => {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header & Filters */}
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name, username or email..." 
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setPage(1);
                        }}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm font-medium"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200">
                        <Filter size={16} className="text-slate-400" />
                        <select 
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(1);
                            }}
                            className="text-xs font-bold text-slate-600 outline-none cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active Only</option>
                            <option value="banned">Banned Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.15em] text-slate-400 font-black">
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Joined Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="animate-spin text-purple-600" size={32} />
                                        <span className="text-sm font-bold text-slate-400">Loading customers...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-medium">
                                    No customers found matching your search.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm overflow-hidden ${
                                                user.status === 'banned' ? 'bg-slate-300' : 'bg-gradient-to-br from-purple-500 to-indigo-500'
                                            }`}>
                                                {user.avatar?.url ? (
                                                    <img src={user.avatar.url} alt={user.name || user.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserIcon size={20} strokeWidth={2.5} />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-700">{user.name || user.username}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">@{user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                            <Mail size={14} className="text-slate-400" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                            <Calendar size={14} className="text-slate-400" />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            user.status === 'active' 
                                                ? 'bg-emerald-50 text-emerald-600' 
                                                : 'bg-rose-50 text-rose-600'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => onViewDetail(user._id)}
                                                className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                                                title="View Detail"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button 
                                                onClick={() => onToggleStatus(user._id, user.status)}
                                                className={`p-2 rounded-xl transition-all ${
                                                    user.status === 'active' 
                                                        ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' 
                                                        : 'text-emerald-500 hover:bg-emerald-50'
                                                }`}
                                                title={user.status === 'active' ? 'Ban User' : 'Activate User'}
                                            >
                                                {user.status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!isLoading && users.length > 0 && (
                <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Showing {users.length} of {pagination.totalItems} Customers
                    </span>
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-30 transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1">
                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                                        page === i + 1 
                                            ? 'bg-purple-600 text-white shadow-md' 
                                            : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            )).slice(Math.max(0, page - 3), Math.min(pagination.totalPages, page + 2))}
                        </div>
                        <button 
                            disabled={page === pagination.totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-30 transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerList;
