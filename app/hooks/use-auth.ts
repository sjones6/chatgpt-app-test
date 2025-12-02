import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { apiClient } from "@/lib/axios";

interface AuthResponse {
  user: User;
}

export function useAuth() {
  return useQuery<AuthResponse>({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const response = await apiClient.get<AuthResponse>("/api/auth/user");
      return response.data;
    },
    retry: false,
  });
}

