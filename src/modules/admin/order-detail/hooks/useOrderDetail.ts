import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '@/shared/hooks/useApi';
import { getOrderByIdApi, updateOrderStatus } from '@/modules/admin/services';
import { toast } from 'react-hot-toast';
import { ORDER_STATUS, ORDER_TRANSITIONS } from '@/shared/constants';
import { Order } from '@/types';

/**
 * 🎣 useOrderDetail Hook (Admin)
 * จัดการ Logic การดึงข้อมูลรายละเอียดออเดอร์และการจัดการขนส่ง
 */
export const useOrderDetail = () => {
    const { orderId } = useParams();
    const id = orderId ?? '';
    const navigate = useNavigate();

    // 💾 State สำหรับเลขพัสดุ (Tracking Number)
    const [trackingNumber, setTrackingNumber] = useState('');

    // 🚀 ดึงข้อมูลรายละเอียดออเดอร์
    const { 
        loading: isLoading, 
        data, 
        execute: fetchOrderDetails 
    } = useApi<Order>(getOrderByIdApi, {
        onError: () => {
            toast.error('ไม่พบข้อมูลคำสั่งซื้อ หรือเกิดข้อผิดพลาด');
            navigate('/admin/order'); // กลับไปหน้าตารางถ้าหาไม่เจอ
        }
    });

    const orderData = useMemo(() => {
        if (!data) return null;
        const o = data as Order;
        return {
            ...o,
            items: o.items?.map(item => {
                const productObj = typeof item.productId === 'object' ? item.productId : (item as any).product;
                return {
                    ...item,
                    brand: item.brand || productObj?.brand || 'Unknown',
                    modelName: item.modelName || productObj?.modelName || productObj?.name || 'Unknown Product',
                    image: item.image || productObj?.image?.url || productObj?.image || '',
                    priceAtPurchase: item.priceAtPurchase || item.price || productObj?.price || 0
                };
            }) || []
        };
    }, [data]);

    useEffect(() => {
        if (id) {
            new Promise<Order>((resolve, reject) => {
                getOrderByIdApi(id).then((res) => {
                    resolve(res.data as Order);
                }).catch(reject);
            }).then((order) => {
                const tracking = order?.trackingNumber;
                if (tracking) {
                    setTrackingNumber(tracking);
                }
            });
        }
    }, [id, fetchOrderDetails]);

    // 🛠️ อัปเดตสถานะ (รวมการใส่เลขพัสดุ)
    const { execute: updateStatusApi, loading: isUpdating } = useApi(updateOrderStatus, {
        showToast: true,
        successMessage: 'อัปเดตสถานะออเดอร์เรียบร้อยแล้ว',
        onSuccess: (updatedData: { data?: Order }) => {
            // โหลดข้อมูลใหม่เพื่ออัปเดต UI ให้ตรงกับ DB
            fetchOrderDetails(id);
            const newTracking = updatedData?.data?.trackingNumber;
            if (newTracking) {
                setTrackingNumber(newTracking);
            }
        }
    });

    const handleUpdateStatus = async (newStatus: string) => {
        // ✅ กฎเหล็ก: ตรวจสอบความถูกต้องของการเปลี่ยนสถานะ (Strict Flow Control)
        const currentStatus = orderData?.status || '';
        const allowedNext = ORDER_TRANSITIONS[currentStatus as keyof typeof ORDER_TRANSITIONS] || [];
        
        if (newStatus !== currentStatus && !allowedNext.includes(newStatus as never)) {
            toast.error(`ไม่สามารถเปลี่ยนสถานะจาก ${currentStatus} เป็น ${newStatus} ได้`);
            return;
        }

        // ✅ Validation: ถ้าจะเปลี่ยนเป็น Shipped ต้องมีเลขพัสดุ
        if (newStatus === ORDER_STATUS.SHIPPED && !trackingNumber.trim()) {
            toast.error('กรุณาระบุเลขพัสดุก่อนทำการจัดส่งสินค้า');
            return; 
        }

        const payload: { status: string; trackingNumber?: string } = { status: newStatus };
        
        // แนบเลขพัสดุไปถ้ามีการระบุไว้ (ไม่ว่าสถานะใด แต่สำคัญที่สุดคือ Shipped)
        if (trackingNumber.trim()) {
            payload.trackingNumber = trackingNumber.trim();
        }

        await updateStatusApi(id, payload);
    };

    return {
        order: orderData || null,
        isLoading,
        isUpdating,
        trackingNumber,
        setTrackingNumber,
        handleUpdateStatus
    };
};
