import {Account, Offer, Strategy} from "@app/models";

export class StrategyMapper {

  static formatToModel(options: any) {
    return new Strategy({
      id: options.ID || options.strategyID || options.IDStrategy,
      name: options.Name,
      dtCreated: options.DTCreated,
      dtStat: options.DTStat,
      dtClosed: options.DTClosed,
      status: options.Status,
      profit: options.Yield,
      accounts: options.Accounts,
      symbols: options.Symbols,
      // account: options.Account ? this.createAccount(options.Account) : null,
      // publicOffer: options.PublicOffer ? this.createOffer(options.PublicOffer) : null,
      // linkOffer: options.LinkOffer ? this.createOffer(options.LinkOffer) : null,
      isMyStrategy: options.IsMyStrategy,
      ageByDays: options.AgeByDays,
      monthlyYield: options.MonthlyYield,
      MCLevel: options.MCLevel,
      equity: options.Equity,
      // traderInfo: options.TraderInfo ? this.createTraderInfo(options.TraderInfo) : null,
      // partnerInfo: options.PartnerInfo ? this.createPartnerInfo(options.PartnerInfo) : null,
      commission: options.Commission,
      chart: options.Chart,
      masterAccount: options.MasterAccount
    });
  }

}
