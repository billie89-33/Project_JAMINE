import { createContext, useState, useContext, useEffect } from 'react';
import { getMeApi, logoutApi } from '@/modules/auth/services/authApi';
import { USER_ROLES } from '@/shared/constants';

/**
 * 🔐 Global Auth Context
 * จัดการสิทธิ์การเข้าถึงและความปลอดภัยของแอปพลิเคชัน
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔄 ฟังก์ชันดึงข้อมูลผู้ใช้ใหม่ (Sync Global State)
    const refreshUser = async () => {
        try {
            const res = await getMeApi();
            if (res.success) {
                setUser(res.data);
                return res.data;
            }
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            return null;
        }
    };

    // ตรวจสอบสถานะการล็อกอินเมื่อเปิดแอป (Check Auth Me)
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                await refreshUser();
            } catch (error) {
                console.warn('User not authenticated (Initial check)');

                // 🧪 Safe Dev Mock
                if (import.meta.env.DEV && import.meta.env.VITE_DEV_MOCK_ADMIN === 'true') {
                    console.log('🛠️ [Dev Mode] Mocking Admin session for testing...');
                    setUser({
                        _id: 'dev-mock-admin-id',
                        username: 'Dev_Admin',
                        email: 'admin@test.com',
                        role: USER_ROLES.ADMIN,
                        addresses: []
                    });
                } else {
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.clear();
            sessionStorage.clear();
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom Hook เพื่อการเรียกใช้งานที่สั้นลง
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
