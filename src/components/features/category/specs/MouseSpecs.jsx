import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MouseSpecs = () => {
  const navigate = useNavigate();

  // 1. สเตตัสสำหรับเก็บค่าฟิลเตอร์ประเภทต่างๆ ของเมาส์เกมมิ่ง
  const [selectedConnections, setSelectedConnections] = useState([]);
  const [selectedWeights, setSelectedWeights] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [inStockOnly, setInStockOnly] = useState(false);

  // สเตตัสสำหรับเก็บรายการสินค้าเมาส์ที่คัดกรองเสร็จแล้วเพื่อนำไปลูปแสดงผล
  const [products, setProducts] = useState([]);

  // ข้อมูลตัวเลือกตัวกรองที่จะเอามาทำปุ่มติ๊ก/Checkbox บน Sidebar ฝั่งซ้าย
  const connectionTypes = ['Wired', 'Wireless', 'Bluetooth'];
  const weightCategories = ['< 60g', '60g-80g', '> 80g'];

  // 2. ข้อมูลสินค้าเมาส์จำลอง (Mock Data โครงสร้างรองรับการส่งสเปกข้ามหน้า)
  const mockMouseDatabase = [
    {
      id: "401",
      brand: 'LOGITECH',
      name: 'GAMING MOUSE LOGITECH G PRO X SUPERLIGHT 2 WIRELESS (< 60G) BLACK',
      price: 4990,
      inStock: true,
      category: "Mouse",
      description: "เมาส์เกมมิ่งไร้สายระดับไอคอนิก เจเนอเรชันใหม่น้ำหนักเบาเป็นพิเศษไม่ถึง 60 กรัม แม่นยำสูงสุดด้วยเซนเซอร์ HERO 2 เพื่อนักแข่ง Esport",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "LOGITECH",
        "Model": "G Pro X Superlight 2",
        "Sensor": "HERO 2 (32,000 DPI)",
        "Connection": "LIGHTSPEED Wireless / Type-C USB",
        "Weight": "54g (Ultra-light < 60g)",
        "Polling Rate": "2,000Hz (Wireless)",
        "Battery Life": "สูงสุด 95 ชั่วโมง",
        "Warranty": "2 Years"
      }
    },
    {
      id: "402",
      brand: 'RAZER',
      name: 'GAMING MOUSE RAZER DEATHADDER V3 PRO WIRELESS (60G-80G) WHITE',
      price: 4690,
      inStock: true,
      category: "Mouse",
      description: "เมาส์ทรง Ergonomic โค้งรับอุ้งมือที่สมบูรณ์แบบ น้ำหนักเบาเพียง 63 กรัม ตอบสนองไว ดุดัน เหมาะสำหรับสายดึงข้อและสะบัดเมาส์ยิง",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "RAZER",
        "Model": "DeathAdder V3 Pro",
        "Sensor": "Focus Pro 30K Optical Sensor",
        "Connection": "Razer HyperSpeed Wireless / Wired",
        "Weight": "63g (Lightweight 60g-80g)",
        "Switch Type": "Razer Optical Mouse Switches Gen-3",
        "Battery Life": "สูงสุด 90 ชั่วโมง",
        "Warranty": "2 Years"
      }
    },
    {
      id: "403",
      brand: 'RAZER',
      name: 'GAMING MOUSE RAZER VIPER MINI ULTRA-LIGHTWEIGHT WIRED (< 60G)',
      price: 990,
      inStock: false,
      category: "Mouse",
      description: "เมาส์เกมมิ่งมีสายขนาดเล็กกะทัดรัด น้ำหนักเบาจับง่ายกระชับมือ ในราคาสุดคุ้มค่า ทนทานด้วยสวิตช์ออปติคอลความเร็วสูง",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "RAZER",
        "Model": "Viper Mini",
        "Sensor": "8,500 DPI Optical Sensor",
        "Connection": "Wired (สาย Razer Speedflex)",
        "Weight": "61g (Lightweight 60g-80g)",
        "Lighting": "Razer Chroma™ RGB",
        "Warranty": "2 Years"
      }
    },
    {
      id: "404",
      brand: 'ASUS',
      name: 'GAMING MOUSE ASUS ROG CHAKRAM X ORIGIN BLUETOOTH / WIRELESS (> 80G)',
      price: 3990,
      inStock: true,
      category: "Mouse",
      description: "เมาส์จัดเต็มฟังก์ชันระดับพรีเมียม มาพร้อมจอยสติ๊กด้านข้างปรับแต่งได้ เชื่อมต่อได้ครบ 3 โหมด ยืนระยะทำงานและเล่นเกมได้ยาวนาน",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "ASUS ROG",
        "Model": "Chakram X Origin",
        "Sensor": "ROG AimPoint (36,000 DPI)",
        "Connection": "2.4GHz RF / Bluetooth / Wired USB",
        "Weight": "123g (Standard > 80g)",
        "Special Feature": "Programmable Joystick / Hot-swappable Switch Socket",
        "Warranty": "3 Years"
      }
    }
  ];

  // 🛠️ 3. LOGIC การสแกนจับคำค้นหาจาก "ชื่อสินค้า" (Text-Matching)
  useEffect(() => {
    const filtered = mockMouseDatabase.filter(product => {
      const productName = product.name.toLowerCase();

      // เงื่อนไขคัดกรองราคา และสต็อกสินค้า
      const matchPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      const matchStock = !inStockOnly || product.inStock;

      // 🔍 คัดกรองตามข้อความชื่อสินค้า: ถ้าไม่คลิกปุ่มจะผ่านฉลุย แต่ถ้ากดเลือก คำนั้นต้องถูกพบซ่อนอยู่ในชื่อสินค้า
      const matchConnection = selectedConnections.length === 0 || 
                              selectedConnections.some(conn => productName.includes(conn.toLowerCase()));
      
      const matchWeight = selectedWeights.length === 0 || 
                          selectedWeights.some(weight => productName.includes(weight.toLowerCase()));

      return matchPrice && matchStock && matchConnection && matchWeight;
    });

    setProducts(filtered);
  }, [selectedConnections, selectedWeights, priceRange, inStockOnly]);

  // ฟังก์ชันสลับหยิบค่าในอาเรย์ตัวกรอง (ติ๊กเข้า / ติ๊กออก)
  const handleFilterToggle = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter(item => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 mt-2">
      
      {/* ==================== ฝั่งซ้าย: SIDEBAR MOUSE FILTER ==================== */}
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

        {/* เลือกการเชื่อมต่อ Connection */}
        <div>
          <h4 className="font-bold text-gray-800 mb-2">Connection</h4>
          <div className="flex flex-col gap-2">
            {connectionTypes.map((conn) => (
              <label key={conn} className="flex items-center gap-2 text-gray-600 cursor-pointer text-xs">
                <input 
                  type="checkbox" 
                  checked={selectedConnections.includes(conn)} 
                  onChange={() => handleFilterToggle(conn, selectedConnections, setSelectedConnections)} 
                  className="rounded border-gray-300 text-purple-600 w-3.5 h-3.5" 
                />
                <span>{conn}</span>
              </label>
            ))}
          </div>
        </div>

        {/* เลือกประเภทน้ำหนัก Mouse Weight */}
        <div>
          <h4 className="font-bold text-gray-800 mb-2">Mouse Weight</h4>
          <div className="flex flex-col gap-2">
            {weightCategories.map((weight) => (
              <label key={weight} className="flex items-center gap-2 text-gray-600 cursor-pointer text-xs">
                <input 
                  type="checkbox" 
                  checked={selectedWeights.includes(weight)} 
                  onChange={() => handleFilterToggle(weight, selectedWeights, setSelectedWeights)} 
                  className="rounded border-gray-300 text-purple-600 w-3.5 h-3.5" 
                />
                <span>{weight}</span>
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
                
                {/* 🌟 ส่งรหัส ID และพ่วงก้อนสเปกเมาส์ข้ามมิติไปวาดเป็นตาราง Key-Value ที่หน้าดีเทลหลักทันที */}
                <div 
                  onClick={() => navigate(`/product/${product.id}`, { state: { productData: product } })} 
                  className="cursor-pointer"
                >
                  {/* พื้นที่จำลองรูปภาพสินค้าเมาส์เกมมิ่ง */}
                  <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-4 mb-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform">🖱️</div>
                  </div>
                  
                  <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded tracking-wide">
                    {product.brand}
                  </span>
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-2 uppercase min-h-[32px] tracking-tight leading-tight mt-1.5 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h4>
                </div>

                {/* ราคาสินค้าและปุ่มแอดลงตะกร้า */}
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-sm font-black text-gray-900">฿{product.price.toLocaleString()}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // ล็อกแรงกดคลิกเพิ่มของไม่ให้พุ่งเข้าหน้า Detail
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
            ❌ ไม่พบรายการเมาส์เกมมิ่งที่ตรงกับเงื่อนไขการเลือกฟิลเตอร์ของคุณ
          </div>
        )}
      </div>

    </div>
  );
};

export default MouseSpecs;