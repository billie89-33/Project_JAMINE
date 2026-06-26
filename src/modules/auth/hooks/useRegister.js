import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
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
  const location = useLocation();
  const { login: setAuthUser } = useAuth();

  // 📝 Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🧹 Status State: ใช้ useApi จัดการ (เปิดใช้ Toast อัตโนมัติ)
  const { loading, error, setError, execute: registerRequest } = useApi(registerApi, {
    showToast: true,
    successMessage: 'สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ Jamine',
    onSuccess: (data, res) => {
      console.log('✅ Registration successful:', { data, res });
      // 🛡️ Resilient Success Check: รองรับทั้งแบบมี res.success, มี res._id หรือ res.message
      if (res.success !== false) {
        // ทำการ Login อัตโนมัติทันทีโดยไม่ต้องเสียเวลากลับไปหน้า Login
        const userPayload = res.data || data || res;
        setAuthUser(userPayload);

        // 🚀 Auto-Return / Seamless Redirect: กลับไปจุดที่กดมา หรือไปหน้า Home
        const from = location.state?.from?.pathname || location.state?.from || '/';
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Registration failed');
      }
    },
    onError: (msg) => {
      console.error('❌ Registration error:', msg);
    }
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
    
    // 🛡️ 1. Validation (Frontend Level) - ปรับปรุงให้แจ้งเตือนรายฟิลด์เพื่อ Debug บัค
    const { username, email, password, confirmPassword } = formData;
    
    if (!username || !username.trim()) {
      setError('กรุณากรอกชื่อผู้ใช้งาน');
      return;
    }
    if (!email || !email.trim()) {
      setError('กรุณากรอกอีเมล');
      return;
    }
    if (!password || !password.trim()) {
      setError('กรุณากรอกรหัสผ่าน');
      return;
    }
    if (!confirmPassword || !confirmPassword.trim()) {
      setError('กรุณายืนยันรหัสผ่าน');
      return;
    }

    if (password !== confirmPassword) {
      setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    const payload = { 
      username: username.trim(), 
      email: email.trim(), 
      password: password,
      confirmPassword: confirmPassword 
    };

    console.log('🚀 Registration Payload being sent:', payload);

    try {
      // 🚀 2. ยิง API (ส่งครบทั้ง 4 ฟิลด์ตามที่ Backend Validation ต้องการ)
      await registerRequest(payload);
    } catch (err) {
      // 🔍 Debug: พิมพ์ Error ทั้งหมดออกมาดูเพื่อหาสาเหตุ 400 Bad Request
      if (err.response) {
        console.error('Registration Backend Error:', err.response.data);
      }
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
