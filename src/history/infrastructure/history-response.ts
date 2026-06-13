import { EnergyPeriod } from '../domain/model/energy-period.entity';

export interface ConsumptionDataPointResponse {
  label: string;
  value: number;
}

export interface DeviceConsumptionResponse {
  id: string;
  name: string;
  consumptionKwh: number;
  sharePercent: number;
  icon: string;
}

export interface EnergyIntelligenceResponse {
  period: EnergyPeriod;
  totalConsumptionKwh: number;
  trendPercent: number;
  trendDirection: 'up' | 'down' | 'stable';
  trendLabel: string;
  chartPoints: ConsumptionDataPointResponse[];
  highestConsumer: {
    name: string;
    consumptionKwh: number;
    sharePercent: number;
    icon: string;
  };
  dailyAverageKwh: number;
  dailyAverageLabel: string;
  dailyAverageBars: number[];
  ecoTip: string;
  devices: DeviceConsumptionResponse[];
}
