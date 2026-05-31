# 🛠️ Backend API Refactoring Guide: Product System (Standard v2)

เอกสารนี้จัดทำขึ้นเพื่ออธิบายการปรับปรุงระบบหลังบ้าน (Backend) ทั้งในส่วนของ **Model** และ **Controllers** เพื่อให้รองรับฟีเจอร์การกรองขั้นสูง และฟิลด์ข้อมูลที่จำเป็นสำหรับหน้าสินค้าในฝั่ง Frontend

---

## 🏗️ 1. Recommended Mongoose Model (`productModel.js`)

เพื่อให้ระบบทำงานร่วมกับ Frontend ได้อย่างสมบูรณ์ ควรปรับปรุง Schema ให้มีฟิลด์ดังนี้:

```javascript
const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    modelName: { type: String, required: true }, // ใช้ modelName แทน name
    description: { type: String, required: true }, // 🆕 เพิ่มฟิลด์รายละเอียดสินค้า
    price: { type: Number, required: true },
    image: { type: imageSchema, required: true },
    sku: { type: String, required: true, unique: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Notebook', 'Keyboard', 'CPU', 'Monitor', 'Gaming Mouse', 'Graphics Card', 'RAM', 'Mainboard'] 
    },
    stock: { type: Number, required: true, default: 0 }, // ใช้ stock แทน quantity
    status: { 
        type: String, 
        required: true, 
        enum: ['active', 'inactive', 'draft'], 
        default: 'active' 
    }, // 🆕 สถานะสินค้า
    isFeatured: { type: Boolean, default: false }, // 🆕 สินค้าแนะนำ
    specifications: { type: Map, of: String, default: {} }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
```

---

## 🚀 2. Updated Controller: `getProducts` (Filtering & Search)

ฟังก์ชันนี้รองรับการค้นหาตาม `keyword` (ในชื่อสินค้าและรายละเอียด) และรองรับการกรองตามสเปกย่อย (`spec_`)

```javascript
export const getProducts = async (req, res, next) => {
    try {
        // 🌟 1. บังคับให้ User ทั่วไปเห็นเฉพาะสินค้าที่ 'active' เท่านั้น
        // แต่ถ้าเป็น Admin (เรียกผ่านหน้าจัดการ) อาจจะอนุญาตให้กรอง status อื่นได้
        const queryObj = { status: 'active' }; 

        // 2. หมวดหมู่สินค้า
        if (req.query.category) queryObj.category = req.query.category;
        
        // 3. กรองตาม Featured (สำหรับหน้าแรก)
        if (req.query.isFeatured) queryObj.isFeatured = req.query.isFeatured === 'true';

        // 4. ค้นหาคำสำคัญ (Search)
        if (req.query.keyword) {
            const regex = { $regex: req.query.keyword, $options: 'i' };
            queryObj.$or = [
                { modelName: regex },
                { description: regex }, 
                { brand: regex }
            ];
        }

        // ... กรองช่วงราคา และ Dynamic Specs Filter ...

        // Pagination & Sorting
        // ...
    } catch (error) { next(error); }
};
```

---

## ➕ 3. New Controller Example: `createProduct`

วิธีการรับข้อมูลจาก Frontend (ผ่าน `FormData`) เพื่อบันทึกลงฟิลด์ใหม่ๆ:

```javascript
export const createProduct = async (req, res, next) => {
    try {
        const { 
            modelName, brand, price, sku, category, stock, 
            description, specifications, tags, status, isFeatured 
        } = req.body;

        // ... imageData logic ...

        const product = await Product.create({
            brand,
            modelName,
            description, 
            price: Number(price),
            image: imageData,
            sku,
            category,
            stock: Number(stock),
            status: status || 'active', // 🆕 บันทึกสถานะ
            isFeatured: isFeatured === 'true', // 🆕 บันทึก Featured flag
            tags: tags ? JSON.parse(tags) : [], 
            specifications: specifications ? JSON.parse(specifications) : {} 
        });

        res.status(201).json({ success: true, data: product });
    } catch (error) { next(error); }
};
```

---

## 📡 สรุปฟิลด์ข้อมูลที่ Frontend จะส่งไป (API Contract)

| Frontend Field | Backend Field (Model) | ประเภท |
| :--- | :--- | :--- |
| `name` / `modelName` | `modelName` | String |
| `regularPrice` | `price` | Number |
| `quantity` | `stock` | Number |
| `description` | `description` | String (🆕) |
| `selectedFile` | `image` | File (FormData) |
| `specifications['Brand']` | `brand` | String |
| `specifications` | `specifications` | JSON String |

---

## 📖 4. ภาคผนวก: คู่มือการทำระบบแบ่งหน้า (Pagination Guide for Backend)

เพื่อให้ระบบ "Smart Pagination" ฝั่ง Frontend ทำงานได้อย่างสมบูรณ์ ทีม Backend ต้องจัดการ Logic การคำนวณหน้าจอดังนี้:

### 📥 สิ่งที่ Backend จะได้รับจาก Query String
*   `page`: เลขหน้าปัจจุบัน (เริ่มต้นที่ 1)
*   `limit`: จำนวนสินค้าต่อหน้า (Frontend มาตรฐานใช้ **12**)

### 📤 รูปแบบ Response ที่ Frontend รอรับ (ตัวอย่าง)
Backend **ต้อง** คำนวณและส่งค่าเหล่านี้กลับมาเพื่อให้ปุ่มเปลี่ยนหน้าโผล่ขึ้นมาอัตโนมัติ:

```json
{
    "success": true,
    "total": 45,        // จำนวนสินค้าทั้งหมดที่ "ค้นหาเจอ" (หลังผ่าน Filter แล้ว)
    "page": 1,         // หน้าปัจจุบันที่กำลังส่งมา
    "totalPages": 4,   // จำนวนหน้าทั้งหมด (คำนวณจาก total / limit แล้วปัดเศษขึ้น)
    "data": [...]      // อาร์เรย์สินค้าจำนวน 12 ชิ้น (ตาม limit)
}
```

### 🧮 สูตรการคำนวณใน Node.js/Express
ให้นำไปปรับใช้ใน Controller เพื่อความแม่นยำ:

```javascript
// 1. รับค่าและกำหนดค่าเริ่มต้น
const page = parseInt(req.query.page, 10) || 1;
const limit = parseInt(req.query.limit, 10) || 12;

// 2. คำนวณจุดเริ่มต้น (Skip)
const skip = (page - 1) * limit;

// 3. ดึงข้อมูลจาก DB พร้อมกับนับจำนวนทั้งหมดที่ค้นหาเจอ (ต้องนับหลัง Filter)
const total = await Product.countDocuments(queryObj);
const products = await Product.find(queryObj)
    .skip(skip)
    .limit(limit);

// 4. ส่งกลับพร้อมค่า totalPages
res.status(200).json({
    success: true,
    total,
    page,
    totalPages: Math.ceil(total / limit), // 🌟 บรรทัดนี้สำคัญมาก!
    data: products
});
```

### ⚠️ ข้อควรระวังสำหรับ Backend:
1.  **การนับจำนวน (Count):** ต้องใช้ `countDocuments(queryObj)` โดยส่งเงื่อนไขตัวกรอง (Filter) เข้าไปด้วย เพื่อให้จำนวนหน้าลดลงตามผลการค้นหาจริง ไม่ใช่นับสินค้าทั้งหมดในร้าน
2.  **การปัดเศษ:** ใช้ `Math.ceil()` เสมอ เพื่อให้มั่นใจว่าเศษสินค้าที่เหลือ (เช่น หน้าสุดท้ายมีแค่ 2 ชิ้น) จะมีหน้าเป็นของตัวเอง
3.  **ค่า Page ต่ำสุด:** ควรดักไม่ให้ `page` ต่ำกว่า 1 เพื่อป้องกัน Error ตอนใช้คำสั่ง `.skip()` ติดลบครับ
