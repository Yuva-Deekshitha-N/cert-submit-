import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://cert-submit.onrender.com",
  withCredentials: true, // optional
});

export default instance;
