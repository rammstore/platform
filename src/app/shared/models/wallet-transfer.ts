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
  strategyName: string;

  constructor(
    id: number,
    strategyID: number,
    accountID: number,
    dealID: number,
    dtCreated: Date,
    dtAccrual: Date,
    amount: number,
    type: number,
    comment: string,
    strategyName: string
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
    this.strategyName = strategyName;
  }

  getType(): string {
    switch (this.type) {
      case 0:
        return 'common.type0';
      case 1:
        return 'common.type1';
      case 2:
        return 'common.type2';
      case 3:
        return 'common.type3';
      case 4:
        return 'common.type4';
      case 5:
        return 'common.type5';
      case 6:
        return 'common.type6';
      case 7:
        return 'common.type7';
      case 8:
        return 'common.type8';
    }
  }

  isExternal(): boolean {
    return this.type === 0 || this.type === 1 || this.type === 2 || this.type === 3;
  }
}
