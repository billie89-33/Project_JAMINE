import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
import { loginApi } from '../services/authApi';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      setLoading(false);
      return;
    }

    try {
      const res = await loginApi(email, password);
      if (res.success) {
        login(res.data);
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleLoginSubmit} 
      className="bg-white rounded-3xl p-6 shadow-2xl text-slate-800 space-y-3.5 relative"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
          {error}
        </div>
      )}

      <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">Sign In</h4>
      
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
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition-colors text-xs"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#130933] hover:bg-purple-900 disabled:bg-slate-400 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-md mt-3"
      >
        {loading ? 'กำลังเข้าสู่ระบบ...' : 'Sign In'}
      </button>

      <p className="text-[10px] text-center text-slate-400 pt-2 border-t border-slate-50">
        Don't have an account?{' '}
        <NavLink to="/register" className="text-purple-600 font-bold hover:underline">
          Sign Up
        </NavLink>
      </p>
    </form>
  );
};

export default LoginForm;
