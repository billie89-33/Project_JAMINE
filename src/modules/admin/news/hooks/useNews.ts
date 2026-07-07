import { useState, useEffect, useCallback } from 'react';
import { 
    getNewsApi, 
    deleteNewsApi, 
    updateNewsApi, 
    getNewsCategoriesApi,
    NewsCategory 
} from '@/modules/admin/services';
import { News } from '@/types';
import toast from 'react-hot-toast';

/**
 * 🎣 useNews Hook
 * จัดการ Logic ทั้งหมดของระบบบทความข่าวสาร (Admin)
 */
export const useNews = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [newsList, setNewsList] = useState<News[]>([]);
    const [categories, setCategories] = useState<NewsCategory[]>([]);
    
    // Filters
    const [page, setPage] = useState(1);
    const [categoryId, setCategoryId] = useState('');
    const [isPublished, setIsPublished] = useState('all');
    const [keyword, setKeyword] = useState('');

    // 1. Fetch News List
    const fetchNews = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: Record<string, string | number | boolean | undefined> = {
                page,
                limit: 10,
                search: keyword.trim() || undefined,
                category: categoryId || undefined,
                isPublished: isPublished === 'all' ? undefined : isPublished === 'true'
            };
            const res = await getNewsApi(params);
            if (res.success && res.data) {
                const data = res.data;
                let finalNews: News[] = [];
                
                if (Array.isArray(data)) {
                    finalNews = data;
                } else if (data && Array.isArray((data as any).news)) {
                    finalNews = (data as any).news;
                } else if (data && Array.isArray((data as any).data)) {
                    finalNews = (data as any).data;
                }
                
                setNewsList(finalNews);
            } else {
                setNewsList([]);
            }
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Failed to fetch news');
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCategories();
    }, [fetchCategories]);

    // 3. Toggle Published Status
    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        setIsActionLoading(true);
        try {
            const res = await updateNewsApi(id, { isPublished: !currentStatus });
            if (res.success) {
                toast.success('News status updated');
                fetchNews();
            }
        } catch {
            toast.error('Failed to update status');
        } finally {
            setIsActionLoading(false);
        }
    };

    // 4. Delete News
    const handleDeleteNews = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this news article?')) return;
        
        setIsActionLoading(true);
        try {
            const res = await deleteNewsApi(id);
            if (res.success) {
                toast.success('News article deleted');
                fetchNews();
            }
        } catch {
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
        togglePublished: handleToggleStatus,
        handleDeleteNews,
        refresh: fetchNews
    };
};
