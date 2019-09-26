import { Account } from './account';
import { Offer } from './offer';

export class StrategyResumeOptions {
  amount: number;
  goal: number;
  protection: number;

  constructor(options: object) {
    Object.assign(this, options);
  }
}

export class Strategy {
  id: number;
  name: string;
  dtCreated: Date;
  dtStat: Date;
  partnerShare: number;
  status: number;
  profit: number;
  accountsCount: number;
  symbols: string;
  account: Account;
  offer: Offer;

  constructor(
    id: number,
    name: string,
    dtCreated: Date,
    dtStat: Date,
    partnerShare: number,
    status: number,
    profit: number,
    accountsCount: number,
    symbols: string,
    account: Account,
    offer: Offer
  ) {
    this.id = id;
    this.name = name;
    this.dtCreated = dtCreated;
    this.dtStat = dtStat;
    this.partnerShare = partnerShare;
    this.status = status;
    this.profit = profit;
    this.accountsCount = accountsCount;
    this.symbols = symbols;
    this.account = account;
    this.offer = offer;
  }

  isActive(): boolean {
    // @TODO: declare type or create enum for status possible values
    return this.status === 1;
  }

  getAgeWeeks(): number {
    const now: number = new Date().getTime();
    const created: number = new Date(this.dtCreated).getTime();
    return Math.round((now - created) / (1000 * 3600 * 24 * 7));
  }

  pause(): void {
    this.status = 4;
  }

  resume(): void {
    this.status = 1;
  }
}
