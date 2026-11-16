import type { Metadata } from "next";
import "./landing.css";
import "./landing-extras.css";
import PraxislineLanding from "@/components/PraxislineLanding";

// Fonts (Fraunces, IBM Plex Sans/Mono) are already loaded once in app/layout.tsx with the
// same weights and set their CSS variables on <html>, so the landing page uses them from
// there. Loading them again here made the production build fail.

export const metadata: Metadata = {
  title: "WellSpring.AI — Ihre Praxis geht nie mehr ans Band",
};

export default function Home() {
  return <PraxislineLanding />;
}
