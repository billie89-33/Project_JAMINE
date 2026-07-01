import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getMeApi, logoutApi } from '@/modules/auth/services/authApi';
import { USER_ROLES } from '@/shared/constants';
import { User } from '@/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<User>;
}

/**
 * 🔐 Global Auth Context
 * จัดการสิทธิ์การเข้าถึงและความปลอดภัยของแอปพลิเคชัน
 */
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // 🔄 ฟังก์ชันดึงข้อมูลผู้ใช้ใหม่ (Sync Global State)
    const refreshUser = async (): Promise<User> => {
        try {
            const res = await getMeApi();
            // 🛡️ Resilient Success Check: รองรับทั้งแบบมี res.success หรือส่ง User Object (res._id) มาตรงๆ
            if (res && res.success !== false) {
                const userData = (res.data || res) as User;
                setUser(userData);
                return userData;
            }
            throw new Error('Invalid user response format');
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            throw error; // 🛡️ โยน Error ออกไปเพื่อให้ checkAuthStatus ดักจับและจัดการ Fallback/Mock ได้ถูกต้อง
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

    const login = (userData: User) => {
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
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
