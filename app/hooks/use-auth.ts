import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { baseURL } from "@/baseUrl";
import { useSupabase } from "@/components/supabase-provider";

interface AuthResponse {
  user: User;
}

type Options = Omit<UseQueryOptions<AuthResponse>, "queryKey" | "queryFn">;

export function useAuth(options?: Options) {
  const { supabase } = useSupabase();
  return useQuery<AuthResponse>({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client not found");
      }
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        throw new Error(`[${error?.code}] Failed to fetch user: ${error?.message}`);
      }
      return { user };
    },
    enabled: !!supabase,
    retry: false,
    ...options,
  });
}

