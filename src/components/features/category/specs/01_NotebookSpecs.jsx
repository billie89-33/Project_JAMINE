import { useState, useEffect } from 'react';
// 1. นำเข้า useNavigate เพื่อเตรียมเปลี่ยนหน้าไปยัง Product Detail
import { useNavigate, useParams } from 'react-router-dom';

const NotebookCategoryPage = () => {
  const navigate = useNavigate();
  const { type } = useParams(); // แงะหมวดหมู่สินค้าจาก URL ได้ (เผื่ออนาคตใช้เช็คประเภท)

  // สเตตัสสำหรับเก็บค่าฟิลเตอร์ที่ผู้ใช้คลิกเลือก
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });
  const [inStockOnly, setInStockOnly] = useState(false);

  // สเตตัสฟิลเตอร์แบบสเปกข้อความ (จับคำจากชื่อสินค้า)
  const [selectedCpu, setSelectedCpu] = useState('');
  const [selectedRam, setSelectedRam] = useState('');

  // สเตตัสสำหรับเก็บรายการสินค้าที่คัดกรองแล้วเพื่อนำไปลูปแสดงผล
  const [products, setProducts] = useState([]);

  // ข้อมูลตัวเลือกที่แสดงฝั่ง Sidebar ซ้าย
  const brandOptions = ['ASUS', 'LENOVO', 'MSI', 'GIGABYTE'];
  const cpuOptions = ['RYZEN 3', 'INTEL CORE I7']; // ดึงคำสำคัญจากชื่อสินค้า
  const ramOptions = ['8GB', '16GB'];

  // 2. ข้อมูลสินค้าจำลองที่มีชื่อสเปกดิบฝังอยู่ข้างใน (Mock Data เหมือนหลังบ้าน)
  const mockDatabase = [
    { 
      id: 1, 
      brand: 'LENOVO', 
      name: 'NOTEBOOK LENOVO IDEAPAD SLIM 3 AMD RYZEN 3 8GB LPDDR5 (ARCTIC GREY)', 
      price: 14990, 
      inStock: true 
    },
    { 
      id: 2, 
      brand: 'ASUS', 
      name: 'NOTEBOOK ASUS VIVOBOOK GO 15 AMD RYZEN 3 8GB LPDDR5 (MIXED BLACK)', 
      price: 14990, 
      inStock: true 
    },
    { 
      id: 3, 
      brand: 'MSI', 
      name: 'NOTEBOOK MSI BRAVO 15 INTEL CORE I7 16GB DDR5 GAMING', 
      price: 29990, 
      inStock: false 
    },
  ];

  // 🛠️ 3. LOGIC สำคัญ: ตัวสแกนจับคำค้นหาจาก "ชื่อสินค้า" (Text-Matching)
  useEffect(() => {
    const filtered = mockDatabase.filter(product => {
      // แปลงชื่อสินค้าในฐานข้อมูลให้เป็นตัวพิมพ์เล็กทั้งหมด
      const productName = product.name.toLowerCase();

      // เงื่อนไขที่ 1: ตรวจสอบ Brand
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      
      // เงื่อนไขที่ 2: ตรวจสอบช่วงราคา
      const matchPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      
      // เงื่อนไขที่ 3: ตรวจสอบสต็อกสินค้า
      const matchStock = !inStockOnly || product.inStock;

      // 🌟 เงื่อนไขจับคำจากชื่อ (CPU & RAM): ถ้าไม่ได้กดปุ่ม จะโชว์ทั้งหมด (true)
      // แต่ถ้ากดปุ่มเมื่อไหร่ คำนั้นต้องถูกพบซ่อนอยู่ในชื่อสินค้า (.includes)
      const matchCpu = selectedCpu === '' || productName.includes(selectedCpu.toLowerCase());
      const matchRam = selectedRam === '' || productName.includes(selectedRam.toLowerCase());

      // สินค้าต้องผ่านทุกเงื่อนไขพร้อมกัน
      return matchBrand && matchPrice && matchStock && matchCpu && matchRam;
    });

    setProducts(filtered);
  }, [selectedBrands, priceRange, inStockOnly, selectedCpu, selectedRam]); 

  // ฟังก์ชันสลับการเลือกกลุ่มแบรนด์ (Checkbox)
  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-6">
        
        {/* ==================== ฝั่งซ้าย: SIDEBAR FILTER ==================== */}
        <div className="w-full md:w-64 bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-6 h-fit text-sm">
          
          {/* ส่วนเลือก: สต็อกสินค้า */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">เลือกการแสดงสินค้า</h4>
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="rounded border-gray-300 text-purple-600 w-4 h-4" />
              <span>มีในสต็อก</span>
            </label>
          </div>

          {/* ส่วนเลือก: ช่วงราคา */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">ช่วงราคา</h4>
            <div className="flex items-center gap-2">
              <input type="number" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} className="w-full border rounded-lg px-3 py-1.5 text-center focus:outline-none focus:border-purple-500" />
              <span className="text-gray-400">-</span>
              <input type="number" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} className="w-full border rounded-lg px-3 py-1.5 text-center focus:outline-none focus:border-purple-500" />
            </div>
          </div>

          {/* ส่วนเลือก: แบรนด์สินค้า */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Brand</h4>
            <div className="flex flex-col gap-2.5">
              {brandOptions.map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)} className="rounded border-gray-300 text-purple-600 w-4 h-4" />
                  <span className="uppercase">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 🌟 ส่วนเลือกเพิ่มเติม: คัดกรอง CPU จากชื่อสินค้า */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Processor (CPU)</h4>
            <div className="flex flex-col gap-2">
              {cpuOptions.map((cpu) => (
                <button
                  key={cpu}
                  onClick={() => setSelectedCpu(selectedCpu === cpu ? '' : cpu)} // คลิกซ้ำเพื่อยกเลิกการเลือก
                  className={`px-3 py-1.5 text-xs text-left font-semibold rounded-lg border transition-all ${
                    selectedCpu === cpu 
                      ? 'bg-purple-600 text-white border-purple-600' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cpu}
                </button>
              ))}
            </div>
          </div>

          {/* 🌟 ส่วนเลือกเพิ่มเติม: คัดกรอง RAM จากชื่อสินค้า */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Memory (RAM)</h4>
            <div className="flex flex-col gap-2">
              {ramOptions.map((ram) => (
                <button
                  key={ram}
                  onClick={() => setSelectedRam(selectedRam === ram ? '' : ram)}
                  className={`px-3 py-1.5 text-xs text-left font-semibold rounded-lg border transition-all ${
                    selectedRam === ram 
                      ? 'bg-purple-600 text-white border-purple-600' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {ram}
                </button>
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
                  
                  {/* 4. ครอบฟังก์ชันนำทางเปลี่ยนหน้าเมื่อกดคลิกที่ตัวเนื้อหาสินค้า */}
                  <div 
                    onClick={() => navigate(`/product/${product.id}`)} 
                    className="cursor-pointer"
                  >
                    {/* พื้นที่รูปภาพ */}
                    <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-4 mb-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400 group-hover:scale-105 transition-transform">
                        Notebook Image
                      </div>
                    </div>
                    {/* ชื่อสินค้าเต็ม */}
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-2 uppercase min-h-[32px] tracking-tight leading-tight group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h4>
                  </div>

                  {/* ราคาสินค้าและปุ่มซื้อเลยด้านล่าง */}
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-sm font-black text-gray-900">฿{product.price.toLocaleString()}</span>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // 👈 ดัก event ไว้ไม่ให้วิ่งไปหน้า Detail ตอนที่เรากดซื้อของลงตะกร้า
                        alert(`เพิ่มชิ้นนี้เข้าตระกร้าช็อปปิ้งเรียบร้อยแล้วครับ!`);
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
              ❌ ไม่พบสินค้าโน้ตบุ๊กที่ตรงกับชื่อสเปกที่คุณค้นหา
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NotebookCategoryPage;