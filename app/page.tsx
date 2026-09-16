import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bolt,
  IndianRupee,
  Leaf,
  MapPin,
  Ruler,
  Sun,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SolarVisual } from "@/components/solar/SolarVisual";
import { mockSolarResult } from "@/data/mockSolarResult";

const benefits = [
  { icon: Sun, label: "Solar Potential", text: "Roof suitability at a glance" },
  { icon: IndianRupee, label: "Financial Returns", text: "Savings and payback clarity" },
  { icon: Bolt, label: "Energy Generation", text: "Monthly and annual estimates" },
  { icon: Leaf, label: "Environmental Impact", text: "See your carbon reduction" },
];

const steps = [
  {
    n: "01",
    icon: Ruler,
    title: "Enter Your Roof Details",
    body: "Share total usable area and structural characteristics of your rooftop space.",
  },
  {
    n: "02",
    icon: MapPin,
    title: "Analyze Solar Potential",
    body: "Specify location, orientation angle, and nearby shading exposure.",
  },
  {
    n: "03",
    icon: BarChart3,
    title: "Estimate Financial Returns",
    body: "Explore capital cost, annual bill savings, and estimated break-even timeline.",
  },
  {
    n: "04",
    icon: Leaf,
    title: "Understand Your Impact",
    body: "See clean kWh generation and annual metric tonnes of carbon emissions reduced.",
  },
];

export default function HomePage() {
  const sampleMetrics = mockSolarResult.metrics.filter((_, i) => i !== 3);

  return (
    <main className="overflow-hidden pt-20">
      {/* Hero Section */}
      <section className="section-shell grid min-h-[calc(100vh-5rem)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr] lg:py-16">
        <div className="max-w-2xl reveal">
          <p className="eyebrow mb-5 flex items-center gap-2">
            <span className="h-px w-7 bg-fresh" />
            Solar rooftop intelligence
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-[1.04] text-foreground sm:text-6xl lg:text-7xl">
            Know Your Roof&apos;s{" "}
            <span className="relative whitespace-nowrap text-fresh">
              Solar Potential.
              <span className="absolute inset-x-0 bottom-1 -z-10 h-3.5 rounded-full bg-fresh-soft" />
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Discover how much energy your rooftop could generate, how much you could save on electricity tariffs, and when your solar investment could pay for itself.
          </p>

          <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
            <Button asChild variant="hero" size="lg">
              <Link href="/calculator">
                Calculate My Solar Potential <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="soft" size="lg">
              <Link href="/how-it-works">Explore How It Works</Link>
            </Button>
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Zap className="h-4 w-4 text-fresh" />
            Zero signup required. Fast, interactive analysis in two minutes.
          </p>
        </div>

        {/* Hero Right Column: House Illustration + Spaced Sample Metrics */}
        <div className="reveal flex flex-col gap-4 w-full" style={{ animationDelay: "120ms" }}>
          {/* Main House Visual (Clean, spacious, no metric card overlap) */}
          <div className="w-full">
            <SolarVisual
              showYieldBadge={true}
              yieldValue="1,338 kWh/kW"
              coverage={76}
            />
          </div>

          {/* Sample Estimate Cards - Positioned cleanly BELOW the illustration */}
          <div className="surface-card rounded-2xl p-4 sm:p-5 shadow-soft border border-line">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-deep px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.14em] text-deep-foreground">
                  Sample Estimate
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  Standard 120 m² Terrace
                </span>
              </div>
              <span className="text-xs font-bold text-primary">
                Bengaluru, KA
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {sampleMetrics.map((m) => (
                <div
                  key={m.key}
                  className="rounded-xl bg-secondary/60 p-3 border border-line/50 transition-colors hover:bg-secondary"
                >
                  <p className="font-display text-base sm:text-lg font-extrabold text-foreground">
                    {m.value}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold text-muted-foreground">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Strip */}
      <section className="border-y border-line bg-surface">
        <div className="section-shell grid sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, label, text }) => (
            <div
              key={label}
              className="group flex items-center gap-4 border-b border-line p-6 transition-colors hover:bg-secondary sm:nth-[2n+1]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-secondary text-primary transition-transform group-hover:-translate-y-1 shadow-xs">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-foreground">{label}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-shell py-24">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">A clearer path to solar</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-extrabold leading-tight sm:text-5xl text-foreground">
              From rooftop details to a decision-ready estimate.
            </h2>
          </div>
          <Button asChild variant="soft">
            <Link href="/how-it-works">
              See the full process <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="relative mt-16 grid gap-6 lg:grid-cols-4">
          <div className="absolute left-[10%] right-[10%] top-9 hidden h-px bg-line lg:block" />
          {steps.map(({ n, icon: Icon, title, body }) => (
            <article
              key={n}
              className="group relative border-t border-line pt-7 transition-all"
            >
              <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-line bg-background font-display text-xs font-extrabold text-fresh transition-all group-hover:-translate-y-1 group-hover:bg-primary group-hover:text-primary-foreground shadow-xs">
                {n}
              </span>
              <Icon className="mt-9 h-7 w-7 text-primary transition-transform group-hover:rotate-6 group-hover:scale-110" />
              <h3 className="mt-5 font-display text-xl font-extrabold text-foreground">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="bg-deep py-20 text-deep-foreground mx-4 sm:mx-8 mb-12 rounded-3xl relative overflow-hidden">
        <div className="section-shell grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow text-solar">Your roof has a story</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold">
              See what it could produce.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-deep-foreground/70">
              Simulate generation, installation cost, return on investment, and environmental impact tailored to your property.
            </p>
          </div>
          <Button asChild variant="solar" size="lg">
            <Link href="/calculator">
              Start Your Estimate <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
