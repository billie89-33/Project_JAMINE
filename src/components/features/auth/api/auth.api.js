// 🔐 Mock Auth API - จำลองการเชื่อมต่อกับเซิร์ฟเวอร์
// ในอนาคต: สามารถเปลี่ยนเป็น axios.post() ได้ง่ายๆ

// Mock ฐานข้อมูลผู้ใช้ (Hardcoded สำหรับทดสอบ)
const mockUsers = [
  {
    id: "admin_1",
    email: "admin@example.com",
    password: "admin123",
    username: "Admin User",
    role: "admin",
  },
  {
    id: "user_1",
    email: "user@example.com",
    password: "user123",
    username: "Regular User",
    role: "user",
  },
];

/**
 * 🔑 ล็อกอินจำลอง
 * @param {string} email - อีเมลผู้ใช้
 * @param {string} password - รหัสผ่าน
 * @returns {Promise} - { success, data: { id, username, email, role, token } }
 */
export const loginApi = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email && u.password === password);

      if (user) {
        resolve({
          success: true,
          data: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: `mock-jwt-token-${Date.now()}`,
          },
        });
      } else {
        reject({
          success: false,
          message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        });
      }
    }, 500); // จำลองความล่าช้าของเซิร์ฟเวอร์
  });
};

/**
 * 📝 สมัครสมาชิกจำลอง
 * @param {string} username - ชื่อผู้ใช้
 * @param {string} email - อีเมล
 * @param {string} password - รหัสผ่าน
 * @returns {Promise}
 */
export const registerApi = async (username, email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // ตรวจสอบว่าอีเมลใช้งานแล้วหรือไม่
      const existingUser = mockUsers.find((u) => u.email === email);

      if (existingUser) {
        reject({
          success: false,
          message: "อีเมลนี้ลงทะเบียนแล้ว",
        });
      } else {
        // สร้างผู้ใช้ใหม่ (สำหรับทดสอบเท่านั้น - ไม่บันทึกลง DB จริง)
        const newUser = {
          id: `user_${Date.now()}`,
          username,
          email,
          password,
          role: "user",
        };
        mockUsers.push(newUser);

        resolve({
          success: true,
          message: "สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ",
          data: newUser,
        });
      }
    }, 500);
  });
};

/**
 * 👤 ตรวจสอบข้อมูลผู้ใช้ปัจจุบัน (สำหรับ AuthContext)
 * @returns {Promise}
 */
export const getMeApi = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // ดึงจาก localStorage หรือ mock ผู้ใช้ default
      const savedUser = JSON.parse(localStorage.getItem("user"));
      
      if (savedUser) {
        resolve({ success: true, data: savedUser });
      } else {
        reject({ success: false, message: "ไม่พบข้อมูลผู้ใช้" });
      }
    }, 300);
  });
};

/**
 * 🚪 ล็อกเอาต์จำลอง
 * @returns {Promise}
 */
export const logoutApi = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "ล็อกเอาต์สำเร็จ" });
    }, 300);
  });
};
