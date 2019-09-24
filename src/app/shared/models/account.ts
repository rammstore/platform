export class Account {
  id: number;
  accountSpecAssetID: number;
  asset: string;
  tradingIntervalCurrentID: number;
  type: number;
  dtCreated: Date;
  balance: number;
  equity: number;
  margin: number;
  marginLevel: number;
  intervalPnL: number;
  status: number;
  factor: number;
  mcReached: Date;
  protection: number;
  protectionEquity: number;
  protectionReached: Date;
  target: number;
  targetEquity: number;
  targetReached: number;

  constructor(
    id: number,
    accountSpecAssetID: number,
    asset: string,
    tradingIntervalCurrentID: number,
    type: number,
    dtCreated: Date,
    balance: number,
    equity: number,
    margin: number,
    marginLevel: number,
    intervalPnL: number,
    status: number,
    factor: number,
    mcReached: Date,
    protection: number,
    protectionEquity: number,
    protectionReached: Date,
    target: number,
    targetEquity: number,
    targetReached: number
  ) {
    this.id = id;
    this.accountSpecAssetID = accountSpecAssetID;
    this.asset = asset;
    this.tradingIntervalCurrentID = tradingIntervalCurrentID;
    this.type = type;
    this.dtCreated = dtCreated;
    this.balance = balance;
    this.equity = equity;
    this.margin = margin;
    this.marginLevel = marginLevel;
    this.intervalPnL = intervalPnL;
    this.status = status;
    this.factor = factor;
    this.mcReached = mcReached;
    this.protection = protection;
    this.protectionEquity = protectionEquity;
    this.protectionReached = protectionReached;
    this.target = target;
    this.targetEquity = targetEquity;
    this.targetReached = targetReached;
  }
}
