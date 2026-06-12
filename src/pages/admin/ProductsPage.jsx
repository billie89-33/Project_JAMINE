import { FilterBar, ProductTable, useAdminProducts } from '@/modules/admin/products';
import { Pagination } from '@/shared/components';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * 🚀 ProductsPage (Admin)
 * หน้าจัดการสินค้าหลักแบบ Full-width ม่วงสดใส
 */
const ProductsPage = () => {
  const navigate = useNavigate();
  const {
    products,
    totalPages,
    currentPage,
    setCurrentPage,
    selectedCategory,
    searchTerm,
    setSearchTerm,
    isLoading,
    categoriesList,
    handleCategoryChange,
    handleClearFilters,
    handleDeleteProduct
  } = useAdminProducts();

  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-4 md:p-8">
      {/* 1. Header Section - Full Width */}
      <div className="max-w-[1600px] mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <span className="bg-purple-600 text-white p-2.5 rounded-2xl shadow-lg shadow-purple-200">📦</span>
            Product Management
          </h1>
          <p className="text-slate-400 mt-1 font-medium ml-1">จัดการรายการสินค้าในคลังและหมวดหมู่ของคุณ</p>
        </div>

        <button 
          onClick={() => navigate('/admin/add-product')}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-purple-200 hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* 2. Main Content - Full Width */}
      <div className="max-w-[1600px] mx-auto">
        
        {/* Integrated Filter Bar */}
        <FilterBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange} 
          onClear={handleClearFilters}
          categoriesList={categoriesList}
        />

        {/* Data Table */}
        <ProductTable 
          products={products} 
          onDelete={handleDeleteProduct} 
          isLoading={isLoading} 
        />

        {/* Pagination Section */}
        <div className="mt-10">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
            loading={isLoading}
          />
        </div>

      </div>
    </div>
  );
};

export default ProductsPage;
