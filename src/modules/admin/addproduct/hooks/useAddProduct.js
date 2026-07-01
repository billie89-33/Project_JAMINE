import { useState, useEffect } from 'react';
import { useProductActions } from './useProductActions';
import { PRODUCT_STATUS } from '@/shared/constants';
import { useApi } from '@/shared/hooks/useApi';
import { getCategoriesApi, getBrandsApi, getProductsApi } from '@/modules/products/services/productApi';
import { toast } from 'react-hot-toast';

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

    // ดึงหมวดหมู่ทั้งหมดครั้งแรกที่โหลดหน้า
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // ดึงแบรนด์และ Template Spec ใหม่ทุกครั้งที่หมวดหมู่เปลี่ยน
    useEffect(() => {
        if (!category) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSpecifications([]);
            return;
        }

        // 🛡️ 1. ดึงแบรนด์ทันที (เพื่อ datalist)
        fetchBrands(category);
        
        // ⏳ 2. ใช้ Debounce (500ms) สำหรับการดึง Spec Template
        // เพื่อป้องกันการ "Auto-wipe" หรือหน้าจอกระตุกขณะกำลังพิมพ์หมวดหมู่ใหม่
        const timer = setTimeout(() => {
            const fetchSpecTemplateFromLatest = async () => {
                try {
                    // 🔮 Smart Auto-fill: ดึง Template สเปคจาก "สินค้าล่าสุด" ในหมวดหมู่นี้
                    const res = await getProductsApi({ category, limit: 1, sort: 'newest' });
                    
                    if (res.success && res.data && res.data.length > 0) {
                        const latestProduct = res.data[0];
                        let parsedSpecs = {};
                        
                        // จัดการเรื่อง Parse JSON (ป้องกัน Double Stringify ที่อาจหลงเหลือในระบบเก่า)
                        if (typeof latestProduct.specifications === 'string') {
                            try {
                                parsedSpecs = JSON.parse(latestProduct.specifications);
                                if (typeof parsedSpecs === 'string') parsedSpecs = JSON.parse(parsedSpecs);
                            } catch (e) {
                                console.warn("Failed to parse specifications", e);
                            }
                        } else if (latestProduct.specifications) {
                            parsedSpecs = latestProduct.specifications;
                        }

                        const keys = Object.keys(parsedSpecs);
                        if (keys.length > 0) {
                            // 💡 สร้าง Template: เอามาแค่ Key ส่วน Value ให้ว่างไว้เพื่อให้แอดมินกรอกใหม่ได้ง่าย
                            const templateSpecs = keys.map((k, index) => ({
                                id: `template_${Date.now()}_${index}`,
                                key: k,
                                value: ''
                            }));
                            setSpecifications(templateSpecs);
                        }
                    } else {
                        // 🛡️ หัวใจการแก้บัค: หากเป็นหมวดหมู่ใหม่ (ไม่พบสินค้าล่าสุด)
                        // ให้ "คงข้อมูลเดิมที่ผู้ใช้พิมพ์ไว้" ห้ามสั่งล้างเป็น [] เด็ดขาด
                        console.log("New category detected or no template found. Preserving current specs.");
                    }
                } catch (error) {
                    console.error("Failed to fetch spec template", error);
                    // ไม่ล้างข้อมูลกรณี Error เช่นกัน เพื่อความเสถียร
                }
            };

            fetchSpecTemplateFromLatest();
        }, 500);

        return () => clearTimeout(timer); // เคลียร์ timer ทุกครั้งที่ Category เปลี่ยน
    }, [category, fetchBrands]);

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
            return toast.error('กรุณาเลือกรูปภาพสินค้าก่อนกดบันทึกครับ');
        }

        // แปลง Array เป็น Object เพื่อส่งให้ Action Hook (ตัดแถวที่ไม่มี Key ทิ้ง)
        const specsObject = {};
        specifications.forEach(spec => {
            const trimmedKey = spec.key.trim();
            if (trimmedKey) {
                specsObject[trimmedKey] = spec.value;
            }
        });
        
        const rawData = {
            modelName, brand, description, sku, tags, stock, price, category, status, isFeatured, selectedFile, 
            specifications: specsObject // ส่งเป็น Object เพื่อให้ useProductActions นำไป Clean และ Stringify ต่อ
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
