import { useState, useEffect, useCallback } from 'react';
import { getProductByIdApi } from '../services/productDetailApi';

/**
 * 🎣 useProductDetail Hook
 * คุม Business Logic สำหรับหน้าจัดการรายละเอียดสินค้า
 */
export const useProductDetail = (productId) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getProductByIdApi(productId);
            if (res.success) {
                setProduct(res.data);
            } else {
                setError("ไม่พบข้อมูลสินค้า");
            }
        } catch (err) {
            setError(err.message || "เกิดข้อผิดพลาดในการดึงข้อมูล");
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        if (productId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchProduct();
        }
    }, [productId, fetchProduct]);

    return { product, loading, error, refetch: fetchProduct };
};
