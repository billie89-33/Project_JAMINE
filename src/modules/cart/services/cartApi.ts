import { apiClient } from '@/shared/api';
import { ApiResponse, Product } from '@/types';

export interface CartResponseData {
  items: Array<{
    _id: string;
    quantity: number;
    productId?: string | Product;
    product?: string | Product;
  }>;
  subtotal: number;
  shippingFee?: number;
  shipping?: number;
  discount?: number;
  total?: number;
  totalAmount?: number;
}

export interface CartApiResponse extends ApiResponse<CartResponseData> {
  isStockAdjusted?: boolean;
}

/**
 * 🛒 Cart API Service
 * จัดการข้อมูลตะกร้าสินค้าผ่าน Backend API
 * (หมายเหตุ: เส้นทางเหล่านี้ต้องการการ Login ก่อนใช้งาน)
 */

/**
 * ดึงข้อมูลสินค้าในตะกร้าทั้งหมด
 */
export const getCartApi = async (): Promise<CartApiResponse> => {
    const response = await apiClient.get('/cart');
    return response.data;
};

/**
 * เพิ่มสินค้าลงในตะกร้า
 * @param {string} productId - ไอดีสินค้า
 * @param {number} quantity - จำนวน
 */
export const addToCartApi = async (productId: string, quantity: number = 1): Promise<CartApiResponse> => {
    const response = await apiClient.post('/cart', { productId, quantity });
    return response.data;
};

/**
 * อัปเดตจำนวนสินค้าในตะกร้า (ส่งค่าจำนวนเต็มที่ต้องการ)
 * @param {string} productId - ไอดีสินค้า
 * @param {number} quantity - จำนวนใหม่
 */
export const updateCartQuantityApi = async (productId: string, quantity: number): Promise<CartApiResponse> => {
    const response = await apiClient.patch('/cart/update-quantity', { productId, quantity });
    return response.data;
};

/**
 * ลบสินค้าออกจากตะกร้า
 * @param {string} productId - ไอดีสินค้า
 */
export const removeFromCartApi = async (productId: string): Promise<CartApiResponse> => {
    const response = await apiClient.delete(`/cart/${productId}`);
    return response.data;
};

/**
 * ล้างสินค้าทั้งหมดออกจากตะกร้า (ใช้หลังการชำระเงินสำเร็จ)
 */
export const clearCartApi = async (): Promise<CartApiResponse> => {
    const response = await apiClient.delete('/cart/clear');
    return response.data;
};

/**
 * ดึงข้อมูลสรุปยอดรวมตะกร้า
 */
export const getCartSummaryApi = async (): Promise<CartApiResponse> => {
    const response = await apiClient.get('/cart/summary');
    return response.data;
};
