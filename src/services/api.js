import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
});

// Interceptor: injeta token JWT em todas as requisicoes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: tenta refresh token em 401 e refaz a requisicao
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const refreshToken = localStorage.getItem("refreshToken");

    if (status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        const newToken = refreshRes.data?.data?.accessToken || refreshRes.data?.accessToken;
        if (newToken) {
          localStorage.setItem("token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
    }

    return Promise.reject(error);
  }
);

export default api;