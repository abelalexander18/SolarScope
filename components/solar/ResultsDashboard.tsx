"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bolt,
  Clock3,
  CloudSun,
  Compass,
  Home,
  IndianRupee,
  Leaf,
  Sun,
  TreePine,
  CarFront,
  Info,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { SolarResult } from "@/data/mockSolarResult";
import { SolarVisual } from "./SolarVisual";
import { Button } from "@/components/ui/button";

const icons = {
  sun: Sun,
  bolt: Bolt,
  rupee: IndianRupee,
  home: Home,
  clock: Clock3,
  leaf: Leaf,
};

const insightIcons = {
  sun: Sun,
  compass: Compass,
  cloud: CloudSun,
  rupee: IndianRupee,
};

const rupee = (v: number) =>
  `₹${Math.abs(v) >= 100000 ? `${(v / 100000).toFixed(1)}L` : `${Math.round(v / 1000)}k`}`;

import { saveCalculation } from "@/app/dashboard/actions";
import type { SolarCalculatorInput } from "@/data/mockSolarResult";
import { Bookmark, CheckCircle2 } from "lucide-react";

export function ResultsDashboard({
  result,
  input,
  onReset,
}: {
  result: SolarResult;
  input?: SolarCalculatorInput;
  onReset?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleSave = async () => {
    if (!input) return;
    setIsSaving(true);
    
    // Convert camelCase input/result fields to snake_case for Supabase
    const payload = {
      roof_area: input.roofArea,
      usable_roof_percent: input.usableRoofPercent,
      city: input.city,
      state: input.state,
      latitude: input.latitude,
      longitude: input.longitude,
      fetched_irradiance: input.fetchedIrradiance,
      orientation: input.orientation,
      shading: input.shading,
      electricity_tariff: input.electricityTariff,
      installation_cost_per_kw: input.installationCostPerKw,
      panel_efficiency: input.panelEfficiency,
      performance_ratio: input.performanceRatio,
      emission_factor: input.emissionFactor,
      
      system_size_kw: result.systemSizeKw,
      annual_generation_kwh: result.monthlyGeneration.reduce((a, b) => a + b.generation, 0),
      annual_savings_rs: result.financialProjection[1].savings - result.financialProjection[0].savings,
      payback_period_years: result.paybackYears,
      co2_mitigation_tonnes: result.co2OffsetTonnes,
    };

    const response = await saveCalculation(payload);
    setIsSaving(false);
    
    if (response.success) {
      setSaveSuccess(true);
    } else {
      if (response.error === 'You must be logged in to save.') {
        alert('Please Sign In to save your calculation.');
        window.location.href = '/login';
      } else {
        alert(response.error);
      }
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Top Banner & Roof Score */}
      <section className="section-shell pt-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <Sparkles className="h-4 w-4 text-fresh" />
            SolarScope Analysis Engine
          </div>
          <div className="flex items-center gap-3">
            {input && (
              <Button
                variant="hero"
                size="sm"
                onClick={handleSave}
                disabled={isSaving || saveSuccess}
                className="gap-2"
              >
                {saveSuccess ? (
                  <><CheckCircle2 className="h-3.5 w-3.5" /> Saved to Workspace</>
                ) : (
                  <><Bookmark className="h-3.5 w-3.5" /> {isSaving ? 'Saving...' : 'Save Calculation'}</>
                )}
              </Button>
            )}
            {onReset ? (
              <Button
                variant="soft"
                size="sm"
                onClick={onReset}
                className="gap-2"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Modify Inputs
              </Button>
            ) : (
              <Button asChild variant="soft" size="sm" className="gap-2">
                <Link href="/calculator">
                  <RotateCcw className="h-3.5 w-3.5" /> New Calculation
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-2xl bg-deep p-7 text-deep-foreground shadow-soft sm:p-10 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-48 h-48 bg-fresh/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-solar px-3 py-1 text-[10px] font-extrabold uppercase tracking-[.15em] text-solar-foreground">
                Estimate
              </span>
              <span className="text-sm font-semibold text-deep-foreground/75">
                {result.location}
              </span>
            </div>
            <p className="mt-10 text-sm font-semibold text-deep-foreground/60">
              Your Solar Potential
            </p>
            <div className="mt-2 flex items-end gap-3">
              <span className="font-display text-7xl font-extrabold sm:text-8xl tracking-tight">
                {result.systemSizeKw}
              </span>
              <span className="mb-3 text-2xl font-bold text-solar">kW</span>
            </div>
            <p className="mt-2 text-sm font-semibold">
              Estimated Solar System Size
            </p>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-deep-foreground/75">
              {result.summary}
            </p>
          </div>

          <div className="surface-card rounded-2xl p-7 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Solar potential</p>
                <h2 className="mt-2 text-2xl font-extrabold">
                  Overall roof score
                </h2>
              </div>
              <Info className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div
                className="relative grid h-44 w-44 place-items-center rounded-full transition-all duration-1000"
                style={{
                  background: `conic-gradient(var(--fresh) ${
                    visible ? result.score : 0
                  }%, var(--secondary) 0)`,
                }}
              >
                <div className="grid h-36 w-36 place-items-center rounded-full bg-surface text-center shadow-inner">
                  <div>
                    <p className="font-display text-4xl font-extrabold">
                      {result.score}
                    </p>
                    <p className="text-xs font-extrabold text-fresh tracking-wider uppercase">
                      {result.rating}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 w-full space-y-3.5">
                {result.factors.map((f) => (
                  <div key={f.label}>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="font-bold text-foreground">
                        {f.label}
                      </span>
                      <span className="text-muted-foreground font-semibold">
                        {f.level}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-fresh transition-[width] duration-1000"
                        style={{ width: visible ? `${f.value}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Key Metric Cards */}
      <section className="section-shell">
        <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-6">
          {result.metrics.map((m, i) => {
            const Icon = icons[m.icon];
            return (
              <article
                key={m.key}
                className="surface-card reveal rounded-xl p-5 hover:border-fresh/50 transition-all hover:-translate-y-1"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-6 font-display text-xl font-extrabold text-foreground">
                  {m.value}
                </p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {m.label}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Financial Analytics & Monthly Generation */}
      <section className="section-shell grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        {/* Financial Chart */}
        <article className="surface-card min-w-0 rounded-2xl p-5 sm:p-7">
          <p className="eyebrow">Financial analytics</p>
          <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-3xl font-extrabold">
                Your Solar Investment
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Estimated 25-year cumulative savings vs net benefit
              </p>
            </div>
            <div className="rounded-xl bg-secondary px-4 py-2 border border-line">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">
                Estimated break-even
              </p>
              <p className="font-extrabold text-primary">
                Year {result.paybackYears}
              </p>
            </div>
          </div>

          <div className="mt-8 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={result.financialProjection}
                margin={{ top: 10, left: 0, right: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="save" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--fresh)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--fresh)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--line)" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={rupee}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={52}
                />
                <Tooltip
                  formatter={(v) => [rupee(Number(v)), ""]}
                  labelFormatter={(v) => `Year ${v}`}
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "var(--line)",
                    backgroundColor: "var(--surface)",
                    boxShadow: "var(--shadow-soft)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  name="Cumulative Savings"
                  stroke="var(--fresh)"
                  strokeWidth={3}
                  fill="url(#save)"
                />
                <Line
                  type="monotone"
                  dataKey="netBenefit"
                  name="Net Benefit"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  dot={false}
                />
                <ReferenceLine
                  x={Math.round(result.paybackYears)}
                  stroke="var(--solar)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  label={{
                    value: "Break-even",
                    position: "top",
                    fill: "var(--solar-foreground)",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap gap-5 text-xs font-semibold text-muted-foreground border-t border-line pt-4">
            <span className="flex items-center gap-2 text-foreground">
              <i className="h-2.5 w-2.5 rounded-full bg-fresh" />
              Cumulative Savings
            </span>
            <span className="flex items-center gap-2 text-foreground">
              <i className="h-2.5 w-2.5 rounded-full bg-primary" />
              Net Benefit
            </span>
            <span className="flex items-center gap-2 text-foreground">
              <i className="h-2.5 w-2.5 rounded-full bg-solar" />
              Break-even ({result.paybackYears} yrs)
            </span>
          </div>
        </article>

        {/* Monthly Generation Bar Chart */}
        <article className="surface-card min-w-0 rounded-2xl p-5 sm:p-7 flex flex-col justify-between">
          <div>
            <p className="eyebrow">Energy profile</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold">
              Expected Monthly Generation
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Seasonal sunlight variation in kWh
            </p>
          </div>

          <div className="mt-8 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={result.monthlyGeneration}
                margin={{ top: 10, left: 0, right: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--line)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(v) => [`${Number(v).toLocaleString("en-IN")} kWh`, "Generation"]}
                  labelFormatter={(_, p) =>
                    p?.[0]?.payload?.fullMonth || ""
                  }
                  cursor={{ fill: "var(--secondary)" }}
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "var(--line)",
                    backgroundColor: "var(--surface)",
                  }}
                />
                <Bar dataKey="generation" radius={[6, 6, 0, 0]}>
                  {result.monthlyGeneration.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === 4 ? "var(--solar)" : "var(--fresh)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-line pt-3">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-xs bg-fresh" /> Average Months
            </span>
            <span className="flex items-center gap-2 font-bold text-foreground">
              <span className="h-2.5 w-2.5 rounded-xs bg-solar" /> Peak Month (May)
            </span>
          </div>
        </article>
      </section>

      {/* Environmental Impact Section */}
      <section className="bg-deep py-16 text-deep-foreground rounded-3xl mx-4 sm:mx-8 relative overflow-hidden">
        <div className="section-shell grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow text-solar">Your Environmental Impact</p>
            <div className="mt-5 flex items-end gap-3">
              <span className="font-display text-6xl font-extrabold sm:text-7xl">
                {result.co2OffsetTonnes}
              </span>
              <span className="mb-2 text-xl text-solar font-bold">tonnes</span>
            </div>
            <p className="mt-2 text-deep-foreground/75 font-semibold">
              CO₂ emissions avoided every year
            </p>
            <p className="mt-8 text-xs text-deep-foreground/50">
              Equivalent environmental offsets calculated from clean solar generation.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-deep-foreground/10 bg-deep-foreground/5 p-6 backdrop-blur-xs">
              <TreePine className="h-8 w-8 text-fresh" />
              <p className="mt-6 text-3xl font-extrabold">
                {result.equivalents.trees.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-sm text-deep-foreground/70">
                Trees growing for one full year
              </p>
            </div>
            <div className="rounded-2xl border border-deep-foreground/10 bg-deep-foreground/5 p-6 backdrop-blur-xs">
              <CarFront className="h-8 w-8 text-solar" />
              <p className="mt-6 text-3xl font-extrabold">
                {result.equivalents.carKm}
              </p>
              <p className="mt-1 text-sm text-deep-foreground/70">
                Passenger-car emissions avoided
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rooftop Layout Visual & Key Insights */}
      <section className="section-shell grid gap-8 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Rooftop visualization</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold">
            An illustrative {result.panelCount}-panel layout.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A visual reference based on your ~{result.systemSizeKw} kW capacity.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-xl border border-line bg-surface p-3.5 shadow-xs">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Simulated Solar Yield
              </span>
              <span className="font-display text-base font-extrabold text-foreground">
                1,338 kWh/kW
              </span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-line shadow-soft">
              <SolarVisual compact coverage={78} showYieldBadge={false} />
            </div>
          </div>
        </div>

        <div>
          <p className="eyebrow">Recommendations</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold">
            Key Insights
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {result.insights.map((x) => {
              const Icon = insightIcons[x.type];
              return (
                <article
                  key={x.title}
                  className="rounded-2xl border border-line bg-surface p-5 transition-transform hover:-translate-y-1 hover:shadow-soft"
                >
                  <Icon className="h-6 w-6 text-fresh" />
                  <h3 className="mt-5 font-extrabold text-foreground">
                    {x.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {x.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subtle Footer Advisory */}
      <section className="section-shell pt-4 pb-2">
        <p className="text-center text-xs text-muted-foreground">
          * Estimates are calculated based on public meteorological irradiance records and standard PV performance factors. Not a certified on-site structural audit.
        </p>
      </section>
    </div>
  );
}
