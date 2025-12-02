import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { apiClient } from "@/lib/axios";

interface AuthResponse {
  user: User;
}

type Options = Omit<UseQueryOptions<AuthResponse>, "queryKey" | "queryFn">;

export function useAuth(options?: Options) {
  return useQuery<AuthResponse>({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const response = await apiClient.get<AuthResponse>("/api/auth/user");
      return response.data;
    },
    retry: false,
    ...options,
  });
}

