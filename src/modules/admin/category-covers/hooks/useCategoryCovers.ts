import { useState, useEffect, useCallback } from 'react';
import { getAdminCategoryCoversApi, upsertCategoryCoverApi } from '../services/categoryCoverApi';
import { getCategoriesApi } from '@/modules/products/services/productApi';
import { toast } from 'react-hot-toast';

export const useCategoryCovers = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [coversMap, setCoversMap] = useState<Record<string, string>>({});
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
      const catsList = rawCats.map((c: { name: string } | string) => typeof c === 'object' ? c.name : c);

      const coversData = Array.isArray(coversRes) ? coversRes : (coversRes?.data || []);
      const cMap: Record<string, string> = {};
      coversData.forEach((item: { categoryName: string; image?: { url: string } }) => {
        if (item.image?.url) {
           cMap[item.categoryName] = item.image.url;
        }
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  // จัดการอัปโหลดภาพปกใหม่
  const handleUploadCover = async (categoryName: string, file: File | null) => {
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
      const errMsg = error instanceof Error ? error.message : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'อัปเดตภาพปกไม่สำเร็จ';
      toast.error(errMsg);
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
