import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/";

const getToken = () => {
  try {
    const root = localStorage.getItem("persist:root");
    if (!root) return null;
    const user = JSON.parse(JSON.parse(root).user);
    return user.currentUser?.accessToken || null;
  } catch {
    return null;
  }
};

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
});

userRequest.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.token = `Bearer ${token}`;
  return config;
});
