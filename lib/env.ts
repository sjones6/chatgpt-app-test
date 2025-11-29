import { z } from "zod";

/**
 * Environment variable schema with validation and documentation.
 * All environment variables are validated at module load time.
 */
const envSchema = z.object({
  /**
   * Supabase project ID.
   * Used to construct Supabase API URLs.
   * Defaults to "hztwecyfjyjldqajnqnx" if not provided.
   */
  SUPABASE_PROJECT_ID: z
    .string()
    .default("hztwecyfjyjldqajnqnx")
    .describe("Supabase project ID"),

  /**
   * Supabase anonymous/public key.
   * Required for authenticating requests to Supabase.
   */
  SUPABASE_ANON_KEY: z
    .string()
    .min(1)
    .describe("Supabase anonymous/public key"),

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
  SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
  VERCEL_URL: process.env.VERCEL_URL,
});

/**
 * Supabase project ID.
 */
export const SUPABASE_PROJECT_ID = env.SUPABASE_PROJECT_ID;

/**
 * Supabase anonymous/public key.
 */
export const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;

/**
 * Supabase API URL.
 * Constructed from the project ID.
 */
export const SUPABASE_URL = `https://${env.SUPABASE_PROJECT_ID}.supabase.co`;

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

