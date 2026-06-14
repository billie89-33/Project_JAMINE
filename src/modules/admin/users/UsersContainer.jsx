import React from 'react';
import { useUsers } from './hooks/useUsers';
import CustomerList from './components/CustomerList';
import CustomerDetailModal from './components/CustomerDetailModal';
import { Users, Sparkles } from 'lucide-react';

/**
 * 🚀 UsersContainer
 * หน้าหลักสำหรับจัดการลูกค้าในฝั่ง Admin
 */
const UsersContainer = () => {
    const {
        isLoading,
        isActionLoading,
        users,
        pagination,
        page,
        setPage,
        keyword,
        setKeyword,
        status,
        setStatus,
        selectedUser,
        summary,
        isModalOpen,
        setIsModalOpen,
        viewDetail,
        toggleStatus,
        deleteUser
    } = useUsers();

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
            
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-purple-500 fill-purple-500" />
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">Community Management</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-200">
                        <Users size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800">
                            Customer Management
                        </h1>
                        <p className="text-slate-400 mt-1 font-medium">จัดการข้อมูลสมาชิก ตรวจสอบสถิติ และควบคุมการเข้าใช้งานระบบ</p>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <CustomerList 
                users={users}
                isLoading={isLoading}
                pagination={pagination}
                page={page}
                setPage={setPage}
                keyword={keyword}
                setKeyword={setKeyword}
                status={status}
                setStatus={setStatus}
                onViewDetail={viewDetail}
                onToggleStatus={toggleStatus}
            />

            {/* Detail Modal */}
            <CustomerDetailModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
                summary={summary}
                onToggleStatus={toggleStatus}
                onDelete={deleteUser}
                isActionLoading={isActionLoading}
            />

            {/* Footer space */}
            <div className="h-10"></div>
        </div>
    );
};

export default UsersContainer;
