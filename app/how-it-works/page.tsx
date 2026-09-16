import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Compass,
  Leaf,
  MapPin,
  Ruler,
  SunMedium,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How SolarScope Works",
  description:
    "See how rooftop, location, orientation, shading, and cost inputs shape a SolarScope estimate.",
};

const stages = [
  {
    icon: Ruler,
    n: "01",
    title: "Measure the opportunity",
    copy: "Start with total roof area and visually choose the portion that is unshaded and structurally usable for solar panels.",
  },
  {
    icon: MapPin,
    n: "02",
    title: "Place your rooftop",
    copy: "Select your city so local meteorological data and average peak sun hours can be applied accurately.",
  },
  {
    icon: Compass,
    n: "03",
    title: "Describe the roof",
    copy: "Set your roof azimuth direction and shading level through tactile visual controls and compass alignment.",
  },
  {
    icon: BarChart3,
    n: "04",
    title: "Review the economics",
    copy: "Add electricity tariff and capital cost assumptions to simulate 25-year financial returns and payback timeframes.",
  },
  {
    icon: Leaf,
    n: "05",
    title: "Understand the impact",
    copy: "Explore energy yield, cumulative savings, and carbon reduction metrics in one unified dashboard.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="pt-20">
      <section className="border-b border-line bg-surface">
        <div className="section-shell py-20 sm:py-28">
          <p className="eyebrow">How it works</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-extrabold leading-tight sm:text-6xl text-foreground">
            A guided solar estimate, designed to make every input understandable.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            SolarScope turns a technical engineering simulation into five simple, intuitive, and transparent visual decisions.
          </p>
        </div>
      </section>

      <section className="section-shell py-20">
        <div className="space-y-4">
          {stages.map(({ icon: Icon, n, title, copy }) => (
            <article
              key={n}
              className="group grid gap-6 rounded-2xl border border-line bg-surface p-6 sm:p-8 transition-all hover:-translate-y-1 hover:shadow-soft md:grid-cols-[80px_1fr_1fr] md:items-center"
            >
              <span className="font-display text-4xl font-extrabold text-line group-hover:text-fresh transition-colors">
                {n}
              </span>
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-secondary text-primary shadow-xs">
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="font-display text-2xl font-extrabold text-foreground">
                  {title}
                </h2>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                {copy}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button asChild variant="hero" size="lg">
            <Link href="/calculator">
              Open the Calculator <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-deep py-16 text-deep-foreground mx-4 sm:mx-8 mb-12 rounded-3xl relative overflow-hidden">
        <div className="section-shell flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <SunMedium className="h-10 w-10 text-solar shrink-0" />
            <div>
              <h2 className="text-xl font-extrabold">
                Planning estimate, not a certified audit
              </h2>
              <p className="mt-1 text-sm text-deep-foreground/70">
                Every calculation is presented transparently for pre-feasibility planning.
              </p>
            </div>
          </div>
          <Button asChild variant="solar">
            <Link href="/methodology">View Methodology</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
