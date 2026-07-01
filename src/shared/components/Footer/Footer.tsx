import React from 'react';
import { NavLink } from 'react-router-dom';
import logoImg from "../../../assets/LOGO pink new.png"; // เช็ค path รูปโลโก้ให้ตรงกับเครื่องคุณครับ

const Footer: React.FC = () => {
  return (
    <footer className="bg-purple-700 text-white pt-0 pb-0 px-6 md:px-12 border-t border-slate-200/20 text-xs relative mt-auto">
      
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pb-4">
        
        

        <div className="space-y-1">
          <div className="flex items-center ">
            <img 
              src={logoImg} 
              alt="Jamine Logo" 
              className="w-30 h-30 object-contain"
            />
            
          </div>

          <div className="text-amber-50 leading-relaxed font-medium ">
            <p>Yada Building, 52 Silom Road,</p>
            <p>Suriyawong, Bangrak,</p>
            <p>Bangkok 10500</p>
            <p className="mt-2">Tel. (662) 231-2244</p>
            <p>
              Email.{' '}
              <a 
                href="mailto:jamine@XXX.com" 
                className="underline hover:text-white transition-colors"
              >
                jamine@XXX.com
              </a>
            </p>
          </div>
        </div>



        
        <div className="space-y-3 mt-0 md:mt-30">
          <h3 className="text-xs font-black text-amber-50 uppercase tracking-wider">
            Customer Service
          </h3>

          <ul className="space-y-2 font-medium">
            <li>
              <NavLink 
                to="/how-to-order" 
                className={({ isActive }) => 
                  `transition-colors hover:text-white ${isActive ? 'text-white font-bold' : 'text-black'}`
                }
              >
                How to order
              </NavLink>
            </li>


            <li>
              <NavLink 
                to="/contact-us" 
                className={({ isActive }) => 
                  `transition-colors hover:text-white ${isActive ? 'text-white font-bold' : 'text-black'}`
                }
              >
                Contact us
              </NavLink>
            </li>
          </ul>
        </div>

        
        
        <div className="hidden md:block"></div>

      </div>

      
      

      <div className="w-full  border-t border-purple-950/10 flex absolute bottom-0 right-1 justify-end">
        <div className="bg-white text-slate-700 px-4 py-2 rounded-tl-xl rounded-br-xl shadow-sm text-[10px] font-medium tracking-wide">
          © 2024 Shadcn/studio, Made with <span className="text-red-500">❤️</span> for a better web.
        </div>
      </div>

    </footer>
  );
};

export default Footer;
