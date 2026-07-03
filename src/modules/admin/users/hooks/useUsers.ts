import { useState, useEffect, useCallback } from 'react';
import { 
    getUsersApi, 
    getUserSummaryApi, 
    updateUserByAdminApi, 
    deleteUserApi,
    exportCustomersApi 
} from '@/modules/admin/services';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';
import React from 'react';

export type UserStats = Record<string, number | string>;

/**
 * 🎣 useUsers Hook
 * จัดการ Logic ทั้งหมดของระบบจัดการลูกค้า (Admin) - v2.0
 */
export const useUsers = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });

    // Filters
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [status, setStatus] = useState('all');

    // Detail Modal & Edit State
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [summary, setSummary] = useState<UserStats | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'addresses' | 'orders'
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'active'
    });

    // 1. Fetch Users List
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getUsersApi({ 
                page, 
                limit: 10, 
                keyword: keyword.trim(), 
                status 
            });
            if (res.success) {
                // Defensive mapping in case backend returns 'customers' instead of 'users'
                const responseData = res.data as unknown as Record<string, unknown>;
                const userList = (responseData.customers as User[]) || (responseData.users as User[]) || [];
                setUsers(userList);
                
                setPagination({
                    currentPage: Number(responseData.page) || 1,
                    totalPages: Number(responseData.totalPages) || 1,
                    totalItems: Number(responseData.total) || 0
                });
            }
        } catch (error: unknown) {
            const errObj = error as { response?: { data?: { message?: string } } };
            toast.error(errObj.response?.data?.message || 'Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    }, [page, keyword, status]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchUsers]);

    // 2. View Detail & Summary
    const viewDetail = useCallback(async (id: string) => {
        setIsActionLoading(true);
        setActiveTab('summary');
        setIsEditMode(false);
        try {
            const res = await getUserSummaryApi(id);
            if (res.success) {
                const responseData = res.data as unknown as Record<string, unknown>;
                const profile = (responseData.profile as User) || (responseData.user as User);
                setSelectedUser(profile);
                
                const stats = (responseData.orderSummary as UserStats) || (responseData.stats as UserStats);
                setSummary(stats);
                
                setEditForm({
                    name: profile?.name || '',
                    email: profile?.email || '',
                    phone: profile?.phone || '',
                    status: profile?.status || 'active'
                });
                setIsModalOpen(true);
            }
        } catch (error: unknown) {
            const errObj = error as { response?: { data?: { message?: string } } };
            toast.error(errObj.response?.data?.message || 'Failed to fetch user details');
        } finally {
            setIsActionLoading(false);
        }
    }, []);

    // 3. Update User (Full Edit)
    const handleUpdateUser = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!selectedUser?._id) return;
        
        setIsActionLoading(true);
        try {
            const updatePayload = { ...editForm };
            const res = await updateUserByAdminApi(selectedUser._id, updatePayload);
            if (res.success) {
                toast.success('User updated successfully');
                setIsEditMode(false);
                fetchUsers(); // Refresh list
                setSelectedUser((prev) => prev ? { ...prev, ...res.data } : null);
            }
        } catch (error: unknown) {
            const errObj = error as { response?: { data?: { message?: string } } };
            toast.error(errObj.response?.data?.message || 'Update failed');
        } finally {
            setIsActionLoading(false);
        }
    };

    // 4. Toggle Status (Surgical Update)
    const toggleStatus = useCallback(async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'banned' : 'active';
        if (!window.confirm(`Are you sure you want to ${newStatus.toUpperCase()} this user?`)) return;

        setIsActionLoading(true);
        try {
            const res = await updateUserByAdminApi(id, { status: newStatus as User['status'] });
            if (res.success) {
                toast.success(`User status updated to ${newStatus}`);
                fetchUsers();
                if (selectedUser?._id === id) {
                    setSelectedUser((prev) => prev ? { ...prev, status: newStatus as User['status'] } : null);
                    setEditForm((prev) => ({ ...prev, status: newStatus }));
                }
            }
        } catch (error: unknown) {
            const errObj = error as { response?: { data?: { message?: string } } };
            toast.error(errObj.response?.data?.message || 'Status update failed');
        } finally {
            setIsActionLoading(false);
        }
    }, [fetchUsers, selectedUser]);

    const exportToCSV = async () => {
        setIsActionLoading(true);
        try {
            const res = await exportCustomersApi({ 
                keyword: keyword.trim(), 
                status 
            });
            if (res.success) {
                const data = res.data;
                const headers = ['Name', 'Username', 'Email', 'Phone', 'Status', 'Joined Date'];
                const csvRows = data.map((u: User) => [
                    u.name || 'N/A',
                    u.username,
                    u.email,
                    u.phone || 'N/A',
                    u.status,
                    u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'
                ].join(','));
                
                const csvContent = [headers.join(','), ...csvRows].join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success('Export started!');
            }
        } catch (error) {
            console.error("Export failed:", error);
            toast.error('Export failed');
        } finally {
            setIsActionLoading(false);
        }
    };

    // 6. Delete User
    const deleteUser = useCallback(async (id: string) => {
        if (!window.confirm('CRITICAL: Delete this user permanently? This cannot be undone.')) return;

        setIsActionLoading(true);
        try {
            const res = await deleteUserApi(id);
            if (res.success) {
                toast.success('User deleted successfully');
                fetchUsers();
                setIsModalOpen(false);
            }
        } catch (error: unknown) {
            const errObj = error as { response?: { data?: { message?: string } } };
            toast.error(errObj.response?.data?.message || 'Delete failed');
        } finally {
            setIsActionLoading(false);
        }
    }, [fetchUsers]);

    // 7. Deep Link to Orders
    const viewCustomerOrders = (userId: string) => {
        setIsModalOpen(false);
        navigate('/admin/order', { state: { userId } });
    };

    return {
        isLoading,
        isActionLoading,
        users,
        pagination,
        page, setPage,
        keyword, setKeyword,
        status, setStatus,
        // Modal & Edit
        selectedUser,
        summary,
        isModalOpen, setIsModalOpen,
        isEditMode, setIsEditMode,
        editForm, setEditForm,
        activeTab, setActiveTab,
        // Actions
        viewDetail,
        handleUpdateUser,
        toggleStatus,
        deleteUser,
        exportToCSV,
        viewCustomerOrders
    };
};
