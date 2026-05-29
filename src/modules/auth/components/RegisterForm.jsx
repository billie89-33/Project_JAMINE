import { NavLink } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";

/**
 * 🎨 RegisterForm (UI Component)
 * เน้นการแสดงผล ส่วน Logic ทั้งหมดถูกดึงไปไว้ใน useRegister Hook
 */
const RegisterForm = () => {
  // 🎣 ดึงสมอง (Logic) มาจาก Hook
  const {
    formData,
    handleChange,
    showPassword,
    showConfirmPassword,
    togglePassword,
    toggleConfirmPassword,
    loading,
    error,
    handleRegisterSubmit
  } = useRegister();

  return (
    <form
      onSubmit={handleRegisterSubmit}
      className="bg-white rounded-3xl p-6 shadow-2xl text-slate-800 space-y-3.5"
    >
      {/* ⚠️ การแสดง Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs animate-shake">
          {error}
        </div>
      )}

      <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
        Sign Up
      </h4>

      {/* 👤 Username */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="ชื่อผู้ใช้งานของคุณ"
          className="w-full bg-slate-50 border border-slate-100 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-purple-600 transition-colors"
          required
        />
      </div>

      {/* 📧 Email */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Your Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@mail.com"
          className="w-full bg-slate-50 border border-slate-100 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-purple-600 transition-colors"
          required
        />
      </div>

      {/* 🔑 Password */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-slate-50 border border-slate-100 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-purple-600 transition-colors pr-10"
            required
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition-colors text-xs"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      {/* 🔑 Confirm Password */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-slate-50 border border-slate-100 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-purple-600 transition-colors pr-10"
            required
          />
          <button
            type="button"
            onClick={toggleConfirmPassword}
            className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition-colors text-xs"
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      {/* 🚀 ปุ่ม Sign Up */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#130933] hover:bg-purple-900 disabled:bg-slate-400 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-md mt-3 active:scale-95"
      >
        {loading ? "กำลังสมัครสมาชิก..." : "Sign Up"}
      </button>

      <p className="text-[10px] text-center text-slate-400 pt-2 border-t border-slate-50">
        Already have an account?{" "}
        <NavLink
          to="/login"
          className="text-purple-600 font-bold hover:underline"
        >
          Sign In
        </NavLink>
      </p>
    </form>
  );
};

export default RegisterForm;
