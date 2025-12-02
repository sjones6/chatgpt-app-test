"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/app/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthRequired({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !data?.user) {
    const hasError = !!error;
    const errorMessage = error instanceof Error 
      ? error.message 
      : error 
        ? String(error)
        : "Unknown error";

    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {hasError ? "Authentication Error" : "You must login"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                {hasError
                  ? "An error occurred while checking your authentication status."
                  : "Please log in to access this page."}
              </p>

              {hasError && (
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full justify-between"
                  >
                    <span>Error Details</span>
                    {showDetails ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </Button>

                  {showDetails && (
                    <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 space-y-2 transition-all">
                      <div>
                        <p className="text-xs font-semibold text-destructive mb-1">Error Message:</p>
                        <p className="text-sm font-mono text-foreground break-words">
                          {errorMessage}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Button asChild>
                <Link href="/auth/login">Go to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

