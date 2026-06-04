import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001/api/v1',
    withCredentials: true,
    headers: {}, // 🛡️ ปล่อยให้ Axios จัดการ Content-Type อัตโนมัติ
    timeout: 10000, 
});

apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (response && response.status === 401) {
            console.error('Session expired or Unauthorized. Cleaning up and redirecting...');
            
            // 🧹 Clear all client-side session data
            localStorage.clear();
            sessionStorage.clear();

            // 🚀 Safe Redirect: Only redirect if not already on the login page
            // This prevents infinite redirection loops
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        if (response && response.status === 500) {
            console.error('Server side error. Please contact the administrator.');
        }

        return Promise.reject(error);
    }
);

export default apiClient;
