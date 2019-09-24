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

  constructor(
    activeStrategiesCount?: number,
    asset?: string,
    balance?: number,
    dt?: Date,
    id?: number,
    idClient?: number,
    internalPnL?: number,
    invested?: number,
    margin?: number,
    status?: number,
  ) {
    this.id = id || null;
    this.activeStrategiesCount = activeStrategiesCount || null;
    this.asset = asset || null;
    this.balance = balance || null;
    this.dt = dt || null;
    this.idClient = idClient || null;
    this.internalPnL = internalPnL || null;
    this.invested = invested || null;
    this.margin = margin || null;
    this.status = status || null;
  }

  getAvailable(): number {
    return Math.round((this.balance - this.invested) * 100) / 100;
  }
}
