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
            // จำลองการดึงตะกร้ามาคำนวณยอดเงินที่หลังบ้าน
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            const shipping = 50; // ตัวอย่างยอดค่าส่งจากหลังบ้าน
            const discount = 0;  // ตัวอย่างส่วนลด

            resolve({
                success: true,
                data: {
                    items: cart,
                    addresses: [
                        { id: 'addr1', name: 'Home', details: '123/45 Sukhumvit Rd, Bangkok 10110' },
                        { id: 'addr2', name: 'Office', details: 'Yada Building, 52 Silom Road, Bangkok 10500' }
                    ],
                    priceDetails: {
                        subtotal,
                        shipping,
                        discount,
                        total: subtotal + shipping - discount
                    }
                }
            });
        }, 800);
    });
};

export const createOrderApi = async (orderData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // 🚨 จำลองหลังบ้าน: รับแค่ addressId และ paymentMethod
            // ยอดเงินต้องดึงจาก cart ของ user ในระบบหลังบ้านเอง
            console.log("API RECEIVED SECURE PAYLOAD:", orderData);

            resolve({ 
                success: true, 
                message: "Order created successfully",
                data: {
                    id: `ORD-${Date.now()}`,
                    totalAmount: 1500, // ตัวอย่างยอดเงินที่สรุปจากหลังบ้าน
                }
            });
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
