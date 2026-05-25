import { createContext, useState, useContext, useEffect } from 'react';

// 1. สร้าง Context สำหรับระบบสมาชิก
export const AuthContext = createContext(); 

// 2. Provider Component สำหรับหุ้มแอปพลิเคชัน
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ตรวจเช็คข้อมูลจาก LocalStorage ตอนเปิดแอป
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) setUser(savedUser);
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook สำหรับการเรียกใช้งาน Context (รวมไว้ในไฟล์เดียวแบบ Modular)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) { 
    throw new Error("useAuth must be used within an AuthProvider"); 
  }
  return context;
};
