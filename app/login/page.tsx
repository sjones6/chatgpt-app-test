"use client";

import { createClient } from "@/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="font-sans flex items-center justify-center min-h-screen p-8">
      <main className="w-full max-w-md">
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl font-black tracking-tight text-center">
            Sign In
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-900 dark:text-red-100 text-sm">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-2 border border-solid border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="px-4 py-2 border border-solid border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-base h-12 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="font-sans flex items-center justify-center min-h-screen p-8">
        <main className="w-full max-w-md">
          <div className="flex flex-col gap-8">
            <h1 className="text-4xl font-black tracking-tight text-center">
              Sign In
            </h1>
            <div className="text-center text-muted-foreground">Loading...</div>
          </div>
        </main>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

