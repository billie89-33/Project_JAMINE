import { useState, useEffect, useCallback } from 'react';
import { 
    getNewsApi, 
    deleteNewsApi, 
    updateNewsApi, 
    getNewsCategoriesApi 
} from '@/modules/admin/services';
import toast from 'react-hot-toast';

/**
 * 🎣 useNews Hook
 * จัดการ Logic ทั้งหมดของระบบบทความข่าวสาร (Admin)
 */
export const useNews = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [newsList, setNewsList] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Filters
    const [page, setPage] = useState(1);
    const [categoryId, setCategoryId] = useState('');
    const [isPublished, setIsPublished] = useState('all');
    const [keyword, setKeyword] = useState('');

    // 1. Fetch News List
    const fetchNews = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page,
                limit: 10,
                keyword: keyword.trim() || undefined,
                categoryId: categoryId || undefined,
                isPublished: isPublished === 'all' ? undefined : isPublished
            };
            const res = await getNewsApi(params);
            if (res.success) {
                setNewsList(res.data || []);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch news');
        } finally {
            setIsLoading(false);
        }
    }, [page, categoryId, isPublished, keyword]);

    // ระบบ Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchNews();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchNews]);

    // 2. Fetch Categories for Dropdown
    const fetchCategories = useCallback(async () => {
        try {
            const res = await getNewsCategoriesApi();
            if (res.success) {
                setCategories(res.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // 3. Toggle Published Status
    const togglePublished = async (id, currentStatus) => {
        setIsActionLoading(true);
        try {
            const res = await updateNewsApi(id, { isPublished: !currentStatus });
            if (res.success) {
                toast.success('News status updated');
                fetchNews();
            }
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setIsActionLoading(false);
        }
    };

    // 4. Delete News
    const handleDeleteNews = async (id) => {
        if (!window.confirm('Are you sure you want to delete this news article?')) return;
        
        setIsActionLoading(true);
        try {
            const res = await deleteNewsApi(id);
            if (res.success) {
                toast.success('News article deleted');
                fetchNews();
            }
        } catch (error) {
            toast.error('Failed to delete news');
        } finally {
            setIsActionLoading(false);
        }
    };

    return {
        isLoading,
        isActionLoading,
        newsList,
        categories,
        page, setPage,
        categoryId, setCategoryId,
        isPublished, setIsPublished,
        keyword, setKeyword,
        togglePublished,
        handleDeleteNews,
        refresh: fetchNews
    };
};
