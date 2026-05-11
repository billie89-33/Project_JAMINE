import { AuthProvider } from './context/AuthContext';
import { RouterProvider } from 'react-router-dom';
import router from './routes/AppRouter'; 

const App = () => {
  return (
    <AuthProvider>
      
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;