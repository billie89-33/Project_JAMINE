import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createProduct } from '@/modules/admin/services';

/**
 * 🎣 useAddProduct Hook
 * Smart Logic สำหรับจัดการหน้าเพิ่มสินค้า
 * รองรับ Dynamic Specifications และการตรวจสอบข้อมูลเบื้องต้น
 */
export const useAddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 📝 State หลักของฟอร์มตาม Product Model
    const [formData, setFormData] = useState({
        brand: '',
        modelName: '',
        price: '',
        sku: '',
        category: 'Notebook', // Default category
        stock: 0,
        image: {
            url: '',
            publicId: 'temp_id' // Placeholder จนกว่าจะมีระบบ Upload
        }
    });

    // 🛠️ State พิเศษสำหรับจัดการ Specifications (Array of Objects สำหรับ UI)
    const [specList, setSpecList] = useState([{ key: '', value: '' }]);

    /**
     * จัดการการเปลี่ยนแปลงข้อมูลทั่วไป
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    /**
     * จัดการการอัปเดต URL รูปภาพ
     */
    const handleImageUrlChange = (url) => {
        setFormData(prev => ({
            ...prev,
            image: { ...prev.image, url }
        }));
    };

    /**
     * จัดการการเพิ่ม/ลบ/แก้ไข Specifications
     */
    const addSpecField = () => setSpecList([...specList, { key: '', value: '' }]);
    
    const removeSpecField = (index) => {
        const newList = specList.filter((_, i) => i !== index);
        setSpecList(newList.length > 0 ? newList : [{ key: '', value: '' }]);
    };

    const handleSpecChange = (index, field, value) => {
        const newList = [...specList];
        newList[index][field] = value;
        setSpecList(newList);
    };

    /**
     * ฟังก์ชันส่งข้อมูล (Submit)
     */
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            // 🔄 1. Transform specList (Array) -> specifications (Map/Object)
            const specifications = specList.reduce((acc, curr) => {
                if (curr.key && curr.value) {
                    acc[curr.key] = curr.value;
                }
                return acc;
            }, {});

            // 📦 2. รวมข้อมูลทั้งหมดเตรียมส่ง API
            const finalData = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                specifications
            };

            // 🚀 3. ยิง API ตัวแม่
            const response = await createProduct(finalData);

            if (response.success) {
                toast.success('สร้างสินค้าใหม่สำเร็จ!');
                navigate('/admin/products'); // กลับหน้าหลัก
            }
        } catch (error) {
            console.error('Create product error:', error);
            const errorMsg = error.response?.data?.message || 'ไม่สามารถสร้างสินค้าได้ กรุณาลองใหม่';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        specList,
        loading,
        handleChange,
        handleImageUrlChange,
        handleSpecChange,
        addSpecField,
        removeSpecField,
        handleSubmit
    };
};
