export class WalletTransfer {
  id: number;
  strategyID: number;
  accountID: number;
  dealID: number;
  dtCreated: Date;
  dtAccrual: Date;
  amount: number;
  type: number;
  comment: string;

  constructor(
    id: number,
    strategyID: number,
    accountID: number,
    dealID: number,
    dtCreated: Date,
    dtAccrual: Date,
    amount: number,
    type: number,
    comment: string
  ) {
    this.id = id;
    this.strategyID = strategyID;
    this.accountID = accountID;
    this.dealID = dealID;
    this.dtCreated = dtCreated;
    this.dtAccrual = dtAccrual;
    this.amount = amount;
    this.type = type;
    this.comment = comment;
  }

  getType(): string {
    switch (this.type) {
      case 0:
        return 'Fund';
      case 1:
        return 'Withdraw';
      case 2:
        return 'Bonus fund';
      case 3:
        return 'Bonus withdraw';
      case 4:
        return 'To account' + (this.strategyID != null ? '\n\'' + this.strategyID + '\'' : '');
      case 5:
        return 'From account' + (this.strategyID != null ? '\n\'' + this.strategyID + '\'' : '');
      case 6:
        return 'Fee' + (this.strategyID != null ? '\n\'' + this.strategyID + '\'' : '');
      case 7:
        return 'Commission' + (this.strategyID != null ? '\n\'' + this.strategyID + '\'' : '');
      case 8:
        return 'Partners' + (this.strategyID != null ? '\n\'' + this.strategyID + '\'' : '');
    }
  }

  isExternal(): boolean {
    return this.type === 0 || this.type === 1 || this.type === 2 || this.type === 3;
  }
}
