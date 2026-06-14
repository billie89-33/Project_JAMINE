import React from 'react';
import { useUsers } from './hooks/useUsers';
import CustomerList from './components/CustomerList';
import CustomerDetailModal from './components/CustomerDetailModal';
import { Users, Sparkles, Download, Loader2 } from 'lucide-react';

/**
 * 🚀 UsersContainer
 * หน้าหลักสำหรับจัดการลูกค้าในฝั่ง Admin - v2.0
 */
const UsersContainer = () => {
    const {
        isLoading,
        isActionLoading,
        users,
        pagination,
        page, setPage,
        keyword, setKeyword,
        status, setStatus,
        selectedUser,
        summary,
        isModalOpen, setIsModalOpen,
        isEditMode, setIsEditMode,
        editForm, setEditForm,
        activeTab, setActiveTab,
        viewDetail,
        handleUpdateUser,
        toggleStatus,
        deleteUser,
        exportToCSV,
        viewCustomerOrders
    } = useUsers();

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
            
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-200">
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={14} className="text-purple-500 fill-purple-500" />
                            <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">Community Management</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-800">
                            Customer Management
                        </h1>
                    </div>
                </div>

                <button 
                    onClick={exportToCSV}
                    disabled={isActionLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                    {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    Export to CSV
                </button>
            </div>

            {/* List Section */}
            <CustomerList 
...
            {/* Detail Modal */}
            <CustomerDetailModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
                summary={summary}
                onToggleStatus={toggleStatus}
                onDelete={deleteUser}
                onUpdate={handleUpdateUser}
                onViewOrders={viewCustomerOrders}
                isActionLoading={isActionLoading}
                isEditMode={isEditMode}
                setIsEditMode={setIsEditMode}
                editForm={editForm}
                setEditForm={setEditForm}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Footer space */}
            <div className="h-10"></div>
        </div>
    );
};

export default UsersContainer;
