declare type ChartType = 'yield' | 'yield-leverage';
declare type ChartSize = 'full' | 'large' | 'medium' | 'small';

export class ChartOptions {
  strategyID: number;
  maxPoints: number;
  chartType: string;
  chartSize: string;

  constructor(
    strategyID: number,
    maxPoints?: number,
    chartType?: string,
    chartSize?: string
  ) {
    this.strategyID = strategyID;
    this.maxPoints = maxPoints || 10;
    this.chartType = chartType || 'yield';
    this.chartSize = chartSize || 'full';
  }
}
