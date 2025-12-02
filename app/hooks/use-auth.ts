import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { baseURL } from "@/baseUrl";

interface AuthResponse {
  user: User;
}

type Options = Omit<UseQueryOptions<AuthResponse>, "queryKey" | "queryFn">;

export function useAuth(options?: Options) {
  return useQuery<AuthResponse>({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const response = await fetch(`${baseURL}/api/auth/user`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`[${response.status}] Failed to fetch user: ${response.statusText}`);
      }

      return response.json() as Promise<AuthResponse>;
    },
    retry: false,
    ...options,
  });
}

