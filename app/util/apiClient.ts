import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
});

// Request Interceptor: Attach Auth Token
// apiClient.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     // In a real app, you might get this from a cookie or secure storage
//     const token = localStorage.getItem("auth_token");

//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response Interceptor: Global Error Handling
// apiClient.interceptors.response.use(
//   (response) => response, // Pass successful responses through
//   (error) => {
//     const status = error.response?.status;

//     if (status === 401) {
//       // Logic: If unauthorized, redirect to login
//       window.location.href = "/login";
//     }

//     if (status === 500) {
//       // Logic: Server error, maybe log to a service like Sentry
//       console.error("Critical Server Error. Our team has been notified.");
//     }

//     return Promise.reject(error);
//   }
// );

export default apiClient;
