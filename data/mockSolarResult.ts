export type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
export type ShadeLevel = "none" | "low" | "medium" | "high";

export interface SolarCalculatorInput {
  roofArea: number;
  usableRoofPercent: number;
  country: "India";
  state: string;
  city: string;
  orientation: Direction;
  shading: ShadeLevel;
  electricityTariff: number;
  installationCostPerKw: number;
  panelEfficiency: number;
  performanceRatio: number;
  emissionFactor: number;
  latitude?: number;
  longitude?: number;
  fetchedIrradiance?: number;
}

export interface SolarMetric {
  key: string;
  label: string;
  value: string;
  icon: "sun" | "bolt" | "rupee" | "home" | "clock" | "leaf";
}

export interface SolarResult {
  location: string;
  systemSizeKw: number;
  annualGenerationKwh: number;
  annualSavings: number;
  systemCost: number;
  paybackYears: number;
  co2OffsetTonnes: number;
  score: number;
  rating: string;
  summary: string;
  metrics: SolarMetric[];
  factors: { label: string; value: number; level: string }[];
  monthlyGeneration: { month: string; fullMonth: string; generation: number }[];
  financialProjection: { year: number; investment: number; savings: number; netBenefit: number }[];
  equivalents: { trees: number; carKm: string };
  insights: { type: "sun" | "compass" | "cloud" | "rupee"; title: string; body: string }[];
  panelCount: number;
}

const monthlyGeneration = [
  ["Jan", "January", 920],
  ["Feb", "February", 960],
  ["Mar", "March", 1080],
  ["Apr", "April", 1120],
  ["May", "May", 1160],
  ["Jun", "June", 860],
  ["Jul", "July", 780],
  ["Aug", "August", 820],
  ["Sep", "September", 900],
  ["Oct", "October", 960],
  ["Nov", "November", 890],
  ["Dec", "December", 790],
].map(([month, fullMonth, generation]) => ({
  month: String(month),
  fullMonth: String(fullMonth),
  generation: Number(generation),
}));

const financialProjection = Array.from({ length: 26 }, (_, year) => {
  const savings = Math.round(89920 * year * Math.pow(1.035, Math.max(0, year - 1)));
  return { year, investment: -504000, savings, netBenefit: savings - 504000 };
});

export const mockSolarResult: SolarResult = {
  location: "Bengaluru, Karnataka",
  systemSizeKw: 8.4,
  annualGenerationKwh: 11240,
  annualSavings: 89920,
  systemCost: 504000,
  paybackYears: 5.6,
  co2OffsetTonnes: 7.87,
  score: 82,
  rating: "GOOD",
  summary: "Your roof shows strong potential for rooftop solar.",
  metrics: [
    { key: "size", label: "System Size", value: "8.4 kW", icon: "sun" },
    { key: "generation", label: "Annual Generation", value: "11,240 kWh", icon: "bolt" },
    { key: "savings", label: "Annual Savings", value: "₹89,920", icon: "rupee" },
    { key: "cost", label: "System Cost", value: "₹5.04 Lakh", icon: "home" },
    { key: "payback", label: "Payback", value: "5.6 years", icon: "clock" },
    { key: "offset", label: "CO₂ Offset", value: "7.87 tonnes/year", icon: "leaf" },
  ],
  factors: [
    { label: "Solar Irradiance", value: 86, level: "High" },
    { label: "Orientation", value: 94, level: "Excellent" },
    { label: "Shading", value: 82, level: "Low" },
    { label: "Roof Area", value: 76, level: "Good" },
  ],
  monthlyGeneration,
  financialProjection,
  equivalents: { trees: 357, carKm: "31,400 km" },
  insights: [
    { type: "sun", title: "Strong solar resource", body: "Your location receives favorable solar exposure throughout the year." },
    { type: "compass", title: "Good roof orientation", body: "Your selected orientation supports high annual solar generation." },
    { type: "cloud", title: "Low shading impact", body: "Limited shading supports stronger, cleaner generation." },
    { type: "rupee", title: "Estimated payback", body: "Projected savings can recover the initial investment over time." },
  ],
  panelCount: 16,
};

export const defaultSolarInput: SolarCalculatorInput = {
  roofArea: 120,
  usableRoofPercent: 70,
  country: "India",
  state: "Karnataka",
  city: "Bengaluru",
  orientation: "S",
  shading: "low",
  electricityTariff: 8,
  installationCostPerKw: 60000,
  panelEfficiency: 21,
  performanceRatio: 80,
  emissionFactor: 0.7,
};

const orientationFactors: Record<Direction, number> = {
  S: 1.0,
  SE: 0.95,
  SW: 0.95,
  E: 0.85,
  W: 0.85,
  NE: 0.75,
  NW: 0.75,
  N: 0.65,
};

const orientationScores: Record<Direction, { score: number; level: string }> = {
  S: { score: 98, level: "Excellent" },
  SE: { score: 92, level: "Very Good" },
  SW: { score: 92, level: "Very Good" },
  E: { score: 82, level: "Good" },
  W: { score: 82, level: "Good" },
  NE: { score: 68, level: "Moderate" },
  NW: { score: 68, level: "Moderate" },
  N: { score: 50, level: "Suboptimal" },
};

const shadingFactors: Record<ShadeLevel, number> = {
  none: 1.0,
  low: 0.9,
  medium: 0.75,
  high: 0.5,
};

const shadingScores: Record<ShadeLevel, { score: number; level: string }> = {
  none: { score: 98, level: "None" },
  low: { score: 85, level: "Low" },
  medium: { score: 65, level: "Moderate" },
  high: { score: 40, level: "High" },
};

const cityIrradiance: Record<string, number> = {
  Bengaluru: 5.3,
  Mumbai: 5.1,
  Delhi: 5.2,
  Chennai: 5.4,
  Hyderabad: 5.3,
  Pune: 5.3,
  Ahmedabad: 5.6,
  Kochi: 4.9,
  Jaipur: 5.5,
  Kolkata: 4.8,
};

const monthlyDistribution = [
  0.88, 0.92, 1.04, 1.08, 1.12, 0.83, 0.75, 0.79, 0.87, 0.93, 0.86, 0.77,
];

const monthNames = [
  ["Jan", "January"],
  ["Feb", "February"],
  ["Mar", "March"],
  ["Apr", "April"],
  ["May", "May"],
  ["Jun", "June"],
  ["Jul", "July"],
  ["Aug", "August"],
  ["Sep", "September"],
  ["Oct", "October"],
  ["Nov", "November"],
  ["Dec", "December"],
];

export function computeSolarPotential(input: SolarCalculatorInput): SolarResult {
  const usableArea = input.roofArea * (input.usableRoofPercent / 100);
  const powerDensityW = input.panelEfficiency * 10; // e.g. 21% -> 210 W/m²
  const systemSizeKw = Math.round((usableArea * powerDensityW) / 1000 * 10) / 10;

  const irradiance = input.fetchedIrradiance ?? cityIrradiance[input.city] ?? 5.2;
  const orientFactor = orientationFactors[input.orientation] ?? 0.9;
  const shadeFactor = shadingFactors[input.shading] ?? 0.85;
  const perfRatio = (input.performanceRatio || 80) / 100;

  const annualGen = Math.round(
    systemSizeKw * irradiance * 365 * perfRatio * orientFactor * shadeFactor
  );

  const annualSavings = Math.round(annualGen * input.electricityTariff);
  const systemCost = Math.round(systemSizeKw * input.installationCostPerKw);
  const paybackYears = annualSavings > 0 ? Math.round((systemCost / annualSavings) * 10) / 10 : 0;
  const co2OffsetTonnes = Math.round((annualGen * input.emissionFactor) / 1000 * 100) / 100;

  const orientMeta = orientationScores[input.orientation] ?? { score: 80, level: "Good" };
  const shadeMeta = shadingScores[input.shading] ?? { score: 80, level: "Low" };
  const roofScore = Math.min(100, Math.max(30, Math.round(input.usableRoofPercent * 0.9 + (input.roofArea > 60 ? 10 : 0))));
  const overallScore = Math.round(
    orientMeta.score * 0.35 +
    shadeMeta.score * 0.35 +
    (irradiance / 6.0) * 100 * 0.15 +
    roofScore * 0.15
  );

  let rating = "GOOD";
  if (overallScore >= 88) rating = "EXCELLENT";
  else if (overallScore >= 75) rating = "VERY GOOD";
  else if (overallScore >= 60) rating = "GOOD";
  else rating = "MODERATE";

  const costLakhs = (systemCost / 100000).toFixed(2);
  const formattedCost = systemCost >= 100000 ? `₹${costLakhs} Lakh` : `₹${systemCost.toLocaleString("en-IN")}`;

  const calculatedMonthly = monthNames.map(([shortM, fullM], i) => {
    const factor = monthlyDistribution[i] ?? 1;
    const baseMonthly = (annualGen / 12) * factor;
    return {
      month: shortM,
      fullMonth: fullM,
      generation: Math.round(baseMonthly),
    };
  });

  const proj = Array.from({ length: 26 }, (_, year) => {
    if (year === 0) {
      return { year: 0, investment: -systemCost, savings: 0, netBenefit: -systemCost };
    }
    const compoundedSavings = Math.round(
      annualSavings * year * Math.pow(1.035, Math.max(0, year - 1))
    );
    return {
      year,
      investment: -systemCost,
      savings: compoundedSavings,
      netBenefit: compoundedSavings - systemCost,
    };
  });

  const panelWattage = 450;
  const panelCount = Math.max(4, Math.round((systemSizeKw * 1000) / panelWattage));

  const treesCount = Math.round(co2OffsetTonnes * 45);
  const carKm = `${Math.round(co2OffsetTonnes * 3980).toLocaleString("en-IN")} km`;

  return {
    location: `${input.city}, ${input.state}`,
    systemSizeKw,
    annualGenerationKwh: annualGen,
    annualSavings,
    systemCost,
    paybackYears,
    co2OffsetTonnes,
    score: overallScore,
    rating,
    summary: `Your rooftop in ${input.city} receives approx. ${irradiance} kWh/m²/day peak irradiance. With a ${systemSizeKw} kW array, you can expect an estimated ${annualGen.toLocaleString("en-IN")} kWh clean generation annually.`,
    metrics: [
      { key: "size", label: "System Size", value: `${systemSizeKw} kW`, icon: "sun" },
      { key: "generation", label: "Annual Generation", value: `${annualGen.toLocaleString("en-IN")} kWh`, icon: "bolt" },
      { key: "savings", label: "Annual Savings", value: `₹${annualSavings.toLocaleString("en-IN")}`, icon: "rupee" },
      { key: "cost", label: "System Cost", value: formattedCost, icon: "home" },
      { key: "payback", label: "Payback", value: `${paybackYears} years`, icon: "clock" },
      { key: "offset", label: "CO₂ Offset", value: `${co2OffsetTonnes} tonnes/year`, icon: "leaf" },
    ],
    factors: [
      { label: "Solar Irradiance", value: Math.round((irradiance / 6.0) * 100), level: irradiance >= 5.3 ? "High" : "Moderate" },
      { label: "Orientation", value: orientMeta.score, level: orientMeta.level },
      { label: "Shading", value: shadeMeta.score, level: shadeMeta.level },
      { label: "Roof Area", value: roofScore, level: input.roofArea >= 80 ? "Good" : "Compact" },
    ],
    monthlyGeneration: calculatedMonthly,
    financialProjection: proj,
    equivalents: { trees: treesCount, carKm },
    insights: [
      {
        type: "sun",
        title: "Solar resource",
        body: `${input.city} receives approximately ${irradiance} kWh/m²/day average solar irradiance.`,
      },
      {
        type: "compass",
        title: `${input.orientation}-facing roof`,
        body: orientMeta.score >= 80 ? "Favorable solar angle provides strong daily radiation profile." : "Non-south orientation reduces daily peak exposure by 15-30%.",
      },
      {
        type: "cloud",
        title: `${input.shading === "none" ? "Zero" : input.shading} shading profile`,
        body: input.shading === "high" ? "High shade may require micro-inverters or panel-level optimizers." : "Low obstruction ensures maximum daily panel efficiency.",
      },
      {
        type: "rupee",
        title: `Estimated ${paybackYears}-year break-even`,
        body: `At ₹${input.electricityTariff}/kWh, the ₹${annualSavings.toLocaleString("en-IN")} yearly savings will repay the installation in ~${paybackYears} years.`,
      },
    ],
    panelCount,
  };
}
