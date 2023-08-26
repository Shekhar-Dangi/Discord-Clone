import axios from "axios";
import { getTokenFromCookies } from "./cookieUtil";

const reqInstance = axios.create({
  baseURL: "http://localhost:8000",
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
