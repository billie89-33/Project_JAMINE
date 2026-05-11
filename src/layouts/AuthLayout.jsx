import { Outlet } from "react-router-dom";
import logoImg from "../assets/LOGO pink new.png";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#9898ee] flex items-center justify-center p-0 md:p-6 select-none">
      <div className="w-full max-w-5xl min-h-screen md:min-h-[600px] bg-[#130933] md:rounded-3xl shadow-2xl shadow-purple-950/40 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-[#1b0b46] to-[#130933] text-white text-center relative border-r border-purple-950/30">
          <div className="max-w-xs space-y-6">


            <div className="w-48 h-48 rounded-2xl overflow-hidden mx-auto flex items-center justify-center bg-purple-50/5 border border-purple-200/20 shadow-lg shadow-purple-500/5">
              <img
                src={logoImg} // ✨ เรียกใช้ตัวแปรภาพโลโก้ที่คุณ import ไว้ด้านบน
                alt="JAMINE Auth Logo"
                className="w-full h-full p-4 object-contain" // p-4 ช่วยเว้นระยะขอบรอบรูปให้ดูสมส่วน คลีน ๆ
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-wide text-purple-300">
                "Welcome to JAMINE"
              </h2>

              <p className="text-xs text-purple-200/60 leading-relaxed font-medium">
                Find products around you, you can search and buy premium devices
                as you wish.
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0b061f]/60 to-transparent"></div>
        </div>

        <div className="flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 bg-[#130933]">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
