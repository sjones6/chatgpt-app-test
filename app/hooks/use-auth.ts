import { useQuery } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";

interface AuthResponse {
  user: User;
}

export function useAuth() {
  return useQuery<AuthResponse>({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unauthorized");
      }

      return response.json();
    },
    retry: false,
  });
}

