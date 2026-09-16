import { Orientation, Shading } from '@/types/solar';

export const SOLAR_CONSTANTS = {
  // factors
  ORIENTATION_FACTORS: {
    South: 1.00,
    Southeast: 0.95,
    Southwest: 0.95,
    East: 0.90,
    West: 0.90,
    Northeast: 0.80,
    Northwest: 0.80,
    North: 0.70,
  } as Record<Orientation, number>,

  SHADING_FACTORS: {
    None: 1.00,
    Low: 0.90,
    Medium: 0.75,
    High: 0.55,
  } as Record<Shading, number>,

  // defaults
  DEFAULT_TARIFF: 8, // ₹/kWh
  DEFAULT_SYSTEM_COST_PER_KW: 60000, // ₹/kW
  DEFAULT_PERFORMANCE_RATIO: 0.80,
  DEFAULT_PANEL_POWER_DENSITY: 200, // W/m² (equivalent to 20% efficiency)
  DEFAULT_USABLE_ROOF_PERCENTAGE: 0.70,
  DEFAULT_TARIFF_ESCALATION_RATE: 0.03, // 3%
  
  // environment
  GRID_EMISSION_FACTOR: 0.7, // kg CO2 / kWh
};
