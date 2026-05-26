import apiClient from '@/shared/api/apiClient';

/**
 * 📦 Product Detail API Service
 * จัดการการดึงข้อมูลสินค้าเฉพาะชิ้นจาก Backend
 */

export const getProductByIdApi = async (productId) => {
    // const response = await apiClient.get(`/products/${productId}`);
    // return response.data;
    
    // Mock data for guidance
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: {
                    id: productId,
                    name: `Product ${productId} (From API)`,
                    price: 25900,
                    category: 'notebook',
                    description: 'This is a detailed description fetched from the API.',
                    specifications: {
                        "Brand": "Jamine Tech",
                        "Model": "Pro X1",
                        "CPU": "Intel Core i7",
                        "RAM": "16GB DDR5"
                    },
                    images: [
                        "https://via.placeholder.com/600",
                        "https://via.placeholder.com/601"
                    ]
                }
            });
        }, 800);
    });
};
