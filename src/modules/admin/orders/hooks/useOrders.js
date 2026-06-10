import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApi } from '@/shared/hooks/useApi';
import { getAllOrders, updateOrderStatus, deleteOrder } from '@/modules/admin/services';
import { toast } from 'react-hot-toast';

/**
 * 🎣 useOrders Hook
 * จัดการ Logic ทั้งหมดของระบบจัดการออเดอร์สำหรับ Admin
 */
export const useOrders = () => {
    const location = useLocation();
    
    // 💾 1. States สำหรับ Filtering & Pagination
    const [status, setStatus] = useState(location.state?.filterStatus || '');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    // 🚀 2. ดึงข้อมูลออเดอร์
    const { 
        loading: isLoading, 
        data: orderData, 
        execute: fetchOrders 
    } = useApi(getAllOrders);

    // 🔄 3. ฟังก์ชันดึงข้อมูลใหม่
    const refreshOrders = useCallback(() => {
        fetchOrders({ status, page, limit });
    }, [fetchOrders, status, page, limit]);

    // ดึงข้อมูลเมื่อมีการเปลี่ยน Filter หรือ Page
    useEffect(() => {
        refreshOrders();
    }, [refreshOrders]);

    // 🛠️ 4. ฟังก์ชันจัดการออเดอร์
    const { execute: updateStatusApi, loading: isUpdating } = useApi(updateOrderStatus, {
        showToast: true,
        successMessage: 'อัปเดตสถานะออเดอร์เรียบร้อยแล้ว',
        onSuccess: () => refreshOrders()
    });

    const { execute: deleteOrderApi } = useApi(deleteOrder, {
        showToast: true,
        successMessage: 'ลบออเดอร์เรียบร้อยแล้ว',
        onSuccess: () => refreshOrders()
    });

    const handleUpdateStatus = async (orderId, newStatus) => {
        await updateStatusApi(orderId, newStatus);
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบออเดอร์นี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
            await deleteOrderApi(orderId);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleStatusFilterChange = (newStatus) => {
        setStatus(newStatus);
        setPage(1); // กลับไปหน้าแรกเมื่อเปลี่ยน Filter
    };

    return {
        // Data States
        orders: orderData?.data || (Array.isArray(orderData) ? orderData : []),
        total: orderData?.total || 0,
        totalPages: orderData?.totalPages || 1,
        page,
        status,
        
        // Loading States
        isLoading,
        isUpdating,
        
        // Handlers
        handleUpdateStatus,
        handleDeleteOrder,
        handlePageChange,
        handleStatusFilterChange,
        refreshOrders
    };
};
