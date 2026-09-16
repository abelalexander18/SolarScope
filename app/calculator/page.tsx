import { Metadata } from "next";
import { SolarCalculator } from "@/components/solar/SolarCalculator";

export const metadata: Metadata = {
  title: "Solar Rooftop Calculator — SolarScope",
  description:
    "Explore rooftop area, orientation, shading, energy costs, and a comprehensive solar ROI estimate.",
};

export default function CalculatorPage() {
  return (
    <main className="pt-20">
      <SolarCalculator />
    </main>
  );
}
