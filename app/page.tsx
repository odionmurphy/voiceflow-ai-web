import type { Metadata } from "next";
import "./landing.css";
import "./landing-extras.css";
import PraxislineLanding from "@/components/PraxislineLanding";

export const metadata: Metadata = {
  title: "WellSpring.AI — Kein Anruf geht mehr verloren",
};

export default function Home() {
  return <PraxislineLanding />;
}
