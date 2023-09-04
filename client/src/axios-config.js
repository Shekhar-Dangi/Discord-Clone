import axios from "axios";
import { getTokenFromCookies } from "./cookieUtil";

const reqInstance = axios.create({
  baseURL: "https://discord-bs4u.onrender.com",
  withCredentials: true,
  transportOptions: {
    polling: {
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    },
  },
});

reqInstance.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookies();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default reqInstance;
