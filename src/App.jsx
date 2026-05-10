import { AuthProvider } from './context/AuthContext';
import { RouterProvider } from 'react-router-dom';
import router from './routes/AppRouter'; 

const App = () => {
  return (
    <AuthProvider>
      {/* ใช้แท็กเดี่ยวปิดในตัวตัวเดียวจบ ไม่ต้องมี <AppRouter /> อยู่ข้างใน */}
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;