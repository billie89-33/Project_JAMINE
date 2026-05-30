import { useState, useEffect } from 'react';
import { useProductActions } from './useProductActions';

/**
 * 🎣 useAddProduct Hook (Smart Logic)
 * รวบรวม State และ Logic ทั้งหมดของฟอร์มเพิ่มสินค้าไว้ที่นี่
 * เพื่อให้ UI Component (ProductForm) เป็น "Dumb Component" อย่างแท้จริง
 */
export const useAddProduct = () => {
    // 💾 1. State ข้อมูลทั่วไป
    const [modelName, setModelName] = useState('');
    const [description, setDescription] = useState(''); // 🆕 เพิ่มฟิลด์รายละเอียดสินค้า
    const [sku, setSku] = useState('');
    const [tags, setTags] = useState('');
    const [stock, setStock] = useState(1); // เปลี่ยนจาก quantity เป็น stock
    const [regularPrice, setRegularPrice] = useState('');
    const [category, setCategory] = useState('Keyboard');

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
        setDescription('');
        setSku(''); 
        setTags(''); 
        setStock(1); 
        setRegularPrice('');
        setSelectedFile(null); 
        setImagePreview(null); 
        setCategory('Keyboard');
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
            modelName, description, sku, tags, stock, regularPrice, category, selectedFile, specifications
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
        description, setDescription,
        sku, setSku,
        tags, setTags,
        stock, setStock,
        regularPrice, setRegularPrice,
        category, setCategory,
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
