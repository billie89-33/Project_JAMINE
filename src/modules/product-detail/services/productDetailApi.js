import { apiClient } from '@/shared/api';

/**
 * 📦 Product Detail API Service
 * จัดการการดึงข้อมูลสินค้าเฉพาะชิ้นจาก Backend
 */

export const getProductByIdApi = async (productId) => {
    // 💡 Mock Data สำหรับทดสอบ UI (v2 Standard)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: {
                    _id: productId,
                    brand: 'Corsair',
                    modelName: 'K70 RGB PRO',
                    price: 5900,
                    stock: 15,
                    category: 'Keyboard',
                    description: 'คีย์บอร์ดกลไกคุณภาพสูงพร้อมระบบไฟ RGB สวยงาม สัมผัสการพิมพ์ที่ยอดเยี่ยมและทนทาน รองรับการใช้งานหนักและการเล่นเกมระดับโปร',
                    specifications: {
                        "Brand": "Corsair",
                        "Switch": "Cherry MX Blue",
                        "Connectivity": "USB-C to USB-A",
                        "Backlight": "RGB"
                    },
                    image: { url: 'https://via.placeholder.com/600' },
                    images: [
                        'https://via.placeholder.com/600',
                        'https://via.placeholder.com/601',
                        'https://via.placeholder.com/602'
                    ]
                }
            });
        }, 500);
    });

    /* เส้นจริง:
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
    */
};
