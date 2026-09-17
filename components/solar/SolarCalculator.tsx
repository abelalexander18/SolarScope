"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  LoaderCircle,
  Minus,
  Plus,
  Settings2,
  Sun,
  Sparkles,
  MapPin,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  defaultSolarInput,
  type Direction,
  type ShadeLevel,
  type SolarCalculatorInput,
  type SolarResult,
  computeSolarPotential,
} from "@/data/mockSolarResult";
import { SolarVisual } from "./SolarVisual";
import { GoogleMapLocation } from "./GoogleMapLocation";
import { OrientationCompass } from "./OrientationCompass";
import { ResultsDashboard } from "./ResultsDashboard";
import { MapboxRoofDraw } from "./MapboxRoofDraw";
import { fetchNASA_PSH, geocodeLocation } from "@/lib/solar/api";

const stages = ["Roof", "Location", "Orientation", "Energy", "Results"];

const directionCopy: Record<Direction, string> = {
  N: "Lower direct exposure in the northern hemisphere (approx. 65% yield)",
  NE: "Balanced morning solar exposure with gradual afternoon falloff",
  E: "Strong morning generation profile, optimal for morning home energy use",
  SE: "Very good morning-to-midday exposure (~95% optimal yield)",
  S: "Optimal orientation for maximum annual solar radiation in India",
  SW: "Very good midday-to-evening exposure (~95% optimal yield)",
  W: "Strong afternoon generation profile, peaks during hot hours",
  NW: "Moderate late-day solar exposure with lower overall yield",
};

const shadeOptions: {
  value: ShadeLevel;
  icon: string;
  title: string;
  copy: string;
}[] = [
  { value: "none", icon: "☀", title: "No Shade", copy: "Clear, unobstructed sky" },
  { value: "low", icon: "🌤", title: "Low Shade", copy: "Minor trees or parapets" },
  { value: "medium", icon: "⛅", title: "Medium Shade", copy: "Partial chimney/tree shadows" },
  { value: "high", icon: "🌥", title: "High Shade", copy: "Frequent surrounding shade" },
];

const cities = [
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Delhi", state: "Delhi" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Pune", state: "Maharashtra" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Kochi", state: "Kerala" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Kolkata", state: "West Bengal" },
];

function NumberControl({
  value,
  onChange,
  step = 1,
  prefix = "",
  suffix = "",
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-line bg-surface p-2 shadow-xs">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onChange(Math.max(0, value - step))}
        aria-label="Decrease"
        className="rounded-xl"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="min-w-0 text-center">
        <span className="font-display text-3xl font-extrabold text-foreground">
          {prefix}
          {value.toLocaleString("en-IN")}
        </span>
        <span className="ml-1.5 text-sm font-bold text-muted-foreground">
          {suffix}
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onChange(value + step)}
        aria-label="Increase"
        className="rounded-xl"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function SolarCalculator({
  initialResult,
}: {
  initialResult?: SolarResult;
}) {
  const [step, setStep] = useState(initialResult ? 4 : 0);
  const [input, setInput] = useState<SolarCalculatorInput>(defaultSolarInput);
  const [advanced, setAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<SolarResult | undefined>(initialResult);

  const patch = <K extends keyof SolarCalculatorInput>(
    key: K,
    value: SolarCalculatorInput[K]
  ) => setInput((p) => ({ ...p, [key]: value }));

  const calculate = async () => {
    setLoading(true);
    setStep(4);
    setLoadingStep(0);

    const ticker = window.setInterval(
      () => setLoadingStep((s) => Math.min(4, s + 1)),
      380
    );

    try {
      await new Promise((r) => setTimeout(r, 1900));
      const res = computeSolarPotential(input);
      setResult(res);
    } finally {
      window.clearInterval(ticker);
      setLoading(false);
    }
  };

  const loadDemo = () => {
    setInput({
      roofArea: 150,
      usableRoofPercent: 80,
      country: "India",
      state: "Karnataka",
      city: "Bengaluru",
      orientation: "S",
      shading: "none",
      electricityTariff: 8.5,
      installationCostPerKw: 58000,
      panelEfficiency: 21.5,
      performanceRatio: 82,
      emissionFactor: 0.72,
    });
  };

  if (step === 4 && result && !loading) {
    return (
      <ResultsDashboard
        result={result}
        onReset={() => {
          setStep(0);
          setResult(undefined);
        }}
      />
    );
  }

  return (
    <div className="section-shell pb-24 pt-10">
      <div className="mb-9 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="eyebrow">Solar Rooftop Calculator</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl text-foreground">
            Build your rooftop estimate.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your rooftop specifics to simulate capacity, generation, savings, and payback.
          </p>
        </div>
        <Button
          type="button"
          variant="soft"
          size="sm"
          onClick={loadDemo}
          className="gap-2 self-start md:self-auto"
        >
          <Sparkles className="h-4 w-4 text-fresh" />
          Load Preset
        </Button>
      </div>

      {/* Step Progress Tracker */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex min-w-[570px] items-center">
          {stages.map((s, i) => (
            <div key={s} className="flex flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => i < step && !loading && setStep(i)}
                className="group flex items-center gap-2.5 cursor-pointer disabled:cursor-not-allowed"
                disabled={i > step || loading}
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-extrabold transition-colors ${
                    i < step
                      ? "border-fresh bg-fresh text-primary-foreground"
                      : i === step
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-line bg-surface text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : `0${i + 1}`}
                </span>
                <span
                  className={`text-xs font-bold ${
                    i === step ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s}
                </span>
              </button>
              {i < stages.length - 1 && (
                <span
                  className={`mx-3 h-0.5 flex-1 transition-colors ${
                    i < step ? "bg-fresh" : "bg-line"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingState index={loadingStep} />
      ) : (
        <div className="surface-card overflow-hidden rounded-2xl shadow-soft">
          <div className="grid min-h-[35rem] lg:grid-cols-[1.05fr_.95fr]">
            {/* Form Column */}
            <div className="p-6 sm:p-10 flex flex-col justify-between">
              <div>
                {step === 0 && <RoofStep input={input} patch={patch} />}
                {step === 1 && <LocationStep input={input} patch={patch} />}
                {step === 2 && <OrientationStep input={input} patch={patch} />}
                {step === 3 && (
                  <EnergyStep
                    input={input}
                    patch={patch}
                    advanced={advanced}
                    setAdvanced={setAdvanced}
                  />
                )}
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-line pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={step === 0}
                  onClick={() => setStep((s) => s - 1)}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                {step < 3 ? (
                  <Button
                    type="button"
                    variant="hero"
                    onClick={() => setStep((s) => s + 1)}
                    className="gap-2"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="solar"
                    size="lg"
                    onClick={calculate}
                    className="gap-2"
                  >
                    Calculate My Solar Potential <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Interactive Preview Column */}
            <div className="border-t border-line bg-secondary/35 p-6 sm:p-8 lg:border-l lg:border-t-0 flex flex-col justify-center">
              {step === 0 ? (
                /* Step 1 Roof Visual: Solar Yield card cleanly outside house, then house with ample space */
                <div className="flex flex-col gap-4">
                  {/* Dedicated Header Information Card */}
                  <div className="flex items-center justify-between rounded-2xl border border-line bg-surface/90 p-4 shadow-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Estimated Solar Yield
                      </span>
                      <p className="font-display text-lg font-extrabold text-foreground">
                        1,338 kWh/kW
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Usable Area
                      </span>
                      <p className="font-display text-lg font-extrabold text-fresh">
                        {input.usableRoofPercent}%
                      </p>
                    </div>
                  </div>

                  {/* House Illustration - Clean, unobstructed */}
                  <SolarVisual
                    compact={true}
                    coverage={input.usableRoofPercent}
                    showYieldBadge={false}
                  />

                  <p className="text-center text-xs text-muted-foreground">
                    Real-time array visualization updating as usable roof percentage is adjusted.
                  </p>
                </div>
              ) : step === 1 ? (
                /* Step 2 Location: Real Interactive Map */
                <GoogleMapLocation city={input.city} state={input.state} latitude={input.latitude} longitude={input.longitude} fetchedIrradiance={input.fetchedIrradiance} />
              ) : step === 2 ? (
                /* Step 3 Orientation: Real SVG Interactive Compass */
                <OrientationCompass
                  selectedOrientation={input.orientation}
                  onOrientationChange={(v) => patch("orientation", v)}
                />
              ) : (
                /* Step 4 Energy: Summary Snapshot */
                <Summary input={input} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RoofStep({
  input,
  patch,
}: {
  input: SolarCalculatorInput;
  patch: <K extends keyof SolarCalculatorInput>(
    k: K,
    v: SolarCalculatorInput[K]
  ) => void;
}) {
  const [mode, setMode] = useState<"manual" | "map">("manual");

  return (
    <div>
      <p className="eyebrow">01 — Your roof</p>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
        <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground">
          Tell us about your roof
        </h2>
        <div className="mt-0 sm:mt-3 flex items-center bg-secondary rounded-lg p-1 border border-line w-fit">
          <button
            type="button"
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${mode === "manual" ? "bg-surface shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setMode("manual")}
          >
            Manual
          </button>
          <button
            type="button"
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${mode === "map" ? "bg-surface shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setMode("map")}
          >
            Map Draw
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Enter your approximate total rooftop area and how much of it is unshaded and structurally usable.
      </p>

      <div className="mt-9">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-extrabold text-foreground">
            Total Roof Area
          </label>
          <span className="text-xs text-muted-foreground font-semibold">
            approx. {(input.roofArea * 10.764).toFixed(0)} sq. ft
          </span>
        </div>
        {mode === "manual" ? (
          <NumberControl
            value={input.roofArea}
            onChange={(v) => patch("roofArea", v)}
            step={5}
            suffix="m²"
          />
        ) : (
          <MapboxRoofDraw onAreaCalculated={(area) => patch("roofArea", area)} />
        )}
      </div>

      <div className="mt-9">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <label className="text-sm font-extrabold text-foreground">
              Usable Roof Area Percentage
            </label>
            <p className="text-xs text-muted-foreground">
              Available space free of tanks, vents, or shadows
            </p>
          </div>
          <span className="font-display text-2xl font-extrabold text-fresh">
            {input.usableRoofPercent}%
          </span>
        </div>
        <Slider
          value={[input.usableRoofPercent]}
          onValueChange={(v) => patch("usableRoofPercent", v[0] ?? 70)}
          max={100}
          step={1}
        />
        <div className="mt-2 flex justify-between text-[11px] font-bold text-muted-foreground">
          <span>0% (No panels)</span>
          <span>50% (Standard roof)</span>
          <span>100% (Open terrace)</span>
        </div>
      </div>
    </div>
  );
}

function LocationStep({
  input,
  patch,
}: {
  input: SolarCalculatorInput;
  patch: <K extends keyof SolarCalculatorInput>(
    k: K,
    v: SolarCalculatorInput[K]
  ) => void;
}) {
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        patch("latitude", latitude);
        patch("longitude", longitude);
        patch("city", "Exact Location");
        
        const psh = await fetchNASA_PSH(latitude, longitude);
        if (psh) {
          patch("fetchedIrradiance", psh);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const result = await geocodeLocation(searchQuery);
    if (result) {
      patch("latitude", result.lat);
      patch("longitude", result.lng);
      patch("city", "Exact Location");
      if (result.state) patch("state", result.state);
      
      const psh = await fetchNASA_PSH(result.lat, result.lng);
      if (psh) {
        patch("fetchedIrradiance", psh);
      }
    } else {
      alert("Location not found. Please try a different search.");
    }
    setIsSearching(false);
  };

  return (
    <div>
      <p className="eyebrow">02 — Location</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground">
        Where is your home?
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Solar resource irradiance data will be calibrated to your exact geographical climate.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex gap-2">
          <Input 
            placeholder="Type any city or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            className="flex-1"
          />
          <Button type="button" onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} variant="secondary">
            {isSearching ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Or</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <Button
          type="button"
          variant="hero"
          className="w-full gap-2 shadow-action"
          onClick={handleUseLocation}
          disabled={isLocating}
        >
          {isLocating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          {isLocating ? "Locating & Fetching NASA Data..." : "Use My Exact Location"}
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Or select from predefined</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-xs font-bold text-muted-foreground uppercase tracking-wider">
            State
          </label>
          <Select
            value={input.state}
            onValueChange={(v) => {
              patch("state", v);
              const matchingCity = cities.find((c) => c.state === v);
              if (matchingCity) patch("city", matchingCity.city);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {input.city === "Exact Location" && input.state !== "Karnataka" && input.state !== "Maharashtra" && input.state !== "Delhi" && input.state !== "Tamil Nadu" && input.state !== "Telangana" && input.state !== "Gujarat" && input.state !== "Kerala" && input.state !== "Rajasthan" && input.state !== "West Bengal" && (
                <SelectItem value={input.state}>{input.state}</SelectItem>
              )}
              <SelectItem value="Karnataka">Karnataka</SelectItem>
              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
              <SelectItem value="Delhi">Delhi</SelectItem>
              <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
              <SelectItem value="Telangana">Telangana</SelectItem>
              <SelectItem value="Gujarat">Gujarat</SelectItem>
              <SelectItem value="Kerala">Kerala</SelectItem>
              <SelectItem value="Rajasthan">Rajasthan</SelectItem>
              <SelectItem value="West Bengal">West Bengal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-muted-foreground uppercase tracking-wider">
            City / Meteorological Station
          </label>
          <Select
            value={input.city}
            onValueChange={(v) => {
              patch("city", v);
              const match = cities.find((c) => c.city === v);
              if (match) patch("state", match.state);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Exact Location">
                Exact Location (GPS {input.latitude ? `${input.latitude.toFixed(2)}, ${input.longitude?.toFixed(2)}` : "..."})
              </SelectItem>
              {cities.map((c) => (
                <SelectItem key={c.city} value={c.city}>
                  {c.city} ({c.state})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function OrientationStep({
  input,
  patch,
}: {
  input: SolarCalculatorInput;
  patch: <K extends keyof SolarCalculatorInput>(
    k: K,
    v: SolarCalculatorInput[K]
  ) => void;
}) {
  return (
    <div>
      <p className="eyebrow">03 — Roof profile</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground">
        Set orientation and shade
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">
        Select the primary direction your solar rooftop surface faces. South-facing roofs yield highest generation in India.
      </p>

      <div className="mt-7 rounded-2xl bg-secondary p-5 border border-line">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Selected roof orientation
        </p>
        <p className="mt-1 text-lg font-extrabold text-primary">
          {input.orientation} — {directionCopy[input.orientation]}
        </p>
      </div>

      <h3 className="mt-8 text-sm font-extrabold text-foreground">
        Obstruction & Shading Level
      </h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {shadeOptions.map((o) => (
          <button
            type="button"
            key={o.value}
            onClick={() => patch("shading", o.value)}
            className={`cursor-pointer rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
              input.shading === o.value
                ? "border-primary bg-primary text-primary-foreground shadow-action"
                : "border-line bg-surface hover:border-fresh/50"
            }`}
          >
            <span className="text-2xl">{o.icon}</span>
            <span className="mt-3 block text-sm font-extrabold">{o.title}</span>
            <span
              className={`mt-1 block text-[11px] font-medium ${
                input.shading === o.value
                  ? "text-primary-foreground/75"
                  : "text-muted-foreground"
              }`}
            >
              {o.copy}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function EnergyStep({
  input,
  patch,
  advanced,
  setAdvanced,
}: {
  input: SolarCalculatorInput;
  patch: <K extends keyof SolarCalculatorInput>(
    k: K,
    v: SolarCalculatorInput[K]
  ) => void;
  advanced: boolean;
  setAdvanced: (v: boolean) => void;
}) {
  return (
    <div>
      <p className="eyebrow">04 — Energy & cost</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground">
        Shape the financial estimate
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Customize your current grid tariff and capital expenditure per kilowatt.
      </p>

      <div className="mt-7 space-y-6">
        <div>
          <label className="mb-2 block text-sm font-extrabold text-foreground">
            Current Electricity Tariff
          </label>
          <NumberControl
            value={input.electricityTariff}
            onChange={(v) => patch("electricityTariff", v)}
            step={0.5}
            prefix="₹"
            suffix="/ kWh"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-extrabold text-foreground">
            Estimated Installation Cost per kW
          </label>
          <NumberControl
            value={input.installationCostPerKw}
            onChange={(v) => patch("installationCostPerKw", v)}
            step={1000}
            prefix="₹"
            suffix="/ kW"
          />
        </div>

        <button
          type="button"
          onClick={() => setAdvanced(!advanced)}
          className="flex w-full cursor-pointer items-center justify-between border-t border-line pt-5 text-sm font-extrabold text-foreground hover:text-primary transition-colors"
        >
          <span className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-fresh" /> Advanced Technical Parameters
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              advanced ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ${
            advanced ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0">
            <div className="space-y-5 rounded-2xl bg-secondary p-5 border border-line">
              {[
                {
                  label: "Solar Panel Efficiency",
                  key: "panelEfficiency" as const,
                  val: input.panelEfficiency,
                  min: 15,
                  max: 25,
                  step: 0.5,
                  suffix: "%",
                },
                {
                  label: "System Performance Ratio (PR)",
                  key: "performanceRatio" as const,
                  val: input.performanceRatio,
                  min: 60,
                  max: 95,
                  step: 1,
                  suffix: "%",
                },
                {
                  label: "CO₂ Grid Emission Factor",
                  key: "emissionFactor" as const,
                  val: input.emissionFactor,
                  min: 0.4,
                  max: 1.0,
                  step: 0.05,
                  suffix: "kg/kWh",
                },
              ].map(({ label, key, val, min, max, step, suffix }) => (
                <div key={key}>
                  <div className="mb-2 flex justify-between text-xs font-bold">
                    <span>{label}</span>
                    <span className="text-primary">
                      {val} {suffix}
                    </span>
                  </div>
                  <Slider
                    value={[val]}
                    min={min}
                    max={max}
                    step={step}
                    onValueChange={(v) => patch(key, v[0] ?? val)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Summary({ input }: { input: SolarCalculatorInput }) {
  return (
    <div className="flex h-full flex-col justify-center rounded-2xl bg-deep p-7 text-deep-foreground shadow-soft">
      <Sun className="h-10 w-10 text-solar" />
      <h3 className="mt-6 font-display text-2xl font-extrabold">
        Estimate snapshot
      </h3>
      <p className="mt-1 text-xs text-deep-foreground/60">
        Summary of parameters queued for the calculation model
      </p>
      <div className="mt-6 divide-y divide-deep-foreground/10">
        {[
          ["Roof", `${input.roofArea} m² · ${input.usableRoofPercent}% usable`],
          ["Location", `${input.city}, ${input.state}`],
          ["Orientation", `${input.orientation}-facing`],
          ["Shading", `${input.shading} shading`],
          ["Tariff", `₹${input.electricityTariff} / kWh`],
          ["Cost / kW", `₹${input.installationCostPerKw.toLocaleString("en-IN")}`],
        ].map(([a, b]) => (
          <div key={a} className="flex justify-between gap-4 py-3 text-sm">
            <span className="text-deep-foreground/55 font-medium">{a}</span>
            <span className="text-right font-bold capitalize">{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingState({ index }: { index: number }) {
  const items = [
    "Analyzing roof area & structural usable bounds...",
    "Retrieving local solar irradiance dataset...",
    "Computing annual & seasonal kWh energy generation...",
    "Simulating 25-year financial savings & payback...",
    "Assessing carbon reduction & environmental offsets...",
  ];

  return (
    <div className="surface-card grid min-h-[34rem] place-items-center rounded-2xl p-6 shadow-soft">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-secondary text-primary">
          <LoaderCircle className="h-10 w-10 animate-spin" />
        </span>
        <h2 className="mt-7 font-display text-3xl font-extrabold text-foreground">
          Building your solar picture
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Processing physical rooftop specifications through the model...
        </p>
        <div className="mt-8 space-y-3 text-left">
          {items.map((x, i) => (
            <div
              key={x}
              className={`flex items-center gap-3.5 rounded-xl border p-3.5 transition-all ${
                i <= index
                  ? "border-fresh/40 bg-secondary"
                  : "border-line opacity-40"
              }`}
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                  i < index
                    ? "bg-fresh text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {i < index ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                )}
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground">
                {x}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
