import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:8080/api/auth", // updated to use API Gateway
});

authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default authApi;
