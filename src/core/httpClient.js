import axios from "axios";

export const Axios = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 300000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor - automatski dodaje token svakom zahtevu
Axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor - automatski refreshuje token ako je istekao
Axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(
                    'http://localhost:8080/auth/refresh-token',
                    refreshToken,
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const newToken = response.data.token;
                localStorage.setItem('token', newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return Axios(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const get = async (url, params) => {
    return await Axios.get(url, { params });
};

export const post = async (url, data) => {
    return await Axios.post(url, data);
};

export const put = async (url, data) => {
    return await Axios.put(url, data);
};

export const del = async (url) => {
    return await Axios.delete(url);
};