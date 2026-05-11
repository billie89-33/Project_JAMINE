import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar/01_Navbar';
import Footer from '../components/common/Footer/Footer';


const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
     
      <Navbar />

      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

     
      <Footer/>
    </div>
  );
};

export default UserLayout;