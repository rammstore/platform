import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/index';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { map } from 'rxjs/internal/operators';
import { Account, ChartOptions, Offer, Paginator, Strategy } from '../models';
import { AccountService } from '@app/services/account.service';
import { CreateInstanceService } from '@app/services/create-instance.service';

class StrategiesSearchOptions {
  Filter: { IsActive?: boolean, Value?: string };
  Pagination: { CurrentPage?: number, PerPage?: number };
}

@Injectable({
  providedIn: 'root'
})
export class StrategyService {
  activeStrategiesSubject: BehaviorSubject<Strategy[]> = new BehaviorSubject<Strategy[]>([]);
  closedStrategiesSubject: BehaviorSubject<Strategy[]> = new BehaviorSubject<Strategy[]>([]);
  strategiesSubject: BehaviorSubject<Strategy[]> = new BehaviorSubject<Strategy[]>([]);

  constructor(
    private http: HttpClient,
    private createInstanceService: CreateInstanceService
  ) { }

  getActive(pagination?: Paginator): Observable<Strategy[]> {
    const options: StrategiesSearchOptions = new StrategiesSearchOptions();
    options.Filter = { IsActive: true };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    this.http.post(`${CONFIG.baseApiUrl}/myStrategies.search`, options).subscribe((response: any) => {
      const strategies: Strategy[] = [];

      response.Strategies.forEach((s: any) => {
        strategies.push(this.createInstanceService.createStrategy(s));
      });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      this.activeStrategiesSubject.next(strategies);
    });

    return this.activeStrategiesSubject.asObservable();
  }

  getClosed(pagination?: Paginator): Observable<Strategy[]> {
    const options: StrategiesSearchOptions = new StrategiesSearchOptions();
    options.Filter = { IsActive: false };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    this.http.post(`${CONFIG.baseApiUrl}/myStrategies.search`, options).subscribe((response: any) => {
      const strategies: Strategy[] = [];

      response.Strategies.forEach((s: any) => {
        strategies.push(this.createInstanceService.createStrategy(s));
      });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      this.closedStrategiesSubject.next(strategies);
    });

    return this.closedStrategiesSubject.asObservable();
  }

  getAll(page: number = 1): Observable<Strategy[]> {
    const options: object = {
      Filter: { IsActive: false },
      Pagination: { CurrentPage: page }
    };

    this.http.post(`${CONFIG.baseApiUrl}/myStrategies.search`, options).subscribe((response: any) => {
      const strategies: Strategy[] = [];

      response.Strategies.forEach((s: any) => {
        strategies.push(this.createInstanceService.createStrategy(s));
      });

      this.strategiesSubject.next(strategies);
    });

    return this.strategiesSubject.asObservable();
  }

  get(id: number): Observable<Strategy> {
    const options: object = {
      Filter: { ID: id }
    };

    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.search`, options).pipe(map((response: any) => {
      return this.createInstanceService.createStrategy(response.Strategies.find(s => s.ID.toString() === id.toString()));
    }));
  }

  getChart(chartOptions: ChartOptions): Observable<any> {
    const options: any = {
      StrategyID: chartOptions.strategyID,
      MaxPoints: chartOptions.maxPoints,
      chartType: chartOptions.chartType,
      chartSize: chartOptions.chartSize
    };

    return this.http.post(`${CONFIG.baseApiUrl}/charts.get`, options);
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

  pause(strategyId: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.pause`, {StrategyID: strategyId});
  }

  resume(strategyId: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.resume`, {StrategyID: strategyId});
  }

  close(strategyId: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.close`, {StrategyID: strategyId});
  }

  invest(id: number, data: object): Observable<any> {
    const options: any = {
      StrategyID: id,
      Factor: data['factor'],
      Protection: data['protection'],
      Target: data['target'],
      Money: data['amount']
    };

    return this.http.post(`${CONFIG.baseApiUrl}/accounts.add`, options);
  }
}
