# 🚚 Backend Spec: Simplified Shipping Tracking

**เป้าหมาย:** เพิ่มระบบบันทึก "เลขพัสดุ (Tracking Number)" เข้าไปในออเดอร์ เมื่อแอดมินทำการจัดส่งสินค้า (เปลี่ยนสถานะเป็น Shipped) แบบเรียบง่าย

---

## 🏗️ 1. อัปเดต Order Model (Database Schema)
ต้องเพิ่มฟิลด์สำหรับเก็บเลขพัสดุเข้าไปใน Schema ของ Order

**ไฟล์ที่ต้องแก้ไข:** `src/models/order.model.js`

```javascript
// เพิ่มฟิลด์ trackingNumber เข้าไปใน orderSchema
const orderSchema = new mongoose.Schema({
    // ... ฟิลด์เดิมที่มีอยู่แล้ว (userId, items, total, status, etc.)
    
    // ➕ ฟิลด์ใหม่ที่ต้องเพิ่ม:
    trackingNumber: {
        type: String,
        default: null,
        trim: true
    }
}, {
    timestamps: true
});
```

---

## ⚙️ 2. ปรับปรุงการอัปเดตสถานะ (Update Order Controller)
ปรับปรุงฟังก์ชัน `updateOrderStatus` ให้สามารถรับค่า `trackingNumber` จาก Frontend ได้ เมื่อแอดมินสั่งเปลี่ยนสถานะเป็น `Shipped`

**เส้นทาง API (ที่มีอยู่แล้ว):** `PATCH /api/v1/admin/orders/:id/status`

**ไฟล์ที่ต้องแก้ไข:** `src/controllers/admin/order.controller.js` (ฟังก์ชัน `updateOrderStatus`)

```javascript
export const updateOrderStatus = async (req, res, next) => {
    try {
        // ➕ 1. รับค่า trackingNumber เพิ่มเติมจาก req.body
        const { status, trackingNumber } = req.body; 
        
        const allowedStatuses = ['Awaiting Payment', 'Paid', 'Cancelled', 'Processing', 'Shipped', 'Delivered'];

        if (!allowedStatuses.includes(status)) {
            const error = new Error('Invalid status');
            error.status = 400;
            throw error;
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            const error = new Error('Order not found');
            error.status = 404;
            throw error;
        }

        // ... (Logic เดิมของ การคืนสต็อก Cancelled และการบวกยอดขาย Paid ยังคงเหมือนเดิม) ...

        // ➕ 2. Logic การบันทึกเลขพัสดุ
        if (status === 'Shipped') {
            if (trackingNumber) {
                order.trackingNumber = trackingNumber;
            } else if (!order.trackingNumber) {
                // ถ้าจะบังคับว่าต้องมีเลขพัสดุตอนกด Shipped ให้เปิดบรรทัดล่างนี้ (Optional)
                // return res.status(400).json({ success: false, message: 'กรุณาระบุเลขพัสดุก่อนทำการจัดส่ง' });
            }
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            data: order // ส่ง object order กลับมา เพื่อให้ Frontend เอา trackingNumber ไปใช้ต่อ
        });
    } catch (error) {
        next(error);
    }
};
```

---

## 🔍 3. สรุปสิ่งที่ Frontend คาดหวัง (Expected Payload)
เมื่อ Frontend ส่ง Request ไปที่ Backend จะมีหน้าตาดังนี้:

```json
// Request Body จาก Admin
{
    "status": "Shipped",
    "trackingNumber": "KRY123456789TH"
}
```

และเมื่อ Frontend ของลูกค้า (User) ดึงข้อมูลออเดอร์ตัวเองผ่าน `getOrderById` หรือ `getMyOrders` ข้อมูลจะต้องมีฟิลด์ `trackingNumber` ติดมาด้วย เพื่อให้หน้าบ้านเอาไปทำปุ่มเช็คพัสดุได้ครับ
