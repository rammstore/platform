import { Account } from './account';
import { Offer } from './offer';

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
}
