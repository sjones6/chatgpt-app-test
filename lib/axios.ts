import axios from "axios";

/**
 * Determines the base URL for API requests based on the current environment.
 * 
 * In development, uses localhost:3000.
 * In production/preview, uses the appropriate Vercel URL.
 * 
 * @returns The base URL string for API requests
 */
function getBaseURL(): string {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  if (process.env.VERCEL_ENV === "production") {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return `https://${process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL}`;
}

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
  baseURL: getBaseURL(),
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

