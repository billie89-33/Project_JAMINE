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

  // 📝 Form State: ปรับมาใช้ Object เพื่อความสอดคล้องกับ Register และขยายง่าย
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  
  // 🧹 Status State: ใช้ onSuccess option เพื่อลด Logic ใน Submit function
  const { loading, error, setError, execute: loginRequest } = useApi(loginApi, {
    onSuccess: (userData, res) => {
      console.log('✅ Login successful:', { userData, res });
      // 🛡️ Resilient Success Check: รองรับทั้งแบบมี res.success หรือส่ง User Object มาตรงๆ
      if (res.success !== false) {
        const userPayload = res.data || userData || res;
        setAuthUser(userPayload);
        navigate('/', { replace: true });
      } else {
        setError(res.message || 'Login failed');
      }
    },
    onError: (msg) => {
      console.error('❌ Login error:', msg);
    }
  });

  const toggleShowPassword = () => setShowPassword(!showPassword);

  /**
   * จัดการการเปลี่ยนแปลงค่าในฟอร์ม
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();

    // 🛡️ 1. Validation: แจ้งเตือน User ถ้าลืมกรอกข้อมูล
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
      return;
    }

    // 🚀 2. ยิง API (Logic ความสำเร็จถูกจัดการใน onSuccess ของ useApi แล้ว)
    try {
      await loginRequest(formData.email, formData.password);
    } catch (err) {
      // Error ทั่วไปถูกจัดการใน useApi (setError) แล้ว
      console.error('Login flow error:', err);
    }
  };

  return {
    formData,
    handleChange,
    showPassword,
    toggleShowPassword,
    loading,
    error,
    handleLoginSubmit
  };
};
