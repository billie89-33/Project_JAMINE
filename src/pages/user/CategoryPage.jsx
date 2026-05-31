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
    <div className="w-full min-h-screen bg-slate-50/50 pb-20">
      
      {/* 1. Top Section: Banner & Categories Slider */}
      <div className="bg-white border-b border-purple-50 pb-10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-6 space-y-10">
          <HeroBanner />
          <CategorySlider />
        </div>
      </div>

      {/* 2. Main Content: Sidebar + Grid */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* ⬅️ Sidebar: ตัวกรองด้านซ้าย */}
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

          {/* ➡️ Main Area: Header + Grid + Pagination */}
          <main className="flex-grow space-y-8">
            
            {/* Grid Header / Toolbar */}
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
                    พบสินค้า <span className="text-purple-600">{(products.length).toLocaleString()}</span> รายการในหน้านี้
                  </p>
                </div>
              </div>

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

            {/* Product Grid Container */}
            <ProductGrid 
              products={products}
              loading={loading}
            />

            {/* Pagination Container */}
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