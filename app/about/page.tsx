import { ShieldAlert, Award, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About SolarScope — Rooftop Potential Estimator",
  description: "SolarScope's mission, engineering approach, and advisory notes.",
};

export default function AboutPage() {
  return (
    <main className="pt-20">
      <section className="section-shell py-16 sm:py-24 max-w-4xl">
        <p className="eyebrow">Solar Rooftop Intelligence</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl font-extrabold text-foreground">
          About SolarScope
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          SolarScope is a rooftop solar pre-feasibility and financial return estimator created to remove uncertainty from solar adoption for homeowners across India.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="surface-card rounded-2xl p-6">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary">
              <Award className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-xl font-extrabold text-foreground">
              Our Mission
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              To empower homeowners with instant, transparent, and accurate estimates of solar capacity, bill savings, and payback timeframes before engaging vendors.
            </p>
          </div>

          <div className="surface-card rounded-2xl p-6">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-xl font-extrabold text-foreground">
              Transparent Engineering
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Built with open physical formulas, calibrated regional irradiance data, and interactive visual controls that put property owners in control.
            </p>
          </div>
        </div>

        {/* Clean Advisory Card */}
        <div className="mt-10 rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-soft">
          <div className="flex items-center gap-3 text-primary">
            <ShieldAlert className="h-5 w-5" />
            <h2 className="text-base font-extrabold">Advisory Note & Scope of Estimates</h2>
          </div>
          <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            SolarScope provides planning estimates based on meteorological solar datasets and mathematical models.
            Before commercial installation or financial commitment, we recommend:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-foreground/80">
            <li>On-site physical rooftop survey and tilt verification</li>
            <li>Structural load-bearing capacity assessment for solar mounts</li>
            <li>Electrical wiring, meter phase suitability, and grid interconnection check</li>
            <li>Certified vendor technical quotation</li>
          </ul>
        </div>

        <div className="mt-10 flex gap-4">
          <Button asChild variant="hero">
            <Link href="/calculator">Start Solar Estimate</Link>
          </Button>
          <Button asChild variant="soft">
            <Link href="/methodology">View Methodology</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
