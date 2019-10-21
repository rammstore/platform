import { Injectable } from '@angular/core';
import { Account, Deal, Offer, Position, Strategy } from '@app/models';

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
      dtClosed: options.DTClosed,
      partnerShare: options.PartnerShare,
      status: options.Status,
      profit: options.Yield,
      accountsCount: options.Accounts,
      symbols: options.Symbols,
      account: options.Account ? this.createAccount(options.Account) : null,
      offer: options.Offer ? this.createOffer(options.Offer) : undefined,
      isMyStrategy: options.IsMyStrategy
    });
  }

  createAccount(options: any): Account {
    return new Account({
      id: options.ID,
      strategy: options.Strategy ? this.createStrategy(options.Strategy) : undefined,
      isSecurity: options.IsSecurity,
      type: options.Type,
      accountSpecAssetID: options.AccountSpecAssetID,
      asset: options.Asset || options.AssetName,
      tradingIntervalCurrentID: options.TradingIntervalCurrentID,
      dtCreated: options.DTCreated || options.DT,
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
      positionsCount: options.PositionsCount,
      accountMinBalance: options.AccountMinBalance
    });
  }

  createOffer(options: any): Offer {
    return new Offer({
      comission: options.Comission,
      fee: options.Fee
    });
  }

  createDeal(options: any): Deal {
    return new Deal({
      id: options.ID,
      signalID: options.SignalID,
      commandID: options.CommanfID,
      stopOutID: options.SOID,
      tradingIntervalID: options.TradingIntervalID,
      dtCreated: options.DT,
      type: options.Type,
      symbol: options.Symbol,
      volume: options.Volume,
      price: options.Price,
      comission: options.Commission,
      entry: options.Entry,
      yield: options.Profit,
      swap: options.Swap,
      totalProfit: options.TotalProfit,
      dealToID: options.DealToID,
      precisionPrice: options.PrecisionPrice,
      precisionVolume: options.PrecisionVolume,
      netting: options.Netting
    });
  }

  createPosition(options: any): Position {
    return new Position({
      id: options.ID,
      symbol: options.Symbol,
      volume: options.Volume,
      price: options.Price,
      margin: options.Margin,
      swap: options.Swap,
      profit: options.Profit,
      totalProfit: options.TotalProfit,
      profitCalcQuote: options.ProfitCalcQuote,
      precisionPrice: options.PrecisionPrice,
      precisionVolume: options.PrecisionVolume
    });
  }
}
