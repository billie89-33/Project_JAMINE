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
            // คุณสามารถเพิ่ม Logic เพิ่มเติมเมื่อสำเร็จที่นี่ได้ เช่นการ Redirect
            // navigate('/admin/products'); 
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
        const cleanSpecs = Object.entries(specifications)
            .filter(([_, value]) => value && value.toString().trim() !== "")
            .reduce((acc, [key, value]) => ({ 
                ...acc, 
                [key]: value.toString().trim() 
            }), {});

        // 💡 2. บรรจุของลง FormData (สำหรับส่งไฟล์ภาพ)
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('brand', brand); // ดึงจาก State โดยตรง ไม่ใช้ Mock
        formData.append('modelName', modelName);
        formData.append('description', description);
        formData.append('price', Number(price));
        formData.append('sku', sku);
        formData.append('category', category);
        formData.append('stock', Number(stock));
        formData.append('status', status);
        formData.append('isFeatured', isFeatured);
        formData.append('tags', tags);
        
        // แปลง Object specifications เป็น JSON string
        formData.append('specifications', JSON.stringify(cleanSpecs));

        // 🚀 3. ยิง API ผ่าน execute ของ useApi
        return await productCreate.execute(formData);
    };

    return {
        handleAddProduct,
        isSubmitting: productCreate.loading,
        error: productCreate.error
    };
};
