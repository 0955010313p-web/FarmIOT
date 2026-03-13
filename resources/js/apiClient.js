import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_APP_URL ? `${import.meta.env.VITE_APP_URL}/api` : '/api',
    withCredentials: true, // Important for Laravel Sanctum if we were using it, but good practice
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Request Interceptor to add the Bearer Token
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Optional: Response Interceptor for handling token expiration
apiClient.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        // Redirect to login page
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }
    return Promise.reject(error);
});

export default apiClient;
