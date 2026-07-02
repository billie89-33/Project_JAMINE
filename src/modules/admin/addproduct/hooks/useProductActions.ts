import { useApi } from '@/shared/hooks/useApi';
import { createProductApi } from '@/modules/admin/services';
import { useNavigate } from 'react-router-dom';

/**
 * 🎣 useProductActions Hook
 * แยกส่วนการจัดการ API Action ของโมดูล AddProduct ออกมา
 * เพื่อลดความซับซ้อนใน Component และใช้มาตรฐาน useApi ร่วมกัน
 */
export const useProductActions = () => {
    const navigate = useNavigate();

    // 🚀 ใช้ useApi จัดการการส่งข้อมูลสินค้าใหม่
    const productCreate = useApi(createProductApi, {
        showToast: true,
        successMessage: 'เพิ่มสินค้าใหม่ลงระบบสำเร็จเรียบร้อยแล้ว!',
        onSuccess: () => {
            // ย้ายไปหน้ารายการสินค้าเมื่อสร้างสำเร็จ
            navigate('/admin/products'); 
        }
    });

    /**
     * ฟังก์ชันสำหรับเตรียมข้อมูล (Transform) และส่ง API
     * @param {Object} rawData - ข้อมูลดิบจากฟอร์ม
     */
    const handleAddProduct = async (rawData) => {
        const { 
            modelName, brand, description, sku, tags, 
            stock, price, category, status, isFeatured, 
            selectedFile, specifications 
        } = rawData;

        // 🧼 1. กรองข้อมูล Specifications: ตัดช่องที่ไม่ได้กรอก หรือมีแค่ช่องว่างทิ้ง
        const cleanSpecs = Object.entries(specifications || {})
            .filter(([key, value]) => key.trim() !== "" && value !== undefined && value !== null && value.toString().trim() !== "")
            .reduce((acc, [key, value]) => ({ 
                ...acc, 
                [key]: value.toString().trim() 
            }), {});

        // 💡 2. บรรจุของลง FormData (สำหรับส่งไฟล์ภาพ)
        const formData = new FormData();
        
        // บังคับว่าต้องมีรูปภาพ
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        formData.append('brand', brand || '');
        formData.append('modelName', modelName || '');
        formData.append('description', description || '');
        
        // 🧼 2.1 จัดการ Price & Stock: ทำให้มั่นใจว่าเป็นตัวเลข
        const cleanPrice = String(price || '0').replace(/,/g, '');
        formData.append('price', String(Number(cleanPrice) || 0));
        formData.append('stock', String(Number(stock) || 0));
        
        formData.append('sku', sku || '');
        formData.append('category', category || '');
        formData.append('status', status || 'active');
        formData.append('isFeatured', String(isFeatured === 'true' || isFeatured === true));
        
        // 🧼 3. จัดการ Tags
        const tagsArray = typeof tags === 'string'
            ? tags.split(',').map(tag => tag.trim()).filter(Boolean)
            : (Array.isArray(tags) ? tags : []);
        
        formData.append('tags', JSON.stringify(tagsArray));
        
        // แปลง Object specifications เป็น JSON string
        // ถ้าเป็น Object ว่าง ให้ส่งเป็น string ว่าง หรือ {} ตามที่ Backend คาดหวัง
        formData.append('specifications', JSON.stringify(cleanSpecs));

        // 🔍 Debug: ดูข้อมูลที่จะส่งไป (ช่วยแก้บัค 500)
        console.log("🚀 Sending Product Data:", {
            modelName, category, price: Number(cleanPrice), 
            specsCount: Object.keys(cleanSpecs).length,
            tagsCount: tagsArray.length
        });

        // 🚀 4. ยิง API ผ่าน execute ของ useApi
        return await productCreate.execute(formData);
    };

    return {
        handleAddProduct,
        isSubmitting: productCreate.loading,
        error: productCreate.error
    };
};
