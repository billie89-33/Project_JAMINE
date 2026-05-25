import { AuthProvider } from './components/features/auth';
import { RouterProvider } from 'react-router-dom';
import router from './routes/AppRouter'; 
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false}/> 
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;