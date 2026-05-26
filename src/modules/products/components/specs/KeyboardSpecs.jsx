import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const KeyboardSpecs = () => {
  const navigate = useNavigate();

  // สเตตัสสำหรับเก็บค่าฟิลเตอร์ประเภทต่างๆ ของคีย์บอร์ด
  const [selectedSwitches, setSelectedSwitches] = useState([]);
  const [selectedLayouts, setSelectedLayouts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [inStockOnly, setInStockOnly] = useState(false);

  // สเตตัสสำหรับเก็บรายการสินค้าที่คัดกรองเสร็จแล้วเพื่อนำไปลูปแสดงผล
  const [products, setProducts] = useState([]);

  // ข้อมูลตัวเลือกฟิลเตอร์บน Sidebar
  const switchOptions = ['RED SWITCH', 'BLUE SWITCH', 'BROWN SWITCH'];
  const layoutOptions = ['60%', '75%', 'TKL', 'FULL SIZE'];

  // 🌟 1. อัปเดตชุดข้อมูลคีย์บอร์ดจำลอง (Mock Data) ให้มีโครงสร้างละเอียดพร้อมส่งไปกางเป็นตารางหน้า Detail
  const mockKeyboardDatabase = [
    {
      id: "101", // ปรับเป็น String เพื่อให้อ่านคู่กับ useParams ได้เสถียร
      brand: 'LOGITECH',
      name: 'MECHANICAL KEYBOARD LOGITECH G PRO X TKL LIGHTSPEED (BROWN SWITCH)',
      price: 4990,
      inStock: true,
      category: "Keyboard",
      description: "คีย์บอร์ดเกมมิ่งระดับโปรเพลเยอร์ ออกแบบร่วมกับนักแข่งระดับโลก การเชื่อมต่อไร้สาย LIGHTSPEED เสถียร แม่นยำ ไร้ดีเลย์",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "LOGITECH",
        "Model": "G PRO X TKL",
        "Switch Type": "GX Brown Tactile Switches",
        "Layout": "Tenkeyless (TKL)",
        "Connectivity": "LIGHTSPEED Wireless / Bluetooth / USB-C Wired",
        "Lighting": "LIGHTSYNC RGB Per-Key",
        "Battery Life": "สูงสุด 50 ชั่วโมง",
        "Warranty": "2 Years"
      }
    },
    {
      id: "102",
      brand: 'KEYCHRON',
      name: 'MECHANICAL KEYBOARD KEYCHRON V1 MAX 75% WIRELESS (RED SWITCH)',
      price: 3690,
      inStock: true,
      category: "Keyboard",
      description: "คีย์บอร์ดแมคคานิคอลไร้สายขนาด 75% โครงสร้าง Gasket Mount พร้อมโฟมซับเสียงหนาพิเศษเพื่อเสียงพิมพ์ที่นุ่มนวลและสนุกมือ",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "KEYCHRON",
        "Model": "V1 Max",
        "Switch Type": "Gateron Jupiter Red (Linear)",
        "Layout": "75% Compact Layout",
        "Connectivity": "2.4GHz Wireless / Bluetooth 5.1 / Type-C Wired",
        "Hot-swappable": "Yes (รองรับสวิตช์แบบ 3-pin และ 5-pin)",
        "OS Support": "macOS / Windows / Linux",
        "Warranty": "1 Year"
      }
    },
    {
      id: "103",
      brand: 'RAZER',
      name: 'MECHANICAL KEYBOARD RAZER HUNTSMAN MINI 60% RGB (RED SWITCH)',
      price: 3990,
      inStock: false,
      category: "Keyboard",
      description: "คีย์บอร์ดขนาดจิ๋ว 60% ขุมพลังสวิตช์แสง Razer Optical Linear Switches ตอบสนองไวเหนือแสง ประหยัดพื้นที่บนโต๊ะคอมพิวเตอร์ของคุณ",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "RAZER",
        "Model": "Huntsman Mini",
        "Switch Type": "Razer™ Linear Optical Switches",
        "Layout": "60% Ultra-compact Layout",
        "Keycaps": "Razer Doubleshot PBT Keycaps",
        "Connectivity": "Detachable Type-C Cable",
        "Lighting": "Razer Chroma™ RGB",
        "Warranty": "2 Years"
      }
    },
    {
      id: "104",
      brand: 'DURGOD',
      name: 'MECHANICAL KEYBOARD DURGOD K310 FULL SIZE CHERRY MX (BLUE SWITCH)',
      price: 2590,
      inStock: true,
      category: "Keyboard",
      description: "คีย์บอร์ดขนาดเต็ม 104 ปุ่ม ดีไซน์คลาสสิก แข็งแรงทนทานด้วยวัสดุเกรดพรีเมียม ตอบโจทย์ผู้ที่ต้องใช้แป้นตัวเลขทำงานและชอบเสียงพิมพ์สะใจ",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "DURGOD",
        "Model": "Taurus K310",
        "Switch Type": "Cherry MX Blue (Clicky)",
        "Layout": "100% Full Size (104 Keys)",
        "Keycaps": "Hard PBT Double-shot",
        "Connectivity": "USB Type-C to Type-C / Type-A",
        "Software Support": "Durgod Zeus Engine",
        "Warranty": "1 Year"
      }
    }
  ];

  // LOGIC การสแกนจับคำค้นหาจาก "ชื่อสินค้า" (Text-Matching)
  useEffect(() => {
    const filtered = mockKeyboardDatabase.filter(product => {
      const productName = product.name.toLowerCase();

      const matchPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      const matchStock = !inStockOnly || product.inStock;

      const matchSwitch = selectedSwitches.length === 0 || 
                          selectedSwitches.some(sw => productName.includes(sw.toLowerCase()));
      
      const matchLayout = selectedLayouts.length === 0 || 
                          selectedLayouts.some(ly => productName.includes(ly.toLowerCase()));

      return matchPrice && matchStock && matchSwitch && matchLayout;
    });

    setProducts(filtered);
  }, [selectedSwitches, selectedLayouts, priceRange, inStockOnly]);

  const handleFilterToggle = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter(item => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 mt-2">
      
      {/* ==================== ฝั่งซ้าย: SIDEBAR KEYBOARD FILTER ==================== */}
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

        {/* เลือกประเภท Switch */}
        <div>
          <h4 className="font-bold text-gray-800 mb-2">Switch Type</h4>
          <div className="flex flex-col gap-2">
            {switchOptions.map((sw) => (
              <label key={sw} className="flex items-center gap-2 text-gray-600 cursor-pointer text-xs">
                <input type="checkbox" checked={selectedSwitches.includes(sw)} onChange={() => handleFilterToggle(sw, selectedSwitches, setSelectedSwitches)} className="rounded border-gray-300 text-purple-600 w-3.5 h-3.5" />
                <span>{sw}</span>
              </label>
            ))}
          </div>
        </div>

        {/* เลือกขนาด Layout */}
        <div>
          <h4 className="font-bold text-gray-800 mb-2">Keyboard Layout</h4>
          <div className="flex flex-col gap-2">
            {layoutOptions.map((ly) => (
              <label key={ly} className="flex items-center gap-2 text-gray-600 cursor-pointer text-xs">
                <input type="checkbox" checked={selectedLayouts.includes(ly)} onChange={() => handleFilterToggle(ly, selectedLayouts, setSelectedLayouts)} className="rounded border-gray-300 text-purple-600 w-3.5 h-3.5" />
                <span>{ly}</span>
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
                
                {/* 🌟 2. ครอบพ่วงข้อมูลชุดสเปกคีย์บอร์ดดิบ (product) ส่งต่อทะลุข้ามหน้าผ่านออปชัน state */}
                <div 
                  onClick={() => navigate(`/product/${product.id}`, { state: { productData: product } })} 
                  className="cursor-pointer"
                >
                  <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-4 mb-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform">⌨️</div>
                  </div>
                  
                  <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded tracking-wide">
                    {product.brand}
                  </span>
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-2 uppercase min-h-[32px] tracking-tight leading-tight mt-1.5 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h4>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-sm font-black text-gray-900">฿{product.price.toLocaleString()}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`เพิ่ม ${product.brand} ลงตะกร้าเรียบร้อยแล้วครับ!`);
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
            ❌ ไม่พบรายการคีย์บอร์ดที่ตรงกับสเปกที่คุณติ๊กเลือก
          </div>
        )}
      </div>

    </div>
  );
};

export default KeyboardSpecs;