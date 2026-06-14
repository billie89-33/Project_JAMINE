import { useState, useEffect, useCallback } from 'react';
import { getUsersApi, getUserSummaryApi, updateUserStatusApi, deleteUserApi } from '@/modules/admin/services';
import toast from 'react-hot-toast';

/**
 * 🎣 useUsers Hook
 * จัดการ Logic ทั้งหมดของระบบจัดการลูกค้า (Admin)
 * ป้องกัน Infinite Loop ด้วย useCallback และใช้ Absolute Imports
 */
export const useUsers = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
    });

    // Filters
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [status, setStatus] = useState('all');

    // Detail Modal
    const [selectedUser, setSelectedUser] = useState(null);
    const [summary, setSummary] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Fetch Users List - ใช้ useCallback เพื่อความเสถียรของฟังก์ชัน
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
                setUsers(res.data.customers || []);
                setPagination(res.data.pagination);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    }, [page, keyword, status]);

    // ระบบ Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchUsers]);

    // 2. Fetch User Summary (Profile + Stats)
    const viewDetail = useCallback(async (id) => {
        setIsActionLoading(true);
        try {
            const res = await getUserSummaryApi(id);
            if (res.success) {
                setSelectedUser(res.data.profile);
                setSummary(res.data.orderSummary);
                setIsModalOpen(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch user details');
        } finally {
            setIsActionLoading(false);
        }
    }, []);

    // 3. Update User Status - ปรับแก้การเช็ค id เป็น _id ตาม MongoDB Standard
    const toggleStatus = useCallback(async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'banned' : 'active';
        const confirmMsg = newStatus === 'banned' 
            ? 'Are you sure you want to BAN this user?' 
            : 'Are you sure you want to ACTIVATE this user?';
        
        if (!window.confirm(confirmMsg)) return;

        setIsActionLoading(true);
        try {
            const res = await updateUserStatusApi(id, newStatus);
            if (res.success) {
                toast.success(`User status updated to ${newStatus}`);
                fetchUsers(); // Refresh list
                
                // อัปเดต State ภายใน Modal ถ้าเปิดอยู่
                setSelectedUser(prev => {
                    if (prev && prev._id === id) {
                        return { ...prev, status: newStatus };
                    }
                    return prev;
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setIsActionLoading(false);
        }
    }, [fetchUsers]);

    // 4. Delete User
    const deleteUser = useCallback(async (id) => {
        if (!window.confirm('CRITICAL: Are you sure you want to DELETE this user permanently? This action cannot be undone.')) return;

        setIsActionLoading(true);
        try {
            const res = await deleteUserApi(id);
            if (res.success) {
                toast.success('User deleted successfully');
                fetchUsers();
                setIsModalOpen(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
        } finally {
            setIsActionLoading(false);
        }
    }, [fetchUsers]);

    return {
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
        // Modal & Detail
        selectedUser,
        summary,
        isModalOpen,
        setIsModalOpen,
        viewDetail,
        toggleStatus,
        deleteUser
    };
};
