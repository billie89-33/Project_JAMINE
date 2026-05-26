import apiClient from '@/shared/api/apiClient';

/**
 * 📦 Checkout API Service
 * จัดการการติดต่อสื่อสารกับ Backend สำหรับระบบการสั่งซื้อ
 */

// --- REAL API ENDPOINTS (เตรียมไว้สำหรับอนาคต) ---
/*
export const getCheckoutSummaryApi = async () => {
    const response = await apiClient.get('/checkout/summary');
    return response.data;
};

export const createOrderApi = async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
};
*/

// --- MOCK API (ใช้สำหรับการพัฒนาหน้าตา UI) ---
export const getCheckoutSummaryApi = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                data: {
                    items: JSON.parse(localStorage.getItem('cart')) || [],
                    addresses: [
                        { id: 'addr1', name: 'Home', details: '123/45 Sukhumvit Rd, Bangkok 10110' },
                        { id: 'addr2', name: 'Office', details: 'Yada Building, 52 Silom Road, Bangkok 10500' }
                    ],
                    priceDetails: {
                        shipping: 0,
                        discount: 0
                    }
                }
            });
        }, 800);
    });
};

export const createOrderApi = async (orderData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("API Received Order Payload:", orderData);
            resolve({ success: true, message: "Order created successfully" });
        }, 1500);
    });
};

export const addAddressApi = async (newAddress) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ 
                success: true, 
                data: { ...newAddress, id: `addr_${Date.now()}` } 
            });
        }, 600);
    });
};

export const deleteAddressApi = async (addressId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: "Address deleted successfully" });
        }, 500);
    });
};
