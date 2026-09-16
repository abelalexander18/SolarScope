import { Metadata } from "next";
import {
  ArrowDown,
  Calculator,
  CircleDollarSign,
  CloudSun,
  Compass,
  Leaf,
  Ruler,
  Sun,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
  title: "SolarScope Methodology & Assumptions",
  description:
    "Understand the reference formulas and engineering assumptions behind SolarScope planning estimates.",
};

const flow = [
  { icon: Ruler, label: "Roof Area & Usable Space" },
  { icon: Sun, label: "Solar Resource Irradiance" },
  { icon: Compass, label: "Orientation Factor" },
  { icon: CloudSun, label: "Shading Coefficient" },
  { icon: Calculator, label: "Annual Energy Generation (kWh)" },
  { icon: CircleDollarSign, label: "Financial Savings & Payback" },
  { icon: Leaf, label: "Carbon Offsets & Environmental Impact" },
];

const formulas = [
  {
    title: "System Capacity (kW)",
    a: "Usable Roof Area (m²)",
    op: "×",
    b: "Panel Power Density (W/m²) ÷ 1000",
  },
  {
    title: "Annual Generation (kWh)",
    a: "Capacity (kW) × Peak Sun Hours × 365",
    op: "×",
    b: "Performance Ratio × Orientation × Shading",
  },
  {
    title: "Annual Savings (₹)",
    a: "Annual Generation (kWh)",
    op: "×",
    b: "Grid Electricity Tariff (₹/kWh)",
  },
  {
    title: "Payback Period (Years)",
    a: "Total System Cost (₹)",
    op: "÷",
    b: "Annual Electricity Savings (₹)",
  },
  {
    title: "CO₂ Offset (Tonnes/yr)",
    a: "Annual Generation (kWh)",
    op: "×",
    b: "Grid Emission Factor (0.7 kg/kWh) ÷ 1000",
  },
  {
    title: "25-Year Net Benefit",
    a: "Compounded Lifetime Savings (3.5% tariff rise)",
    op: "−",
    b: "Initial Capital Expenditure (CapEx)",
  },
];

export default function MethodologyPage() {
  return (
    <main className="pt-20">
      <section className="section-shell py-20 sm:py-28">
        <p className="eyebrow">Transparent by design</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-extrabold leading-tight sm:text-6xl text-foreground">
          Methodology without the black box.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          A clear, visible breakdown of the physical equations, meteorological datasets, and financial principles driving SolarScope.
        </p>
      </section>

      {/* Process Flow Diagram */}
      <section className="border-y border-line bg-surface py-20">
        <div className="section-shell">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="eyebrow">Data Pipeline</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-foreground">
              Calculation Sequence
            </h2>
          </div>

          <div className="mx-auto flex max-w-xl flex-col items-stretch">
            {flow.map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex flex-col items-center">
                <div className="group flex w-full items-center gap-5 rounded-2xl border border-line bg-background p-5 shadow-soft transition-transform hover:scale-[1.01]">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-primary shadow-xs">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-base sm:text-lg font-extrabold uppercase text-foreground">
                    {label}
                  </span>
                </div>
                {i < flow.length - 1 && (
                  <ArrowDown className="my-3 h-5 w-5 text-fresh" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reference Formulas */}
      <section className="section-shell py-20">
        <p className="eyebrow">Reference formulas</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold text-foreground">
          Engineering relationships, clearly shown.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {formulas.map((f) => (
            <article key={f.title} className="surface-card rounded-2xl p-6 flex flex-col justify-between">
              <h3 className="text-sm font-extrabold text-fresh tracking-wide">
                {f.title}
              </h3>
              <div className="mt-6 space-y-2 text-center">
                <p className="rounded-xl bg-secondary p-3 text-xs sm:text-sm font-display font-extrabold text-foreground">
                  {f.a}
                </p>
                <p className="text-xl font-bold text-muted-foreground">{f.op}</p>
                <p className="rounded-xl bg-secondary p-3 text-xs sm:text-sm font-display font-extrabold text-foreground">
                  {f.b}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Clean Professional Advisory Card */}
        <div className="mt-12 rounded-2xl border border-line bg-surface p-6 sm:p-8 flex items-start gap-4 shadow-soft">
          <ShieldAlert className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-primary">
              Planning Estimates & Scope of Assumptions
            </p>
            <p className="mt-2 max-w-4xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
              SolarScope provides planning estimates based on simulated solar irradiance data and standard PV performance factors.
              Results should be used for early-stage feasibility evaluation and do not replace a certified on-site structural assessment, shading drone survey, or electrical grid interconnection study before contractual commitment.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
