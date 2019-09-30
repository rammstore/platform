import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { Account } from '@app/models';
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
