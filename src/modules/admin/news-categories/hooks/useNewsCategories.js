import { useState, useEffect, useCallback } from 'react';
import { 
    getNewsCategoriesApi, 
    createNewsCategoryApi, 
    updateNewsCategoryApi, 
    deleteNewsCategoryApi 
} from '@/modules/admin/services';
import toast from 'react-hot-toast';

/**
 * 🎣 useNewsCategories Hook
 * สำหรับจัดการหมวดหมู่ข่าวสาร (Admin)
 */
export const useNewsCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    
    // State สำหรับฟอร์ม (สร้าง/แก้ไข)
    const [formData, setEditFormData] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    // 1. ดึงข้อมูลทั้งหมด
    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getNewsCategoriesApi();
            if (res.success) {
                setCategories(res.data || []);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch categories');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // 2. จัดการฟอร์ม
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setEditFormData({ name: '', description: '' });
        setEditingId(null);
    }, []);

    const startEdit = useCallback((cat) => {
        setEditFormData({ name: cat.name, description: cat.description || '' });
        setEditingId(cat._id);
    }, []);

    // 3. บันทึกข้อมูล (Create/Update)
    const handleSubmit = useCallback(async (e) => {
        if (e) e.preventDefault();
        if (!formData.name.trim()) return toast.error('Please enter category name');

        setIsActionLoading(true);
        try {
            let res;
            if (editingId) {
                res = await updateNewsCategoryApi(editingId, formData);
                if (res.success) toast.success('Category updated');
            } else {
                res = await createNewsCategoryApi(formData);
                if (res.success) toast.success('Category created');
            }
            
            if (res?.success) {
                resetForm();
                fetchCategories();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        } finally {
            setIsActionLoading(false);
        }
    }, [formData, editingId, fetchCategories, resetForm]);

    // 4. ลบข้อมูล
    const handleDelete = useCallback(async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        setIsActionLoading(true);
        try {
            const res = await deleteNewsCategoryApi(id);
            if (res.success) {
                toast.success('Category deleted');
                fetchCategories();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
        } finally {
            setIsActionLoading(false);
        }
    }, [fetchCategories]);

    return {
        categories,
        isLoading,
        isActionLoading,
        formData,
        editingId,
        handleInputChange,
        handleSubmit,
        handleDelete,
        startEdit,
        resetForm
    };
};
