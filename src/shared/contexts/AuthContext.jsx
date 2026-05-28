import { createContext, useState, useContext, useEffect } from 'react';
import { getMeApi, logoutApi } from '@/modules/auth/services/authApi';

/**
 * 🔐 Global Auth Context
 * จัดการสิทธิ์การเข้าถึงและความปลอดภัยของแอปพลิเคชัน
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ตรวจสอบสถานะการล็อกอินเมื่อเปิดแอป (Check Auth Me)
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // 🛡️ Single Source of Truth: ดึงข้อมูลจาก Server เสมอ
                const res = await getMeApi();
                if (res.success) {
                    setUser(res.data);
                }
            } catch (error) {
                console.warn('User not authenticated (Initial check)');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = (userData) => {
        // ✅ เก็บแค่ใน State (ความปลอดภัยสูง)
        setUser(userData);
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // 🧹 ล้าง State ทุกกรณี
            setUser(null);
            localStorage.clear();
            sessionStorage.clear();
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
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
