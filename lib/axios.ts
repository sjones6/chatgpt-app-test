import { baseURL } from "@/baseUrl";
import axios, { type AxiosError } from "axios";

/**
 * Axios instance configured for API requests.
 * 
 * Features:
 * - Base URL is programmatically determined based on environment
 * - Cookies are automatically included in requests (withCredentials: true)
 * - Default timeout of 30 seconds
 * 
 * @example
 * ```ts
 * import { apiClient } from "@/lib/axios";
 * 
 * const response = await apiClient.get("/api/auth/user");
 * ```
 */
export const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor for logging and error handling.
 * Can be extended to add authentication tokens or other headers.
 */
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for handling common errors.
 * Automatically handles 401 Unauthorized responses.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors if needed
    }
    return Promise.reject(error);
  }
);

/**
 * Type guard to check if an error is an Axios error.
 * Useful for extracting detailed error information from API requests.
 * 
 * @param error - The error to check
 * @returns True if the error is an Axios error
 * 
 * @example
 * ```ts
 * import { isAxiosError } from "@/lib/axios";
 * 
 * try {
 *   await apiClient.get("/api/auth/user");
 * } catch (error) {
 *   if (isAxiosError(error)) {
 *     console.log(error.response?.status);
 *     console.log(error.response?.data);
 *   }
 * }
 * ```
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

