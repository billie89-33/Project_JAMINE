import { NavLink } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';

/**
 * 🎨 LoginForm (UI Component)
 * เน้นการแสดงผลเท่านั้น ส่วน Logic ทั้งหมดถูกดึงไปไว้ใน useLogin Hook
 */
const LoginForm = () => {
  // 🎣 ดึงสมอง (Logic) มาจาก Hook
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    loading,
    error,
    handleLoginSubmit
  } = useLogin();

  return (
    <form 
      onSubmit={handleLoginSubmit} 
      className="bg-white rounded-3xl p-6 shadow-2xl text-slate-800 space-y-3.5 relative"
    >
      {/* ⚠️ การแสดง Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs animate-shake">
          {error}
        </div>
      )}

      <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">Sign In</h4>
      
      {/* 📧 อีเมล */}
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

      {/* 🔑 รหัสผ่าน */}
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
            onClick={toggleShowPassword}
            className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition-colors text-xs"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      {/* 🚀 ปุ่ม Sign In */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#130933] hover:bg-purple-900 disabled:bg-slate-400 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-md mt-3 active:scale-95"
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
