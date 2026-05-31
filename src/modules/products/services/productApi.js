import { apiClient } from '@/shared/api';

/**
 * 📦 User Product Service
 * ศูนย์รวมการดึงข้อมูลสินค้า หมวดหมู่ และแบรนด์ สำหรับหน้าบ้าน (User Side)
 * ดึงข้อมูลสดจาก Database เพื่อใช้ทำ Sidebar Filter และ Product Grid
 */

/**
 * ดึงรายการสินค้าทั้งหมดพร้อมระบบกรองขั้นสูง
 */
export const getProductsApi = async (params) => {
    // 💡 Mock Data สำหรับทดสอบ UI
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                total: 2,
                page: 1,
                totalPages: 1,
                data: [
                    {
                        _id: '1',
                        brand: 'Corsair',
                        modelName: 'K70 RGB PRO',
                        price: 5900,
                        stock: 10,
                        category: 'Keyboard',
                        image: { url: 'https://via.placeholder.com/300' },
                        updatedAt: new Date().toISOString()
                    },
                    {
                        _id: '2',
                        brand: 'Razer',
                        modelName: 'DeathAdder V3',
                        price: 3500,
                        stock: 5,
                        category: 'Gaming Mouse',
                        image: { url: 'https://via.placeholder.com/300' },
                        updatedAt: new Date().toISOString()
                    }
                ]
            });
        }, 500);
    });

    /* เส้นจริง:
    const response = await apiClient.get('/products', { params });
    return response.data;
    */
};

/**
 * ดึงรายการหมวดหมู่ (Categories) ทั้งหมดที่มีในระบบ
 */
export const getCategoriesApi = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: ['Keyboard', 'CPU', 'Monitor', 'Notebook', 'Gaming Mouse', 'Graphics Card', 'RAM', 'Mainboard']
            });
        }, 300);
    });

    /* เส้นจริง:
    const response = await apiClient.get('/categories');
    return response.data;
    */
};

/**
 * ดึงรายการแบรนด์ (Brands) ทั้งหมดที่มีในระบบ
 */
export const getBrandsApi = async (category) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: ['Corsair', 'Razer', 'Logitech', 'Samsung', 'ASUS', 'MSI', 'Gigabyte', 'Intel', 'AMD']
            });
        }, 300);
    });

    /* เส้นจริง:
    const params = category ? { category } : {};
    const response = await apiClient.get('/brands', { params });
    return response.data;
    */
};

/**
 * ดึงข้อมูลสินค้าชิ้นเดียวตาม ID
 * @param {string} id - ID ของสินค้า
 */
export const getProductByIdApi = async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
};
