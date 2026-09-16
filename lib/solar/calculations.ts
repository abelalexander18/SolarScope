import { SolarInputs, SolarResults, SolarLocationData } from '@/types/solar';
import { SOLAR_CONSTANTS } from './constants';
import solarData from '@/data/solar-data.json';

export function calculateSolarPotential(inputs: SolarInputs): SolarResults {
  const {
    location,
    roofArea,
    usableRoofPercentage,
    orientation,
    shading,
    tariff,
    systemCostPerKW,
    performanceRatio,
    panelPowerDensity,
    tariffEscalationRate
  } = inputs;

  const locData = (solarData as Record<string, SolarLocationData>)[location];
  if (!locData) {
    throw new Error('Location not found in database');
  }

  // 1. Usable Roof Area
  const usableRoofArea = roofArea * usableRoofPercentage;

  // 2 & 3. DC System Capacity (kW) = Area * PowerDensity(W/m2) / 1000
  const systemCapacityKW = (usableRoofArea * panelPowerDensity) / 1000;

  // 4. Annual Solar Generation
  const orientationFactor = SOLAR_CONSTANTS.ORIENTATION_FACTORS[orientation];
  const shadingFactor = SOLAR_CONSTANTS.SHADING_FACTORS[shading];
  const peakSunHours = locData.averageDailyIrradiance;

  const annualGenerationKWh = systemCapacityKW * peakSunHours * 365 * performanceRatio * orientationFactor * shadingFactor;

  // 5. Annual Savings
  const annualSavingsINR = annualGenerationKWh * tariff;

  // 6. System Cost
  const systemCostINR = systemCapacityKW * systemCostPerKW;

  // 7. Payback Period
  const paybackPeriodYears = annualSavingsINR > 0 ? systemCostINR / annualSavingsINR : 0;

  // 8. CO2 Offset
  const co2OffsetKg = annualGenerationKWh * SOLAR_CONSTANTS.GRID_EMISSION_FACTOR;

  // Monthly Generation
  const monthlyGenerationKWh = locData.monthlyFactors.map(factor => {
    // Distribute annual generation proportionally
    const monthlyBase = (annualGenerationKWh / 12) * factor;
    return monthlyBase;
  });

  // Cumulative Savings (25 Years)
  const cumulativeSavings = [];
  let currentTariff = tariff;
  let totalSavings = 0;
  
  for (let year = 1; year <= 25; year++) {
    const savingsThisYear = annualGenerationKWh * currentTariff;
    totalSavings += savingsThisYear;
    cumulativeSavings.push({
      year,
      savings: totalSavings,
      investment: systemCostINR
    });
    currentTariff *= (1 + tariffEscalationRate);
  }

  // Scoring Logic
  let irradianceScore: 'Excellent' | 'Good' | 'Moderate' | 'Limited' = 'Good';
  if (peakSunHours >= 5.3) irradianceScore = 'Excellent';
  else if (peakSunHours < 4.5) irradianceScore = 'Limited';
  else if (peakSunHours < 5.0) irradianceScore = 'Moderate';

  let orientationScore: 'Excellent' | 'Good' | 'Moderate' | 'Limited' = 'Good';
  if (orientationFactor >= 0.95) orientationScore = 'Excellent';
  else if (orientationFactor <= 0.75) orientationScore = 'Limited';
  else if (orientationFactor < 0.9) orientationScore = 'Moderate';

  let shadingScore: 'Excellent' | 'Good' | 'Moderate' | 'Limited' = 'Good';
  if (shadingFactor === 1) shadingScore = 'Excellent';
  else if (shadingFactor <= 0.6) shadingScore = 'Limited';
  else if (shadingFactor < 0.85) shadingScore = 'Moderate';

  let areaScore: 'Excellent' | 'Good' | 'Moderate' | 'Limited' = 'Good';
  if (usableRoofArea >= 100) areaScore = 'Excellent';
  else if (usableRoofArea <= 20) areaScore = 'Limited';
  else if (usableRoofArea < 50) areaScore = 'Moderate';

  const scoreValues = { 'Excellent': 4, 'Good': 3, 'Moderate': 2, 'Limited': 1 };
  const totalScore = scoreValues[irradianceScore] + scoreValues[orientationScore] + scoreValues[shadingScore] + scoreValues[areaScore];
  
  let overallScore: 'Excellent' | 'Good' | 'Moderate' | 'Limited' = 'Good';
  if (totalScore >= 14) overallScore = 'Excellent';
  else if (totalScore <= 8) overallScore = 'Limited';
  else if (totalScore <= 11) overallScore = 'Moderate';

  return {
    usableRoofArea,
    systemCapacityKW,
    annualGenerationKWh,
    annualSavingsINR,
    systemCostINR,
    paybackPeriodYears,
    co2OffsetKg,
    monthlyGenerationKWh,
    cumulativeSavings,
    score: overallScore,
    scoreFactors: {
      irradiance: irradianceScore,
      orientation: orientationScore,
      shading: shadingScore,
      area: areaScore
    }
  };
}
