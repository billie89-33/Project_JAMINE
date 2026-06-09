# 🛒 19. E-commerce Order Workflow & Resilience Patterns

เอกสารนี้รวบรวม "Best Practices", "Anti-Patterns" และ "เทคนิคที่ควรระวัง" ที่ได้จากการพัฒนาระบบ Order Management, Top Selling และ Shipping Tracking ซึ่งออกแบบมาให้ **ยืดหยุ่น (Flexible)** และสามารถนำไปประยุกต์ใช้กับ E-commerce โปรเจกต์อื่นๆ ในระดับ Enterprise ได้

---

## ✅ Best Practices (สิ่งที่ควรทำ)

### 1. Defensive Rendering for Null States (เกราะป้องกันจอขาว)
**สถานการณ์:** เมื่อใช้ Custom Hook (เช่น `useApi`) ในการดึงข้อมูล `data` มักจะมีค่าเริ่มต้นเป็น `null` ก่อนที่จะโหลดเสร็จ
**เทคนิค:** การตั้ง Default Value ใน Destructuring `const { data: orders = [] }` **ไม่สามารถป้องกันค่า `null` ได้** (มันป้องกันได้แค่ `undefined`)
**วิธีแก้ (Universal Pattern):**
ต้องทำการ Fallback ข้อมูลก่อนนำไปใช้ทำ High-order functions เสมอ
```javascript
// ✅ GOOD: ป้องกัน Cannot read properties of null (reading 'filter')
const safeOrders = orders || []; 
const filteredOrders = safeOrders.filter(order => order.id.includes(keyword));
```

### 2. Strict State Transitions (การบังคับเปลี่ยนสถานะออเดอร์)
**สถานการณ์:** การเปลี่ยนสถานะออเดอร์ (เช่น จัดส่งแล้ว) ต้องมาพร้อมกับข้อมูลที่เกี่ยวข้อง (เช่น เลขพัสดุ)
**วิธีแก้:** Frontend ต้องไม่ยอมให้กดส่ง Request และ Backend ต้องครอบ `if` เพื่อป้องกันข้อมูลหลุด
```javascript
// ✅ Backend Validation
if (status === 'Shipped') {
    if (!trackingNumber || trackingNumber.trim() === '') {
        throw new Error('กรุณาระบุเลขพัสดุก่อนทำการจัดส่ง'); // บังคับข้อมูลสำคัญ
    }
    order.trackingNumber = trackingNumber;
}
```

### 3. Contextual Detail Views (เปิดดูรายละเอียดโดยไม่เสีย Context)
**สถานการณ์:** ผู้ใช้ต้องการดูรายละเอียดคำสั่งซื้อในหน้า Profile ที่มีหลายรายการ
**วิธีแก้:** แทนที่จะเปลี่ยนหน้า (`navigate('/order/:id')`) ซึ่งทำให้ผู้ใช้สูญเสียตำแหน่งเดิม ให้ใช้ **Modal (Popup)** แทน สิ่งนี้ช่วยให้ UX ลื่นไหล และผู้ใช้สามารถกดดูออเดอร์หลายๆ อันสลับกันได้ง่ายขึ้น

### 4. Single Source of Truth for Enums
**สถานการณ์:** Status ของออเดอร์มีหลายแบบ (Pending, Paid, Shipped)
**วิธีแก้:** สร้าง Object/Array ในฝั่ง `shared/constants/` ของ Frontend และฝั่ง Backend ให้ตรงกันเป๊ะ 100% ห้ามพิมพ์ String สดๆ (Hardcode) เด็ดขาด เพื่อป้องกัน `Mongoose ValidationError` เมื่อ Backend เพิ่มสถานะใหม่

---

## ❌ Anti-Patterns (สิ่งที่ไม่ควรทำ / จุดที่พบบั๊กบ่อย)

### 1. The "Zero-Sales" Top Seller Bug (การจัดอันดับโดยขาด Threshold)
**บั๊กที่พบ:** ระบบ Query หาสินค้าขายดี `Product.find({}).sort('-soldCount')` ปรากฏว่า **"สินค้าใหม่"** ที่มียอดขาย = 0 ทะลุขึ้นมาติดอันดับต้นๆ (เนื่องจาก Database เรียงตาม Natural Order หากค่าเท่ากัน)
**วิธีป้องกัน (Universal Query Pattern):**
เมื่อต้องการทำระบบจัดอันดับ (Ranking/Top Items) **ต้องใส่เงื่อนไขขั้นต่ำ (Threshold) และเงื่อนไขสำรอง (Tie-breaker) เสมอ**
```javascript
// ❌ BAD: เรียงอย่างเดียว ถ้าเป็น 0 เท่ากันจะมั่ว
await Product.find({}).sort({ soldCount: -1 }).limit(5);

// ✅ GOOD: ต้องเคยขายได้จริง และถ้าขายได้เท่ากัน ให้เอาของเก่าขึ้นก่อน
await Product.find({ soldCount: { $gt: 0 } }) 
    .sort({ soldCount: -1, createdAt: 1 })
    .limit(5);
```

### 2. Orphaned API Exports (บั๊กจอขาวเพราะลืม Export)
**บั๊กที่พบ:** ระบบพังทั้งหน้าจอ (Build Error / Runtime Crash) เกิดจาก `[MISSING_EXPORT]` ในไฟล์ Services (เช่น `checkoutApi.js`)
**บทเรียน:** 
เมื่อมีการเพิ่ม API endpoint ใหม่ในไฟล์ Service **ต้องตรวจสอบการ `export` ให้ครบถ้วนเสมอ** ก่อนนำไป Destructure ใน Custom Hook (เช่น `import { newApi } from './api'`) เพราะถ้าลืม React จะแครชทั้งแอปพลิเคชันทันที

### 3. Asynchronous Syncing Issues (ข้อมูลเก่าไม่ซิงค์)
**บั๊กที่พบ:** เพิ่มระบบนับยอดขาย แต่สินค้าเก่าที่เคยขายไปแล้ว ยอดขายยังเป็น 0
**บทเรียน:** เมื่อมีการเพิ่ม Field สถิติใหม่ (เช่น `soldCount`, `viewCount`) โค้ดใหม่จะทำงานเฉพาะกับ Action ในอนาคต **ต้องเขียน Data Migration Script** เพื่อซิงค์ข้อมูลย้อนหลัง (เช่น ไปนับรวมยอดจากออเดอร์เก่าๆ มาอัปเดตลงฟิลด์ใหม่) เสมอ เพื่อให้ตัวเลขแม่นยำ

---

## 💡 สรุปแนวคิดระดับ Enterprise
> *"เขียน Frontend ให้พร้อมรับมือกับความว่างเปล่า (Null/Empty Arrays) และเขียน Backend ให้พร้อมปฏิเสธข้อมูลที่มาไม่ครบ (Strict Validation)"*