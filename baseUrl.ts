export const baseURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3000"
    : "https://" +
      (process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
        ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
        : process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL || process.env.NEXT_PUBLIC_VERCEL_URL);
