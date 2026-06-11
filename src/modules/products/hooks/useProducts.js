import { useState, useEffect, useCallback } from 'react';
import { getProductsApi, getCategoriesApi, getBrandsApi, getSpecFiltersApi } from '../services/productApi';
import { toast } from 'react-hot-toast';

/**
 * 🎣 useProducts Hook (User Side Logic)
 * จัดการสถานะสินค้า ตัวกรอง และการแบ่งหน้าสำหรับหน้าบ้าน
 */
export const useProducts = (rawInitialCategory = '', initialKeyword = '') => {
  // Decode URL Parameters เพื่อความชัวร์
  const initialCategory = rawInitialCategory ? decodeURIComponent(rawInitialCategory) : 'All';
  const decodedKeyword = initialKeyword ? decodeURIComponent(initialKeyword) : '';

  // 1. Product Data State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // 2. Filter Master Data (จาก DB)
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [specFilters, setSpecFilters] = useState({}); // 🆕 โครงสร้าง Advance Filter

  // 3. User Selected Filters
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchKeyword, setSearchKeyword] = useState(decodedKeyword);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedSpecs, setSelectedSpecs] = useState({}); // 🆕 สิ่งที่ User ติ๊กเลือก
  const [sort, setSort] = useState('newest');

  // 🔄 Sync: เมื่อ URL Parameters เปลี่ยน ให้รีเซ็ต State ภายใน
  useEffect(() => {
    // กรณีเปลี่ยนหมวดหมู่
    if (initialCategory && initialCategory !== selectedCategory) {
      setSelectedCategory(initialCategory);
      setSearchKeyword(''); // ล้างคำค้นหาเมื่อเลือกหมวดหมู่ใหม่
      resetFilters();
    }
  }, [initialCategory]);

  useEffect(() => {
    // กรณีมีการค้นหาใหม่
    if (decodedKeyword !== searchKeyword) {
      setSearchKeyword(decodedKeyword);
      setSelectedCategory('All'); // กลับไปหน้าสินค้าทั้งหมดเพื่อค้นหาแบบกว้าง
      resetFilters();
    }
  }, [decodedKeyword]);

  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedSpecs({});
    setCurrentPage(1);
  };

  // --- 🛰️ API Calls ---

  // ดึงข้อมูล Master Data (Categories & Brands & SpecFilters)
  const fetchMasterData = useCallback(async () => {
    try {
      // 🛡️ Safe Fetch: แยกดัก Error แต่ละตัว ป้องกัน Promise.all พังทั้งยวงถ้า API ตัวใดตัวนึงล่ม
      const fetchCategories = getCategoriesApi().catch(e => { console.error("Cat API Error", e); return { success: false }; });
      const fetchBrands = getBrandsApi(selectedCategory !== 'All' ? selectedCategory : undefined).catch(e => { console.error("Brand API Error", e); return { success: false }; });
      const fetchSpecs = getSpecFiltersApi(selectedCategory).catch(e => { console.error("Spec API Error", e); return { success: false }; });

      const [catRes, brandRes, specRes] = await Promise.all([fetchCategories, fetchBrands, fetchSpecs]);
      
      if (catRes && catRes.success) setCategories(catRes.data || []);
      if (brandRes && brandRes.success) setBrands(brandRes.data || []);
      if (specRes && specRes.success) setSpecFilters(specRes.data || {});
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
        keyword: searchKeyword || undefined, // 🔍 ส่งคำค้นหาไปที่ API
        // แปลง Array ของ Brand เป็น String คั่นด้วยจุลภาค เพื่อให้ Backend นำไป `$in` หรือ `$or` ได้ง่าย
        brand: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined,
        sort: sort
      };

      // 🆕 แนบ Dynamic Specs เข้าไปใน params
      Object.keys(selectedSpecs).forEach(key => {
        if (selectedSpecs[key] && selectedSpecs[key].length > 0) {
          // ใช้ format spec_Key=Value1,Value2
          params[`spec_${key}`] = selectedSpecs[key].join(',');
        }
      });

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
  }, [currentPage, selectedCategory, selectedBrands, priceRange, selectedSpecs, sort]);

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

  // 🆕 Handler สำหรับการติ๊กเลือก Advance Filter
  const handleSpecToggle = (specKey, value) => {
    setSelectedSpecs(prev => {
      const currentValues = prev[specKey] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value) // เอาออกถ้าติ๊กซ้ำ
        : [...currentValues, value];             // เพิ่มถ้ายังไม่ได้ติ๊ก
      
      return { ...prev, [specKey]: newValues };
    });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 100000 });
    setSelectedSpecs({}); // 🆕 ล้าง Advance Filter
    setSort('newest');
    setCurrentPage(1);
  };

  return {
    // Data
    products,
    loading,
    categories,
    brands,
    specFilters, // 🆕 ส่งออกข้อมูลตัวกรอง
    totalPages,
    currentPage,
    
    // States
    selectedCategory,
    selectedBrands,
    priceRange,
    selectedSpecs, // 🆕 ส่งออกสถานะการเลือก
    sort,

    // Setters/Handlers
    setCurrentPage,
    setSelectedCategory,
    handleBrandToggle,
    handlePriceChange,
    handleSpecToggle, // 🆕 ส่งออก Handler
    setSort,
    clearAllFilters,
    refreshProducts: fetchProducts
  };
};
