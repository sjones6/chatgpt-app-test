import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const addCorsHeaders = (request: NextRequest, response: NextResponse): NextResponse => {
  response.headers.set("Access-Control-Allow-Origin", request.headers.get("Origin") || "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Accept-Encoding",
      "Accept-Language",
      "Access-Control-Request-Headers",
      "Access-Control-Request-Method",
      "Connection",
      "Forwarded",
      "Host",
      "Priority",
      "Referer",
      "Sec-Fetch-Dest",
      "Sec-Fetch-Mode",
      "Sec-Fetch-Site",
      "User-Agent",
      "X-Forwarded-For",
      "X-Forwarded-Host",
      "X-Forwarded-Proto",
      "X-Real-Ip",
      "X-Vercel-Deployment-Url",
      "X-Vercel-Id",
      "X-Vercel-Ip-As-Number",
      "X-Vercel-Ip-City",
      "X-Vercel-Ip-Continent",
      "X-Vercel-Ip-Country",
      "X-Vercel-Ip-Country-Region",
      "X-Vercel-Ip-Latitude",
      "X-Vercel-Ip-Longitude",
      "X-Vercel-Ip-Postal-Code",
      "X-Vercel-Ip-Timezone",
      "X-Vercel-Ja4-Digest",
      "X-Vercel-Oidc-Token",
      "X-Vercel-Proxied-For"
    ].join(", ")
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
};

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
    console.log("OPTIONS request", request.headers.get("Origin"));
    const headersObject: Record<string, string> = {};
    for (const [key, value] of request.headers.entries()) {
      headersObject[key] = value;
    }
    console.log("Headers", JSON.stringify(headersObject, null, 2));
    return addCorsHeaders(request, new NextResponse(null, { status: 204 }));
  }

  /**
   * Exclude static assets and public files from authentication checks.
   * These include Next.js static assets, images, fonts, and other public resources.
   */
  const pathname = request.nextUrl.pathname;
  const isAsset =
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot|json)$/i);
  /**
   * Exclude MCP routes from Supabase authentication checks.
   * MCP routes handle their own bearer token authentication, so they bypass
   * session-based auth while still receiving CORS headers.
   */
  const isMCPRoute =
    pathname.startsWith("/mcp") || pathname.includes(".well-known") || pathname.startsWith("/chatgpt");

  if (isAsset || isMCPRoute) {
    return addCorsHeaders(request, NextResponse.next());
  }

  /**
   * Apply Supabase session management and authentication for all other routes.
   * This updates the user session, checks authentication status, and redirects
   * unauthenticated users to the login page if needed.
   */
  return addCorsHeaders(request, await updateSession(request));
}

/**
 * Middleware configuration.
 * Matches all routes to ensure middleware runs on every request.
 */
export const config = {
  matcher: "/:path*",
};
