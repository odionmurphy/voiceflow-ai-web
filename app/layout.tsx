import type { Metadata } from "next";
import {
  Space_Grotesk,
  Inter,
  Fraunces,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { BusinessProvider } from "@/lib/business-context";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Praxisline AI — Business Dashboard",
  description: "Manage your AI receptionist, appointments, and customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${fraunces.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full`}
    >
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
