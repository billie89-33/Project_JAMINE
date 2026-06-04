import { useState, useEffect } from 'react';
import { useProductActions } from './useProductActions';
import { CATEGORIES, PRODUCT_STATUS } from '@/shared/constants';

/**
 * 🎣 useAddProduct Hook (Smart Logic)
 * รวบรวม State และ Logic ทั้งหมดของฟอร์มเพิ่มสินค้าไว้ที่นี่
 * เพื่อให้ UI Component (ProductForm) เป็น "Dumb Component" อย่างแท้จริง
 */
export const useAddProduct = () => {
    // 💾 1. State ข้อมูลทั่วไป
    const [modelName, setModelName] = useState('');
    const [brand, setBrand] = useState(''); // 🆕 เพิ่มฟิลด์แบรนด์
    const [description, setDescription] = useState(''); 
    const [sku, setSku] = useState('');
    const [tags, setTags] = useState(''); // 🏷️ Tag Processing Pattern: เตรียมไว้เป็น String เพื่อแยกด้วยคอมม่า
    const [stock, setStock] = useState(1); 
    const [price, setPrice] = useState(''); // เปลี่ยนจาก regularPrice เป็น price ให้ตรง Backend
    const [category, setCategory] = useState(CATEGORIES[1]); // Default: Keyboard
    const [status, setStatus] = useState(PRODUCT_STATUS.ACTIVE); // 🆕 เพิ่มสถานะสินค้า
    const [isFeatured, setIsFeatured] = useState(false); // 🆕 เพิ่มสินค้าแนะนำ

    // 💾 2. State คุมข้อมูลไฟล์ภาพ
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    // 💾 3. State คุม Specs ย่อยเฉพาะหมวดหมู่
    const [specifications, setSpecifications] = useState({});

    // 🚀 4. เรียกใช้ Action Hook สำหรับการส่ง API
    const { handleAddProduct, isSubmitting } = useProductActions();

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
        setCategory(CATEGORIES[1]);
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
        
        // Handlers
        handleFileSelect,
        handleSpecChange,
        handleSubmit
    };
};
