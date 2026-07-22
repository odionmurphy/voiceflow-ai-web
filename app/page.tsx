import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./landing.css";
import PraxislineLanding from "@/components/PraxislineLanding";

// Only weights/styles actually used in landing.css (h1-h3 at 600, the hero's italic
// "ans Band" at 500) - kept narrow to avoid pulling in unused font weight files.
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
  title: "Praxisline AI — Ihre Praxis geht nie mehr ans Band",
};

export default function Home() {
  return (
    <div className={`${fraunces.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <PraxislineLanding />
    </div>
  );
}
