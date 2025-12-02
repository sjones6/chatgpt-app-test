"use client";

import Link from "next/link";
import { useAuth } from "@/app/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthRequired({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error || !data?.user) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">You must login</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Please log in to access this page.
              </p>
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

