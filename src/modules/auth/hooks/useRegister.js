import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/shared/hooks/useApi';
import { registerApi } from '../services/authApi';

/**
 * 🎣 useRegister Hook
 * สมองสำหรับจัดการการสมัครสมาชิก
 * - จัดการ State ของฟอร์ม
 * - จัดการ Validation (รวมถึงเช็ค Password ตรงกัน)
 * - ใช้ useApi เพื่อจัดการ API Call และ Toast อัตโนมัติ
 */
export const useRegister = () => {
  const navigate = useNavigate();

  // 📝 Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🧹 Status State: ให้ useApi จัดการ (เปิดใช้ Toast อัตโนมัติ)
  const { loading, error, setError, execute: registerRequest } = useApi(registerApi, {
    showToast: true,
    successMessage: 'สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ',
    onSuccess: () => navigate('/login')
  });

  /**
   * จัดการการเปลี่ยนแปลงค่าในฟอร์ม (Universal Change Handler)
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * ฟังก์ชันสลับการมองเห็นรหัสผ่าน
   */
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  /**
   * ฟังก์ชันส่งข้อมูลการสมัครสมาชิก
   */
  const handleRegisterSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // 🛡️ 1. Validation (Frontend Level)
    const { username, email, password, confirmPassword } = formData;
    
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    if (password !== confirmPassword) {
      setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      // 🚀 2. ยิง API ผ่านแม่บ้าน (useApi จะจัดการ Toast และ Navigate ให้เองตาม options)
      await registerRequest({ username, email, password });
    } catch (err) {
      // Error ถูกจัดการโดย useApi แล้ว
      console.error('Registration flow error:', err);
    }
  };

  return {
    formData,
    handleChange,
    showPassword,
    showConfirmPassword,
    togglePassword,
    toggleConfirmPassword,
    loading,
    error,
    handleRegisterSubmit
  };
};
