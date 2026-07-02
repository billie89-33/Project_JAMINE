import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { HeroBanner } from '@/modules/home';
import { CategorySlider } from '@/shared/components';
import { 
  Sidebar, 
  ProductGrid, 
  Pagination, 
  useProducts 
} from '@/modules/products';
import { LayoutGrid, ListFilter, Search, Filter, X } from 'lucide-react';

const CategoryPage = () => {
  // แกะค่าตัวแปรจาก URL เช่น /category/Notebook
  const { type } = useParams();
  
  // 🔍 ดึงค่าจาก query string เช่น ?q=asus
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // Mobile Filter State
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 🎣 ใช้งาน Hook หลักเพื่อคุม Logic ทั้งหมดของหน้านี้
  const {
    products,
    loading,
    categories,
    brands,
    specFilters,
    totalPages,
    currentPage,
    selectedCategory,
    selectedBrands,
    priceRange,
    selectedSpecs,
    sort,
    setCurrentPage,
    setSelectedCategory,
    handleBrandToggle,
    handlePriceChange,
    handleSpecToggle,
    setSort,
    clearAllFilters
  } = useProducts(type, searchQuery);

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
          <HeroBanner placement="category_hero" />
          <CategorySlider />
        </div>
      </div>

      {/* 2. Main Content: Sidebar + Product Grid */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-10 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* ⬅️ Sidebar: ตัวกรองอัจฉริยะ (Desktop) */}
          <aside className="hidden lg:block flex-shrink-0">
            <Sidebar 
              categories={categories}
              brands={brands}
              specFilters={specFilters}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              selectedSpecs={selectedSpecs}
              onSpecToggle={handleSpecToggle}
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
              onClearAll={clearAllFilters}
            />
          </aside>

          {/* 📱 Sidebar: ตัวกรองอัจฉริยะ (Mobile Drawer) */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-[200] flex lg:hidden">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              
              {/* Drawer */}
              <div className="relative w-[85%] max-w-sm h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                <div className="p-4 border-b border-purple-100 flex items-center justify-between bg-purple-50">
                  <h3 className="font-black text-purple-900 uppercase tracking-widest text-sm flex items-center gap-2">
                    <Filter size={16} /> Filters
                  </h3>
                  <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-2 text-purple-600 hover:bg-purple-200 rounded-lg transition-colors active:scale-90"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                  <Sidebar 
                    categories={categories}
                    brands={brands}
                    specFilters={specFilters}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedBrands={selectedBrands}
                    onBrandToggle={handleBrandToggle}
                    selectedSpecs={selectedSpecs}
                    onSpecToggle={handleSpecToggle}
                    priceRange={priceRange}
                    onPriceChange={handlePriceChange}
                    onClearAll={clearAllFilters}
                  />
                </div>
                <div className="p-4 border-t border-slate-100 bg-white">
                  <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-purple-200 active:scale-95 transition-all"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ➡️ Main Content Area */}
          <main className="flex-grow space-y-6 md:space-y-8">
            
            {/* Toolbar: ข้อมูลสรุปและการเรียงลำดับ */}
            <div className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center justify-between w-full md:w-auto gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="bg-purple-50 p-2 md:p-3 rounded-xl md:rounded-2xl text-purple-600">
                    {searchQuery ? <Search size={20} strokeWidth={2.5} /> : <LayoutGrid size={20} strokeWidth={2.5} />}
                  </div>
                  <div>
                    <h2 className="text-base md:text-xl font-black text-slate-800 tracking-tight line-clamp-1">
                      {searchQuery ? `ค้นหา: "${searchQuery}"` : (selectedCategory === 'All' ? 'สินค้าทั้งหมด' : selectedCategory)}
                    </h2>
                    <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      พบสินค้า <span className="text-purple-600">{(products.length).toLocaleString()}</span> รายการ
                    </p>
                  </div>
                </div>
                
                {/* 📱 Mobile Filter Button */}
                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center justify-center p-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors border border-purple-100"
                >
                  <Filter size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 md:gap-4 bg-slate-50 p-1.5 rounded-xl md:rounded-2xl border border-slate-100 w-full md:w-auto">
                <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 text-slate-400">
                  <ListFilter size={16} />
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Sort:</span>
                </div>
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-white border-none rounded-lg md:rounded-xl px-2 md:px-4 py-2 md:py-2.5 text-[10px] md:text-xs font-black text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer shadow-sm w-full md:w-auto"
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
            <div className="pt-6 md:pt-10">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                loading={loading}
              />
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;