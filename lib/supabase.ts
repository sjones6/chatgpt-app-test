import { createClient as createServerClient } from "./supabase/server";

/**
 * Creates a Supabase SSR client for use in Next.js server components and API routes.
 * Handles cookie-based session management.
 * @deprecated Use createClient from '@/lib/supabase/server' directly instead.
 */
export async function createSupabaseServerClient() {
  return await createServerClient();
}

