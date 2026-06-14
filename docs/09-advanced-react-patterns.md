# 🧠 09. Advanced React Patterns & Best Practices

เอกสารนี้รวบรวม **"เทคนิคขั้นสูง (Advanced Patterns)"** ที่ถูกนำมาใช้ในโปรเจกต์ Jamine ซึ่งได้รับความยืนยันแล้วว่ามีความยืดหยุ่นสูง (Flexible) ลดบั๊ก และ **สามารถนำไปประยุกต์ใช้กับโปรเจกต์ React อื่นๆ ได้ทันที**

---

## 🔗 1. การซิงค์ URL เข้ากับ Local State (URL-to-State Sync)
**ปัญหา (The Problem):**
เมื่อผู้ใช้อยู่ในหน้า `/category/notebook` แล้วกดลิงก์ Navbar ไปที่ `/category/keyboard` React Router จะทำการเปลี่ยน URL แต่ **Component จะไม่ถูกสร้างใหม่ (No Re-mount)** ทำให้ค่าเริ่มต้นใน `useState(initialCategory)` ไม่ยอมอัปเดตตาม URL ใหม่ หน้าจอจึงค้างอยู่ที่ข้อมูลเดิม

**🚨 Anti-Pattern (สิ่งที่ห้ามทำ):**
ใน UI Component (เช่น Sidebar) เมื่อผู้ใช้กดปุ่มเลือกหมวดหมู่ **ห้ามเรียก `setSelectedCategory('All')` เพื่อเปลี่ยน State โดยตรง** เพราะ State จะเปลี่ยน แต่ URL บนเบราว์เซอร์จะไม่เปลี่ยนตาม ทำให้เกิดบั๊กพฤติกรรมขัดแย้ง (State Desync)

**✅ วิธีแก้แบบ Best Practice:**
1. **ฝั่ง UI (การกดปุ่ม):** ต้องใช้ `useNavigate` เพื่อเปลี่ยน URL เสมอ เพื่อให้ URL เป็นแหล่งความจริง (Source of Truth) แหล่งเดียว
   ```javascript
   // ❌ BAD: เปลี่ยนแค่ State แต่ URL ไม่เปลี่ยน
   onClick={() => setSelectedCategory('All')}

   // ✅ GOOD: สั่งเปลี่ยน URL แล้วปล่อยให้ระบบ Sync ทำงาน
   onClick={() => navigate('/category/All')}
   ```

2. **ฝั่ง Hook (การรับรู้):** ใช้ `useEffect` เพื่อดักจับการเปลี่ยนแปลงของตัวแปรจาก URL (ผ่าน Props หรือ useParams) แล้วทำการซิงค์ (Sync) เข้ากับ Local State ทันที พร้อมกับรีเซ็ตค่าอื่นๆ (เช่น หน้า Pagination หรือตัวกรอง) เพื่อให้ระบบเริ่มต้นทำงานใหม่ได้อย่างสมบูรณ์แบบ

```javascript
// ใน Custom Hook: useProducts.js
export const useProducts = (initialCategory = '') => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // 🌟 The Magic Sync: เมื่อ URL เปลี่ยน ให้สั่งอัปเดต State ภายใน
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setSelectedBrands([]); // เคลียร์ตัวกรองเก่าทิ้งป้องกัน User งง
      setCurrentPage(1);     // ดึงข้อมูลหน้าแรกใหม่เสมอ
    }
  }, [initialCategory]); // <--- จับตาดูตัวแปรนี้จาก URL

  // ...
}
```

---

## 🔪 2. การอัปเดตข้อมูลแบบ "ผ่าตัด" (Surgical PATCH & Dirty Checking)
**ปัญหา (The Problem):**
เมื่อผู้ใช้ต้องการแก้ไขข้อมูลสินค้า (Edit Product) การส่งข้อมูลทั้งหมด (PUT) กลับไปที่ Backend อาจทำให้เกิดการ Overwrite ข้อมูลโดยไม่ตั้งใจ (เช่น รูปภาพหาย) และสิ้นเปลือง Bandwidth

**✅ วิธีแก้แบบ Best Practice:**
ใช้เทคนิค **Dirty Checking** โดยการเปรียบเทียบข้อมูลที่ผู้ใช้พิมพ์ (`formData`) กับข้อมูลดั้งเดิมที่ดึงมาจาก API (`originalData`) แล้วใช้คำสั่ง `FormData.append()` เฉพาะฟิลด์ที่ **"มีการเปลี่ยนแปลงจริงๆ"** เท่านั้น

```javascript
// ใน Custom Hook: useEditProduct.js
const handleSubmit = async (e) => {
  e.preventDefault();
  const patchData = new FormData();
  let hasChanges = false;

  // 🌟 Dirty Check สำหรับฟิลด์ทั่วไป
  const fields = ['brand', 'modelName', 'price', 'stock', 'category'];
  fields.forEach(field => {
    if (formData[field] !== originalProduct[field]) {
      patchData.append(field, formData[field]);
      hasChanges = true;
    }
  });

  // 🌟 Dirty Check สำหรับ Object (เช่น Specifications)
  if (JSON.stringify(formData.specifications) !== JSON.stringify(originalProduct.specifications)) {
    patchData.append('specifications', JSON.stringify(formData.specifications));
    hasChanges = true;
  }

  // 🌟 หยุดการทำงานถ้าผู้ใช้กด Save แต่ไม่ได้แก้รู้อะไรเลย
  if (!hasChanges) {
    return toast.success('ข้อมูลไม่มีการเปลี่ยนแปลง');
  }

  await updateProduct(productId, patchData);
};
```

---

## 🎚️ 3. UI ที่ขับเคลื่อนด้วยข้อมูล (Database-Driven UI)
**ปัญหา (The Problem):**
การเขียน Hardcode รายชื่อแบรนด์หรือหมวดหมู่ (เช่น `const brands = ['Apple', 'Samsung']`) ไว้ใน Frontend จะทำให้เกิดปัญหาเวลาที่ฝั่ง Admin มีการเพิ่มแบรนด์ใหม่ หรือลบแบรนด์ทิ้ง Frontend จะต้องมารอแก้โค้ดและ Deploy ใหม่ทุกครั้ง

**✅ วิธีแก้แบบ Best Practice:**
ออกแบบ UI ให้รองรับโครงสร้างจาก Backend เสมอ (Fetch Master Data) และปล่อยให้ Array ที่ดึงมาได้ทำการสร้าง Checkbox หรือ Dropdown แบบอัตโนมัติ

```javascript
// 🌟 1. ดึง Master Data จาก Backend
const fetchMasterData = async () => {
  const [catRes, brandRes] = await Promise.all([
    getCategoriesApi(),
    getBrandsApi()
  ]);
  setCategories(catRes.data);
  setBrands(brandRes.data);
};

// 🌟 2. ให้ React วนลูปสร้าง UI (ไม่ต้องสนว่าจะมี่กี่แบรนด์)
{brands.map(brand => (
  <label key={brand}>
    <input
      type="checkbox"
      checked={selectedBrands.includes(brand)}
      onChange={() => onBrandToggle(brand)}
    />
    {brand}
  </label>
))}
```

---

## 🔍 4. Real-time Search & Suggestion Pattern
**แนวคิด:** การทำระบบค้นหาที่ตอบสนองทันทีที่ผู้ใช้พิมพ์ (As-you-type) โดยต้องรักษาความเร็วและไม่ทำให้เซิร์ฟเวอร์ทำงานหนัก

**เทคนิค Best Practice:**
1. **Hybrid Navigation**: แบ่งการค้นหาเป็น 2 ระดับ:
   - **Quick Look (Suggestions)**: โชว์ผลลัพธ์ 5 รายการแรกที่ตรงใจที่สุดใน Dropdown เพื่อให้ผู้ใช้กดเข้าหน้าสินค้าได้ทันที
   - **Full Results (Search Page)**: เมื่อกด Enter หรือปุ่มค้นหา ให้พาไปยังหน้า Category/All พร้อม Parameter `?q=...` เพื่อแสดงผลลัพธ์ทั้งหมด
2. **Ref Visibility (Debounce Safety)**: ใช้ `useRef` สำหรับเก็บ `timeoutId` เพื่อให้แน่ใจว่าการเคลียร์ Timer ทำงานได้ถูกต้องแม้ Component จะถูก Re-render ถี่ๆ  
3. **Empty Query Protection**: ห้ามยิง API หากคำค้นหามีความยาวไม่ถึงเกณฑ์ (เช่น < 2 ตัวอักษร) เพื่อป้องกันผลลัพธ์ที่กว้างเกินไปและลดโหลด API

```javascript
// 💡 รูปแบบการทำ Search Hook ที่สมบูรณ์
const [searchQuery, setSearchQuery] = useState("");
const [suggestions, setSuggestions] = useState([]);
const debounceRef = useRef(null);

useEffect(() => {
  if (debounceRef.current) clearTimeout(debounceRef.current);
  if (searchQuery.trim().length < 2) return setSuggestions([]);

  debounceRef.current = setTimeout(async () => {
    const res = await getProductsApi({ keyword: searchQuery.trim(), limit: 5 });
    if (res.success) setSuggestions(res.data);
  }, 300);
}, [searchQuery]);
```

---

## 🎯 สรุปคุณค่าของ Patterns เหล่านี้:
1. **ลดข้อผิดพลาด (Robustness):** จัดการกับ State ที่ซับซ้อนและการทำงานข้ามหน้าจอ (Routing) ได้อย่างมั่นคง
2. **ประสิทธิภาพ (Performance):** ส่งข้อมูลเฉพาะที่จำเป็น (PATCH) และไม่ยิง API พร่ำเพรื่อ
3. **ลดงานบำรุงรักษา (Maintainability):** เพิ่มลบแบรนด์หรือหมวดหมู่จากหลังบ้าน หน้าบ้านปรับเปลี่ยนตามทันที ไม่ต้องแก้โค้ด!
