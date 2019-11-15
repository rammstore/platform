export class Deal {
  id: number;
  signalID: number;
  commandID: number;
  stopOutID: number;
  tradingIntervalID: number;
  dtCreated: Date;
  type: number;
  symbol: string;
  volume: number;
  price: number;
  commission: number;
  entry: number;
  yield: number;
  swap: number;
  totalProfit: number;
  dealToID: number;
  precisionPrice: number;
  precisionVolume: number;
  netting: number;

  constructor(options: any) {
    Object.assign(this, options);
  }

  getType(): string {
    switch (this.type) {
      case 0:
        return 'Buy';
        break;
      case 1:
        return 'Sell';
        break;
      case 2:
        return 'Balance';
        break;
      case 3:
        return 'Credit';
        break;
      case 4:
        return 'Additional charge';
        break;
      case 5:
        return 'Correction';
        break;
      case 6:
        return 'Bonus';
        break;
      case 7:
        return 'Fee';
        break;
      case 8:
        return 'Dividend';
        break;
      case 9:
        return 'Interest';
        break;
      case 10:
        return 'Canceled/Rejected buy deal';
        break;
      case 11:
        return 'Canceled/Rejected sell deal';
        break;
      case 12:
        return 'Periodical commission';
        break;
    }
  }

  getEntry(): string {
    switch (this.entry) {
      case 0:
        return 'In';
        break;
      case 1:
        return 'Out';
        break;
      case 2:
        return 'InOut';
        break;
    }
  }

  getAbsVolume(): number {
    return Math.abs(this.volume);
  }

  getColorClass(property: string): string {
    if (this[property] === 0) {
      return '';
    }

    return this[property] > 0 ? 'positive' : 'negative';
  }
}
