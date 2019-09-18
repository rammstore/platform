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
    activeStrategiesCount: number,
    asset: string,
    balance: number,
    dt: Date,
    id: number,
    idClient: number,
    internalPnL: number,
    invested: number,
    margin: number,
    status: number,
  ) {
    this.id = id;
    this.activeStrategiesCount = activeStrategiesCount;
    this.asset = asset;
    this.balance = balance;
    this.dt = dt;
    this.idClient = idClient;
    this.internalPnL = internalPnL;
    this.invested = invested;
    this.margin = margin;
    this.status = status;
  }
}
