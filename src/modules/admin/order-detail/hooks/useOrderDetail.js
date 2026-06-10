import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '@/shared/hooks/useApi';
import { getOrderByIdApi, updateOrderStatus } from '@/modules/admin/services';
import { toast } from 'react-hot-toast';
import { ORDER_STATUS } from '@/shared/constants';

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
                // ถ้าออเดอร์มีเลขพัสดุอยู่แล้ว ให้เซ็ตค่าใส่ช่อง Input เลย
                if (res?.data?.trackingNumber) {
                    setTrackingNumber(res.data.trackingNumber);
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
            if(updatedData?.data?.trackingNumber) {
                setTrackingNumber(updatedData.data.trackingNumber);
            }
        }
    });

    const handleUpdateStatus = async (newStatus) => {
        // Validation: ถ้ากดเปลี่ยนเป็น Shipped แต่ยังไม่ใส่เลขพัสดุ
        if (newStatus === ORDER_STATUS.SHIPPED && !trackingNumber.trim()) {
            toast.error('กรุณาระบุเลขพัสดุก่อนทำการจัดส่งสินค้า');
            return; // หยุดการส่ง API (ป้องกันการ Error 400 จาก Backend)
        }

        const payload = { status: newStatus };
        if (newStatus === ORDER_STATUS.SHIPPED) {
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
