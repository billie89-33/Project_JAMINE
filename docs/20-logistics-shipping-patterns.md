# 🚚 20. Logistics & Shipping Patterns (Enterprise Workflow)

เอกสารนี้รวบรวม **Best Practices** สำหรับการพัฒนาระบบหลังบ้าน (Admin) ที่เกี่ยวข้องกับการขนส่ง, การแพ็คสินค้า, และการจัดการเลขพัสดุ ซึ่งได้มาจากการพัฒนาระบบ Shipping ในโปรเจกต์ Jamine

---

## 🛡️ 1. Ultra-Defensive Data Mapping (การแกะข้อมูลแบบปลอดภัย 100%)
**ปัญหาที่พบ:** Backend อาจมีการตอบกลับข้อมูลในโครงสร้างที่หลากหลาย เช่น `.data.data`, `.data`, หรือส่งมาเป็น Array โดยตรง ทำให้ Hook (เช่น `useApi`) ที่พยายามเข้าถึง property ตรงๆ แครช หรือรีเทิร์นค่าว่าง `[]` ออกมา
**วิธีการแก้ไข (Pattern):**
เขียน Mapping ให้ครอบคลุมทุก Layer ของ Response พร้อม Fallback เสมอ ห้ามดึงค่าแบบชั้นเดียว (e.g. `data: res.data.data`)

```javascript
// ✅ Best Practice: Ultra-Defensive Array Mapping
const orders = apiResponse?.data?.data || (Array.isArray(apiResponse?.data) ? apiResponse.data : []);

// ✅ Best Practice: Ultra-Defensive Object Mapping
const stats = apiResponse?.data?.stats || apiResponse?.data?.data || apiResponse?.data || {};
```

---

## 🚦 2. Strict Logistics Flow Control
**กฎเหล็ก:** การเปลี่ยนสถานะออเดอร์ในระบบจัดส่ง **ไม่ใช่แค่การเปลี่ยน String** แต่มีผลผูกพันทางธุรกิจ
*   **Awaiting Payment (รอดำเนินการ):** ห้ามนำมาแสดงในหน้า Shipping เด็ดขาด เพื่อป้องกันการแพ็คและส่งสินค้าฟรี
*   **Shipped (จัดส่งแล้ว):** การเปลี่ยนสถานะเป็น Shipped **"ต้อง" (Required)** ระบุเลขพัสดุ (Tracking Number) เสมอ Frontend ต้องบล็อคไม่ให้กดส่งหากข้อมูลไม่ครบ และ Backend ต้องครอบ `try/catch` เพื่อรีเจค Request นั้น
*   **Directional Flow:** ออเดอร์ที่ถูก Cancelled ไปแล้ว ห้ามเปลี่ยนกลับมาเป็นสถานะ Shipping อีก

```javascript
// ✅ Frontend Guard: การเปลี่ยนสถานะเป็น Shipped
if (newStatus === ORDER_STATUS.SHIPPED) {
    if (!trackingNumber.trim()) {
        toast.error('⚠️ จำเป็นต้องระบุเลขพัสดุ');
        return;
    }
}
```

---

## 🧼 3. Clean Mode UI for Logistics
**แนวคิด:** หน้าจอสำหรับทีมแพ็คของ/จัดส่ง (Shipping Table) ต้องการความรวดเร็วและความชัดเจน การแสดงข้อมูลที่เยอะเกินไป (เช่น ที่อยู่ยาวๆ) จะทำให้เสียโฟกัส
**รูปแบบการออกแบบ:**
*   **Table View (Clean Mode):** แสดงเฉพาะ "ชื่อผู้รับ (Recipient Name)" และ "อีเมล/เบอร์โทร" เท่านั้น เพื่อใช้ระบุตัวตนเบื้องต้น
*   **Detail View (Actionable Modal/Page):** ค่อยแสดงที่อยู่เต็มๆ, ปุ่ม Copy Address, หรือ Print Label ในหน้ารายละเอียดเมื่อแอดมินคลิกเข้ามาดู

```jsx
{/* ✅ Fallback ชื่อลูกค้า (เน้นชื่อคนรับของ) */}
<div className="font-black text-slate-800 uppercase tracking-tight">
    {order.shippingAddress?.fullName || order.userId?.name || 'Unknown'}
</div>
```

---

## 🛣️ 4. Shared API Routing (Generic Endpoints)
**ปัญหาที่พบ:** การยิง API ไปที่ `/admin/orders/:id` ได้รับ 404 Error เพราะ Backend รวมศูนย์ Endpoint สำหรับการดึงรายละเอียดออเดอร์ไว้ที่ทางเข้าหลัก
**แนวทาง (RESTful Principle):**
การดึง Resource แบบระบุ ID (เช่น การอ่านรายละเอียดออเดอร์) มักจะใช้ Route กลาง (Generic Route) เช่น `GET /orders/:id` แทนที่จะแยกเป็นของ User กับ Admin เพื่อลดการเขียนโค้ดซ้ำซ้อนใน Backend

```javascript
// ✅ การยิง API ที่ถูกต้องสำหรับ Resource กลาง
export const getOrderByIdApi = async (orderId) => {
    // ใช้ /orders/:id แทน /admin/orders/:id
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
};
```
