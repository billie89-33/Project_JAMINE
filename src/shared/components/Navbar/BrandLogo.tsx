import { NavLink } from 'react-router-dom';
import logoImg from "../../../assets/LOGO pink new.png";

const BrandLogo = () => {
  return (
    <NavLink to="/" className="flex items-center gap-3 cursor-pointer group">
      <img 
        src={logoImg}  
        alt="Brand Logo" 
        className="ml-4 w-14 h-14 object-contain scale-250"
      />
      
    </NavLink>
  );
};

export default BrandLogo;