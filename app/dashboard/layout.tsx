"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useBusiness } from "@/lib/business-context";
import CreateBusinessModal from "@/components/CreateBusinessModal";

type IconName =
  | "overview"
  | "calendar"
  | "people"
  | "messages"
  | "assistant"
  | "team"
  | "settings";

const NAV_GROUPS: {
  items: { href: string; label: string; icon: IconName }[];
}[] = [
  {
    items: [
      { href: "/dashboard", label: "Overview", icon: "overview" },
      { href: "/dashboard/appointments", label: "Appointments", icon: "calendar" },
      { href: "/dashboard/calendar", label: "Calendar", icon: "calendar" },
      { href: "/dashboard/customers", label: "Customers", icon: "people" },
      { href: "/dashboard/messages", label: "Messages", icon: "messages" },
    ],
  },
  {
    items: [
      { href: "/dashboard/ai-settings", label: "AI assistant", icon: "assistant" },
      { href: "/dashboard/team", label: "Team", icon: "team" },
      { href: "/dashboard/settings", label: "Settings", icon: "settings" },
    ],
  },
];

function NavIcon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "overview" && (
        <path d="M4 5h6v6H4zM14 5h6v3h-6zM14 12h6v7h-6zM4 15h6v4H4z" />
      )}
      {name === "calendar" && (
        <path d="M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1ZM8 4v4M16 4v4M4 11h16" />
      )}
      {name === "people" && (
        <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 20a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14.5A6 6 0 0 1 21 20" />
      )}
      {name === "messages" && (
        <path d="M4 5h16v11H9l-5 4V5ZM8 9.5h8M8 12.5h5" />
      )}
      {name === "assistant" && (
        <path d="M12 3v4M7 8h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2ZM9.5 12.5v1M14.5 12.5v1M9 21h6" />
      )}
      {name === "team" && (
        <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5 20a7 7 0 0 1 14 0" />
      )}
      {name === "settings" && (
        <path d="M5 7h9M18 7h1M5 17h1M10 17h9M16 5v4M8 15v4" />
      )}
    </svg>
  );
}

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

  useEffect(() => {
    if (!switcherOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSwitcherOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [switcherOpen]);

  if (authLoading || !user) {
    return (
      <div className="dashboard-shell flex min-h-screen items-center justify-center bg-paper">
        <div
          className="h-6 w-6 animate-spin rounded-full border-2 border-amber border-t-transparent"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <div className="dashboard-shell flex min-h-screen flex-col bg-paper md:flex-row">
      <aside className="flex w-full shrink-0 flex-col bg-[#0F2C34] px-4 py-3 text-[#F1EBDC] md:sticky md:top-0 md:h-screen md:w-[240px] md:justify-between md:px-4 md:py-6">
        <div className="min-w-0">
         
<div className="mb-4 flex items-center gap-2.5 px-1 md:mb-8">
 <Image
  src="/logo.png"
  alt=""
  width={48}
  height={48}
  className="h-12 w-12 shrink-0 rounded-md object-contain"
/>
  <span className="font-display text-[19px] font-medium tracking-tight">
    WellSpring.AI
  </span>
</div>


          <div className="relative mb-5">
            <button
              type="button"
              onClick={() => setSwitcherOpen((v) => !v)}
              aria-expanded={switcherOpen}
              aria-haspopup="listbox"
              className="flex w-full items-center justify-between rounded-md bg-[#153B45] px-3 py-2.5 text-left transition hover:bg-[#1E4E59]"
            >
              <span className="min-w-0">
                <span className="block text-[11px] text-[#F1EBDC]/60">
                  Practice
                </span>
                <span className="block truncate text-[13px] font-medium">
                  {bizLoading
                    ? "Loading…"
                    : (activeBusiness?.name ?? "Choose a practice")}
                </span>
              </span>
              <svg
                viewBox="0 0 24 24"
                className="ml-2 h-4 w-4 shrink-0 text-[#F1EBDC]/60"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {switcherOpen && (
              <div
                role="listbox"
                className="absolute left-0 right-0 top-full z-30 mt-1 rounded-md border border-border bg-panel p-1 text-ink shadow-lg"
              >
                {businesses.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    role="option"
                    aria-selected={b.id === activeBusiness?.id}
                    onClick={() => {
                      setActiveBusinessId(b.id);
                      setSwitcherOpen(false);
                    }}
                    className="block w-full rounded px-3 py-2 text-left text-[13px] hover:bg-paper"
                  >
                    {b.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setSwitcherOpen(false);
                    setShowCreateBusiness(true);
                  }}
                  className="mt-1 block w-full rounded border-t border-border px-3 py-2 text-left text-[13px] font-medium text-amber-deep hover:bg-paper"
                >
                  Add a practice
                </button>
              </div>
            )}
          </div>

          <nav
            aria-label="Main navigation"
            className="flex gap-3 overflow-x-auto pb-1 md:block md:overflow-visible md:pb-0"
          >
            {NAV_GROUPS.map((group, gi) => (
              <div
                key={gi}
                className={`flex gap-1 md:block md:space-y-0.5 ${
                  gi > 0
                    ? "md:mt-4 md:border-t md:border-[#F1EBDC]/10 md:pt-4"
                    : ""
                }`}
              >
                {group.items.map((item) => {
                  const active =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-[14px] transition md:w-full ${
                        active
                          ? "bg-[#153B45] font-medium text-white"
                          : "text-[#F1EBDC]/75 hover:bg-[#153B45]/70 hover:text-white"
                      }`}
                    >
                      {active && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-1.5 left-0 hidden w-[3px] rounded-full bg-[#DD9633] md:block"
                        />
                      )}
                      <NavIcon name={item.icon} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-4 hidden items-center gap-2.5 border-t border-[#F1EBDC]/10 pt-4 md:flex">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E4E59] text-[11px] font-medium text-white">
            {user.email.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] text-[#F1EBDC]/80">
              {user.email}
            </p>
            <button
              type="button"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="text-[12px] text-[#F1EBDC]/60 underline-offset-2 transition hover:text-white hover:underline"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-[1120px] min-w-0 flex-1 px-4 py-7 sm:px-8 sm:py-10 lg:px-12">
        {children}
        <div className="mt-10 border-t border-border pt-4 md:hidden">
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="text-[13px] text-ink-soft underline underline-offset-2"
          >
            Log out ({user.email})
          </button>
        </div>
      </main>

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
