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
  status: 'active' | 'banned';
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
