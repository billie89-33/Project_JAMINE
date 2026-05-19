import  { useState } from 'react';

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('all');

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
            <p className="text-xs text-gray-600 font-medium pl-2 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              {product.description}
            </p>
          </div>
        )}

        {/* ⚡ จุดไฮไลท์สำคัญ: ตารางคุณสมบัติสินค้าแบบแปลงข้อความจาก Object อัตโนมัติ */}
        {(activeTab === 'all' || activeTab === 'specs') && (
          <div className="flex flex-col gap-4">
            <h3 className="font-extrabold text-gray-800 border-l-4 border-red-600 pl-2 text-sm uppercase tracking-wide">
              📊 คุณสมบัติสินค้า
            </h3>
            
            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              {product.specifications && Object.entries(product.specifications).map(([key, value], idx) => (
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
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductTabs;