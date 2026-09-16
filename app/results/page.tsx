import { Metadata } from "next";
import { ResultsDashboard } from "@/components/solar/ResultsDashboard";
import { mockSolarResult } from "@/data/mockSolarResult";

export const metadata: Metadata = {
  title: "Sample Solar Estimate — SolarScope",
  description:
    "Explore a sample rooftop solar potential, financial, energy, and environmental dashboard.",
};

export default function ResultsPage() {
  return (
    <main className="pt-20">
      <ResultsDashboard result={mockSolarResult} />
    </main>
  );
}
