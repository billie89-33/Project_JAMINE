import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '@/shared/hooks/useApi';
import { getOrderByIdApi, updateOrderStatus } from '@/modules/admin/services';
import { toast } from 'react-hot-toast';
import { ORDER_STATUS, ORDER_TRANSITIONS } from '@/shared/constants';

/**
 * 🎣 useOrderDetail Hook (Admin)
 * จัดการ Logic การดึงข้อมูลรายละเอียดออเดอร์และการจัดการขนส่ง
 */
export const useOrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    // 💾 State สำหรับเลขพัสดุ (Tracking Number)
    const [trackingNumber, setTrackingNumber] = useState('');

    // 🚀 ดึงข้อมูลรายละเอียดออเดอร์
    const { 
        loading: isLoading, 
        data: orderData, 
        execute: fetchOrderDetails 
    } = useApi(getOrderByIdApi, {
        onError: () => {
            toast.error('ไม่พบข้อมูลคำสั่งซื้อ หรือเกิดข้อผิดพลาด');
            navigate('/admin/order'); // กลับไปหน้าตารางถ้าหาไม่เจอ
        }
    });

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(orderId).then(res => {
                // ถ้าออเดอร์มีเลขพัสดุอยู่แล้ว ให้เซ็ตค่าใส่ช่อง Input เลย (Defensive Mapping)
                const tracking = res?.data?.trackingNumber || res?.trackingNumber;
                if (tracking) {
                    setTrackingNumber(tracking);
                }
            });
        }
    }, [orderId, fetchOrderDetails]);

    // 🛠️ อัปเดตสถานะ (รวมการใส่เลขพัสดุ)
    const { execute: updateStatusApi, loading: isUpdating } = useApi(updateOrderStatus, {
        showToast: true,
        successMessage: 'อัปเดตสถานะออเดอร์เรียบร้อยแล้ว',
        onSuccess: (updatedData) => {
            // โหลดข้อมูลใหม่เพื่ออัปเดต UI ให้ตรงกับ DB
            fetchOrderDetails(orderId);
            const newTracking = updatedData?.data?.trackingNumber || updatedData?.trackingNumber;
            if (newTracking) {
                setTrackingNumber(newTracking);
            }
        }
    });

    const handleUpdateStatus = async (newStatus) => {
        // ✅ กฎเหล็ก: ตรวจสอบความถูกต้องของการเปลี่ยนสถานะ (Strict Flow Control)
        const currentStatus = orderData?.data?.status || orderData?.status;
        const allowedNext = ORDER_TRANSITIONS[currentStatus] || [];
        
        if (newStatus !== currentStatus && !allowedNext.includes(newStatus)) {
            toast.error(`ไม่สามารถเปลี่ยนสถานะจาก ${currentStatus} เป็น ${newStatus} ได้`);
            return;
        }

        // ✅ Validation: ถ้าจะเปลี่ยนเป็น Shipped ต้องมีเลขพัสดุ
        if (newStatus === ORDER_STATUS.SHIPPED && !trackingNumber.trim()) {
            toast.error('กรุณาระบุเลขพัสดุก่อนทำการจัดส่งสินค้า');
            return; 
        }

        const payload = { status: newStatus };
        
        // แนบเลขพัสดุไปถ้ามีการระบุไว้ (ไม่ว่าสถานะใด แต่สำคัญที่สุดคือ Shipped)
        if (trackingNumber.trim()) {
            payload.trackingNumber = trackingNumber.trim();
        }

        await updateStatusApi(orderId, payload);
    };

    return {
        order: orderData?.data || orderData || null,
        isLoading,
        isUpdating,
        trackingNumber,
        setTrackingNumber,
        handleUpdateStatus
    };
};
