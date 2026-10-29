"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useBusiness } from "@/lib/business-context";
import CreateBusinessModal from "@/components/CreateBusinessModal";

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard", label: "Overview", icon: "▦" },
      { href: "/dashboard/appointments", label: "Appointments", icon: "▣" },
      { href: "/dashboard/customers", label: "Customers", icon: "♙" },
      { href: "/dashboard/messages", label: "Messages", icon: "▱" },
    ],
  },
  {
    label: "Configure",
    items: [
      { href: "/dashboard/ai-settings", label: "AI Assistant", icon: "♧" },
      { href: "/dashboard/team", label: "Team", icon: "♧" },
      { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading, logout } = useAuth();
  const {
    businesses,
    activeBusiness,
    loading: bizLoading,
    setActiveBusinessId,
    refresh,
  } = useBusiness();
  const router = useRouter();
  const pathname = usePathname();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return (
      <div className="dashboard-shell flex min-h-screen items-center justify-center bg-paper">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="dashboard-shell flex min-h-screen flex-col bg-paper md:flex-row">
      {/* Sidebar */}
      <aside className="flex w-full shrink-0 flex-col border-b border-[#e9e5e0] bg-[#f6f3ef] px-4 py-3 text-ink md:sticky md:top-0 md:h-screen md:w-[232px] md:justify-between md:border-b-0 md:border-r md:px-4 md:py-5">
        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-2.5 px-1 md:mb-7">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#111820] to-[#d95335] text-sm text-white">
              ◉
            </span>
            <span className="font-display text-[15px] font-bold tracking-tight text-ink">
              Praxisline
            </span>
          </div>

          <button
            onClick={() => setSwitcherOpen((v) => !v)}
            aria-expanded={switcherOpen}
            className="mb-5 flex w-full items-center justify-between rounded-2xl border border-[#e9e5e0] bg-white px-3 py-2.5 text-left shadow-[0_3px_10px_rgba(20,24,30,0.04)] transition hover:border-[#d6d0c9]"
          >
            <span className="min-w-0">
              <span className="block text-[10px] text-ink-soft">Practice</span>
              <span className="block truncate text-xs font-semibold text-ink">
                {bizLoading
                  ? "Loading…"
                  : (activeBusiness?.name ?? "Choose a practice")}
              </span>
            </span>
            <span className="ml-2 text-xs text-ink-soft">⌄</span>
          </button>
          {switcherOpen && (
            <div className="absolute left-4 right-4 top-[112px] z-30 rounded-2xl border border-border bg-panel p-1.5 shadow-xl md:left-4 md:right-auto md:top-[112px] md:w-[200px]">
              {businesses.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveBusinessId(b.id);
                    setSwitcherOpen(false);
                  }}
                  className="block w-full rounded-xl px-3 py-2 text-left text-xs text-ink hover:bg-paper"
                >
                  {b.name}
                </button>
              ))}
              <button
                onClick={() => {
                  setSwitcherOpen(false);
                  setShowCreateBusiness(true);
                }}
                className="block w-full rounded-xl border-t border-border px-3 py-2 text-left text-xs font-semibold text-amber-deep"
              >
                + Add practice
              </button>
            </div>
          )}

          <nav
            aria-label="Main navigation"
            className="flex gap-4 overflow-x-auto pb-1 md:block md:space-y-6 md:overflow-visible md:pb-0"
          >
            {NAV_GROUPS.map((group, gi) => (
              <div key={gi} className="min-w-max md:space-y-1">
                <p className="mb-2 hidden px-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-soft md:block">
                  {group.label}
                </p>
                <div className="flex gap-1 md:block md:space-y-1">
                  {group.items.map((item) => {
                    const active =
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex shrink-0 items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-medium transition md:w-full md:gap-2.5 md:rounded-full md:px-2.5 md:py-2 md:text-[13px] ${
                          active
                            ? "bg-white text-ink shadow-[0_2px_8px_rgba(20,24,30,0.05)]"
                            : "text-ink hover:bg-white/70"
                        }`}
                      >
                        <span className="w-4 text-center text-[15px] leading-none text-ink-soft">
                          {item.icon}
                        </span>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="hidden md:block">
          <div className="mb-4 rounded-2xl bg-gradient-to-br from-[#18212a] via-[#272d32] to-[#b94b32] p-3 text-white shadow-sm">
            <p className="flex items-center gap-2 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-[#32c5a1]" />
              AI receptionist live
            </p>
            <p className="mt-1.5 text-[10px] leading-relaxed text-white/70">
              Answering calls around the clock for your practice.
            </p>
          </div>
          <div className="flex items-center gap-2.5 border-t border-[#e6e1db] pt-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#17202a] text-[10px] font-semibold text-white">
              {user.email.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] text-ink-soft">{user.email}</p>
              <button
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="text-[10px] font-medium text-ink-soft transition hover:text-ink"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[58px] items-center justify-between border-b border-[#e9e5e0] bg-[#fbfaf8]/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <label className="flex w-full max-w-[320px] items-center gap-2 rounded-full border border-[#e8e4df] bg-white px-3 py-2 text-ink-soft shadow-[0_2px_7px_rgba(20,24,30,0.025)]">
            <span aria-hidden="true" className="text-sm">
              ⌕
            </span>
            <input
              type="search"
              placeholder="Search patients, bookings…"
              className="w-full bg-transparent text-xs text-ink outline-none placeholder:text-ink-soft/80"
            />
          </label>
          <div className="ml-3 flex items-center gap-2.5">
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e9e5e0] bg-white text-sm text-ink"
            >
              ♧
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#17202a] text-[10px] font-semibold text-white">
              {user.email.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1160px] flex-1 px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
          {children}
        </main>
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
