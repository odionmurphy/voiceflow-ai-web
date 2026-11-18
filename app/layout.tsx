import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { BusinessProvider } from "@/lib/business-context";

export const metadata: Metadata = {
  title: "WellSpring.AI — Business Dashboard",
  description: "Manage your AI receptionist, appointments, and customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      {/* suppressHydrationWarning: some browser extensions (e.g. ColorZilla) inject
          attributes like cz-shortcut-listen onto <body> after page load, which
          otherwise trips a false-positive hydration mismatch warning here. */}
      <body
        className="min-h-full bg-paper text-ink antialiased"
        suppressHydrationWarning
      >
        <AuthProvider>
          <BusinessProvider>{children}</BusinessProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
