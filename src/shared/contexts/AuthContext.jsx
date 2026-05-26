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
                // พยายามดึงข้อมูลจาก Server (ถ้าใช้ HttpOnly Cookie)
                const res = await getMeApi();
                if (res.success) {
                    setUser(res.data);
                }
            } catch (error) {
                // ถ้าดึงจาก Server ไม่ได้ ลองเช็ค LocalStorage (Fallback)
                const savedUser = JSON.parse(localStorage.getItem('user'));
                if (savedUser) setUser(savedUser);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
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
