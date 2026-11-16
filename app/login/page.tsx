"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import Footer from "@/components/Footer";
import BrandMark from "@/components/BrandMark";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not sign in. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="grid lg:grid-cols-2">
        {/* Left panel: brand */}
        <div className="relative hidden min-h-screen flex-col justify-between bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#60A5FA] px-12 py-10 text-white lg:flex">
          <Link href="/" className="flex items-center gap-3">
            <BrandMark size="regular" />
            <span className="font-display text-lg font-semibold tracking-tight">
              WellSpring.AI
            </span>
          </Link>

          <div className="max-w-md">
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight">
              Every call answered.
              <br />
              Every slot filled.
            </h1>
            <p className="mt-4 text-white/80">
              Your AI receptionist is always on — booking appointments,
              answering questions, and filling your calendar while you focus on
              the work that matters.
            </p>
          </div>

          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} WellSpring.AI
          </p>
        </div>

        {/* Right panel: form */}
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFF] px-6 py-16">
          <div className="w-full max-w-sm">
            <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
              <BrandMark />
              <span className="font-display text-base font-semibold">
                WellSpring.AI
              </span>
            </Link>

            <h2 className="font-display text-2xl font-semibold text-ink">
              Sign in
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Welcome back — manage your business dashboard.
            </p>

            <p className="mb-4 mt-7 text-sm font-medium text-ink">
              Continue with email
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-soft">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
                  placeholder="you@business.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-soft">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-soft px-3.5 py-2.5 text-sm text-red">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:opacity-60"
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-soft">
              No account yet?{" "}
              <Link
                href="/register"
                className="font-medium text-[#1D4ED8] hover:underline"
              >
                Start a free trial
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
