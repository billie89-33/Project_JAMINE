import { useState, useEffect, useCallback } from 'react';
import { getAdminCategoryCoversApi, upsertCategoryCoverApi } from '../services/categoryCoverApi';
import { getCategoriesApi } from '@/modules/products/services/productApi';
import { toast } from 'react-hot-toast';

export const useCategoryCovers = () => {
  const [categories, setCategories] = useState([]);
  const [coversMap, setCoversMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ดึงรายชื่อหมวดหมู่ทั้งหมด และภาพปกปัจจุบัน
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [catsRes, coversRes] = await Promise.all([
        getCategoriesApi(),
        getAdminCategoryCoversApi()
      ]);

      const rawCats = Array.isArray(catsRes) ? catsRes : (catsRes?.data || []);
      const catsList = rawCats.map(c => typeof c === 'object' ? c.name : c);

      const coversData = Array.isArray(coversRes) ? coversRes : (coversRes?.data || []);
      const cMap = {};
      coversData.forEach(item => {
        cMap[item.categoryName] = item.image?.url;
      });

      setCategories(catsList);
      setCoversMap(cMap);
    } catch (error) {
      console.error('Fetch Category Covers Error:', error);
      toast.error('ไม่สามารถดึงข้อมูลภาพปกหมวดหมู่ได้');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // จัดการอัปโหลดภาพปกใหม่
  const handleUploadCover = async (categoryName, file) => {
    if (!file) return false;

    const formData = new FormData();
    formData.append('image', file);

    setIsSubmitting(true);
    try {
      const res = await upsertCategoryCoverApi(categoryName, formData);
      if (res?.success || res?.data || res) {
        toast.success(`อัปเดตภาพปกหมวดหมู่ ${categoryName} สำเร็จ! ✨`);
        fetchData();
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'อัปเดตภาพปกไม่สำเร็จ');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    categories,
    coversMap,
    isLoading,
    isSubmitting,
    handleUploadCover,
    refreshData: fetchData
  };
};
