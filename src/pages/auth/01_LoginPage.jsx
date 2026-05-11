import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, NavLink } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // 1. สร้าง State สำหรับรับค่าฟอร์มและคุมการเปิด/ปิดตาดูรหัสผ่าน
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 2. ฟังก์ชันจัดการระบบล็อกอิน (ดักเช็คและเตรียมส่งให้ API อนาคต)
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    // 🚀 [แนวทางอนาคต]: เปลี่ยนจุดนี้เป็นการยิง API ไปยังเซิร์ฟเวอร์หลังบ้าน
    // ตัวอย่าง: axios.post('/api/auth/login', { email, password }).then(res => login(res.data))
    
    // จำลองการเข้าสู่ระบบเสร็จสิ้น (ลองเปลี่ยนบทบาทสิทธิ์เป็น 'gm' เพื่อทดสอบเมนูหลังบ้านได้ครับ)
    login({
      email: email,
      role: 'user', 
      token: 'mock-jwt-token-abcd-1234'
    });

    // พากลับไปหน้าแรกสุด (Home) ทันทีหลังล็อกอินผ่าน
    navigate('/');
  };

  return (
    <div className="space-y-6 text-white animate-in fade-in duration-200">
      
      {/* ข้อความต้อนรับด้านบนตัวฟอร์ม */}
      <div className="text-center space-y-1">

         <NavLink 
          to="/" 
          className="absolute top-4 left-5 flex items-center gap-1.5 text-[11px] font-bold text-white hover:text-purple-600 transition-colors group"
        >
          <svg xmlns="w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 transition-transform group-hover:-translate-x-0.5 bg-amber-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </NavLink>

        <h3 className="text-lg font-black tracking-wide text-purple-700">Welcome Back</h3>
        <p className="text-xs text-purple-500">เข้าสู่ระบบบัญชีของคุณเพื่อดำเนินการช้อปปิ้งต่อ</p>
      </div>

      
      <form 
        onSubmit={handleLoginSubmit} 
        className="bg-white rounded-3xl p-6 shadow-2xl text-slate-800 space-y-3.5 relative pt-12"
      >
        

        <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">Sign In</h4>
        
        {/* ช่องข้อมูลที่ 1: อีเมล */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            className="w-full bg-slate-50 border border-slate-100 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-purple-600 transition-colors"
            required
          />
        </div>

        {/* ช่องข้อมูลที่ 2: รหัสผ่าน (พร้อมปุ่มเปิด/ปิดตาซ่อนพาสเวิร์ด) */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-100 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-purple-600 transition-colors pr-10"
              required
            />
            {/* ปุ่มรูปดวงตาสำหรับกดสลับดูรหัสผ่าน */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition-colors text-xs [&::-ms-reveal]:hidden"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* ปุ่มกดส่งข้อมูลยืนยันตัวตน */}
        <button
          type="submit"
          className="w-full bg-[#130933] hover:bg-purple-900 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-md mt-3"
        >
          Sign In
        </button>

        {/* ลิงก์สลับหน้าเด้งเปลี่ยนไปที่หน้า Register */}
        <p className="text-[10px] text-center text-slate-400 pt-2 border-t border-slate-50">
          Don't have an account?{' '}
          <NavLink to="/register" className="text-purple-600 font-bold hover:underline">
            Sign Up
          </NavLink>
        </p>
      </form>

    </div>
  );
};

export default LoginPage;