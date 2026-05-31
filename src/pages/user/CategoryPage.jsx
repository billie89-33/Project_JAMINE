import { useParams } from 'react-router-dom';
import { HeroBanner } from '@/modules/home';
import { CategorySlider } from '@/shared/components';
import { 
  Sidebar, 
  ProductGrid, 
  Pagination, 
  useProducts 
} from '@/modules/products';
import { LayoutGrid, ListFilter } from 'lucide-react';

const CategoryPage = () => {
  // แกะค่าตัวแปรจาก URL เช่น /category/Notebook
  const { type } = useParams();

  // 🎣 ใช้งาน Hook หลักเพื่อคุม Logic ทั้งหมดของหน้านี้
  // รองรับทั้ง Mock Data และข้อมูลจริงจาก DB ในอนาคต
  const {
    products,
    loading,
    categories,
    brands,
    totalPages,
    currentPage,
    selectedCategory,
    selectedBrands,
    priceRange,
    sort,
    setCurrentPage,
    setSelectedCategory,
    handleBrandToggle,
    handlePriceChange,
    setSort,
    clearAllFilters
  } = useProducts(type);

  return (
    <div className="w-full min-h-screen bg-white relative overflow-hidden pb-20">
      
      {/* 🔮 Decorative Background Elements (ม่วงสดใส) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-100/40 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[40%] bg-indigo-100/30 blur-[100px] rounded-full"></div>
        <div className="absolute top-[40%] left-[20%] w-[20%] h-[20%] bg-purple-50/50 blur-[80px] rounded-full"></div>
        
        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#7c3aed 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>
      
      {/* 1. Header Section: Banner & Category Slider */}
      <div className="bg-white/40 backdrop-blur-md border-b border-purple-50/50 pb-10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-6 space-y-10">
          <HeroBanner />
          <CategorySlider />
        </div>
      </div>

      {/* 2. Main Content: Sidebar + Product Grid */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* ⬅️ Sidebar: ตัวกรองอัจฉริยะ (จะแสดงผลเมื่อเข้าหน้า Category) */}
          <aside className="flex-shrink-0">
            <Sidebar 
              categories={categories}
              brands={brands}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
              onClearAll={clearAllFilters}
            />
          </aside>

          {/* ➡️ Main Content Area */}
          <main className="flex-grow space-y-8">
            
            {/* Toolbar: ข้อมูลสรุปและการเรียงลำดับ */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
                  <LayoutGrid size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">
                    {selectedCategory === 'All' ? 'สินค้าทั้งหมด' : selectedCategory}
                  </h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    พบสินค้า <span className="text-purple-600">{(products.length).toLocaleString()}</span> รายการ
                  </p>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 px-3 text-slate-400">
                  <ListFilter size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Sort By:</span>
                </div>
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-white border-none rounded-xl px-4 py-2.5 text-xs font-black text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer shadow-sm"
                >
                  <option value="newest">ใหม่ล่าสุด</option>
                  <option value="price_asc">ราคา: ต่ำ - สูง</option>
                  <option value="price_desc">ราคา: สูง - ต่ำ</option>
                  <option value="oldest">เก่าที่สุด</option>
                </select>
              </div>
            </div>

            {/* Product Display Grid */}
            <ProductGrid 
              products={products}
              loading={loading}
            />

            {/* Pagination */}
            <div className="pt-10">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;