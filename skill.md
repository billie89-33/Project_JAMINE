# ⚛️ React Event Handling & Separation of Concerns Guide

คู่มือสรุปแนวทางปฏิบัติที่ดีที่สุดในการแยก **Event Handlers (เช่น ฟังก์ชันตระกูล `handle...` หรือ `on...Click`)** ออกจากไฟล์หน้าตาเว็บ (UI Component) โดยใช้ Custom Hooks ประจำโมดูล เพื่อควบคุมสถาปัตยกรรมให้สะอาด บำรุงรักษาง่าย และทำ Unit Test ได้อย่างมีประสิทธิภาพ

---

## 📂 1. แนวคิดหลัก: ทำไมต้องแยก Event Handler ออกจาก UI?

*   **UI Component (หน้าตาเว็บ):** ควรทำหน้าที่เพียงแค่ "รับข้อมูลมาเรนเดอร์แสดงผล" และส่งสัญญาณว่าเกิดการคลิกหรือพิมพ์เท่านั้น (เรียกว่า Dumb หรือ Presentational Component)
*   **Custom Hook (สมองคำนวณ):** ควรทำหน้าที่เก็บ State, เขียนคำสั่งยิง API, และจัดการกลไกเมื่อเกิด Event ต่าง ๆ (เรียกว่า Business Logic Layer)
*   **ประโยชน์หลัก:** เวลาที่คุณต้องการปรับปรุง UI หรือเปลี่ยน CSS/Tailwind โค้ดส่วนคำนวณจะไม่พัง และในทางกลับกัน ถ้าคุณจะแก้สคริปต์ยิง API หรือเงื่อนไขจำนวนสินค้า คุณก็แก้ที่ Hook จุดเดียวโดยไม่ต้องยุ่งกับไฟล์ UI

---

## 🎨 2. ตัวอย่างการจัดโครงสร้างแบบ Modular (เช่น โมดูล `product-detail`)

ภายใน 1 โมดูลย่อย เราจะแยกชิ้นส่วนคำนวณ (Hook) ออกจากชิ้นส่วนหน้าตา (Component) แล้วเชื่อมโยงกันผ่านสัญญารับส่งค่า (Props)

```text
src/
└── modules/
    └── product-detail/
        ├── components/
        │   └── ProductMainInfo.jsx # 🖼️ UI Component (รับเฉพาะข้อมูลและฟังก์ชัน handle ไปแปะปุ่ม)
        ├── hooks/
        │   └── useProductActions.js # 🧠 Custom Hook (ศูนย์รวม Event Handlers: handleQuantity, handleAddToCart)
        └── index.js                 # 🚪 ประตูเข้า-ออกหลัก
```

---

## 🛠️ 3. โค้ดต้นแบบการแยกเลเยอร์ (Production-Ready)

### 🧠 3.1 ฝั่งสมองควบคุม: `src/modules/product-detail/hooks/useProductActions.js`
ย้ายสเตตส์และการคำนวณ Event ทั้งหมดมาไว้ที่นี่ โดยฟังก์ชันด้านล่างจะทำหน้าที่เตรียมค่าความปลอดภัยและยิงต่อยอดคำสั่งระบบ

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const useProductActions = (product) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // 1. ระบบจัดการเปลี่ยนรูปภาพแกลเลอรี (Event Handler)
  const handleImageChange = (index) => {
    setActiveImgIndex(index);
  };

  // 2. ระบบควบคุมเพิ่ม/ลดจำนวนสินค้า (Event Handler)
  const handleQuantityChange = (type) => {
    const maxQuantity = product?.quantity || 99;
    if (type === "inc" && quantity < maxQuantity) setQuantity(prev => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity(prev => prev - 1);
  };

  // 3. ตรรกะแกนกลางสำหรับยัดสินค้าลงตระกร้า
  const processAddToCart = () => {
    const productId = product?._id || product?.id;
    if (!productId) {
      toast.error("ไม่พบรหัสสินค้า");
      return false;
    }
    // อนาคตเปลี่ยนเป็นสั่งยิง API: await addToCartRemote(productId, quantity);
    return true;
  };

  // 4. คำสั่งเมื่อกดปุ่มเพิ่มลงตระกร้า (Event Handler)
  const handleAddToCartClick = () => {
    if (processAddToCart()) {
      toast.success(`เพิ่ม ${product.name} จำนวน ${quantity} ชิ้นลงตะกร้าแล้ว!`);
    }
  };

  // 5. คำสั่งเมื่อกดปุ่มซื้อทันที (Event Handler)
  const handleBuyNowClick = () => {
    if (processAddToCart()) {
      navigate('/cart');
    }
  };

  // พ่นเฉพาะ State และ Event Handlers ออกไปให้หน้าบ้านสวมใส่
  return {
    quantity,
    activeImgIndex,
    handleImageChange,
    handleQuantityChange,
    handleAddToCartClick,
    handleBuyNowClick
  };
};
```

### 🖼️ 3.2 ฝั่งหน้าตาแสดงผล: `src/modules/product-detail/components/ProductMainInfo.jsx`
ในไฟล์ UI นี้จะ**ไม่มีการคำนวณตัวเลขหรือครอบ try-catch ใด ๆ ทั้งสิ้น** มีหน้าที่เพียงรับคำสั่งจาก Hook ที่ส่งเข้ามาผ่าน Props แล้วจับคู่แปะลิงก์เข้ากับคำสั่ง `onClick` บนแท็กปุ่มกดต่าง ๆ ตรง ๆ เท่านั้นครับ

```jsx
import React from 'react';

const ProductMainInfo = ({ 
  product,
  quantity,
  activeImgIndex,
  onImageChange,       // 👈 รับฟังก์ชัน Event มาจากภายนอก
  onQuantityChange,    // 👈 รับฟังก์ชัน Event มาจากภายนอก
  onAddToCartClick,    // 👈 รับฟังก์ชัน Event มาจากภายนอก
  onBuyNowClick        // 👈 รับฟังก์ชัน Event มาจากภายนอก
}) => {
  
  if (!product) return null;

  // ตรวจสอบเช็กภาพสไลด์ความปลอดภัย
  const hasMultipleImages = product?.images && product.images.length > 0;
  const currentImage = hasMultipleImages ? product.images[activeImgIndex] : product?.image;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      
      {/* 📸 ส่วนแสดงผลรูปภาพสินค้า */}
      <div className="flex flex-col gap-3">
        <div className="w-full aspect-square bg-gray-50 flex items-center justify-center p-6 relative rounded-xl border border-gray-100">
          <img src={currentImage} alt={product.name} className="max-h-full object-contain mix-blend-multiply" />
        </div>
        
        {/* แกลเลอรีรูปย่อ ดักเช็กคลิกสลับรูปโดยส่ง Event เลขดัชนี (Index) คืนกลับไปหา Hook */}
        {hasMultipleImages && (
          <div className="flex gap-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => onImageChange(idx)} // 👈 ส่ง Event กลับไปหาตัวคุมสมอง
                className={`w-14 h-14 rounded-lg p-1 border cursor-pointer ${activeImgIndex === idx ? "border-purple-600 ring-2 ring-purple-100" : "border-gray-100"}`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 📝 ส่วนปุ่มแอคชั่นควบคุมคำสั่งซื้อ */}
      <div className="flex flex-col justify-between py-1 gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-base font-extrabold text-gray-900">{product.name}</h1>
          <span className="text-2xl font-black text-purple-600">฿{product.price?.toLocaleString()}.00</span>

          {/* แผงควบคุมบวก/ลดจำนวนชิ้น */}
          <div className="flex items-center gap-4 mt-1">
            <span className="text-xs text-gray-500 font-bold">จำนวน:</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-inner">
              <button
                onClick={() => onQuantityChange("dec")} // 👈 ยิงสัญญาณสั่งลด
                className="px-3 py-1.5 bg-white hover:bg-gray-100 font-bold text-gray-500 cursor-pointer"
              >
                -
              </button>
              <span className="px-4 text-xs font-bold text-gray-800">{String(quantity).padStart(2, "0")}</span>
              <button
                onClick={() => onQuantityChange("inc")} // 👈 ยิงสัญญาณสั่งเพิ่ม
                className="px-3 py-1.5 bg-white hover:bg-gray-100 font-bold text-gray-500 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* ปุ่มกดยื่นยันคำสั่งซื้อหลัก */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAddToCartClick} // 👈 แนบฟังก์ชันเพิ่มลงตระกร้าส่วนกลาง
            className="flex-1 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 text-xs font-bold py-3.5 rounded-xl transition-all cursor-pointer"
          >
            🛒 เพิ่มลงตะกร้า
          </button>
          <button
            onClick={onBuyNowClick} // 👈 แนบฟังก์ชันวาร์ปไปหน้าชำระเงินทันที
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-3.5 rounded-xl transition-all cursor-pointer"
          >
            ซื้อเลย
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductMainInfo;
```

---

## 🚪 4. วิธีประกอบร่างชิ้นส่วนที่หน้าเพจหลัก (`src/pages/ProductDetailPage.jsx`)

ที่ตัวไฟล์หน้าเพจระดับบนสุด จะทำหน้าที่เรียกใช้ Custom Hook เพื่อดึงเอา State และ Event Handlers ออกมา จากนั้นก็นำไปสวมใส่ลงใน Props ของคอมโพเนนต์ย่อยตามโครงสร้างที่สวยงามแบบนี้ครับ:

```jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import ProductMainInfo from '@/modules/product-detail/components/ProductMainInfo';
import { useProductActions } from '@/modules/product-detail/hooks/useProductActions'; // 🧠 โหลดกล่องคุม Event

const ProductDetailPage = () => {
  const { productId } = useParams();
  
  // 🎣 สมมติว่านี่คือตัวดึงข้อมูลดิบของสินค้ามาจาก API
  const product = { id: productId, name: 'Premium Mechanical Keyboard', price: 2000, quantity: 5, images: ['https://placeholder.com', 'https://placeholder.com'] };

  // 🧠 สวมระบบสมองคุม Event เข้าคู่กับข้อมูลตัวสินค้าชิ้นนี้
  const {
    quantity,
    activeImgIndex,
    handleImageChange,
    handleQuantityChange,
    handleAddToCartClick,
    handleBuyNowClick
  } = useProductActions(product);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 🧩 ประกบชิ้นส่วนเชื่อมโยงข้อมูลและตัวจับคู่ Event เข้าด้วยกันอย่างสวยงาม */}
      <ProductMainInfo 
        product={product}
        quantity={quantity}
        activeImgIndex={activeImgIndex}
        onImageChange={handleImageChange}
        onQuantityChange={handleQuantityChange}
        onAddToCartClick={handleAddToCartClick}
        onBuyNowClick={handleBuyNowClick}
      />
    </div>
  );
};

export default ProductDetailPage;