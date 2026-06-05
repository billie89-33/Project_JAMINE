import { useState, useEffect } from 'react';
import { useProductActions } from './useProductActions';
import { PRODUCT_STATUS } from '@/shared/constants';
import { useApi } from '@/shared/hooks/useApi';
import { getCategoriesApi, getBrandsApi } from '@/modules/products/services/productApi';

/**
 * 🎣 useAddProduct Hook (Smart Logic)
 * รวบรวม State และ Logic ทั้งหมดของฟอร์มเพิ่มสินค้าไว้ที่นี่
 * เพื่อให้ UI Component (ProductForm) เป็น "Dumb Component" อย่างแท้จริง
 */
export const useAddProduct = () => {
    // 💾 1. State ข้อมูลทั่วไป
    const [modelName, setModelName] = useState('');
    const [brand, setBrand] = useState(''); 
    const [description, setDescription] = useState(''); 
    const [sku, setSku] = useState('');
    const [tags, setTags] = useState(''); 
    const [stock, setStock] = useState(1); 
    const [price, setPrice] = useState(''); 
    const [category, setCategory] = useState(''); // เริ่มต้นเป็นค่าว่าง ให้พิมพ์หรือเลือกเอง
    const [status, setStatus] = useState(PRODUCT_STATUS.ACTIVE); 
    const [isFeatured, setIsFeatured] = useState(false); 

    // 💾 2. State คุมข้อมูลไฟล์ภาพ
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    // 💾 3. State คุม Specs ย่อยเฉพาะหมวดหมู่
    const [specifications, setSpecifications] = useState({});

    // 🚀 4. เรียกใช้ Action Hook สำหรับการส่ง API
    const { handleAddProduct, isSubmitting } = useProductActions();

    // 🌐 5. ดึงข้อมูล Master Data สำหรับ Auto-suggest (Datalist)
    const { data: categoriesList, execute: fetchCategories } = useApi(getCategoriesApi);
    const { data: brandsList, execute: fetchBrands } = useApi(getBrandsApi);

    // ดึงหมวดหมู่ทั้งหมดครั้งแรกที่โหลดหน้า
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // ดึงแบรนด์ใหม่ทุกครั้งที่หมวดหมู่เปลี่ยน (เพื่อทำ Smart Suggestion)
    useEffect(() => {
        fetchBrands(category || undefined);
    }, [category, fetchBrands]);

    // 🔄 รีเซ็ตช่องกรอก Specs เมื่อมีการเปลี่ยนหมวดหมู่
    useEffect(() => {
        setSpecifications({});
    }, [category]);

    // --- Handlers ---

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file)); 
    };

    const handleSpecChange = (key, value) => {
        setSpecifications(prev => ({ ...prev, [key]: value }));
    };

    /**
     * เคลียร์ข้อมูลในฟอร์มทั้งหมด
     */
    const resetForm = () => {
        setModelName(''); 
        setBrand('');
        setDescription('');
        setSku(''); 
        setTags(''); 
        setStock(1); 
        setPrice('');
        setSelectedFile(null); 
        setImagePreview(null); 
        setCategory('');
        setStatus(PRODUCT_STATUS.ACTIVE);
        setIsFeatured(false);
        setSpecifications({});
    };

    /**
     * จัดการการส่งฟอร์ม
     */
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        if (!selectedFile) {
            return alert('กรุณาเลือกรูปภาพสินค้าก่อนกดบันทึกครับ');
        }
        
        const rawData = {
            modelName, brand, description, sku, tags, stock, price, category, status, isFeatured, selectedFile, specifications
        };

        const result = await handleAddProduct(rawData);
        
        if (result?.success) {
            resetForm();
        }
    };

    // ส่งค่าทั้งหมดออกไปให้ UI ใช้งาน
    return {
        // States
        modelName, setModelName,
        brand, setBrand,
        description, setDescription,
        sku, setSku,
        tags, setTags,
        stock, setStock,
        price, setPrice,
        category, setCategory,
        status, setStatus,
        isFeatured, setIsFeatured,
        selectedFile,
        imagePreview,
        specifications,
        isSubmitting,
        categoriesList,
        brandsList,
        
        // Handlers
        handleFileSelect,
        handleSpecChange,
        handleSubmit
    };
};
