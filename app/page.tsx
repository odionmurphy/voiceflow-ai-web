import type { Metadata } from "next";
import "./landing.css";
import "./landing-extras.css";
import PraxislineLanding from "@/components/PraxislineLanding";

export const metadata: Metadata = {
  title: "WellSpring.AI — Ihre Praxis geht nie mehr ans Band",
};

export default function Home() {
  return <PraxislineLanding />;
}
