import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ComputerSpecs = () => {
  const navigate = useNavigate();

  // 1. สเตตัสสำหรับเก็บค่าตัวกรองประเภทต่างๆ ของคอมพิวเตอร์ประกอบ
  const [selectedCaseSizes, setSelectedCaseSizes] = useState([]);
  const [selectedPsuWatts, setSelectedPsuWatts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [inStockOnly, setInStockOnly] = useState(false);

  // สเตตัสสำหรับเก็บรายการสินค้าคอมพิวเตอร์ที่คัดกรองเสร็จแล้วเพื่อนำไปลูปแสดงผล
  const [products, setProducts] = useState([]);

  // ข้อมูลตัวเลือกตัวกรองที่จะเอามาทำปุ่มติ๊ก/Checkbox บน Sidebar ฝั่งซ้าย
  const caseSizes = ['Full Tower', 'Mid Tower', 'Mini-ITX'];
  const psuWattage = ['650W', '750W', '850W', '1000W'];

  // 2. ข้อมูลสินค้าคอมพิวเตอร์จำลอง (Mock Data โครงสร้างรองรับการส่งสเปกข้ามหน้า)
  const mockComputerDatabase = [
    {
      id: "201",
      brand: 'IHV',
      name: 'DESKTOP PC SET INTEL I5-14400F / RTX 4060 / 16GB DDR5 / 750W (MID TOWER)',
      price: 28900,
      inStock: true,
      category: "Computer",
      description: "คอมพิวเตอร์ประกอบชุดสุดคุ้มสำหรับเกมเมอร์ เล่นเกมลื่นไหลทุกเกมในระดับ Full HD สตรีมเกม ทำงานกราฟิกตัดต่อวิดีโอได้สบาย",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "iHAVE-SET",
        "CPU": "Intel Core i5-14400F (10 Cores / 16 Threads)",
        "Mainboard": "B760M DDR5 Support",
        "Memory (RAM)": "16GB DDR5 5200MHz",
        "Graphics Card": "NVIDIA GeForce RTX 4060 8GB GDDR6",
        "Storage": "SSD NVMe M.2 512GB PCIe 4.0",
        "Power Supply": "750W 80 Plus Bronze",
        "Case Size": "Mid Tower (RGB Fans Included)",
        "Warranty": "3 Years"
      }
    },
    {
      id: "202",
      brand: 'IHV',
      name: 'DESKTOP PC SET AMD RYZEN 7 7800X3D / RTX 4070 SUPER / 32GB / 850W (FULL TOWER)',
      price: 65900,
      inStock: true,
      category: "Computer",
      description: "คอมชุดระดับไฮเอนด์ด้วยขุมพลังซีพียูสำหรับเล่นเกมที่ดีที่สุดในโลก จับคู่การ์ดจอ RTX 4070 Super เล่นเกมระดับ 2K/4K ได้ลื่นไหลไม่มีสะดุด",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "iHAVE-SET",
        "CPU": "AMD Ryzen 7 7800X3D (8 Cores / 16 Threads)",
        "Mainboard": "X670 Gaming WiFi DDR5",
        "Memory (RAM)": "32GB DDR5 6000MHz RGB",
        "Graphics Card": "NVIDIA GeForce RTX 4070 Super 12GB GDDR6X",
        "Storage": "SSD NVMe M.2 1TB PCIe 4.0 High Speed",
        "Power Supply": "850W 80 Plus Gold (Full Modular)",
        "Case Size": "Full Tower Premium Premium",
        "Warranty": "3 Years"
      }
    },
    {
      id: "203",
      brand: 'IHV',
      name: 'DESKTOP PC SET INTEL I7-14700K / RTX 4080 SUPER / 64GB / 1000W (FULL TOWER)',
      price: 89900,
      inStock: false,
      category: "Computer",
      description: "ที่สุดของคอมพิวเตอร์ประกอบสำหรับงานสถาปัตยกรรม เรนเดอร์ 3D ขั้นสูง ตัดต่อวิดีโอ 8K และเล่นเกมระดัยบอัลตร้าเซ็ตติ้ง",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "iHAVE-SET",
        "CPU": "Intel Core i7-14700K (20 Cores / 28 Threads)",
        "Mainboard": "Z790 Creator DDR5 WiFi",
        "Memory (RAM)": "64GB DDR5 5600MHz (32GBx2)",
        "Graphics Card": "NVIDIA GeForce RTX 4080 Super 16GB GDDR6X",
        "Storage": "SSD NVMe M.2 2TB PCIe 4.0 NVMe",
        "Power Supply": "1000W 80 Plus Gold ATX 3.0",
        "Case Size": "Full Tower Glass Design",
        "Warranty": "3 Years"
      }
    },
    {
      id: "204",
      brand: 'IHV',
      name: 'DESKTOP PC MINI ITX AMD RYZEN 5 7600 / RTX 4060 TI / 16GB / 650W',
      price: 34900,
      inStock: true,
      category: "Computer",
      description: "คอมพิวเตอร์ขนาดเล็กกะทัดรัด สไตล์ Minimal ประหยัดพื้นที่จัดวางบนโต๊ะคอมพิวเตอร์ แต่คงไว้ซึ่งความแรงระดับดุดัน",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "iHAVE-SET",
        "CPU": "AMD Ryzen 5 7600 (6 Cores / 12 Threads)",
        "Mainboard": "A620I ITX Ultra Form Factor",
        "Memory (RAM)": "16GB DDR5 5200MHz",
        "Graphics Card": "NVIDIA GeForce RTX 4060 Ti 8GB GDDR6",
        "Storage": "SSD NVMe M.2 512GB",
        "Power Supply": "650W SFX 80 Plus Gold",
        "Case Size": "Mini-ITX Small Form Factor",
        "Warranty": "3 Years"
      }
    }
  ];

  // 🛠️ 3. LOGIC การสแกนจับคำค้นหาจาก "ชื่อสินค้า" (Text-Matching)
  useEffect(() => {
    const filtered = mockComputerDatabase.filter(product => {
      const productName = product.name.toLowerCase();

      // เงื่อนไขคัดกรองราคา และสต็อกสินค้า
      const matchPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      const matchStock = !inStockOnly || product.inStock;

      // 🔍 คัดกรองตามข้อความชื่อสินค้า: ถ้าไม่คลิกปุ่มจะผ่านฉลุย แต่ถ้ากดเลือก คำนั้นต้องซ่อนอยู่ในชื่อสินค้า
      const matchCase = selectedCaseSizes.length === 0 || 
                        selectedCaseSizes.some(size => productName.includes(size.toLowerCase()));
      
      const matchPsu = selectedPsuWatts.length === 0 || 
                       selectedPsuWatts.some(watt => productName.includes(watt.toLowerCase()));

      return matchPrice && matchStock && matchCase && matchPsu;
    });

    setProducts(filtered);
  }, [selectedCaseSizes, selectedPsuWatts, priceRange, inStockOnly]);

  // ฟังก์ชันช่วยสลับหยิบค่าในอาร์เรย์ตัวกรอง (ติ๊กเข้า / ติ๊กออก)
  const handleFilterToggle = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter(item => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 mt-2">
      
      {/* ==================== ฝั่งซ้าย: SIDEBAR COMPUTER FILTER ==================== */}
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

        {/* เลือกขนาดเคสคอมพิวเตอร์ */}
        <div>
          <h4 className="font-bold text-gray-800 mb-2">Case Size</h4>
          <div className="flex flex-col gap-2">
            {caseSizes.map((size) => (
              <label key={size} className="flex items-center gap-2 text-gray-600 cursor-pointer text-xs">
                <input 
                  type="checkbox" 
                  checked={selectedCaseSizes.includes(size)} 
                  onChange={() => handleFilterToggle(size, selectedCaseSizes, setSelectedCaseSizes)} 
                  className="rounded border-gray-300 text-purple-600 w-3.5 h-3.5" 
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* เลือกกำลังไฟพาวเวอร์ซัพพลาย */}
        <div>
          <h4 className="font-bold text-gray-800 mb-2">Power Supply (PSU)</h4>
          <div className="flex flex-col gap-2">
            {psuWattage.map((watt) => (
              <label key={watt} className="flex items-center gap-2 text-gray-600 cursor-pointer text-xs">
                <input 
                  type="checkbox" 
                  checked={selectedPsuWatts.includes(watt)} 
                  onChange={() => handleFilterToggle(watt, selectedPsuWatts, setSelectedPsuWatts)} 
                  className="rounded border-gray-300 text-purple-600 w-3.5 h-3.5" 
                />
                <span>{watt}</span>
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
                
                {/* 🌟 จุดนำทางเปลี่ยนหน้า: โยนวัตถุสเปกคอมประกอบทั้งชุดข้ามไปกางเป็นตารางที่ไฟล์ ProductTabs หน้า Detail */}
                <div 
                  onClick={() => navigate(`/product/${product.id}`, { state: { productData: product } })} 
                  className="cursor-pointer"
                >
                  {/* พื้นที่จำลองรูปภาพเคสคอมพิวเตอร์ */}
                  <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-4 mb-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform">🖥️</div>
                  </div>
                  
                  <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded tracking-wide">
                    {product.brand}
                  </span>
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-2 uppercase min-h-[32px] tracking-tight leading-tight mt-1.5 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h4>
                </div>

                {/* ราคาสินค้าและปุ่มเพิ่มตะกร้า */}
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-sm font-black text-gray-900">฿{product.price.toLocaleString()}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // ดักล็อกแรงกดไม่ให้หน้าต่างวิ่งทะลุเข้าดีเทลตอนกดสั่งของ
                      alert(`เพิ่มคอมพิวเตอร์ชุดนี้ลงตะกร้าเรียบร้อยแล้วครับ!`);
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
            ❌ ไม่พบชุดเครื่องคอมพิวเตอร์ประกอบที่ตรงกับสเปกตัวเลือกที่คุณระบุ
          </div>
        )}
      </div>

    </div>
  );
};

export default ComputerSpecs;