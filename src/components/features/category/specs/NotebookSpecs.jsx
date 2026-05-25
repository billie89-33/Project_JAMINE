import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const NotebookCategoryPage = () => {
  const navigate = useNavigate();
  const { type } = useParams(); 

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 40000 }); // ปรับ Max ขึ้นเป็น 40,000 ให้คลุมเครื่องราคาสูง
  const [inStockOnly, setInStockOnly] = useState(false);

  const [selectedCpu, setSelectedCpu] = useState("");
  const [selectedRam, setSelectedRam] = useState("");
  const [products, setProducts] = useState([]);

  const brandOptions = ["ASUS", "LENOVO", "MSI", "GIGABYTE"];
  const cpuOptions = ["RYZEN 3", "INTEL CORE I7"]; 
  const ramOptions = ["8GB", "16GB"];

  // 🌟 1. อัปเดต Mock Data ให้มีชุดสเปกดิบ (specifications) ฝังเตรียมไว้ส่งต่อข้ามหน้า
  const mockDatabase = [
    {
      id: "1", // ปรับเป็น String เพื่อให้ตรงกับไอดีที่ useParams ได้รับจาก URL
      brand: "LENOVO",
      name: "NOTEBOOK LENOVO IDEAPAD SLIM 3 AMD RYZEN 3 8GB LPDDR5 (ARCTIC GREY)",
      price: 14990,
      inStock: true,
      category: "Notebook",
      description: "โน้ตบุ๊กทำงานดีไซน์เพรียวบาง น้ำหนักเบา พกพาสะดวก พร้อมขุมพลังแรงประหยัดพลังงาน",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "LENOVO",
        "Series": "IdeaPad Slim 3",
        "Processor": "AMD Ryzen 3 7320U (2.4GHz up to 4.1GHz)",
        "Memory (RAM)": "8GB LPDDR5 5500MHz (Onboard)",
        "Storage": "512GB SSD M.2 2242 PCIe 4.0x4 NVMe",
        "Graphics": "AMD Radeon 610M Graphics (Integrated)",
        "Display": "15.6 inch FHD (1920x1080) IPS Anti-glare",
        "OS": "Windows 11 Home",
        "Warranty": "2 Years"
      }
    },
    {
      id: "2",
      brand: "ASUS",
      name: "NOTEBOOK ASUS VIVOBOOK GO 15 AMD RYZEN 3 8GB LPDDR5 (MIXED BLACK)",
      price: 14990,
      inStock: true,
      category: "Notebook",
      description: "โน้ตบุ๊กหน้าจอใหญ่คมชัดระดับถนอมสายตา บานพับกางได้ 180 องศา ตอบโจทย์การทำงานมัลติทาสกิ้งประจำวัน",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "ASUS",
        "Series": "Vivobook Go 15",
        "Processor": "AMD Ryzen 3 7320U (2.4GHz up to 4.1GHz)",
        "Memory (RAM)": "8GB LPDDR5 (Onboard)",
        "Storage": "512GB PCIe 3.0 NVMe M.2 SSD",
        "Graphics": "AMD Radeon Graphics (Integrated)",
        "Display": "15.6 inch FHD (1920x1080) 60Hz IPS",
        "OS": "Windows 11 Home + Office Home 2024",
        "Warranty": "2 Years"
      }
    },
    {
      id: "3",
      brand: "MSI",
      name: "NOTEBOOK MSI BRAVO 15 INTEL CORE I7 16GB DDR5 GAMING",
      price: 29990,
      inStock: false,
      category: "Notebook",
      description: "โน้ตบุ๊กเกมมิ่งระดับพระกาฬ ขุมพลัง Intel Core i7 เจเนอเรชันล่าสุด ผสานกราฟิกการ์ดแยกเพื่อการเล่นเกมขั้นสุด",
      image: "https://unsplash.com",
      specifications: {
        "Brand": "MSI",
        "Series": "Bravo 15",
        "Processor": "Intel Core i7-13620H (2.4GHz up to 4.9GHz)",
        "Memory (RAM)": "16GB DDR5 4800MHz",
        "Storage": "512GB NVMe PCIe Gen4x4 SSD",
        "Graphics": "NVIDIA GeForce RTX 4050 (6GB GDDR6)",
        "Display": "15.6 inch FHD (1920x1080) 144Hz IPS",
        "OS": "Windows 11 Home",
        "Warranty": "2 Years"
      }
    },
  ];

  // 🛠️ LOGIC คัดกรองสินค้าตามการคลิกฟิลเตอร์ฝั่งซ้าย
  useEffect(() => {
    const filtered = mockDatabase.filter(product => {
      const productName = product.name.toLowerCase();

      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      const matchStock = !inStockOnly || product.inStock;
      const matchCpu = selectedCpu === '' || productName.includes(selectedCpu.toLowerCase());
      const matchRam = selectedRam === '' || productName.includes(selectedRam.toLowerCase());

      return matchBrand && matchPrice && matchStock && matchCpu && matchRam;
    });

    setProducts(filtered);
  }, [selectedBrands, priceRange, inStockOnly, selectedCpu, selectedRam]);

  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 py-6 text-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-6">
        
        {/* ==================== ฝั่งซ้าย: SIDEBAR FILTER ==================== */}
        <div className="w-full md:w-64 bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-6 h-fit">
          {/* เลือกการแสดงสินค้า */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">เลือกการแสดงสินค้า</h4>
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="rounded border-gray-300 text-purple-600 w-4 h-4" />
              <span>มีในสต็อก</span>
            </label>
          </div>

          {/* ช่วงราคา */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">ช่วงราคา</h4>
            <div className="flex items-center gap-2">
              <input type="number" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} className="w-full border rounded-lg px-3 py-1.5 text-center focus:outline-none focus:border-purple-500" />
              <span className="text-gray-400">-</span>
              <input type="number" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} className="w-full border rounded-lg px-3 py-1.5 text-center focus:outline-none focus:border-purple-500" />
            </div>
          </div>

          {/* แบรนด์ */}
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

          {/* ตัวกรอง CPU */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Processor (CPU)</h4>
            <div className="flex flex-col gap-2">
              {cpuOptions.map((cpu) => (
                <button
                  key={cpu}
                  onClick={() => setSelectedCpu(selectedCpu === cpu ? '' : cpu)}
                  className={`px-3 py-1.5 text-xs text-left font-semibold rounded-lg border transition-all ${
                    selectedCpu === cpu ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cpu}
                </button>
              ))}
            </div>
          </div>

          {/* ตัวกรอง RAM */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Memory (RAM)</h4>
            <div className="flex flex-col gap-2">
              {ramOptions.map((ram) => (
                <button
                  key={ram}
                  onClick={() => setSelectedRam(selectedRam === ram ? '' : ram)}
                  className={`px-3 py-1.5 text-xs text-left font-semibold rounded-lg border transition-all ${
                    selectedRam === ram ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
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
                  
                  {/* 🌟 2. จุดสำคัญ: ยิงนำทางข้ามหน้าพ่วงข้อมูลชุดสเปกดิบ (product) ติดรถไปด้วยผ่านออปชัน state */}
                  <div 
                    onClick={() => navigate(`/product/${product.id}`, { state: { productData: product } })} 
                    className="cursor-pointer"
                  >
                    <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-4 mb-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400 group-hover:scale-105 transition-transform">
                        Notebook Image
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-2 uppercase min-h-[32px] tracking-tight leading-tight group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-sm font-black text-gray-900">฿{product.price.toLocaleString()}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
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
            <div className="bg-white rounded-xl border p-16 text-center text-gray-400">
              ❌ ไม่พบสินค้าที่ตรงกับเงื่อนไขตัวกรองของคุณ
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NotebookCategoryPage;