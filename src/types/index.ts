// Global Types and Interfaces
// ใช้ไฟล์นี้เป็นศูนย์กลางในการเก็บ Interface หลักของระบบ

export interface User {
  id: string | number;
  email: string;
  name?: string;
  role?: string;
}

// ตัวอย่าง ApiResponse สำหรับนำไปใช้ต่อใน axios
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
