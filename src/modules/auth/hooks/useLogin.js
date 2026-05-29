import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useApi } from '@/shared/hooks/useApi'; // 🛠️ เรียกใช้แม่บ้านส่วนกลาง
import { loginApi } from '../services/authApi';

/**
 * 🎣 useLogin Hook (Refactored with useApi)
 * จัดการ Logic ของการเข้าสู่ระบบโดยใช้ useApi เพื่อลด Code ซ้ำซ้อน
 */
export const useLogin = () => {
  const { login: setAuthUser } = useAuth();
  const navigate = useNavigate();

  // 📝 Form State (ยังต้องเก็บเองเพราะเป็นข้อมูลฝั่ง UI)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // 🧹 Status State: ให้ useApi จัดการแทนทั้งหมด!
  const { loading, error, execute: loginRequest } = useApi(loginApi);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();

    // 🛡️ 1. Validation (UI Level)
    if (!email.trim() || !password.trim()) {
      return; // Error อื่นๆ useApi จะจัดการให้เอง
    }

    try {
      // 🚀 2. ยิง API ผ่านแม่บ้าน (ไม่ต้องเขียน try-catch สำหรับ setLoading/setError เองแล้ว)
      const res = await loginRequest(email, password);
      
      if (res.success) {
        setAuthUser(res.data);
        navigate('/', { replace: true });
      }
    } catch (err) {
      // ❌ Error ทั่วไปถูกจัดการใน useApi แล้ว 
      // เราใส่ catch ไว้เผื่ออยากทำ Logic พิเศษเพิ่มเติมที่นี่เท่านั้น
      console.error('Login implementation error:', err);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    loading, // มาจาก useApi
    error,   // มาจาก useApi
    handleLoginSubmit
  };
};
