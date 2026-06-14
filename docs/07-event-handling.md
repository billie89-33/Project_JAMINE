# ⚛️ 07. Event Handling & Separation of Concerns

คู่มือสรุปแนวทางปฏิบัติในการแยก **Event Handlers (Business Logic)** ออกจาก **UI Components (Presentation)** โดยใช้ Custom Hooks เพื่อความสะอาดและง่ายต่อการบำรุงรักษา

---

## 📂 1. แนวคิดหลัก (Dumb Components & Smart Hooks)

*   **UI Component (Dumb):** ทำหน้าที่รับข้อมูลมาเรนเดอร์ และส่งสัญญาณว่าเกิดการโต้ตอบ (คลิก/พิมพ์) ผ่าน Props เท่านั้น
*   **Custom Hook (Smart):** ทำหน้าที่เก็บ State, ประมวลผล Business Logic, ยิง API และจัดการกลไกเมื่อเกิด Event ต่างๆ
*   **Naming Pattern:** 
    *   ใน **Hook**: ใช้คำขึ้นต้นด้วย `handle...` (เช่น `handleAddToCart`)
    *   ใน **Props**: ใช้คำขึ้นต้นด้วย `on...` (เช่น `onAddToCartClick`) เพื่อสื่อว่าเป็นการรอรับเหตุการณ์

---

## 🎨 2. โครงสร้างภายในโมดูล (Module Internal Layout)

เราจะแยกชิ้นส่วนคำนวณออกจากชิ้นส่วนหน้าตา และเชื่อมโยงกันผ่านสัญญารับส่งค่า (Props)

```text
src/modules/[feature]/
├── components/
│   └── FeatureUI.jsx      # 🖼️ รับข้อมูลและฟังก์ชัน handle ไปแปะปุ่ม
├── hooks/
│   └── useFeatureActions.js # 🧠 ศูนย์รวม State และ Event Handlers
└── index.js               # 🚪 ประตูเข้า-ออกหลัก
```

---

## 🛠️ 3. มาตรฐานการเขียนโค้ด (Standard Code Pattern)

### 🧠 3.1 ฝั่งควบคุม (Custom Hook)
ย้ายสเตตส์และการคำนวณ Event ทั้งหมดมาไว้ที่นี่:

```javascript
export const useFeatureActions = (data) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (type) => {
    if (type === "inc") setQuantity(prev => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleActionClick = () => {
    // Business Logic เช่น ยิง API หรือแสดง Toast
    toast.success("ดำเนินการสำเร็จ!");
  };

  return {
    quantity,
    handleQuantityChange,
    handleActionClick
  };
};
```

### 🖼️ 3.2 ฝั่งเรนเดอร์ (UI Component)
รับคำสั่งจาก Hook ผ่าน Props และจับคู่เข้ากับ `onClick` หรือ `onChange` ตรงๆ:

```jsx
const FeatureUI = ({ quantity, onQuantityChange, onActionClick }) => (
  <div>
    <span>จำนวน: {quantity}</span>
    <button onClick={() => onQuantityChange("inc")}>+</button>
    <button onClick={onActionClick}>ตกลง</button>
  </div>
);
```

---

## 🚪 4. การประกอบร่างที่หน้า Page (The Orchestrator)
หน้า Page ทำหน้าที่ดึงข้อมูล เรียกใช้ Hook และนำทั้งสองมาประกบกัน:

```jsx
const FeaturePage = () => {
  const { data } = useFetchData(); // ดึงข้อมูล
  const { quantity, handleQuantityChange, handleActionClick } = useFeatureActions(data); // ดึงสมอง

  return (
    <FeatureUI 
      quantity={quantity}
      onQuantityChange={handleQuantityChange}
      onActionClick={handleActionClick}
    />
  );
};
```

---
**กฎเหล็ก:** ห้ามเขียน `try-catch` หรือ `axios.post` ภายในไฟล์ UI Component โดยเด็ดขาด ให้ย้ายไปที่ Hook หรือ Service ทั้งหมด
