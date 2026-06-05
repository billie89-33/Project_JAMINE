import { useState, useEffect } from 'react';
import { useProductActions } from './useProductActions';
import { PRODUCT_STATUS } from '@/shared/constants';
import { useApi } from '@/shared/hooks/useApi';
import { getCategoriesApi, getBrandsApi, getSpecKeysApi } from '@/modules/products/services/productApi';

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
    
    // 💾 3. State คุม Specs เป็น Array ของ Object เพื่อการ Render UI ที่เสถียร (ป้องกัน Input เสีย Focus)
    const [specifications, setSpecifications] = useState([]);

    // 🚀 4. เรียกใช้ Action Hook สำหรับการส่ง API
    const { handleAddProduct, isSubmitting } = useProductActions();

    // 🌐 5. ดึงข้อมูล Master Data สำหรับ Auto-suggest (Datalist)
    const { data: categoriesList, execute: fetchCategories } = useApi(getCategoriesApi);
    const { data: brandsList, execute: fetchBrands } = useApi(getBrandsApi);
    const { execute: fetchSpecKeys } = useApi(getSpecKeysApi, {
        onSuccess: (keys) => {
            // Smart Auto-fill: สร้างช่องรอไว้ให้เลยถ้าดึง keys มาได้
            if (keys && keys.length > 0) {
                const initialSpecs = keys.map((k, index) => ({
                    id: `spec_auto_${Date.now()}_${index}`, // Unique ID สำหรับ React Key
                    key: k.key || k,
                    value: ''
                }));
                setSpecifications(initialSpecs);
            } else {
                setSpecifications([]);
            }
        }
    });

    // ดึงหมวดหมู่ทั้งหมดครั้งแรกที่โหลดหน้า
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // ดึงแบรนด์และ Template Spec ใหม่ทุกครั้งที่หมวดหมู่เปลี่ยน
    // (หมายเหตุ: ในอนาคตอาจปรับให้ดึงเมื่อ OnBlur เพื่อลดการยิง API ตอนพิมพ์ทีละตัวอักษร)
    useEffect(() => {
        fetchBrands(category || undefined);
        if (category) {
            fetchSpecKeys(category);
        } else {
            setSpecifications([]);
        }
    }, [category, fetchBrands, fetchSpecKeys]);

    // --- Handlers ---

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file)); 
    };

    const handleAddSpecRow = () => {
        setSpecifications(prev => [
            ...prev, 
            { id: `spec_manual_${Date.now()}`, key: '', value: '' }
        ]);
    };

    const handleSpecChange = (id, field, newValue) => {
        setSpecifications(prev => prev.map(spec => 
            spec.id === id ? { ...spec, [field]: newValue } : spec
        ));
    };

    const handleRemoveSpec = (id) => {
        setSpecifications(prev => prev.filter(spec => spec.id !== id));
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
        setSpecifications([]);
    };

    /**
     * จัดการการส่งฟอร์ม
     */
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        if (!selectedFile) {
            return alert('กรุณาเลือกรูปภาพสินค้าก่อนกดบันทึกครับ');
        }

        // แปลง Array กลับเป็น Object ก่อนส่งให้ Backend (ทิ้งแถวที่ไม่มี Key)
        const specsObject = {};
        specifications.forEach(spec => {
            const trimmedKey = spec.key.trim();
            if (trimmedKey) {
                specsObject[trimmedKey] = spec.value;
            }
        });
        
        const rawData = {
            modelName, brand, description, sku, tags, stock, price, category, status, isFeatured, selectedFile, 
            specifications: JSON.stringify(specsObject) // ส่งเป็น JSON String ตาม Blueprint
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
        handleAddSpecRow,
        handleSpecChange,
        handleRemoveSpec,
        handleSubmit
    };
};
