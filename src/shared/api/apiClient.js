import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001/api/v1',
    withCredentials: true,
    headers: {}, // 🛡️ ปล่อยให้ Axios จัดการ Content-Type อัตโนมัติ
    timeout: 10000, 
});

apiClient.interceptors.request.use(
    (config) => {
        // ⏱️ Start timer
        config.metadata = { startTime: new Date() };
        console.log(`🚀 [API Request] ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => {
        // ⏱️ End timer
        const startTime = response.config.metadata.startTime;
        const duration = new Date() - startTime;
        console.log(`✅ [API Response] ${response.config.method.toUpperCase()} ${response.config.url} - ${duration}ms`);
        return response;
    },
    (error) => {
        const { response, config } = error;
        
        // ⏱️ End timer even on error
        if (config && config.metadata) {
            const duration = new Date() - config.metadata.startTime;
            console.error(`❌ [API Error] ${config.method.toUpperCase()} ${config.url} - ${duration}ms`);
        }

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
