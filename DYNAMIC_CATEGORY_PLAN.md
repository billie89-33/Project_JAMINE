# 🚀 Dynamic Category Filter Plan (Data-Assisted Builder Strategy)

แผนปฏิบัติการสำหรับการเปลี่ยนระบบตัวกรองสินค้า (Filter) จากแบบ Hardcode (`FILTER_WHITELIST`) ให้เป็นระบบ Dynamic ที่ควบคุมได้จากหน้า Admin Panel 100% โดยรองรับความซับซ้อนของสเปคสินค้าแต่ละหมวดหมู่ที่มีความแตกต่างกัน

---

## 🎯 ปัญหาที่พบ (The Problem)
1. **Hardcoded Filters:** ปัจจุบันในไฟล์ `Sidebar.tsx` ของหน้ารวมสินค้า มีการทำ Hardcode ตัวแปร `FILTER_WHITELIST` ไว้ หากมีหมวดหมู่ใหม่ Frontend จะไม่รู้จักหมวดหมู่นั้น
2. **Spec Overload:** สินค้าในแต่ละหมวดหมู่ (เช่น Notebook) มีสเปคย่อยเยอะมาก (10+ รายการ) ซึ่งบางอันไม่ได้สำคัญพอที่จะเอามาทำเป็นตัวกรองที่ Sidebar หากให้ระบบดึงสเปคทั้งหมดมาทำเป็นตัวกรองอัตโนมัติ (Auto-Discovery) จะทำให้หน้าตา Sidebar รก และใช้งานยาก
3. **Human Error:** หากให้แอดมินพิมพ์ชื่อคีย์สเปคเองทั้งหมด อาจเกิดความผิดพลาดจากการสะกดผิด (เช่น พิมพ์ `Ram` แทน `RAM`)

---

## 💡 ทางแก้ปัญหา (The Solution): Data-Assisted Filter Builder
เราจะสร้างระบบ "Category Settings" โดยเฉพาะ โดยใช้ข้อมูลสเปคที่ "มีอยู่จริงในระบบ" มานำเสนอเป็นตัวเลือก (Checkbox/Tags) ให้แอดมินเลือกติ๊ก เพื่อป้องกันความผิดพลาดและลดภาระในการพิมพ์

### 🛠️ Step 1: Database & Backend (ฝั่ง API)
แจ้งทีม Backend ให้สร้าง Schema/Entity ใหม่ชื่อ `CategorySettings` แยกออกมาเพื่อจัดการ Configuration ของแต่ละหมวดหมู่
- **ตัวอย่างข้อมูลใน DB (`CategorySettings`):**
  ```json
  {
    "categoryName": "Notebook",
    "filterWhitelist": ["CPU", "RAM", "Display Size", "Graphic Card"] 
  }
  ```
- **API ที่ต้องเตรียมเพิ่ม:**
  1. `GET /admin/category-settings` (ดึงการตั้งค่าของหมวดหมู่ทั้งหมด)
  2. `GET /admin/category-settings/:categoryName` (ดึงการตั้งค่าของหมวดหมู่ที่ระบุ)
  3. `PATCH /admin/category-settings/:categoryName` (อัปเดตข้อมูล)
     - **เหตุผลที่ใช้ PATCH:** เพื่อรองรับการอัปเดตเฉพาะฟิลด์ (เช่น อัปเดตแค่ `filterWhitelist`) โดยไม่กระทบฟิลด์อื่นหากอนาคตมีการเพิ่มฟิลด์ใหม่ (เช่น `icon`, `sortOrder`)
  4. `GET /products/category-settings` (สำหรับให้หน้า User `Sidebar.tsx` ดึงค่าไปใช้แบบ Public)

---

### 🛠️ Step 2: Admin Frontend (หน้าจัดการตั้งค่าหมวดหมู่)
เราจะสร้างหน้าจอ Admin สำหรับจัดการ "Category Settings" โดยมี Workflow อัจฉริยะดังนี้:

1. **Category Selection:** แอดมินเลือกหมวดหมู่ที่ต้องการตั้งค่า (เช่น "Notebook")
2. **Auto-Fetch Spec Keys:** Frontend จะยิง API เก่าที่มีอยู่แล้วคือ `GET /products/spec-keys?category=Notebook` เพื่อดึง **"คีย์สเปคทั้งหมดที่สินค้าหมวดหมู่นี้เคยใช้"**
3. **Checkbox Interface:** นำคีย์สเปคที่ได้จากข้อ 2 มาเรียงเป็น Checkbox ให้แอดมินติ๊กเลือก
   - *ตัวอย่าง: จากสเปค 15 รายการ แอดมินติ๊กเลือกแค่ CPU, RAM, Display Size*
4. **Custom Tag Input (เผื่ออนาคต):** มีช่องให้แอดมินพิมพ์คีย์ใหม่เองได้ เผื่อต้องการเตรียม Filter ไว้สำหรับสินค้าลอตใหม่
5. **Save Configuration:** เมื่อกด Save Frontend จะยิง `PATCH /admin/category-settings/Notebook` พร้อมส่ง `filterWhitelist` เข้าไปบันทึก

---

### 🛠️ Step 3: User Frontend (หน้าร้านค้า `Sidebar.tsx`)
ปรับปรุงโค้ดในส่วนของลูกค้าให้ดึงข้อมูลอ้างอิงจาก Backend แทนการ Hardcode:

1. **ดึงข้อมูล Dynamic Map จาก API ทันทีที่โหลดหน้าแรก:**
   ```typescript
   // ดึงข้อมูล Category Settings จาก Backend
   const { data: categorySettings } = useApi(getCategorySettingsApi);

   // แปลงข้อมูลให้อยู่ในรูปแบบ Map (Record)
   const dynamicWhitelist = useMemo(() => {
     if (!categorySettings) return {};
     return categorySettings.reduce((acc, setting) => {
       acc[setting.categoryName] = setting.filterWhitelist || [];
       return acc;
     }, {} as Record<string, string[]>);
   }, [categorySettings]);
   ```

2. **ใส่ระบบ Fallback (กันเหนียวกรณียังไม่ได้ตั้งค่า):**
   ```typescript
   const DEFAULT_FILTERS = ['Brand', 'Price']; 
   
   // ลำดับความสำคัญ: 1. DB (Dynamic) -> 2. Hardcode เดิม (สำรอง) -> 3. พื้นฐาน
   const activeWhitelists = dynamicWhitelist[selectedCategory] 
                         || FILTER_WHITELIST[selectedCategory] 
                         || DEFAULT_FILTERS;
   ```

---

## 📋 Checklist สำหรับนำไปปฏิบัติ (To-Do List)

- [ ] **Backend:** สร้าง Schema/Entity `CategorySettings` ใน Database
- [ ] **Backend:** สร้าง Endpoint `GET /admin/category-settings` และ `PATCH /admin/category-settings/:categoryName`
- [ ] **Backend:** สร้าง Endpoint `GET /products/category-settings` สำหรับ Public (หน้า User)
- [ ] **Admin UI:** สร้าง Service/API Client เพื่อต่อกับ API ใหม่ของ Backend
- [ ] **Admin UI:** สร้างหน้าต่าง/Modal สำหรับจัดการ Filter โดยดึงสเปคเก่ามาทำเป็น Checkbox ให้แอดมินเลือก
- [ ] **User UI:** นำ `dynamicWhitelist` ที่โหลดจาก API เข้าไปแทนที่แบบ Hardcode ใน `Sidebar.tsx`
- [ ] **QA:** ทดสอบติ๊กเลือก Filter จากหน้า Admin แล้วดูว่าเปลี่ยนตามในหน้า User Sidebar ทันทีหรือไม่

---

### 🛠️ รายละเอียดสำหรับการสร้าง Backend (Node.js/Express + MongoDB)

สำหรับทีม Backend นี่คือรายละเอียดเชิงลึกของสิ่งที่ต้องสร้าง:

**1. Mongoose Schema (`models/CategorySettings.js` หรือ `.ts`)**
สร้าง Schema ใหม่เพื่อเก็บข้อมูลการตั้งค่าแยกต่างหากจาก Category หลัก เพื่อความยืดหยุ่น

```typescript
import mongoose from 'mongoose';

const CategorySettingsSchema = new mongoose.Schema({
  categoryName: { 
    type: String, 
    required: true, 
    unique: true, // หมวดหมู่หนึ่งมีการตั้งค่าได้แค่ชุดเดียว
    trim: true
  },
  filterWhitelist: { 
    type: [String], 
    default: [] // เก็บชื่อ Key ของสเปคที่อนุญาตให้เป็นตัวกรอง เช่น ["CPU", "RAM"]
  },
  // เผื่อฟิลด์สำหรับอนาคต (เช่น การเรียงลำดับหมวดหมู่ หรือเปิด/ปิดการแสดงผล)
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const CategorySettings = mongoose.model('CategorySettings', CategorySettingsSchema);
```

**2. Controllers (`controllers/categorySettingsController.js` หรือ `.ts`)**

```typescript
import { CategorySettings } from '../models/CategorySettings';

// @desc    Get all category settings (For Admin)
// @route   GET /api/category-settings/admin
export const getAdminCategorySettings = async (req, res) => {
  try {
    const settings = await CategorySettings.find({});
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all active category settings (For Public/Frontend Sidebar)
// @route   GET /api/category-settings/public
export const getPublicCategorySettings = async (req, res) => {
  try {
    const settings = await CategorySettings.find({ isActive: true }).select('categoryName filterWhitelist -_id');
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get category settings by category name (For Admin)
// @route   GET /api/category-settings/admin/:categoryName
export const getCategorySettingsByName = async (req, res) => {
  try {
    const setting = await CategorySettings.findOne({ categoryName: req.params.categoryName });
    if (!setting) {
      // คืนค่า default ถ้ายังไม่มี (ไม่ต้อง error 404 เพื่อให้ frontend นำไปใช้ต่อได้ง่าย)
      return res.status(200).json({ success: true, data: { categoryName: req.params.categoryName, filterWhitelist: [] } });
    }
    res.status(200).json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update or Create category settings using PATCH (Upsert)
// @route   PATCH /api/category-settings/admin/:categoryName
export const updateCategorySettings = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const { filterWhitelist, isActive } = req.body;

    // ใช้ findOneAndUpdate พร้อม options: upsert=true 
    // หมายความว่า ถ้ามีอยู่แล้วให้อัปเดต ถ้ายังไม่มีให้สร้างใหม่เลย
    const updatedSettings = await CategorySettings.findOneAndUpdate(
      { categoryName },
      { 
        $set: { 
          ...(filterWhitelist !== undefined && { filterWhitelist }),
          ...(isActive !== undefined && { isActive })
        } 
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: updatedSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
```

**3. Express Routes (`routes/categorySettingsRoutes.js` หรือ `.ts`)**

```typescript
import express from 'express';
import { 
  getAdminCategorySettings, 
  getPublicCategorySettings, 
  getCategorySettingsByName, 
  updateCategorySettings 
} from '../controllers/categorySettingsController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// Public Route สำหรับหน้า User (Sidebar.tsx)
router.get('/public', getPublicCategorySettings); 

// Admin Routes (ต้อง Login และเป็น Admin)
router.get('/admin', protect, admin, getAdminCategorySettings);
router.get('/admin/:categoryName', protect, admin, getCategorySettingsByName);
router.patch('/admin/:categoryName', protect, admin, updateCategorySettings);

export default router;
```

*หมายเหตุ: สำหรับ Backend Developer ให้นำ `categorySettingsRoutes` ไปลงทะเบียนในไฟล์ `server.js` (หรือ `app.js`) หลักของโปรเจกต์ เช่น `app.use('/api/category-settings', categorySettingsRoutes);`*
