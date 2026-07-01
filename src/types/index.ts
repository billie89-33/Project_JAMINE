// Global Types and Interfaces
// ใช้ไฟล์นี้เป็นศูนย์กลางในการเก็บ Interface หลักของระบบ

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  id?: string;
  username: string;
  email: string;
  name?: string;
  phone?: string | null;
  avatar?: {
    public_id: string | null;
    url: string | null;
  };
  role: string;
  status?: 'active' | 'banned';
  addresses?: Address[];
  createdAt?: string;
  updatedAt?: string;
}

// ตัวอย่าง ApiResponse สำหรับนำไปใช้ต่อใน axios
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 🛒 Product Interfaces
export interface ProductImage {
  url: string;
  publicId?: string;
}

export interface Product {
  _id: string;
  brand: string;
  modelName: string;
  description: string;
  price: number;
  image: ProductImage;
  images?: string[];
  sku: string;
  id?: string;
  name?: string;
  quantity?: number;
  category: string;
  tags?: string[];
  stock: number;
  status: string;
  isFeatured?: boolean;
  soldCount?: number;
  viewCount?: number;
  specifications?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

// 📦 Order Interfaces
export interface OrderItem {
  productId: string | Product; // Can be ID string or populated Product object
  brand: string;
  modelName: string;
  image: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  userId: string | User; // Can be ID string or populated User object
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: string; // e.g. 'PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'
  paymentDetails?: {
    method?: string;
    paidAt?: string;
    transactionId?: string;
  };
  expiresAt: string;
  trackingNumber?: string | null;
  shippedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
