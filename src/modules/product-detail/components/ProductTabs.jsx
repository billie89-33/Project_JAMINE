import { useState } from 'react';

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('all');

  // 1. โค้ดดักเซฟตี้ชั้นแรก: ถ้าในจังหวะโหลด API แล้ว product ยังเป็นค่าว่าง (null) ให้คืนค่าว่างเปล่าไปก่อนเพื่อไม่ให้โค้ดด้านล่างพัง
  if (!product) return null;

  // 2. โค้ดกำหนดโครงสร้างดัก API: บังคับว่าถ้า product.specifications ไม่มีอยู่จริงจากหลังบ้าน ให้ดักแปลงเป็น Object ว่าง {} ทันที
  // 🛡️ Safe Parse Specifications: รองรับทั้งกรณีที่เป็น Object อยู่แล้ว หรือเป็น JSON String จากหลังบ้าน
  let productSpecs = {};
  if (typeof product.specifications === 'string') {
    try {
      productSpecs = JSON.parse(product.specifications);
      // รองรับเคส double stringify
      if (typeof productSpecs === 'string') productSpecs = JSON.parse(productSpecs);
    } catch (e) {
      productSpecs = {};
    }
  } else if (product.specifications && typeof product.specifications === 'object') {
    productSpecs = product.specifications;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      
      {/* 🗂️ ส่วนแท็บเลือกหัวข้อ */}
      <div className="flex border-b border-gray-100 bg-gray-50/50">
        <button onClick={() => setActiveTab('all')} className={`px-6 py-3.5 text-xs font-bold transition-all ${activeTab === 'all' ? 'text-red-600 border-b-2 border-red-600 bg-white' : 'text-gray-400 hover:text-gray-600'}`}>ทั้งหมด</button>
        <button onClick={() => setActiveTab('details')} className={`px-6 py-3.5 text-xs font-bold transition-all ${activeTab === 'details' ? 'text-red-600 border-b-2 border-red-600 bg-white' : 'text-gray-400 hover:text-gray-600'}`}>รายละเอียดสินค้า</button>
        <button onClick={() => setActiveTab('specs')} className={`px-6 py-3.5 text-xs font-bold transition-all ${activeTab === 'specs' ? 'text-red-600 border-b-2 border-red-600 bg-white' : 'text-gray-400 hover:text-gray-600'}`}>คุณสมบัติสินค้า</button>
      </div>

      {/* 📦 ส่วนแสดงกล่องเนื้อหาภายใน */}
      <div className="p-6 flex flex-col gap-8">
        
        {/* แท็บรายละเอียดสินค้า (โชว์เมื่อเป็น 'all' หรือ 'details') */}
        {(activeTab === 'all' || activeTab === 'details') && (
          <div className="flex flex-col gap-4">
            <h3 className="font-extrabold text-gray-800 border-l-4 border-red-600 pl-2 text-sm uppercase tracking-wide">
              📋 รายละเอียดสินค้า
            </h3>
            {/* ดักเซฟตี้ ?. เผื่อสินค้าบางชิ้นไม่มีคำอธิบายส่งมาจาก API */}
            <p className="text-xs text-gray-600 font-medium pl-2 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              {product?.description || "ไม่มีรายละเอียดเฉพาะสำหรับสินค้าชิ้นนี้"}
            </p>
          </div>
        )}

        {/* ⚡ จุดไฮไลท์สำคัญ: ตารางคุณสมบัติสินค้าแบบแปลงข้อความจาก Object อัตโนมัติ */}
        {(activeTab === 'all' || activeTab === 'specs') && (
          <div className="flex flex-col gap-4">
            <h3 className="font-extrabold text-gray-800 border-l-4 border-red-600 pl-2 text-sm uppercase tracking-wide">
              📊 คุณสมบัติสินค้า
            </h3>
            
            {/* เช็กโครงสร้าง: ถ้าใน Object สเปกมีข้อมูลอยู่จริง ให้กางตารางวนลูปออกมาโชว์ */}
            {Object.keys(productSpecs).length > 0 ? (
              <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                {/* 🌟 เปลี่ยนมาแตกลูปจากตัวแปร productSpecs ที่เราเซ็ตค่าความปลอดภัยไว้ด้านบนเรียบร้อยแล้ว */}
                {Object.entries(productSpecs)
                  .map(([key, value], idx) => (
                  <div 
                    key={key} 
                    className={`grid grid-cols-3 p-3 text-xs border-b last:border-b-0 items-center transition-colors hover:bg-purple-50/20 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}
                  >
                    {/* แสดงชื่อสเปกฝั่งซ้าย (Key) */}
                    <span className="font-bold text-gray-400 pl-2">{key}</span>
                    {/* แสดงค่าสเปกฝั่งขวา (Value) */}
                    <span className="col-span-2 text-gray-700 font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            ) : (
              // โค้ดรองรับกรณีสินค้าบางตัวจาก API ไม่มีข้อมูลสเปก (เช่น อุปกรณ์เสริมเล็กๆ) จะได้ไม่ขึ้นหน้าจอขาวพัง
              <div className="text-xs text-gray-400 p-8 border border-dashed rounded-xl text-center font-medium bg-gray-50/50">
                ℹ️ ไม่มีข้อมูลคุณสมบัติทางเทคนิคเฉพาะสำหรับสินค้าชิ้นนี้
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductTabs;