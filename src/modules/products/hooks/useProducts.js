import { useState, useEffect, useCallback } from 'react';
import { getProductsApi, getCategoriesApi, getBrandsApi } from '../services/productApi';
import toast from 'react-hot-toast';

/**
 * 🎣 useProducts Hook (User Side Logic)
 * จัดการสถานะสินค้า ตัวกรอง และการแบ่งหน้าสำหรับหน้าบ้าน
 */
export const useProducts = (initialCategory = '') => {
  // 1. Product Data State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // 2. Filter Master Data (จาก DB)
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // 3. User Selected Filters
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sort, setSort] = useState('newest');

  // 🔄 Sync: เมื่อ URL Parameter (initialCategory) เปลี่ยน ให้รีเซ็ต State ภายใน
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      // รีเซ็ตตัวกรองอื่นเมื่อเปลี่ยนหมวดหมู่ผ่าน URL เพื่อความไม่งงของ User
      setSelectedBrands([]);
      setCurrentPage(1);
    }
  }, [initialCategory]);

  // --- 🛰️ API Calls ---

  // ดึงข้อมูล Master Data (Categories & Brands)
  const fetchMasterData = useCallback(async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        getCategoriesApi(),
        getBrandsApi(selectedCategory !== 'All' ? selectedCategory : undefined)
      ]);
      
      if (catRes.success) setCategories(catRes.data);
      if (brandRes.success) setBrands(brandRes.data);
    } catch (error) {
      console.error("Failed to fetch master data", error);
    }
  }, [selectedCategory]);

  // ดึงรายการสินค้าพร้อม Filter
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        category: selectedCategory === 'All' || !selectedCategory ? undefined : selectedCategory,
        brand: selectedBrands.length > 0 ? selectedBrands : undefined,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined,
        sort: sort
      };

      const response = await getProductsApi(params);
      if (response.success) {
        setProducts(response.data);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      toast.error("ไม่สามารถดึงข้อมูลสินค้าได้");
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, selectedBrands, priceRange, sort]);

  // --- 🔄 Effects ---

  // ดึง Master Data เมื่อ Component Mount หรือเปลี่ยน Category
  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  // ดึงสินค้าเมื่อ Filter หรือ Page เปลี่ยน
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- 🛠️ Handlers ---

  const handleBrandToggle = (brandName) => {
    setSelectedBrands(prev => 
      prev.includes(brandName) 
        ? prev.filter(b => b !== brandName) 
        : [...prev, brandName]
    );
    setCurrentPage(1); // รีเซ็ตหน้า
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 100000 });
    setSort('newest');
    setCurrentPage(1);
  };

  return {
    // Data
    products,
    loading,
    categories,
    brands,
    totalPages,
    currentPage,
    
    // States
    selectedCategory,
    selectedBrands,
    priceRange,
    sort,

    // Setters/Handlers
    setCurrentPage,
    setSelectedCategory,
    handleBrandToggle,
    handlePriceChange,
    setSort,
    clearAllFilters,
    refreshProducts: fetchProducts
  };
};
