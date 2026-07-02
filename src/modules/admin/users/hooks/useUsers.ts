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

/**
 * 🎣 useUsers Hook
 * จัดการ Logic ทั้งหมดของระบบจัดการลูกค้า (Admin) - v2.0
 */
export const useUsers = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
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
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [summary, setSummary] = useState<any>(null);
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
            const res: any = await getUsersApi({ 
                page, 
                limit: 10, 
                keyword: keyword.trim(), 
                status 
            });
            if (res.success) {
                setUsers(res.data.customers || res.data.users || []);
                setPagination({
                    currentPage: res.data.page || 1,
                    totalPages: res.data.totalPages || 1,
                    totalItems: res.data.total || 0
                });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to fetch users');
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
            const res: any = await getUserSummaryApi(id);
            if (res.success) {
                const profile = res.data.profile || res.data.user;
                setSelectedUser(profile);
                setSummary(res.data.orderSummary || res.data.stats);
                setEditForm({
                    name: profile.name || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    status: profile.status || 'active'
                });
                setIsModalOpen(true);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to fetch user details');
        } finally {
            setIsActionLoading(false);
        }
    }, []);

    // 3. Update User (Full Edit)
    const handleUpdateUser = async (e: any) => {
        if (e) e.preventDefault();
        setIsActionLoading(true);
        try {
            const updatePayload: any = { ...editForm };
            const res = await updateUserByAdminApi((selectedUser as any)?._id, updatePayload);
            if (res.success) {
                toast.success('User updated successfully');
                setIsEditMode(false);
                fetchUsers(); // Refresh list
                setSelectedUser((prev: any) => ({ ...prev, ...res.data }));
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Update failed');
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
            const res = await updateUserByAdminApi(id, { status: newStatus });
            if (res.success) {
                toast.success(`User status updated to ${newStatus}`);
                fetchUsers();
                if (selectedUser?._id === id) {
                    setSelectedUser((prev: any) => ({ ...prev, status: newStatus }));
                    setEditForm((prev: any) => ({ ...prev, status: newStatus }));
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Status update failed');
        } finally {
            setIsActionLoading(false);
        }
    }, [fetchUsers, selectedUser]);

    const exportToCSV = async () => {
        setIsActionLoading(true);
        try {
            const res: any = await exportCustomersApi({ 
                keyword: keyword.trim(), 
                status 
            });
            if (res.success) {
                const data = res.data;
                const headers = ['Name', 'Username', 'Email', 'Phone', 'Status', 'Joined Date'];
                const csvRows = data.map((u: any) => [
                    u.name || 'N/A',
                    u.username,
                    u.email,
                    u.phone || 'N/A',
                    u.status,
                    new Date(u.createdAt).toLocaleDateString()
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
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Delete failed');
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
