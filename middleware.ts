import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js middleware function that handles CORS, authentication, and session management.
 * Processes all incoming requests and applies appropriate headers and auth checks.
 */
export async function middleware(request: NextRequest) {
  /**
   * Handle CORS preflight requests (OPTIONS method).
   * Returns a 204 No Content response with CORS headers to allow cross-origin requests.
   */
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    response.headers.set("Access-Control-Allow-Headers", "*");
    return response;
  }

  /**
   * Exclude MCP routes from Supabase authentication checks.
   * MCP routes handle their own bearer token authentication, so they bypass
   * session-based auth while still receiving CORS headers.
   */
  console.log("request.nextUrl.pathname", request.nextUrl.pathname);
  console.log("request.url", request.url);
  if (request.nextUrl.pathname.startsWith("/mcp")) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    response.headers.set("Access-Control-Allow-Headers", "*");
    return response;
  }

  /**
   * Apply Supabase session management and authentication for all other routes.
   * This updates the user session, checks authentication status, and redirects
   * unauthenticated users to the login page if needed.
   */
  const supabaseResponse = await updateSession(request);

  /**
   * Add CORS headers to the Supabase response to allow cross-origin requests.
   * These headers are applied after session management to ensure they're present
   * on all responses, including redirects.
   */
  supabaseResponse.headers.set("Access-Control-Allow-Origin", "*");
  supabaseResponse.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  supabaseResponse.headers.set("Access-Control-Allow-Headers", "*");

  return supabaseResponse;
}

/**
 * Middleware configuration.
 * Matches all routes to ensure middleware runs on every request.
 */
export const config = {
  matcher: "/:path*",
};
