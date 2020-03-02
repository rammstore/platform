export class Wallet {
  activeStrategiesCount: number;
  asset: string;
  balance: number;
  dt: Date;
  id: number;
  idClient: number;
  internalPnL: number;
  invested: number;
  margin: number;
  status: number;

  constructor(options: any) {
    Object.assign(this, options);
  }

  getEquity(): number {
    return Math.round((this.balance + this.invested) * 100) / 100;
  }

  getAvailableMoney(): number {
    return Math.floor(this.balance * 100) / 100;
  }
}
