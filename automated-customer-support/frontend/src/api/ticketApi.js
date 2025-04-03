// ticketApi.js
import axios from "axios";

const ticketApi = axios.create({
  baseURL: "http://localhost:5001/api", // ticket-service
});

ticketApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default ticketApi;
