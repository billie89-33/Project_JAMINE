import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '@/modules/admin/services/productApi';
import toast from 'react-hot-toast';

/**
 * 🎣 useEditProduct Hook (Surgical Logic)
 * จัดการการดึงข้อมูลและอัปเดตสินค้าแบบเจาะจงรายฟิลด์
 */
export const useEditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [originalProduct, setOriginalProduct] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    modelName: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    status: 'active',
    isFeatured: false,
    specifications: {}
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. ดึงข้อมูลสินค้าเดิมมา Pre-fill ในฟอร์ม
  const fetchProduct = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getProductById(productId);
      if (response.success) {
        const product = response.data;
        setOriginalProduct(product);
        
        // เซ็ตข้อมูลลงฟอร์ม
        setFormData({
          brand: product.brand || '',
          modelName: product.modelName || '',
          description: product.description || '',
          price: product.price || 0,
          stock: product.stock || 0,
          category: product.category || '',
          status: product.status || 'active',
          isFeatured: !!product.isFeatured,
          specifications: product.specifications || {}
        });
        
        if (product.image?.url) {
          setImagePreview(product.image.url);
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
    fetchProduct();
  }, [fetchProduct]);

  // 2. จัดการการเปลี่ยนรูปภาพ
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 3. จัดการการเปลี่ยน Specifications
  const handleSpecChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  // 4. Surgical PATCH Logic: ตรวจสอบเฉพาะฟิลด์ที่เปลี่ยน (Dirty Check)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ใช้ FormData เพราะอาจมีการส่งรูปภาพใหม่
      const patchData = new FormData();
      let hasChanges = false;

      // ตรวจสอบฟิลด์ทั่วไป
      const fields = ['brand', 'modelName', 'description', 'price', 'stock', 'category', 'status', 'isFeatured'];
      fields.forEach(field => {
        if (formData[field] !== originalProduct[field]) {
          patchData.append(field, formData[field]);
          hasChanges = true;
        }
      });

      // ตรวจสอบ Specifications
      if (JSON.stringify(formData.specifications) !== JSON.stringify(originalProduct.specifications)) {
        patchData.append('specifications', JSON.stringify(formData.specifications));
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

      const response = await updateProduct(productId, patchData);
      
      if (response.success) {
        toast.success('อัปเดตสินค้าเรียบร้อยแล้ว');
        setOriginalProduct(response.data); // อัปเดตค่าเดิมให้ตรงกับที่เซฟล่าสุด
        setSelectedFile(null); // ล้างไฟล์ที่ค้างอยู่
      }
    } catch (error) {
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
    handleFileSelect,
    handleSpecChange,
    handleSubmit,
    refreshProduct: fetchProduct
  };
};
