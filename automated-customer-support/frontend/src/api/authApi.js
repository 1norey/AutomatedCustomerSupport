import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:8080/api/auth",
});

// ✅ Attach token automatically for authenticated routes
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Token attached to request:", token); // Debug only
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Auth routes
export const signup = (data) => authApi.post("/signup", data);
export const login = (data) => authApi.post("/login", data);
export const verifyEmail = (token) => authApi.get(`/verify-email/${token}`);
export const forgotPassword = (email) => authApi.post("/forgot-password", { email });
export const resetPassword = (token, password) => authApi.post(`/reset-password/${token}`, { password });

// ✅ Add route for fetching users (admin only)
export const getUsers = () => authApi.get("/users");

// ✅ You can also add update/delete if needed
export const updateUser = (id, data) => authApi.put(`/users/${id}`, data);
export const deleteUser = (id) => authApi.delete(`/users/${id}`);

// Export the API instance
export default authApi;
