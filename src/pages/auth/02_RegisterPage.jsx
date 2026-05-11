import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  // 1. สร้าง State สำหรับเก็บข้อมูลลงทะเบียน
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2. ฟังก์ชันจัดการเมื่อกดยืนยันการสมัครสมาชิก
  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (password !== confirmPassword) {
      alert("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    // 🚀 [แนวทางอนาคต]: ใส่คำสั่งส่งข้อมูลไปเซิร์ฟเวอร์เพื่อสมัครสมาชิกจริงที่จุดนี้
    // ตัวอย่าง: axios.post('/api/auth/register', { username, email, password })

    alert("สมัครสมาชิกจำลองสำเร็จ!");

    // เมื่อสมัครเสร็จ พาผู้ใช้ไปหน้าล็อกอินโดยอัตโนมัติ
    navigate("/login");
  };

  return (
    <div className="space-y-6 text-white animate-in fade-in duration-200">
      {/* ส่วนหัวข้อข้อความต้อนรับด้านบน */}
      <div className="text-center space-y-1">
        <NavLink
          to="/"
          className="absolute top-4 left-5 flex items-center gap-1.5 text-[11px] font-bold text-white hover:text-purple-600 transition-colors group"
        >
          {/* ไอคอนลูกศรย้อนกลับสไตล์โปร่งสบายตา */}
          <svg
            xmlns="w3.org"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-3 h-3 bg-amber-800 transition-transform group-hover:-translate-x-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Back to Home
        </NavLink>

        <h3 className="text-lg font-black tracking-wide text-purple-900">
          Create Account
        </h3>
        <p className="text-xs text-purple-200/60 text-purple-700">
          ร่วมเป็นสมาชิกเพื่อสัมผัสประสบการณ์ช้อปปิ้งที่ดีที่สุด
        </p>
      </div>

      {/* ตัวกล่องฟอร์มสีขาวตัดขอบมนลึก (สไตล์แมตช์เข้าชุดกับ LoginPage) */}
      <form
        onSubmit={handleRegisterSubmit}
        className="bg-white rounded-3xl p-6 shadow-2xl text-slate-800 space-y-3.5"
      >
        <h4 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
          Sign Up
        </h4>

        {/* ช่อง ชื่อผู้ใช้งาน */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ชื่อผู้ใช้งานของคุณ"
            className="w-full bg-slate-50 border border-slate-100 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-purple-600 transition-colors"
            required
          />
        </div>

        {/* ช่อง อีเมล */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Your Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            className="w-full bg-slate-50 border border-slate-100 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-purple-600 transition-colors"
            required
          />
        </div>

        {/* ช่อง รหัสผ่าน */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // ✨ สลับชนิดแท็กตาม State
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-100 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-purple-600 transition-colors pr-10"
              required
            />
            {/* ปุ่มดวงตาสำหรับช่อง Password */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition-colors text-xs [&::-ms-reveal]:hidden"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* ช่อง ยืนยันรหัสผ่าน */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"} // ✨ สลับชนิดแท็กตาม State ตัวที่สอง
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-100 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-purple-600 transition-colors pr-10 [&::-ms-reveal]:hidden"
              required
            />
            {/* ปุ่มดวงตาสำหรับช่อง Confirm Password */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 transition-colors text-xs"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* ปุ่มกดส่งฟอร์ม */}
        <button
          type="submit"
          className="w-full bg-[#130933] hover:bg-purple-900 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-md mt-3"
        >
          Sign Up
        </button>

        {/* ลิงก์สลับหน้าเด้งกลับไปที่หน้า Login */}
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
    </div>
  );
};

export default RegisterPage;
