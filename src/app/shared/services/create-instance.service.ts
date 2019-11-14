import { Injectable } from '@angular/core';
import { Account, AuthData, Company, Deal, Offer, Position, Session, Strategy, User, Wallet } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class CreateInstanceService {

  constructor() { }

  createStrategy(options: any): Strategy {
    console.log(options);
    return new Strategy({
      id: options.ID || options.strategyID || options.IDStrategy,
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
      isMyStrategy: options.IsMyStrategy,
      ageByDays: options.AgeByDays,
      monthlyYield: options.MonthlyYield,
      MCLevel: options.MCLevel
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
      intervalPnL: options.IntervalPnL || options.ProfitCurrentIntervalGross,
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
      accountMinBalance: options.AccountMinBalance,
      leverageMax: options.LeverageMax,
      freeMargin: options.FreeMargin,
      MCLevel: options.MCLevel,
      state: options.State,
      isMyStrategy: options.IsMyStrategy,
      profitCurrentIntervalGross: options.ProfitCurrentIntervalGross,
      feeToPay: options.FeeToPay,
      totalCommissionTrader: options.TotalCommissionTrader,
      feePaid: options.FeePaid
    });
  }

  createOffer(options: any): Offer {
    return new Offer({
      commission: options.Commission,
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
      commission: options.Commission,
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

  createWallet(options: any): Wallet {
    return new Wallet({
      activeStrategiesCount: options.ActiveStrategiesCount,
      asset: options.Asset,
      balance: options.Balance,
      id: options.ID,
      intervalPnL: options.IntervalPnL,
      invested: options.Invested,
      margin: options.Margin
    });
  }

  createSession(options: any): Session {
    return new Session({
      token: options.Token,
      walletID: options.WalletID,
      dtLastActivity: options.DTLastActivity,
      expirationMinutes: options.ExpirationMinutes
    });
  }

  createCompany(options: any): Company {
    return new Company({
      name: options.Name,
      isDemo: options.Demo,
      contacts: options.contacts
    });
  }

  createUser(options: any): User {
    return new User({
      firstName: options.FirstName,
      lastName: options.LastName,
      login: options.Login,
      language: options.Language,
      pushToken: options.PushToken
    });
  }

  createAuthData(options: any): AuthData {
    return new AuthData({
      session: options.session,
      client: options.client,
      company: options.company,
      wallets: options.wallets
    });
  }
}
