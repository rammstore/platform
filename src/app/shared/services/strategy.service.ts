import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { map } from 'rxjs/internal/operators';
import { Account, Offer, Strategy } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StrategyService {

  constructor(
    private http: HttpClient
  ) { }

  getActive(page: number = 1): Observable<Strategy[]> {
    const options: object = {
      Filter: { IsActive: true },
      Pagination: { CurrentPage: page }
    };

    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.search`, options).pipe(map((response: any) => {
      const strategies: Strategy[] = [];

      response.Strategies.forEach((s: any) => {
        strategies.push(this.createStrategy(s));
      });

      return strategies;
    }));
  }

  getClosed(page: number = 1): Observable<Strategy[]> {
    const options: object = {
      Filter: { IsActive: false },
      Pagination: { CurrentPage: page }
    };

    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.search`, options).pipe(map((response: any) => {
      const strategies: Strategy[] = [];

      response.Strategies.forEach((s: any) => {
        strategies.push(this.createStrategy(s));
      });

      return strategies;
    }));
  }

  private createStrategy(strategyObj: any): Strategy {
    const account = new Account(
      strategyObj.Account.ID,
      strategyObj.Account.AccountSpecAssetID,
      strategyObj.Account.Asset,
      strategyObj.Account.TradingIntervalCurrentID,
      strategyObj.Account.Type,
      strategyObj.Account.DTCreated,
      strategyObj.Account.Balance,
      strategyObj.Account.Equity,
      strategyObj.Account.Margin,
      strategyObj.Account.MarginLevel,
      strategyObj.Account.IntervalPnL,
      strategyObj.Account.Status,
      strategyObj.Account.Factor,
      strategyObj.Account.MCReached,
      strategyObj.Account.Protection,
      strategyObj.Account.ProtectionEquity,
      strategyObj.Account.ProtectionReached,
      strategyObj.Account.Target,
      strategyObj.Account.TargetEquity,
      strategyObj.Account.TargetReached
    );

    const offer: Offer = new Offer(
      strategyObj.Offer.Commission,
      strategyObj.Offer.Fee
    );

    return new Strategy(
      strategyObj.ID,
      strategyObj.Name,
      strategyObj.DTCreated,
      strategyObj.DTStat,
      strategyObj.PartnerShare,
      strategyObj.Status,
      strategyObj.Yield,
      strategyObj.Accounts,
      strategyObj.Symbols,
      account,
      offer
    );
  }

  add(strategy: object) {
    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.add`, strategy).pipe(map((response: any) => {
      console.log(response);
    }));
  }

  fund(accountID: number, amount: number) {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.fund`, {AccountID: accountID, Amount: amount}).pipe(map((response: any) => {
      console.log(response);
    }));
  }

  pause(strategyId: number) {
    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.pause`, {StrategyID: strategyId}).pipe(map((response: any) => {
      console.log(response);
    }));
  }

  resume(strategyId: number) {
    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.resume`, {StrategyID: strategyId}).pipe(map((response: any) => {
      console.log(response);
    }));
  }
}
