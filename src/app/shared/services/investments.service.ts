import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { Account, Deal } from '@app/models';
import { CONFIG } from '../../../config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class InvestmentsService {

  constructor(
    private http: HttpClient
  ) { }

  get(id: number): Observable<Account> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.get`, { AccountID: id }).pipe(map((response: any) => {
      return this.createInvestment(response);
    }));
  }

  getDeals(id: number): Observable<Deal[]> {
    const options: object = {
      Filter: { AccountID: id }
    };

    return this.http.post(`${CONFIG.baseApiUrl}/deals.search`, options).pipe(map((response: any) => {
      const deals: Deal[] = [];

      response.Deals.forEach((deal: any) => {
        deals.push(this.createDeal(deal));
      });

      return deals;
    }));
  }

  createDeal(dealObj: any): Deal {
    return new Deal({
      id: dealObj.ID,
      signalID: dealObj.SignalID,
      commandID: dealObj.CommanfID,
      stopOutID: dealObj.SOID,
      tradingIntervalID: dealObj.TradingIntervalID,
      dtCreated: dealObj.DT,
      type: dealObj.Type,
      symbol: dealObj.Symbol,
      volume: dealObj.Volume,
      price: dealObj.Price,
      comission: dealObj.Commission,
      entry: dealObj.Entry,
      yield: dealObj.Profit,
      swap: dealObj.Swap,
      totalProfit: dealObj.TotalProfit,
      dealToID: dealObj.DealToID,
      precisionPrice: dealObj.PrecisionPrice,
      precisionVolume: dealObj.PrecisionVolume,
      netting: dealObj.Netting
    });
  }

  createInvestment(accountObj: any): Account {
    return new Account({
      id: accountObj.ID,
      strategy: accountObj.Strategy ? { id: accountObj.Strategy.ID, name: accountObj.Strategy.Name } : undefined,
      dtCreated: new Date(accountObj.DT),
      dtClosed: accountObj.DTClosed ? new Date(accountObj.DTClosed) : undefined,
      type: accountObj.Type,
      status: accountObj.Status,
      balance: accountObj.Balance,
      bonus: accountObj.Bonus,
      equity: accountObj.Equity,
      availableToWithDraw: accountObj.AvailableToWithdraw,
      factor: accountObj.Factor,
      margin: accountObj.Margin,
      marginLevel: accountObj.MarginLevel,
      dtMCReached: accountObj.MCReached ? new Date(accountObj.MCReached) : undefined,
      protection: accountObj.Protection,
      protectionEquity: accountObj.ProtectionEquity,
      dtProtectionReached: accountObj.ProtectionReached ? new Date(accountObj.ProtectionReached) : undefined,
      target: accountObj.Target,
      targetEquity: accountObj.TargetEquity,
      dtTargetReached: accountObj.TargetReached ? new Date(accountObj.TargetReached) : undefined,
      profitBase: accountObj.ProfitBase,
      asset: accountObj.AssetName,
      precision: accountObj.Precision,
      positionsCount: accountObj.PositionsCount,
      accountSpecAssetID: accountObj.AccountSpecAssetID,
      tradingIntervalCurrentID: accountObj.TradingIntervalCurrentID,
      intervalPnL: accountObj.IntervalPnL
    });
  }
}
