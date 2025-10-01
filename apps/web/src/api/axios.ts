import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },                                                                                                                                                                                                                // salam
});

export default api;
