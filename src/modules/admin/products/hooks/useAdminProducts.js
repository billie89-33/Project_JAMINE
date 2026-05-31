import { useState, useEffect, useCallback } from 'react';
import { getAdminProducts, deleteProduct } from '../../services/productApi';
import toast from 'react-hot-toast';

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
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        category: selectedCategory === 'All' ? undefined : selectedCategory
      };
      
      const response = await getAdminProducts(params);
      
      if (response.success) {
        setProducts(response.data);
        setTotal(response.total);
        setTotalPages(response.totalPages || Math.ceil(response.total / 10));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('ไม่สามารถโหลดข้อมูลสินค้าได้');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handler สำหรับการเปลี่ยนหมวดหมู่
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // รีเซ็ตไปหน้า 1 เสมอเมื่อเปลี่ยนหมวดหมู่
  };

  // Handler สำหรับการลบสินค้า
  const handleDeleteProduct = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้าชิ้นนี้?')) {
      try {
        const response = await deleteProduct(id);
        if (response.success) {
          toast.success('ลบสินค้าสำเร็จ');
          fetchProducts(); // โหลดข้อมูลใหม่
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
    isLoading,
    handleCategoryChange,
    handleDeleteProduct,
    refreshProducts: fetchProducts
  };
};
