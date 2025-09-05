import axios from "axios";

export const BASE_URL = "http://188.121.102.156/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getTokenFromCookie = () => {
  const matches = document.cookie.match(/(^| )token=([^;]+)/);
  if (matches) {
    return matches[2];
  }
  return null;
};

api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    console.log()
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
