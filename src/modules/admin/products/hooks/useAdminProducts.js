import { useState, useEffect, useCallback } from 'react';
import { getAdminProducts, deleteProduct } from '@/modules/admin/services/productApi';
import { toast } from 'react-hot-toast';

/**
 * 🎣 useAdminProducts Hook (Smart Logic)
 * จัดการข้อมูลรายการสินค้าสำหรับหน้า Admin
 */
export const useAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState(''); // 🆕 เพิ่มสถานะคำค้นหา
  const [debouncedSearch, setDebouncedSearch] = useState(''); // สำหรับหน่วงเวลาการค้นหา
  const [isLoading, setIsLoading] = useState(false);

  // ⏱️ Debounce Logic: หน่วงเวลา 500ms ก่อนเริ่มค้นหาจริง
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // รีเซ็ตไปหน้า 1 เมื่อมีการค้นหาใหม่
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        keyword: debouncedSearch || undefined // 🆕 ส่งคำค้นหาไปยัง Backend
      };
      
      const response = await getAdminProducts(params);
      
      if (response.success) {
        // 🛡️ Defensive Check: รองรับทั้งข้อมูลที่ส่งมาเป็น Array ตรงๆ หรือครอบใน Object
        const productsList = Array.isArray(response.data) 
            ? response.data 
            : (response.data?.products || []);
            
        setProducts(productsList);
        setTotal(response.total || response.data?.total || productsList.length);
        setTotalPages(response.totalPages || response.data?.totalPages || Math.ceil((response.total || productsList.length) / 10));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('ไม่สามารถโหลดข้อมูลสินค้าได้');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedCategory, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handler สำหรับการเปลี่ยนหมวดหมู่
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  // 🆕 Handler สำหรับการล้างตัวกรองทั้งหมด
  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Handler สำหรับการลบสินค้า
  const handleDeleteProduct = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้าชิ้นนี้?')) {
      try {
        const response = await deleteProduct(id);
        if (response.success) {
          toast.success('ลบสินค้าสำเร็จ');
          fetchProducts(); 
        }
      } catch (error) {
        toast.error('ลบสินค้าไม่สำเร็จ');
      }
    }
  };

  return {
    products,
    total,
    totalPages,
    currentPage,
    setCurrentPage,
    selectedCategory,
    searchTerm, // 🆕 ส่งออกเพื่อให้ UI ผูกค่า
    setSearchTerm, // 🆕 ส่งออกเพื่อให้ UI พิมพ์ค่า
    isLoading,
    handleCategoryChange,
    handleClearFilters, // 🆕 ส่งออกปุ่มล้างข้อมูล
    handleDeleteProduct,
    refreshProducts: fetchProducts
  };
};
