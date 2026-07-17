"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const FEATURES = [
  {
    icon: "📞",
    title: "AI phone receptionist",
    body: "Answers every call, 24/7, in a natural conversation - no more missed bookings because you were busy with a client.",
  },
  {
    icon: "🌍",
    title: "7 languages, out of the box",
    body: "English, German, Spanish, French, Italian, Portuguese, and Dutch - the AI speaks whichever language your caller uses.",
  },
  {
    icon: "📅",
    title: "Real appointment booking",
    body: "Checks your actual availability and books directly into your schedule, with Google Calendar sync if you want it.",
  },
  {
    icon: "👥",
    title: "Customer records, kept automatically",
    body: "Every caller becomes a customer record with their booking history - no manual data entry.",
  },
  {
    icon: "✉️",
    title: "Confirmations & reminders",
    body: "Automatic SMS/email confirmations and ~24h-ahead reminders cut down no-shows without you lifting a finger.",
  },
  {
    icon: "📊",
    title: "Call transcripts & analytics",
    body: "Read exactly what was said on every call, and track answer rate, no-show rate, and revenue over time.",
  },
];

const PLANS = [
  {
    name: "Starter",
    calls: "Up to 100 calls / month",
    blurb: "For a single-location practice just getting started.",
  },
  {
    name: "Professional",
    calls: "Up to 500 calls / month",
    blurb: "For busier practices with multiple staff.",
    featured: true,
  },
  {
    name: "Business",
    calls: "Unlimited calls",
    blurb: "For multi-location or high-volume businesses.",
  },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-amber text-amber" />
            <span className="font-display text-lg font-semibold tracking-tight text-ink">
              VoiceFlow AI
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-ink-soft hover:text-ink"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              Start free trial
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Every call answered.
            <br />
            Every slot filled.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Your AI receptionist picks up every call, books appointments straight into
            your calendar, and never puts a customer on hold - so you can focus on the
            work in front of you.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-amber px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-amber-deep"
            >
              Start your free trial
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Problem framing */}
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Every missed call is a missed booking.
        </h2>
        <p className="mt-4 text-ink-soft">
          Dental practices, salons, barbershops, and clinics lose customers every day
          simply because nobody could pick up the phone in time. VoiceFlow AI answers
          instantly, every time - so a ringing phone never costs you a booking again.
        </p>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-panel">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-center font-display text-2xl font-semibold text-ink">
            Everything a front desk does - answered instantly
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-paper p-6"
              >
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-3 font-display text-base font-semibold text-ink">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-center font-display text-2xl font-semibold text-ink">
          Up and running in minutes
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            { step: "1", title: "Create your business", body: "Add your hours, services, and pricing." },
            { step: "2", title: "Connect your number", body: "Your AI receptionist answers on your existing line." },
            { step: "3", title: "Never miss a booking", body: "Calls get answered, booked, and confirmed automatically." },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-navy font-display text-sm font-semibold text-white">
                {s.step}
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="border-t border-border bg-panel">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center font-display text-2xl font-semibold text-ink">
            Plans that grow with your call volume
          </h2>
          <p className="mt-2 text-center text-sm text-ink-soft">
            Every plan starts with a 14-day free trial - no card required to try it out.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`rounded-xl border p-6 ${
                  p.featured ? "border-navy bg-navy text-white" : "border-border bg-paper"
                }`}
              >
                <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                <p
                  className={`mt-1 text-sm font-medium ${
                    p.featured ? "text-amber" : "text-navy"
                  }`}
                >
                  {p.calls}
                </p>
                <p
                  className={`mt-3 text-sm ${
                    p.featured ? "text-white/70" : "text-ink-soft"
                  }`}
                >
                  {p.blurb}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/register"
              className="rounded-lg bg-amber px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-amber-deep"
            >
              Start your free trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-ink-soft sm:flex-row">
          <span>&copy; {new Date().getFullYear()} VoiceFlow AI</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/impressum" className="hover:underline">
              Impressum
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
