import React, { useState } from 'react';

const ProductMainInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0); // จัดการระบบคลังสไลด์รูปจากอาร์เรย์

  // ตรวจสอบเช็กว่าสินค้าตัวนี้มีรูปเป็นแบบ Array หรือเป็นตัวแปรเดี่ยว
  const hasMultipleImages = product?.images && product.images.length > 0;
  // ดึงลิงก์รูปภาพมาแสดงผลให้ฉลาดและปลอดภัย ไม่ว่าข้อมูลจะมาคีย์ไหน
  const currentImage = hasMultipleImages ? product.images[activeImgIndex] : product?.image;

  const handleQuantity = (type) => {
    // 💡 ปรับให้เช็คค่าความปลอดภัย: ถ้าไม่มี product.quantity ให้ดัก Default เป็น 99 ชิ้นไปก่อน
    const maxQuantity = product?.quantity || 99;
    if (type === 'inc' && quantity < maxQuantity) setQuantity(quantity + 1);
    if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
  };

  if (!product) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      
      {/* 📸 ฝั่งซ้าย: แกลเลอรีรูปภาพสินค้า */}
      <div className="flex flex-col gap-3">
        <div className="w-full aspect-square bg-gray-50 rounded-xl border flex items-center justify-center p-6 relative overflow-hidden">
          <img 
            src={currentImage} 
            alt={product.name} 
            className="max-h-full object-contain mix-blend-multiply"
          />
          {hasMultipleImages && product.images.length > 1 && (
            <button 
              onClick={() => setActiveImgIndex((prev) => (prev + 1) % product.images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-200/80 hover:bg-gray-300 p-1.5 rounded-full text-gray-600 text-xs font-bold"
            >
              ➔
            </button>
          )}
        </div>
        {/* รูปย่อด้านล่างสำหรับกดสลับดูรูปใหญ่ (จะแสดงผลเฉพาะกรณีที่สินค้าหลังบ้านส่งมาหลายรูปจริง) */}
        {hasMultipleImages && product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, index) => (
              <button 
                key={index}
                onClick={() => setActiveImgIndex(index)}
                className={`w-14 h-14 bg-gray-50 rounded-lg p-1 border overflow-hidden ${activeImgIndex === index ? 'border-purple-600 ring-1 ring-purple-100' : 'border-gray-200'}`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 📝 ฝั่งขวา: ชื่อ ราคา ปุ่มกดแอคชั่น */}
      <div className="flex flex-col justify-between py-2 gap-4">
        <div className="flex flex-col gap-3">
          <div>
            <span className="bg-red-50 text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
              {product.category || 'Product'}
            </span>
            <h1 className="text-base font-extrabold text-gray-900 mt-2 leading-snug">{product.name}</h1>
            {/* 🟢 จุดแก้สำคัญ: ใส่เครื่องหมาย ?. ดักไว้ และถ้าไม่มี _id ให้ถอยไปแสดงผลตัวแปร id ธรรมดาแทนเพื่อไม่ให้เกิด Error หน้าแดงครับ */}
            <p className="text-xs text-gray-400 mt-1">
              รหัสสินค้า (SKU): <span className="text-gray-600 font-medium">{product.sku || product._id?.slice(-6) || product.id}</span>
            </p>
          </div>

          <div className="py-2 border-t border-b border-gray-50 mt-1">
            <span className="text-xl font-black text-purple-600">฿{product.price?.toLocaleString()}.00</span>
          </div>

          {/* แผงควบคุมจำนวนชิ้น */}
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-400 font-bold">จำนวน:</span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <button onClick={() => handleQuantity('dec')} className="px-3 py-1 bg-white hover:bg-gray-100 font-bold text-gray-500">-</button>
              <span className="px-4 text-xs font-bold text-gray-800">{String(quantity).padStart(2, '0')}</span>
              <button onClick={() => handleQuantity('inc')} className="px-3 py-1 bg-white hover:bg-gray-100 font-bold text-gray-500">+</button>
            </div>
            {product.quantity && <span className="text-xs text-gray-400">(คงเหลือ {product.quantity} ชิ้น)</span>}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* แผงปุ่มแอคชั่นแบบเว็บ iHAVECPU */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 border-2 border-red-600 text-red-600 hover:bg-red-50 text-xs font-bold py-3 rounded-xl transition-all">
              🛒 เพิ่มลงตะกร้า
            </button>
            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm shadow-red-100">
              ซื้อเลย
            </button>
          </div>

          {/* ป้ายแท็กสรุปสเปกย่อใต้ปุ่ม */}
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-50">
            <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">#{product.category || 'gadget'}</span>
            {product.specifications?.Brand && (
              <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full uppercase">#{product.specifications.Brand}</span>
            )}
            {product.specifications?.["Socket Type"] && (
              <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full uppercase">#{product.specifications["Socket Type"]}</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductMainInfo;