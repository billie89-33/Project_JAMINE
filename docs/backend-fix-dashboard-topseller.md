# 🛠️ Backend Fix: Admin Dashboard Top Selling Logic

**สถานะของบั๊ก:** สินค้าที่เพิ่งลงใหม่ (ยอดขายเป็น 0) ปรากฏในรายการ "Top Selling" บนหน้า Dashboard แทนที่จะเป็นสินค้าที่ขายดีที่สุดจริงๆ

---

## 🧐 1. สาเหตุของปัญหา (Root Cause)
ในฟังก์ชัน `getTopProducts` มีการใช้คำสั่ง `Product.find({})` โดยไม่ได้ระบุเงื่อนไขยอดขายขั้นต่ำ เมื่อสินค้าหลายรายการมียอดขายเป็น 0 เท่ากัน (โดยเฉพาะสินค้าใหม่) Database จะคืนค่าตามลำดับการจัดเก็บ (Natural Order) ทำให้สินค้าใหม่ล่าสุดถูกดึงขึ้นมาแสดงผลเป็นสินค้าขายดีอันดับต้นๆ

## 🛠️ 2. วิธีการแก้ไขที่แนะนำ (Proposed Solution)

ให้แก้ไขฟังก์ชัน `getTopProducts` ในไฟล์ Dashboard Controller โดยเพิ่มเงื่อนไขการกรอง (Filtering) และปรับปรุงลำดับการเรียง (Sorting) ดังนี้:

### โค้ดที่ต้องแก้ไข:
**ไฟล์:** `src/controllers/admin/dashboard.controller.js` (หรือไฟล์ที่เกี่ยวข้อง)

```javascript
/**
 * @desc    Get top selling products (Fixed Version)
 */
export const getTopProducts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 5;

        // ✅ 1. กรองเฉพาะสินค้าที่มีการขายจริง (soldCount > 0)
        // ✅ 2. เพิ่ม Tie-breaker: หากยอดขายเท่ากัน ให้เอาตัวที่อยู่มานานกว่าขึ้นก่อน (createdAt: 1)
        const products = await Product.find({ 
            soldCount: { $gt: 0 } 
        })
        .sort({ soldCount: -1, createdAt: 1 }) 
        .limit(limit)
        .lean();

        const formattedProducts = products.map(p => ({
            _id: p._id,
            name: p.modelName,
            brand: p.brand,
            price: p.price,
            sold: p.soldCount,
            image: p.image?.url
        }));

        res.status(200).json({ success: true, data: formattedProducts });
    } catch (error) {
        next(error);
    }
};
```

---

## ✅ 3. ผลลัพธ์ที่คาดหวัง (Expected Results)
1.  **ความแม่นยำ**: รายการ Top Selling จะต้องแสดงเฉพาะสินค้าที่เคยมียอดชำระเงินสำเร็จแล้วเท่านั้น (`status: 'Paid'`)
2.  **ความสะอาดของข้อมูล**: สินค้าใหม่ที่ยังไม่มีการขายจะไม่ไปปรากฏในส่วนนี้ ช่วยให้แอดมินวิเคราะห์สินค้าที่ทำกำไรได้จริง
3.  **กรณีไม่มีการขาย**: หากในระบบยังไม่มีสินค้าใดขายได้เลย รายการจะส่งกลับเป็น Array ว่าง `[]` (Frontend จะแสดงสถานะ "ไม่พบข้อมูล" อย่างถูกต้อง)

---

## 🔔 หมายเหตุเพิ่มเติมสำหรับ Backend:
*   ตรวจสอบให้แน่ใจว่าใน `Product Model` ฟิลด์ `soldCount` มีการทำ **Index** ไว้เพื่อประสิทธิภาพในการ Sort เมื่อข้อมูลมีจำนวนมาก
*   ยืนยันว่าฟังก์ชัน `updateOrderStatus` มีการใช้ `$inc: { soldCount: quantity }` เมื่อสถานะเปลี่ยนเป็น `Paid` เท่านั้น
