import { NavLink } from 'react-router-dom';
import { LoginForm } from '../../components/features/auth';

const LoginPage = () => {
  return (
    <div className="space-y-6 text-white animate-in fade-in duration-200">
      
      {/* ข้อความต้อนรับด้านบนตัวฟอร์ม */}
      <div className="text-center space-y-1">
         <NavLink 
          to="/" 
          className="absolute top-4 left-5 flex items-center gap-1.5 text-[11px] font-bold text-white hover:text-purple-600 transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 transition-transform group-hover:-translate-x-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </NavLink>

        <h3 className="text-lg font-black tracking-wide text-purple-700">Welcome Back</h3>
        <p className="text-xs text-purple-500">เข้าสู่ระบบบัญชีของคุณเพื่อดำเนินการช้อปปิ้งต่อ</p>
      </div>

      <div className="pt-8">
        <LoginForm />
      </div>

    </div>
  );
};

export default LoginPage;
