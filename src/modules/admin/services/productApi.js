import { apiClient } from '@/shared/api';

/**
 * 🛠️ Admin Product Mother Service
 * ศูนย์รวมคำสั่งจัดการข้อมูลสินค้าทั้งหมดจากฝั่ง Admin
 * รองรับการ สร้าง, อ่าน, แก้ไข, และลบ (CRUD)
 */

/**
 * ดึงรายการสินค้าทั้งหมดพร้อมรองรับการกรอง (Filtering & Pagination)
 * @param {Object} params - Query parameters เช่น category, page, limit
 */
export const getAdminProducts = async (params) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
};

/**
 * ดึงรายละเอียดสินค้าทีละชิ้นตาม ID (สำหรับหน้าแก้ไข)
 * @param {string} id - ID ของสินค้า
 */
export const getProductById = async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
};

/**
 * สร้างสินค้าใหม่ (รองรับ FormData สำหรับไฟล์รูปภาพ)
 * @param {FormData} formData - ข้อมูลสินค้าพร้อมไฟล์ภาพ
 */
export const createProductApi = async (formData) => {
    const response = await apiClient.post('/admin/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

/**
 * สร้างสินค้าใหม่ (แบบ JSON ปกติ - เก็บไว้เป็นทางเลือก)
 * @param {Object} productData - ข้อมูลสินค้าตาม Product Model
 */
export const createProduct = async (productData) => {
    const response = await apiClient.post('/products', productData);
    return response.data;
};

/**
 * แก้ไขข้อมูลสินค้าเดิม
 * @param {string} id - ID ของสินค้าที่ต้องการแก้ไข
 * @param {Object} productData - ข้อมูลที่ต้องการอัปเดต
 */
export const updateProduct = async (id, productData) => {
    const response = await apiClient.patch(`/products/${id}`, productData);
    return response.data;
};

/**
 * ลบสินค้าออกจากระบบ
 * @param {string} id - ID ของสินค้าที่ต้องการลบ
 */
export const deleteProduct = async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
};
