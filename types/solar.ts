export type Orientation = 'North' | 'Northeast' | 'East' | 'Southeast' | 'South' | 'Southwest' | 'West' | 'Northwest';

export type Shading = 'None' | 'Low' | 'Medium' | 'High';

export interface SolarLocationData {
  state: string;
  averageDailyIrradiance: number; // kWh/m²/day
  monthlyFactors: number[];
}

export interface SolarInputs {
  location: string;
  roofArea: number; // m²
  usableRoofPercentage: number; // 0 to 1
  orientation: Orientation;
  shading: Shading;
  tariff: number; // ₹/kWh
  systemCostPerKW: number; // ₹/kW
  performanceRatio: number; // 0 to 1
  panelPowerDensity: number; // W/m²
  tariffEscalationRate: number; // 0 to 1
}

export interface SolarResults {
  usableRoofArea: number; // m²
  systemCapacityKW: number; // kW
  annualGenerationKWh: number; // kWh
  annualSavingsINR: number; // ₹
  systemCostINR: number; // ₹
  paybackPeriodYears: number; // years
  co2OffsetKg: number; // kg CO2
  monthlyGenerationKWh: number[]; // Array of 12 numbers
  cumulativeSavings: { year: number; savings: number; investment: number }[]; // 25 years data
  score: 'Excellent' | 'Good' | 'Moderate' | 'Limited';
  scoreFactors: {
    irradiance: 'Excellent' | 'Good' | 'Moderate' | 'Limited';
    orientation: 'Excellent' | 'Good' | 'Moderate' | 'Limited';
    shading: 'Excellent' | 'Good' | 'Moderate' | 'Limited';
    area: 'Excellent' | 'Good' | 'Moderate' | 'Limited';
  };
}
