import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:8080/api/auth",
});

authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const signup = (data) => authApi.post("/signup", data);
export const verifyEmail = (token) => authApi.get(`/verify-email/${token}`);
export const forgotPassword = (email) => authApi.post("/forgot-password", { email });
export const resetPassword = (token, password) => authApi.post(`/reset-password/${token}`, { password });

export default authApi;
