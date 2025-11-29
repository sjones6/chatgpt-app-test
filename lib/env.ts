import { z } from "zod";

/**
 * Environment variable schema with validation and documentation.
 * All environment variables are validated at module load time.
 */
const envSchema = z.object({
  /**
   * Supabase project URL.
   * Required for connecting to Supabase.
   */
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url()
    .describe("Supabase project URL"),

  /**
   * Supabase anonymous/public key.
   * Required for authenticating requests to Supabase.
   */
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY: z
    .string()
    .min(1)
    .describe("Supabase anonymous/public key"),

  /**
   * Supabase project ID.
   * Used to construct Supabase Auth API URL.
   * Defaults to "hztwecyfjyjldqajnqnx" if not provided.
   */
  SUPABASE_PROJECT_ID: z
    .string()
    .default("hztwecyfjyjldqajnqnx")
    .describe("Supabase project ID"),

  /**
   * Node environment.
   * Typically "development", "production", or "test".
   * Defaults to "development" if not provided.
   */
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development")
    .describe("Node environment"),

  /**
   * Vercel deployment environment.
   * Can be "production", "preview", or "development".
   */
  VERCEL_ENV: z
    .enum(["production", "preview", "development"])
    .optional()
    .describe("Vercel deployment environment"),

  /**
   * Vercel production URL.
   * Used when VERCEL_ENV is "production".
   * Can be a hostname or full URL.
   */
  VERCEL_PROJECT_PRODUCTION_URL: z
    .string()
    .optional()
    .describe("Vercel production project URL"),

  /**
   * Vercel branch/preview URL.
   * Used for preview deployments.
   * Can be a hostname or full URL.
   */
  VERCEL_BRANCH_URL: z
    .string()
    .optional()
    .describe("Vercel branch/preview URL"),

  /**
   * Vercel deployment URL.
   * Fallback URL for Vercel deployments.
   * Can be a hostname or full URL.
   */
  VERCEL_URL: z
    .string()
    .optional()
    .describe("Vercel deployment URL"),
});

/**
 * Validated environment variables.
 * Throws an error at module load if validation fails.
 */
const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY,
  SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID,
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
  VERCEL_URL: process.env.VERCEL_URL,
});

/**
 * Supabase project URL.
 */
export const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Supabase anonymous/public key.
 */
export const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

/**
 * Supabase project ID.
 */
export const SUPABASE_PROJECT_ID = env.SUPABASE_PROJECT_ID;

/**
 * Supabase Auth API URL.
 * Used for OAuth and authentication endpoints.
 */
export const SUPABASE_AUTH_URL = `https://${env.SUPABASE_PROJECT_ID}.supabase.co/auth/v1`;

/**
 * Node environment.
 */
export const NODE_ENV = env.NODE_ENV;

/**
 * Vercel environment variables.
 */
export const VERCEL_ENV = env.VERCEL_ENV;
export const VERCEL_PROJECT_PRODUCTION_URL = env.VERCEL_PROJECT_PRODUCTION_URL;
export const VERCEL_BRANCH_URL = env.VERCEL_BRANCH_URL;
export const VERCEL_URL = env.VERCEL_URL;

