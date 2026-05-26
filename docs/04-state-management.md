# 🧠 04. State & Context Management

จัดการ State ให้มีประสิทธิภาพและป้องกันปัญหาประสิทธิภาพ (Performance)

## 📍 กลยุทธ์การวาง Context (Placement Rule)
- **Global Context**: วางที่ `src/shared/contexts/` (เฉพาะสิ่งที่ใช้ทุกหน้า เช่น Auth, Theme)
- **Module Context**: วางที่ `src/modules/[feature]/contexts/` (สิ่งที่ใช้เฉพาะในโมดูลนั้น เช่น CartContext)

## 🔄 ตัวอย่าง Flow มาตรฐาน: Authentication
การทำงานของ State และ API ควรเป็นเส้นทางเดียวกันและจัดการให้จบในโฟลเดอร์ตัวเอง:
1. **Modular Context**: `AuthContext.jsx` ต้องรวม Provider และ Hook (`useAuth`) ไว้ด้วยกัน
2. **Action**: ผู้ใช้กด Submit ฟอร์ม (UI Component)
3. **API Call**: Component เรียกใช้ Services (เช่น `authApi.login`) 
4. **Update State**: นำ Response ที่ได้อัปเดตข้อมูล User ลงใน Context
5. **UX Feedback**: แจ้งเตือนผลลัพธ์ผ่าน `react-hot-toast` เสมอ
6. **Navigate**: เปลี่ยนหน้าด้วย `useNavigate` หลังจาก State อัปเดตเสร็จสมบูรณ์

## 🛡️ ป้องกัน Context Hell
เมื่อมี Provider หลายตัวซ้อนกัน ให้ออกแบบ **AppProvider** ที่ `src/shared/providers/AppProvider.jsx`:
```jsx
export const AppProvider = ({ children }) => (
    <ThemeProvider>
        <AuthProvider>
            {children}
        </AuthProvider>
    </ThemeProvider>
);
```

## ✅ แนวทางปฏิบัติ
- ใช้ `useContext` ผ่าน Custom Hook เสมอ (เช่น `useAuth`)
- **Data Transformation Pattern**: ในโมดูลที่ต้องส่งข้อมูลให้ Shared UI (เช่น Summary Card) ให้ใช้ Hook (เช่น `useCart`, `useCheckout`) ทำหน้าที่เป็น Adapter แปลงข้อมูลจาก Local/API ให้ตรงตาม Interface ที่ UI ต้องการก่อนส่งต่อเสมอ
- ห้ามประกาศ State ซ้ำซ้อนที่สามารถคำนวณจาก State อื่นได้ (Derived State)
- ตรวจสอบ `loading` state ก่อนแสดงผลข้อมูลเสมอ
