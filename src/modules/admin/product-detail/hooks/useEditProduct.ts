import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '@/modules/admin/services';
import { toast } from 'react-hot-toast';
import { PRODUCT_STATUS } from '@/shared/constants';
import { useApi } from '@/shared/hooks/useApi';
import { getCategoriesApi } from '@/modules/products/services/productApi';

/**
 * 🎣 useEditProduct Hook (Surgical Logic)
 * จัดการการดึงข้อมูลและอัปเดตสินค้าแบบเจาะจงรายฟิลด์
 */
export const useEditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [originalProduct, setOriginalProduct] = useState(null);
  const [formData, setFormData] = useState<any>({
    brand: '',
    modelName: '',
    description: '',
    sku: '',
    price: 0,
    stock: 0,
    category: '',
    tags: '', // 🏷️ เก็บเป็น String เพื่อให้ UI แก้ไขได้ง่าย
    status: PRODUCT_STATUS.ACTIVE,
    isFeatured: false,
    specifications: [] // เปลี่ยนเป็น Array เพื่อใช้กับ SpecFields
  });

  const [imagePreview, setImagePreview] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🌐 ดึงข้อมูล Master Data สำหรับ Auto-suggest (Datalist)
  const { data: categoriesList, execute: fetchCategories } = useApi(getCategoriesApi);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 1. ดึงข้อมูลสินค้าเดิมมา Pre-fill ในฟอร์ม
  const fetchProduct = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getProductById(productId as string);
      if (response.success && response.data) {
        // 🛡️ Defensive Check: ป้องกันกรณี Backend ส่งมาเป็น { product: {...} } แทนที่จะเป็น {...}
        const responseData = response.data as { product?: Record<string, string | number | boolean | object> };
        const product = responseData.product || response.data || {};
        
        // 🛡️ Safe Parse Specifications: ดักกรณี Backend ส่งมาเป็น JSON String
        let parsedSpecs = {};
        if (typeof product.specifications === 'string') {
          try {
            parsedSpecs = JSON.parse(product.specifications);
            // เคส double stringify
            if (typeof parsedSpecs === 'string') parsedSpecs = JSON.parse(parsedSpecs);
          } catch (e) {
            console.error("Parse specifications error:", e);
          }
        } else if (product.specifications && typeof product.specifications === 'object') {
          parsedSpecs = product.specifications;
        }

        // อัปเดตข้อมูลในออบเจกต์ต้นฉบับให้เป็น Object จริงๆ เพื่อใช้ทำ Dirty Check (JSON.stringify เทียบกัน)
        product.specifications = parsedSpecs;
        setOriginalProduct(product as any);
        
        // แปลง Specs Object เป็น Array สำหรับ UI
        const specsArray = Object.entries(parsedSpecs)
          .map(([key, value], index) => ({
            id: `spec_${Date.now()}_${index}`,
            key,
            value
          }));

        // เซ็ตข้อมูลลงฟอร์ม พร้อม Fallback กันพัง
        setFormData({
          brand: product.brand || '',
          modelName: product.modelName || '',
          description: product.description || '',
          price: product.price || 0,
          stock: product.stock || 0,
          category: product.category || '',
          sku: product.sku || '',
          tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''), 
          status: product.status || PRODUCT_STATUS.ACTIVE,
          isFeatured: !!product.isFeatured,
          specifications: specsArray
        });
        
        if ((product as any).image?.url) {
          setImagePreview((product as any).image.url);
        }
      }
    } catch (error) {
      toast.error('ไม่สามารถดึงข้อมูลสินค้าได้');
      navigate('/admin/products');
    } finally {
      setIsLoading(false);
    }
  }, [productId, navigate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProduct();
  }, [fetchProduct]);

  // 2. จัดการการเปลี่ยนรูปภาพ
  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 3. จัดการการเปลี่ยน Specifications (ใช้ pattern เดียวกับ addproduct)
  const handleSpecChange = (id: string, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      specifications: prev.specifications.map((spec: any) => 
        spec.id === id ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const handleAddSpecRow = () => {
    setFormData((prev: any) => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        { id: `spec_manual_${Date.now()}`, key: '', value: '' }
      ]
    }));
  };

  const handleRemoveSpec = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      specifications: prev.specifications.filter((spec: any) => spec.id !== id)
    }));
  };

  // 4. Surgical PATCH Logic: ตรวจสอบเฉพาะฟิลด์ที่เปลี่ยน (Dirty Check)
  const handleSubmit = async (e?: any) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      // ใช้ FormData เพราะอาจมีการส่งรูปภาพใหม่
      const patchData = new FormData();
      let hasChanges = false;

      // ตรวจสอบฟิลด์ทั่วไป (พร้อม Clean ข้อมูลตัวเลข และรวม SKU)
      const fields = ['brand', 'modelName', 'description', 'sku', 'price', 'stock', 'category', 'status', 'isFeatured'];
      fields.forEach(field => {
        let value = formData[field];
        
        // 🧼 Numeric Sanitization: ลบคอมม่าและทำให้เป็นตัวเลขที่คลีนก่อนส่ง
        if (field === 'price' || field === 'stock') {
          value = Number(String(value).replace(/,/g, '')) || 0;
        }

        if (value !== (originalProduct as any)?.[field]) {
          patchData.append(field, value);
          hasChanges = true;
        }
      });

      // 🏷️ Tag Processing Pattern: จัดการ Tags ให้เป็น Array ที่คลีน
      const currentTags = (formData.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean);
      const originalTags = Array.isArray((originalProduct as any)?.tags) ? (originalProduct as any).tags : [];
      if (JSON.stringify(currentTags) !== JSON.stringify(originalTags)) {
        patchData.append('tags', JSON.stringify(currentTags));
        hasChanges = true;
      }

      // แปลง Specs Array กลับเป็น Object เพื่อเช็คการเปลี่ยนแปลง
      const currentSpecsObj = formData.specifications.reduce((acc: any, spec: any) => {
        if (spec.key.trim()) {
          acc[spec.key.trim()] = spec.value;
        }
        return acc;
      }, {});

      if (JSON.stringify(currentSpecsObj) !== JSON.stringify((originalProduct as any)?.specifications)) {
        patchData.append('specifications', JSON.stringify(currentSpecsObj));
        hasChanges = true;
      }

      // ตรวจสอบรูปภาพ
      if (selectedFile) {
        patchData.append('image', selectedFile);
        hasChanges = true;
      }

      if (!hasChanges) {
        toast.success('ข้อมูลไม่มีการเปลี่ยนแปลง');
        setIsSubmitting(false);
        return;
      }

      const response = await updateProduct(productId as string, patchData);
      
      if (response.success) {
        toast.success('อัปเดตสินค้าเรียบร้อยแล้ว');
        // รีเฟรชข้อมูลเพื่ออัปเดต originalProduct
        await fetchProduct();
        setSelectedFile(null); 
      }
    } catch (error: any) {
      console.error("Update Product Error:", error);
      toast.error(error.response?.data?.message || 'อัปเดตไม่สำเร็จ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    imagePreview,
    isLoading,
    isSubmitting,
    categoriesList,
    handleFileSelect,
    handleSpecChange,
    handleAddSpecRow,
    handleRemoveSpec,
    handleSubmit,
    refreshProduct: fetchProduct
  };
};
