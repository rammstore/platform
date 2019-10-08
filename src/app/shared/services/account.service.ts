import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs/index';
import { Account, Deal, Paginator } from '@app/models';
import { CONFIG } from '../../../config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import { StrategyService } from '@app/services/strategy.service';
import { CreateInstanceService } from '@app/services/create-instance.service';

class InvestmentsSearchOptions {
  Filter: { MyActiveAccounts?: boolean, Value?: string };
  Pagination: { CurrentPage?: number, PerPage?: number };
  OrderBy: { Field?: string, Direction?: string };
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
    private createInstanceService: CreateInstanceService
  ) { }

  get(id: number): Observable<Account> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.get`, { AccountID: id }).pipe(map((response: any) => {
      return this.createInstanceService.createAccount(response);
    }));
  }

  getActive(pagination?: Paginator): Observable<Account[]> {
    const options: InvestmentsSearchOptions = new InvestmentsSearchOptions();

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    return this.http.post(`${CONFIG.baseApiUrl}/accounts.search`, options).pipe(map((response: any) => {
      const investments: Account[] = [];

      response.Accounts.forEach((account: any) => {
        investments.push(new Account(this.createInstanceService.createAccount(account)));
      });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      return investments.filter((a: Account) => a.isActive());
    }));
  }

  getClosed(pagination?: Paginator): Observable<Account[]> {
    const options: InvestmentsSearchOptions = new InvestmentsSearchOptions();

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    return this.http.post(`${CONFIG.baseApiUrl}/accounts.search`, options).pipe(map((response: any) => {
      const investments: Account[] = [];

      response.Accounts
        .filter((a: any) => a.Status === 6)
        .forEach((account: any) => {
          investments.push(new Account(this.createInstanceService.createAccount(account)));
        });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      return investments;
    }));
  }

  pause(id: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.pause`, {AccountID: id});
  }

  resume(id: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.resume`, {AccountID: id});
  }

  changeProfile(id: number, valueObj: {[key: string]: number}): Observable<any> {
    return forkJoin([
      this.http.post(`${CONFIG.baseApiUrl}/accounts.setFactor`, {AccountID: id, Factor: valueObj['factor']}),
      this.http.post(`${CONFIG.baseApiUrl}/accounts.setProtection`, {AccountID: id, Protection: valueObj['protection']}),
      this.http.post(`${CONFIG.baseApiUrl}/accounts.setTarget`, {AccountID: id, Target: valueObj['target']})
    ]);
  }

  withdraw(id: number, amount: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.withdraw`, { AccountID: id, Amount: amount });
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

  close(id: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.close`, { AccountID: id });
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
}
