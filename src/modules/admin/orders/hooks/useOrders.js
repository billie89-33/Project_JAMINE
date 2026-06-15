import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useApi } from '@/shared/hooks/useApi';
import { getAllOrders, updateOrderStatus, deleteOrder } from '@/modules/admin/services';
import { toast } from 'react-hot-toast';
import { ORDER_STATUS, ORDER_TRANSITIONS } from '@/shared/constants';

/**
 * 🎣 useOrders Hook (Refactored for Scalability)
 * จัดการ Logic ทั้งหมดของระบบจัดการออเดอร์สำหรับ Admin
 */
export const useOrders = () => {
    const location = useLocation();
    
    // 💾 1. States สำหรับ Filtering, Search & Pagination
    const [status, setStatus] = useState(location.state?.filterStatus || '');
    const [keyword, setKeyword] = useState(''); // ค้นหา Order ID หรือชื่อลูกค้า
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    // 🚀 2. ดึงข้อมูลออเดอร์ (ใช้ useApi มาตรฐาน)
    const { 
        loading: isLoading, 
        data: orderData, 
        execute: fetchOrders 
    } = useApi(getAllOrders, {
        transform: (res) => res
    });

    // 🔄 3. ฟังก์ชันดึงข้อมูลใหม่ (Stabilized with useCallback)
    const refreshOrders = useCallback(() => {
        fetchOrders({ 
            status: status || undefined, 
            userId: location.state?.userId || undefined, // รองรับ Deep Link จากหน้าลูกค้า
            keyword: keyword.trim() || undefined,
            page, 
            limit 
        });
    }, [fetchOrders, status, location.state?.userId, keyword, page, limit]);

    // ⏳ 4. ระบบ Debounce Search และ Auto-fetch เมื่อเปลี่ยน Filter/Page
    useEffect(() => {
        const timer = setTimeout(() => {
            refreshOrders();
        }, keyword ? 400 : 0); // หน่วงเวลาเฉพาะตอนพิมพ์ค้นหา
        return () => clearTimeout(timer);
    }, [refreshOrders, keyword]);

    // 🛠️ 5. ฟังก์ชันจัดการออเดอร์
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

    const handleUpdateStatus = useCallback(async (orderId, newStatus) => {
        // ค้นหาออเดอร์ปัจจุบันเพื่อเช็คสถานะ
        const currentOrder = orders.find(o => o._id === orderId);
        if (!currentOrder) return;

        // ✅ กฎเหล็ก: ตรวจสอบความถูกต้องของการเปลี่ยนสถานะ (Strict Flow Control)
        const allowedNext = ORDER_TRANSITIONS[currentOrder.status] || [];
        if (newStatus !== currentOrder.status && !allowedNext.includes(newStatus)) {
            toast.error(`ไม่สามารถเปลี่ยนสถานะจาก ${currentOrder.status} เป็น ${newStatus} ได้`);
            return;
        }

        const payload = { status: newStatus };

        if (newStatus === ORDER_STATUS.SHIPPED) {
            const tracking = window.prompt('🚚 กรุณาระบุเลขพัสดุ (Tracking Number):');
            if (tracking === null) return; 
            if (!tracking.trim()) {
                toast.error('⚠️ จำเป็นต้องระบุเลขพัสดุเพื่อเปลี่ยนสถานะเป็น Shipped');
                return;
            }
            payload.trackingNumber = tracking.trim();
        }

        await updateStatusApi(orderId, payload);
    }, [updateStatusApi, orders]);

    const handleDeleteOrder = useCallback(async (orderId) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบออเดอร์นี้?')) {
            await deleteOrderApi(orderId);
        }
    }, [deleteOrderApi]);

    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleStatusFilterChange = useCallback((newStatus) => {
        setStatus(newStatus);
        setPage(1);
    }, []);

    const handleSearchChange = useCallback((value) => {
        setKeyword(value);
        setPage(1);
    }, []);

    // 📦 6. Prepare Final Data (Ultra-Defensive Mapping as per doc/20)
    const orders = useMemo(() => {
        // ดึงจาก orderData.data หรือถ้า orderData เป็น Array ก็เอามาเลย ถ้าไม่ใช่ให้เป็น []
        return orderData?.data || (Array.isArray(orderData) ? orderData : []);
    }, [orderData]);

    const totalPages = useMemo(() => orderData?.totalPages || 1, [orderData]);
    const totalItems = useMemo(() => orderData?.total || orders.length || 0, [orderData, orders]);

    return {
        // Data States
        orders,
        totalItems,
        totalPages,
        page,
        status,
        keyword,
        
        // Loading States
        isLoading,
        isUpdating,
        
        // Handlers
        handleUpdateStatus,
        handleDeleteOrder,
        handlePageChange,
        handleStatusFilterChange,
        handleSearchChange,
        refreshOrders
    };
};
