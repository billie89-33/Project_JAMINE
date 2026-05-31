/**
 * 🏷️ CategoryFilter Component
 * แถบเลือกหมวดหมู่สินค้าแบบเม็ดยา (Pills)
 */
const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    'All', 'Notebook', 'Keyboard', 'CPU', 'Monitor', 
    'Gaming Mouse', 'Graphics Card', 'RAM', 'Mainboard'
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8 bg-white/50 p-2 rounded-2xl backdrop-blur-sm border border-purple-50">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            selectedCategory === cat
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200 scale-105'
              : 'bg-white text-slate-500 hover:bg-purple-50 hover:text-purple-600 border border-transparent hover:border-purple-100'
          }`}
        >
          {cat === 'All' ? '📂 ทั้งหมด' : cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
