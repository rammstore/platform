import { Injectable } from '@angular/core';
import { Account, Deal, Offer, Strategy } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class CreateInstanceService {

  constructor() { }

  createStrategy(options: any): Strategy {
    return new Strategy({
      id: options.ID,
      name: options.Name,
      dtCreated: options.DTCreated,
      dtStat: options.DTStat,
      partnerShare: options.PartnerShare,
      status: options.Status,
      profit: options.Yield,
      accountsCount: options.Accounts,
      symbols: options.Symbols,
      account: options.Account ? this.createAccount(options.Account) : undefined,
      offer: options.Offer ? this.createOffer(options.Offer) : undefined
    });
  }

  createAccount(options: any): Account {
    return new Account({
      id: options.ID,
      strategy: options.Strategy ? this.createStrategy(options.Strategy) : undefined,
      isSecurity: options.IsSecurity,
      type: options.Type,
      accountSpecAssetID: options.AccountSpecAssetID,
      asset: options.Asset,
      tradingIntervalCurrentID: options.TradingIntervalCurrentID,
      dtCreated: options.DTCreated,
      balance: options.Balance,
      equity: options.Equity,
      margin: options.Margin,
      marginLevel: options.MarginLevel,
      intervalPnL: options.IntervalPnL,
      status: options.Status,
      factor: options.Factor,
      dtMCReached: options.MCReached,
      protection: options.Protection,
      protectionEquity: options.ProtectionEquity,
      dtProtectionReached: options.ProtectionReached,
      target: options.Target,
      targetEquity: options.TargetEquity,
      dtTargetReached: options.TargetReached,
      dtClosed: options.DTClosed,
      bonus: options.Bonus,
      availableToWithDraw: options.AvailableToWithdraw,
      profitBase: options.ProfitBase,
      precision: options.Precision,
      positionsCount: options.PositionsCount
    });
  }

  createOffer(options: any): Offer {
    return new Offer({
      comission: options.Comission,
      fee: options.Fee
    });
  }

  createDeal(options: any): Deal {
    return new Deal({});
  }
}
