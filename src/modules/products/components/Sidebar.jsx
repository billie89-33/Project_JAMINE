import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

/**
 * 🏔️ Sidebar Filter Component
 * ส่วนควบคุมการกรองสินค้าด้านซ้าย (User Side)
 */
const Sidebar = ({ 
  categories, 
  brands, 
  selectedCategory, 
  setSelectedCategory,
  selectedBrands, 
  onBrandToggle, 
  priceRange, 
  onPriceChange,
  onClearAll 
}) => {
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);

  return (
    <div className="w-full lg:w-72 flex flex-col gap-6 select-none">
      
      {/* 1. Header & Clear Button */}
      <div className="flex items-center justify-between bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2">
          <span className="bg-purple-600 text-white p-1.5 rounded-lg shadow-lg shadow-purple-100">
            <Filter size={14} strokeWidth={3} />
          </span>
          <h2 className="font-black text-slate-800 uppercase tracking-widest text-sm">Filters</h2>
        </div>
        <button 
          onClick={onClearAll}
          className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-all"
        >
          Clear All
        </button>
      </div>

      {/* 2. Category Selection (Horizontal Pills on Mobile, Vertical List on Desktop) */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Categories</h3>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
              selectedCategory === 'All' || !selectedCategory
                ? 'bg-purple-600 text-white shadow-xl shadow-purple-100 translate-x-1'
                : 'text-slate-500 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            📂 ทั้งหมด
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-xl shadow-purple-100 translate-x-1'
                  : 'text-slate-500 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Brand Filter (Accordion) */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <button 
          onClick={() => setIsBrandOpen(!isBrandOpen)}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
        >
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Brands</h3>
          <span className="text-slate-300">
            {isBrandOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>
        
        {isBrandOpen && (
          <div className="px-6 pb-6 pt-2 grid grid-cols-1 gap-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-100">
            {brands.map(brand => (
              <label 
                key={brand}
                className="group flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-purple-50 transition-all border border-transparent hover:border-purple-100"
              >
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => onBrandToggle(brand)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 border-2 border-slate-200 rounded-lg bg-white peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all duration-300 group-hover:border-purple-300 shadow-sm"></div>
                  <div className="absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                    <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                  </div>
                </div>
                <span className={`text-sm font-bold transition-colors ${selectedBrands.includes(brand) ? 'text-purple-600' : 'text-slate-600'}`}>
                  {brand}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 4. Price Filter */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <button 
          onClick={() => setIsPriceOpen(!isPriceOpen)}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
        >
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Price Range</h3>
          <span className="text-slate-300">
            {isPriceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {isPriceOpen && (
          <div className="px-8 pb-8 pt-2 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Min</span>
                  <input 
                    type="number" 
                    value={priceRange.min}
                    onChange={(e) => onPriceChange(Number(e.target.value), priceRange.max)}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Max</span>
                  <input 
                    type="number" 
                    value={priceRange.max}
                    onChange={(e) => onPriceChange(priceRange.min, Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>
              
              {/* Range Visualization (Progress Bar style) */}
              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-gradient-to-r from-purple-400 to-purple-600"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Sidebar;
