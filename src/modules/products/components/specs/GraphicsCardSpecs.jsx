import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const GraphicsCardSpecs = ({ setTotalPages, currentPage = 1 }) => {
  const navigate = useNavigate();

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [inStockOnly, setInStockOnly] = useState(false);

  const [selectedVram, setSelectedVram] = useState("");
  const [products, setProducts] = useState([]);

  const brandOptions = ["ASUS", "MSI", "GIGABYTE", "GALAX", "ZOTAC"];
  const vramOptions = ["8GB", "12GB", "16GB", "24GB"];

  const mockDatabase = [
    { id: "vga-1", brand: "ASUS", name: "ASUS ROG STRIX GEFORCE RTX 4090 OC EDITION 24GB GDDR6X", price: 79900, inStock: true, category: "Graphics Card", description: "...", image: "https://unsplash.com", specifications: { "Brand": "ASUS" } },
    { id: "vga-2", brand: "MSI", name: "MSI GEFORCE RTX 4070 SUPER 12G VENTUS 2X OC", price: 24900, inStock: true, category: "Graphics Card", description: "...", image: "https://unsplash.com", specifications: { "Brand": "MSI" } },
    { id: "vga-3", brand: "GIGABYTE", name: "GIGABYTE RADEON RX 7900 XTX GAMING OC 24G", price: 36900, inStock: false, category: "Graphics Card", description: "...", image: "https://unsplash.com", specifications: { "Brand": "GIGABYTE" } }
  ];

  useEffect(() => {
    const filtered = mockDatabase.filter(product => {
      const productName = product.name.toLowerCase();
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      const matchStock = !inStockOnly || product.inStock;
      const matchVram = selectedVram === '' || productName.includes(selectedVram.toLowerCase());
      return matchBrand && matchPrice && matchStock && matchVram;
    });

    const itemsPerPage = 12;
    const calculatedTotalPages = Math.ceil(filtered.length / itemsPerPage);
    if (setTotalPages) setTotalPages(calculatedTotalPages);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);
    setProducts(paginatedItems);
  }, [selectedBrands, priceRange, inStockOnly, selectedVram, currentPage, setTotalPages]);

  return (
    <div className="w-full min-h-screen bg-gray-50/50 py-6 text-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-6 h-fit">
          <div>
            <h4 className="font-bold text-gray-800 mb-3">เลือกการแสดงสินค้า</h4>
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="rounded border-gray-300 text-purple-600 w-4 h-4" />
              <span>มีในสต็อก</span>
            </label>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-3">ช่วงราคา</h4>
            <div className="flex items-center gap-2">
              <input type="number" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} className="w-full border rounded-lg px-3 py-1.5 text-center focus:outline-none focus:border-purple-500" />
              <span className="text-gray-400">-</span>
              <input type="number" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} className="w-full border rounded-lg px-3 py-1.5 text-center focus:outline-none focus:border-purple-500" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Brand</h4>
            <div className="flex flex-col gap-2.5">
              {brandOptions.map((brand) => (
                <label key={brand} className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])} className="rounded border-gray-300 text-purple-600 w-4 h-4" />
                  <span className="uppercase">{brand}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-800 mb-3">Video Memory (VRAM)</h4>
            <div className="flex flex-wrap gap-2">
              {vramOptions.map((vram) => (
                <button
                  key={vram}
                  onClick={() => setSelectedVram(selectedVram === vram ? '' : vram)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    selectedVram === vram ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {vram}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-purple-200 hover:shadow transition-all duration-200">
                  <div onClick={() => navigate(`/product/${product.id}`, { state: { productData: product } })} className="cursor-pointer">
                    <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-4 mb-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400 group-hover:scale-105 transition-transform">VGA Image</div>
                    </div>
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-2 uppercase min-h-[32px] tracking-tight leading-tight group-hover:text-purple-600 transition-colors">{product.name}</h4>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-sm font-black text-gray-900">฿{product.price.toLocaleString()}</span>
                    <button onClick={(e) => { e.stopPropagation(); alert(`Added to cart!`); }} className="text-[11px] bg-black hover:bg-purple-600 text-white font-semibold px-2.5 py-1.5 rounded-lg transition-colors">ซื้อเลย</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-16 text-center text-gray-400">❌ ไม่พบสินค้าที่ตรงกับเงื่อนไขตัวกรองของคุณ</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphicsCardSpecs;
