import { useState, useEffect, useCallback } from 'react';
import { 
    createNewsApi, 
    updateNewsApi, 
    getNewsByIdApi,
    getNewsCategoriesApi,
    NewsCategory
} from '@/modules/admin/services';
import { News } from '@/types';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * 🎣 useNewsForm Hook
 * จัดการ State ของฟอร์มสร้าง/แก้ไขข่าวสาร
 * Audit: Added useCallback for handlers and fixed effect dependencies.
 */
export const useNewsForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(!!id);
    const [categories, setCategories] = useState<NewsCategory[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        isPublished: true,
        isFeatured: false
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // 1. Load Categories
    const fetchCategories = useCallback(async () => {
        try {
            const res = await getNewsCategoriesApi();
            if (res.success) setCategories(res.data || []);
        } catch (error) {
            console.error(error);
        }
    }, []);

    // 2. Load Existing News Data (Edit Mode)
    const fetchNewsData = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const res = await getNewsByIdApi(id);
            if (res.success) {
                const originalNews = res.data;
                setFormData({
                    title: originalNews.title,
                    category: originalNews.category?._id || (typeof originalNews.category === 'string' ? originalNews.category : ''),
                    content: originalNews.content || '',
                    isFeatured: !!(originalNews as { isFeatured?: boolean }).isFeatured,
                    isPublished: !!originalNews.isPublished,
                });
                setImagePreview(originalNews.image?.url || null);
            }
        } catch (error) {
            toast.error('Failed to load news article');
            navigate('/admin/news');
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchCategories();
        fetchNewsData();
    }, [fetchCategories, fetchNewsData]);

    // 3. Handle Inputs
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string | boolean; type?: string; checked?: boolean } }) => {
        const target = e.target as { name: string; value: string | boolean; type?: string; checked?: boolean };
        const { name, value, type, checked } = target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? !!checked : value
        }));
    }, []);

    const handleContentChange = useCallback((value: string) => {
        setFormData(prev => ({ ...prev, content: value }));
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }, []);

    // 4. Submit Form
    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!formData.title || !formData.category || !formData.content) {
            return toast.error('Please fill in all required fields');
        }

        if (!id && !selectedFile) {
            return toast.error('Please upload a cover image');
        }

        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('category', formData.category);
            data.append('content', formData.content);
            data.append('isPublished', String(formData.isPublished));
            
            if (selectedFile) {
                data.append('image', selectedFile);
            }

            let res;
            if (id) {
                res = await updateNewsApi(id, data);
                if (res.success) toast.success('Article updated successfully!');
            } else {
                res = await createNewsApi(data);
                if (res.success) toast.success('Article published successfully!');
            }

            if (res.success) {
                navigate('/admin/news');
            }
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to save article');
        } finally {
            setIsSubmitting(false);
        }
    }, [id, formData, selectedFile, navigate]);

    return {
        formData,
        categories,
        isLoading,
        isSubmitting,
        imagePreview,
        handleChange,
        handleContentChange,
        handleFileChange,
        handleSubmit,
        isEditMode: !!id
    };
};
