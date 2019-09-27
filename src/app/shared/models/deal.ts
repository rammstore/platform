export class Deal {
  id: number;
  signalID: number;
  commandID: number;
  stopOutID: number;
  tradinfIntervalID: number;
  dtCreated: Date;
  type: number;
  symbol: string;
  volume: number;
  price: number;
  comission: number;
  entry: number;
  profit: number;
  swap: number;
  totalProfit: number;
  dealToID: number;
  precisionPrice: number;
  precisionVolume: number;
  netting: number;

  constructor(
    id: number,
    signalID: number,
    commandID: number,
    stopOutID: number,
    tradinfIntervalID: number,
    dtCreated: Date,
    type: number,
    symbol: string,
    volume: number,
    price: number,
    comission: number,
    entry: number,
    profit: number,
    swap: number,
    totalProfit: number,
    dealToID: number,
    precisionPrice: number,
    precisionVolume: number,
    netting: number
  ) {
    this.id = id;
    this.signalID = signalID;
    this.commandID = commandID;
    this.stopOutID = stopOutID;
    this.tradinfIntervalID = tradinfIntervalID;
    this.dtCreated = dtCreated;
    this.type = type;
    this.symbol = symbol;
    this.volume = volume;
    this.price = price;
    this.comission = comission;
    this.entry = entry;
    this.profit = profit;
    this.swap = swap;
    this.totalProfit = totalProfit;
    this.dealToID = dealToID;
    this.precisionPrice = precisionPrice;
    this.precisionVolume = precisionVolume;
    this.netting = netting;
  }
}
