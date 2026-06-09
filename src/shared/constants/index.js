/**
 * 🎯 Global Project Constants
 * ไฟล์รวมค่ามาตรฐานที่ต้องตรงกับ Backend 100%
 */

// 1. สิทธิ์ของผู้ใช้งาน (User Roles)
export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin'
};

// 2. สถานะของสินค้า (Product Status)
export const PRODUCT_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DRAFT: 'draft'
};

// 3. หมวดหมู่สินค้า (Standard Categories)
export const CATEGORIES = [
    'Notebook', 
    'Keyboard', 
    'Computer', 
    'Monitor', 
    'Gaming Mouse', 
    'Graphics Card', 
    'RAM', 
    'CPU', 
    'Mainboard'
];

// 4. สถานะออเดอร์ (Order Status)
export const ORDER_STATUS = {
    PENDING: 'Awaiting Payment',
    PAID: 'Paid',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
};
