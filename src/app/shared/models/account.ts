export class Account {
  id: number;
  strategy: { id: number, name: string };
  dtCreated: Date;
  dtClosed: Date;
  type: number;
  status: number;
  balance: number;
  bonus: number;
  equity: number;
  availableToWithDraw: number;
  factor: number;
  margin: number;
  marginLevel: number;
  dtMCReached: Date;
  protection: number;
  protectionEquity: number;
  dtProtectionReached: Date;
  target: number;
  targetEquity: number;
  dtTargetReached: number;
  profitBase: number;
  asset: string;
  precision: number;
  positionsCount: number;
  accountSpecAssetID: number;
  tradingIntervalCurrentID: number;
  intervalPnL: number;

  constructor(
    options: any
  ) {
    Object.assign(this, options);
  }

  getStatus(): string {
    switch (this.status) {
      case 0:
        return 'New';
        break;
      case 1:
        return 'Active';
        break;
      case 2:
        return 'Paused (MC)';
        break;
      case 3:
        return 'Paused (SLTP)';
        break;
      case 4:
        return 'Paused (Client)';
        break;
      case 5:
        return 'Disabled';
        break;
      case 6:
        return 'Closed';
        break;
    }
  }

  getType(): string {
    switch (this.status) {
      case 0:
        return 'master investment';
        break;
      case 1:
        return 'slave investment';
        break;
      case 2:
        return 'usual investment';
        break;
      case 3:
        return 'external investment';
        break;
      case 4:
        return 'external trader account';
        break;
    }
  }
}
