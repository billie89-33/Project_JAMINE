import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 🏔️ Sidebar Filter Component
 * ส่วนควบคุมการกรองสินค้าด้านซ้าย (User Side)
 */
const Sidebar = ({ 
  categories = [], 
  brands = [], 
  specFilters = {}, 
  selectedCategory, 
  setSelectedCategory,
  selectedBrands = [], 
  onBrandToggle, 
  selectedSpecs = {}, 
  onSpecToggle,       
  priceRange, 
  onPriceChange,
  onClearAll 
}) => {
  const navigate = useNavigate();
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [openSpecs, setOpenSpecs] = useState({});

  // 🎯 Filter Whitelist: กำหนดว่าแต่ละหมวดหมู่ ควรโชว์ตัวกรองสเปคหัวข้อไหนบ้าง
  // เพื่อไม่ให้ Sidebar ยาวเกินไปจนลูกค้าใช้งานลำบาก
  const FILTER_WHITELIST = {
    'Notebook': ['CPU', 'RAM', 'Graphic Card', 'Display Size', 'Storage'],
    'Monitor': ['Resolution', 'Refresh Rate', 'Panel Type', 'Display Size (in.)'],
    'Keyboard': ['Switch Type', 'Connectivity', 'Backlight', 'Layout'],
    'Graphics Card': ['Chipset', 'Memory Size', 'Interface'],
    'CPU': ['Socket', 'Cores/Threads', 'Base Clock'],
    'RAM': ['Type', 'Capacity', 'Speed'],
    'Mainboard': ['Socket', 'Chipset', 'Form Factor'],
    'Computer': ['CPU', 'RAM', 'Graphic Card']
  };

  const toggleSpecAccordion = (key) => {
    setOpenSpecs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCategorySelect = (cat) => {
    navigate(`/category/${cat}`);
  };

  // กรองเฉพาะหัวข้อสเปคที่อยู่ใน Whitelist ของหมวดหมู่นั้น
  const activeWhitelists = FILTER_WHITELIST[selectedCategory] || [];
  const curatedSpecKeys = Object.keys(specFilters).filter(key => 
    activeWhitelists.some(w => key.toLowerCase().includes(w.toLowerCase()))
  );

  return (
    <div className="w-full lg:w-72 flex flex-col gap-6 select-none relative">
      
      {/* 🏔️ Decorative Background Blur for Sidebar */}
      <div className="absolute -inset-2 bg-purple-100/20 blur-2xl rounded-[40px] -z-10"></div>

      {/* 1. Header & Clear Button */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-xl shadow-purple-200/20 border border-purple-50">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-purple-200">
            <Filter size={14} strokeWidth={3} />
          </div>
          <h2 className="font-black text-slate-800 uppercase tracking-[0.1em] text-xs">Smart Filters</h2>
        </div>
        <button 
          onClick={onClearAll}
          className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-all border border-transparent hover:border-rose-100"
        >
          Reset
        </button>
      </div>

      {/* 2. Category Selection (Accordion) */}
      <div className="bg-purple-50/40 backdrop-blur-sm rounded-[32px] border border-purple-100/50 shadow-sm overflow-hidden">
        <button 
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="w-full flex items-center justify-between p-6 hover:bg-white transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${isCategoryOpen ? 'bg-purple-500 animate-pulse' : 'bg-slate-300'}`}></div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Categories</h3>
          </div>
          <span className="text-slate-300">
            {isCategoryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {isCategoryOpen && (
          <div className="px-5 pb-6 pt-1 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
            <button
              onClick={() => handleCategorySelect('All')}
              className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black transition-all border ${
                selectedCategory === 'All' || !selectedCategory
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-lg shadow-purple-200 translate-x-2'
                  : 'text-slate-500 bg-white/50 border-white hover:bg-white hover:text-purple-600 hover:border-purple-100'
              }`}
            >
              📂 EXPLORE ALL
            </button>
            {categories.map(cat => {
              const name = typeof cat === 'object' ? cat.name : cat;
              return (
                <button
                  key={name}
                  onClick={() => handleCategorySelect(name)}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl text-xs font-black transition-all border ${
                    selectedCategory === name
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-lg shadow-purple-200 translate-x-2'
                      : 'text-slate-500 bg-white/50 border-white hover:bg-white hover:text-purple-600 hover:border-purple-100'
                  }`}
                >
                  {name.toUpperCase()}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Brand Filter (Accordion) */}
      <div className="bg-purple-50/40 backdrop-blur-sm rounded-[32px] border border-purple-100/50 shadow-sm overflow-hidden">
        <button 
          onClick={() => setIsBrandOpen(!isBrandOpen)}
          className="w-full flex items-center justify-between p-6 hover:bg-white transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${isBrandOpen ? 'bg-purple-500 animate-pulse' : 'bg-slate-300'}`}></div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Top Brands</h3>
          </div>
          <span className="text-slate-300">
            {isBrandOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>
        
        {isBrandOpen && (
          <div className="px-5 pb-6 pt-1 grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200">
            {brands.map(brand => (
              <label 
                key={brand}
                className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                  selectedBrands.includes(brand)
                    ? 'bg-white border-purple-100 shadow-sm'
                    : 'bg-white/30 border-transparent hover:bg-white hover:border-purple-50'
                }`}
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
                <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${selectedBrands.includes(brand) ? 'text-purple-600' : 'text-slate-500'}`}>
                  {brand}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 🆕 3.5 Dynamic Spec Filters (คัดกรองเฉพาะที่สำคัญตาม Whitelist) */}
      {curatedSpecKeys.map(specKey => {
        const isOpen = openSpecs[specKey] !== false; 
        
        return (
          <div key={specKey} className="bg-purple-50/40 backdrop-blur-sm rounded-[32px] border border-purple-100/50 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <button 
              onClick={() => toggleSpecAccordion(specKey)}
              className="w-full flex items-center justify-between p-6 hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-purple-500 animate-pulse' : 'bg-slate-300'}`}></div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] truncate max-w-[120px] text-left">
                  {specKey}
                </h3>
              </div>
              <span className="text-slate-300 flex-shrink-0">
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>
            
            {isOpen && (
              <div className="px-5 pb-6 pt-1 grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200">
                {specFilters[specKey].map(val => (
                  <label 
                    key={val}
                    className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                      (selectedSpecs[specKey] || []).includes(val)
                        ? 'bg-white border-purple-100 shadow-sm'
                        : 'bg-white/30 border-transparent hover:bg-white hover:border-purple-50'
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox"
                        checked={(selectedSpecs[specKey] || []).includes(val)}
                        onChange={() => onSpecToggle(specKey, val)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-slate-200 rounded-lg bg-white peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all duration-300 group-hover:border-purple-300 shadow-sm"></div>
                      <div className="absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                        <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                      </div>
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest transition-colors break-words line-clamp-2 ${
                      (selectedSpecs[specKey] || []).includes(val) ? 'text-purple-600' : 'text-slate-500'
                    }`}>
                      {val}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* 4. Price Filter */}
      <div className="bg-purple-50/40 backdrop-blur-sm rounded-[32px] border border-purple-100/50 shadow-sm overflow-hidden">
        <button 
          onClick={() => setIsPriceOpen(!isPriceOpen)}
          className="w-full flex items-center justify-between p-6 hover:bg-white transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${isPriceOpen ? 'bg-purple-500 animate-pulse' : 'bg-slate-300'}`}></div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Budget</h3>
          </div>
          <span className="text-slate-300">
            {isPriceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {isPriceOpen && (
          <div className="px-6 pb-8 pt-2 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 space-y-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter ml-1">Min (฿)</span>
                  <input 
                    type="number" 
                    value={priceRange.min}
                    onChange={(e) => onPriceChange(Number(e.target.value), priceRange.max)}
                    className="w-full p-3 bg-white border border-purple-50 rounded-xl text-[11px] font-black text-slate-700 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter ml-1">Max (฿)</span>
                  <input 
                    type="number" 
                    value={priceRange.max}
                    onChange={(e) => onPriceChange(priceRange.min, Number(e.target.value))}
                    className="w-full p-3 bg-white border border-purple-50 rounded-xl text-[11px] font-black text-slate-700 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 transition-all shadow-sm"
                  />
                </div>
              </div>
              
              <div className="relative h-2 bg-white/50 rounded-full border border-purple-50 overflow-hidden">
                <div 
                  className="absolute h-full bg-gradient-to-r from-purple-400 to-indigo-600 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
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
