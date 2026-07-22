"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useBusiness } from "@/lib/business-context";
import CreateBusinessModal from "@/components/CreateBusinessModal";

const NAV_GROUPS = [
  {
    items: [
      { href: "/dashboard", label: "Overview", icon: "🏠" },
      { href: "/dashboard/appointments", label: "Appointments", icon: "📅" },
      { href: "/dashboard/customers", label: "Customers", icon: "👥" },
      { href: "/dashboard/messages", label: "Messages", icon: "✉️" },
    ],
  },
  {
    items: [
      { href: "/dashboard/ai-settings", label: "AI Settings", icon: "🤖" },
      { href: "/dashboard/team", label: "Team", icon: "🧑‍🤝‍🧑" },
      { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, logout } = useAuth();
  const { businesses, activeBusiness, loading: bizLoading, setActiveBusinessId, refresh } =
    useBusiness();
  const router = useRouter();
  const pathname = usePathname();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-navy border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col justify-between bg-navy px-5 py-6 text-white">
        <div>
          <div className="mb-8 flex items-center gap-2 border-b border-white/10 px-1 pb-6">
            <span className="pulse-dot h-2 w-2 rounded-full bg-amber text-amber" />
            <span className="font-display text-base font-semibold tracking-tight">
              Praxisline AI
            </span>
          </div>

          <nav className="space-y-6">
            {NAV_GROUPS.map((group, gi) => (
              <div key={gi} className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2.5 rounded-lg border-l-2 px-2.5 py-2 text-sm font-medium transition ${
                        active
                          ? "border-amber bg-navy-soft text-white"
                          : "border-transparent text-white/60 hover:bg-navy-soft/60 hover:text-white"
                      }`}
                    >
                      <span className="text-base leading-none">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2.5 border-t border-white/10 pt-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-soft text-sm font-semibold text-white">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-white/60">{user.email}</p>
            <button
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="text-xs font-medium text-white/40 transition hover:text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-panel px-8 py-4">
          <div className="relative">
            <button
              onClick={() => setSwitcherOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-ink hover:border-navy/30"
            >
              {bizLoading ? "Loading..." : activeBusiness?.name ?? "No business yet"}
              <span className="text-ink-soft">▾</span>
            </button>
            {switcherOpen && (
              <div className="absolute left-0 top-full z-10 mt-1 w-56 rounded-lg border border-border bg-panel py-1 shadow-lg">
                {businesses.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setActiveBusinessId(b.id);
                      setSwitcherOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-paper ${
                      b.id === activeBusiness?.id ? "font-semibold text-navy" : "text-ink"
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSwitcherOpen(false);
                    setShowCreateBusiness(true);
                  }}
                  className="block w-full border-t border-border px-3 py-2 text-left text-sm font-medium text-navy hover:bg-paper"
                >
                  + Add business
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 px-8 py-8">{children}</main>
      </div>

      {showCreateBusiness && (
        <CreateBusinessModal
          onClose={() => setShowCreateBusiness(false)}
          onCreated={async () => {
            await refresh();
            setShowCreateBusiness(false);
          }}
        />
      )}
    </div>
  );
}
