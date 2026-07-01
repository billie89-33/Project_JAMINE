// Global Types and Interfaces
// ใช้ไฟล์นี้เป็นศูนย์กลางในการเก็บ Interface หลักของระบบ

export interface User {
  _id: string;
  id?: string;
  username: string;
  email: string;
  name?: string;
  role: string;
  addresses?: Record<string, unknown>[];
  [key: string]: unknown; // Allow other dynamic fields for now
}

// ตัวอย่าง ApiResponse สำหรับนำไปใช้ต่อใน axios
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
