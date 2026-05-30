import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MonitorSpecs = ({ setTotalPages, currentPage = 1 }) => {
  const navigate = useNavigate();

  // 1. สเตตัสสำหรับเก็บค่าฟิลเตอร์ประเภทต่างๆ ของจอมอนิเตอร์
  const [selectedHz, setSelectedHz] = useState([]);
  const [selectedPanels, setSelectedPanels] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [inStockOnly, setInStockOnly] = useState(false);

  // สเตตัสสำหรับเก็บรายการสินค้าหน้าจอที่คัดกรองเสร็จแล้วเพื่อนำไปลูปแสดงผล
  const [products, setProducts] = useState([]);

  // ข้อมูลตัวเลือกตัวกรองที่จะเอามาทำปุ่มติ๊ก/Checkbox บน Sidebar ฝั่งซ้าย
  const refreshRates = ['60Hz', '144Hz', '240Hz', '360Hz'];
  const panelTypes = ['IPS', 'VA', 'OLED'];

  // 2. ข้อมูลสินค้าจอมอนิเตอร์จำลอง (Mock Data โครงสร้างรองรับการส่งสเปกข้ามหน้า)
  const mockMonitorDatabase = [
    { id: "301", brand: 'ASUS', name: 'GAMING MONITOR ASUS TUF GAMING VG249Q3A 23.8" IPS 180Hz (144HZ SUPPORT)', price: 4590, inStock: true, category: "Monitor", description: "...", image: "https://unsplash.com", specifications: { "Brand": "ASUS" } },
    { id: "302", brand: 'SAMSUNG', name: 'GAMING MONITOR SAMSUNG ODYSSEY G6 G65B 27" VA 2K 240HZ CURVED', price: 13900, inStock: true, category: "Monitor", description: "...", image: "https://unsplash.com", specifications: { "Brand": "SAMSUNG" } },
    { id: "303", brand: 'LG', name: 'GAMING MONITOR LG ULTRAGEAR 27GR95QE-B 27" OLED 2K 240HZ', price: 29900, inStock: false, category: "Monitor", description: "...", image: "https://unsplash.com", specifications: { "Brand": "LG" } },
    { id: "304", brand: 'GIGABYTE', name: 'GAMING MONITOR GIGABYTE G27F 2 27" IPS 165HZ (144HZ SUPPORT)', price: 5990, inStock: true, category: "Monitor", description: "...", image: "https://unsplash.com", specifications: { "Brand": "GIGABYTE" } }
  ];

  // 🛠️ 3. LOGIC การสแกนจับคำค้นหาจาก "ชื่อสินค้า" (Text-Matching)
  useEffect(() => {
    const filtered = mockMonitorDatabase.filter(product => {
      const productName = product.name.toLowerCase();
      const matchPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      const matchStock = !inStockOnly || product.inStock;
      const matchHz = selectedHz.length === 0 || selectedHz.some(hz => productName.includes(hz.toLowerCase()));
      const matchPanel = selectedPanels.length === 0 || selectedPanels.some(panel => productName.includes(panel.toLowerCase()));
      return matchPrice && matchStock && matchHz && matchPanel;
    });

    const itemsPerPage = 12;
    const calculatedTotalPages = Math.ceil(filtered.length / itemsPerPage);
    if (setTotalPages) setTotalPages(calculatedTotalPages);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);
    setProducts(paginatedItems);
  }, [selectedHz, selectedPanels, priceRange, inStockOnly, currentPage, setTotalPages]);

  // ฟังก์ชันสลับหยิบค่าติ๊กเข้า / ติ๊กออก ในอาเรย์สเตตัสฟิลเตอร์
  const handleFilterToggle = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter(item => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 mt-2">
      
      {/* ==================== ฝั่งซ้าย: SIDEBAR MONITOR FILTER ==================== */}
      <div className="w-full md:w-64 bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-5 h-fit text-sm">
        
        {/* เลือกการแสดงสินค้า */}
        <div>
          <h4 className="font-bold text-gray-800 mb-2">เลือกการแสดงสินค้า</h4>
          <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="rounded border-gray-300 text-purple-600 w-4 h-4" />
            <span>มีในสต็อก</span>
          </label>
        </div>

        {/* ช่วงราคา */}
        <div>
          <h4 className="font-bold text-gray-800 mb-2">ช่วงราคา</h4>
          <div className="flex items-center gap-2">
            <input type="number" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} className="w-full border rounded-lg px-2 py-1 text-center focus:outline-none focus:border-purple-500 text-xs" />
            <span className="text-gray-400">-</span>
            <input type="number" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} className="w-full border rounded-lg px-2 py-1 text-center focus:outline-none focus:border-purple-500 text-xs" />
          </div>
        </div>

        {/* เลือกความลื่นไหล Refresh Rate */}
        <div>
          <h4 className="font-bold text-gray-800 mb-2">Refresh Rate</h4>
          <div className="flex flex-col gap-2">
            {refreshRates.map((hz) => (
              <label key={hz} className="flex items-center gap-2 text-gray-600 cursor-pointer text-xs">
                <input 
                  type="checkbox" 
                  checked={selectedHz.includes(hz)} 
                  onChange={() => handleFilterToggle(hz, selectedHz, setSelectedHz)} 
                  className="rounded border-gray-300 text-purple-600 w-3.5 h-3.5" 
                />
                <span>{hz}</span>
              </label>
            ))}
          </div>
        </div>

        {/* เลือกประเภทพาเนลหน้าจอ */}
        <div>
          <h4 className="font-bold text-gray-800 mb-2">Panel Type</h4>
          <div className="flex flex-col gap-2">
            {panelTypes.map((panel) => (
              <label key={panel} className="flex items-center gap-2 text-gray-600 cursor-pointer text-xs">
                <input 
                  type="checkbox" 
                  checked={selectedPanels.includes(panel)} 
                  onChange={() => handleFilterToggle(panel, selectedPanels, setSelectedPanels)} 
                  className="rounded border-gray-300 text-purple-600 w-3.5 h-3.5" 
                />
                <span>{panel}</span>
              </label>
            ))}
          </div>
        </div>

      </div>

      {/* ==================== ฝั่งขวา: PRODUCT GRID ==================== */}
      <div className="flex-1">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-purple-200 hover:shadow transition-all duration-200">
                
                {/* 🌟 ส่งรหัส ID และพ่วงก้อนสเปกมอนิเตอร์ข้ามไปวาดตาราง Key-Value ที่ไฟล์หน้า Detail อัตโนมัติ */}
                <div 
                  onClick={() => navigate(`/product/${product.id}`, { state: { productData: product } })} 
                  className="cursor-pointer"
                >
                  {/* พื้นที่จำลองรูปภาพสินค้าจอมอนิเตอร์ */}
                  <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-4 mb-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform">📺</div>
                  </div>
                  
                  <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded tracking-wide">
                    {product.brand}
                  </span>
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-2 uppercase min-h-[32px] tracking-tight leading-tight mt-1.5 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h4>
                </div>

                {/* ราคาสินค้าและปุ่มแอคชั่นซื้อเลย */}
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-sm font-black text-gray-900">฿{product.price.toLocaleString()}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // ดักล็อกไม่ให้หน้าขยับสลับเข้าดีเทลตอนคลิกเพิ่มของ
                      alert(`เพิ่ม ${product.brand} จอภาพรุ่นนี้ลงตะกร้าเรียบร้อยครับ!`);
                    }}
                    className="text-[11px] bg-black hover:bg-purple-600 text-white font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    ซื้อเลย
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border p-16 text-center text-gray-400 text-sm">
            ❌ ไม่พบรายการจอมอนิเตอร์ที่ตรงกับสเปกที่คุณติ๊กเลือกค้นหา
          </div>
        )}
      </div>

    </div>
  );
};

export default MonitorSpecs;