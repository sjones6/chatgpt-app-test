"use client";

import { useEffect, useState } from "react";
import { useCallTool } from "@/app/hooks";
import { SupabaseProvider } from "./supabase-provider";

export function SupabaseProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const callTool = useCallTool();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await callTool("get_auth_token", {});
        if (response?.result) {
          let token: string = response.result;
          try {
            const parsed = JSON.parse(response.result);
            token = parsed.token || parsed.structuredContent?.token || response.result;
          } catch {
            token = response.result;
          }
          if (token && token.trim()) {
            setAccessToken(token);
          }
        }
      } catch (error) {
        console.error("Failed to fetch auth token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [callTool]);

  if (isLoading) {
    return null;
  }

  return <SupabaseProvider accessToken={accessToken}>
    {children}
    <div>
      <p>API token: {process.env.API_TOKEN}</p>
      <div>Access token: {accessToken}</div>
    </div>
    </SupabaseProvider>;
}

