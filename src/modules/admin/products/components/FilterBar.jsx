import { Search, X, Filter } from 'lucide-react';

/**
 * 🔍 FilterBar Component
 * แถบเครื่องมือรวมศูนย์: ค้นหาสินค้า + กรองตามหมวดหมู่
 */
const FilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange, 
  onClear 
}) => {
  const categories = [
    'All', 'Notebook', 'Keyboard', 'CPU', 'Monitor', 
    'Gaming Mouse', 'Graphics Card', 'RAM', 'Mainboard'
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 mb-8">
      
      {/* 1. ช่องค้นหา (Search Input) */}
      <div className="relative w-full lg:flex-1 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-600 transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="ค้นหาชื่อสินค้า, แบรนด์ หรือ SKU..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-rose-500 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* 2. ตัวเลือกหมวดหมู่ (Category Dropdown) */}
      <div className="relative w-full lg:w-72 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-purple-600 transition-colors">
          <Filter size={18} />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full pl-11 pr-10 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-black appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 shadow-sm cursor-pointer transition-all"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'หมวดหมู่ทั้งหมด' : cat}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {/* 3. ปุ่มล้างค่า (Clear Button) - แสดงเมื่อมีการเลือก Filter อะไรบางอย่าง */}
      {(searchTerm || selectedCategory !== 'All') && (
        <button
          onClick={onClear}
          className="w-full lg:w-auto px-6 py-4 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <X size={18} />
          ล้างตัวกรอง
        </button>
      )}
    </div>
  );
};

export default FilterBar;
