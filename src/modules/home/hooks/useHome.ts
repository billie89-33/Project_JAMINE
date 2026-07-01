/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { getBannersApi } from '../services/homeApi';

/**
 * 🎣 useHome Hook
 * จัดการข้อมูลหน้าแรก และแบนเนอร์ตามตำแหน่ง
 */
export const useHome = (placement: string = 'home_hero') => {
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBanners = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getBannersApi(placement);
            if (res.success) {
                setBanners(res.data);
            }
        } catch (error) {
            console.error(`Failed to fetch banners for ${placement}`, error);
            setBanners([]);
        } finally {
            setLoading(false);
        }
    }, [placement]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBanners();
    }, [fetchBanners]);

    return { banners, loading, refreshBanners: fetchBanners };
};
