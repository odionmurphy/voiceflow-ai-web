"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(email, password, fullName);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create account. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="grid lg:grid-cols-2">
        {/* Left panel: brand */}
        <div className="relative hidden min-h-screen flex-col justify-between bg-navy px-12 py-10 text-white lg:flex">
          <Link href="/" className="flex items-center gap-3">
            <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-amber text-amber" />
            <span className="font-display text-lg font-semibold tracking-tight">
              Praxisline AI
            </span>
          </Link>

          <div className="max-w-md">
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight">
              Every call answered.
              <br />
              Every slot filled.
            </h1>
            <p className="mt-4 text-navy-soft/0 text-white/70">
              Your AI receptionist is always on — booking appointments, answering
              questions, and filling your calendar while you focus on the work
              that matters.
            </p>
          </div>

          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Praxisline AI
          </p>
        </div>

        {/* Right panel: form */}
        <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm">
            <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
              <span className="pulse-dot h-2 w-2 rounded-full bg-amber text-amber" />
              <span className="font-display text-base font-semibold">Praxisline AI</span>
            </Link>

            <h2 className="font-display text-2xl font-semibold text-ink">Create your account</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Set up your dashboard login — you&apos;ll add your business next.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-soft">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-soft">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10"
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
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-panel px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10"
                  placeholder="At least 8 characters"
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
                className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-deep disabled:opacity-60"
              >
                {submitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink-soft">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-navy hover:underline">
                Sign in
              </Link>
            </p>

            <p className="mt-4 text-center text-xs text-ink-soft/70">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
