export type Period = "daily" | "weekly";

export interface PortfolioMetric {
  label: string;
  value: string;
  delta: string;
  favourable: boolean;
}

export interface PropertyRow {
  name: string;
  units: number;
  occupancy: number;
  occupancyDelta: number;
  ar: number;
  futureOccupancy: number;
}

export interface TrendPoint {
  label: string;
  occupancy: number;
}
