import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { Account, Paginator, Strategy, StrategiesSearchOptions } from "@app/models";
import { HttpClient } from "@angular/common/http";
import { CreateInstanceService } from "@app/services/create-instance.service";
import { CommandService } from "@app/services/command.service";
import { CONFIG } from "../../../config";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Мои активные стратегии
  activeMyStrategiesSubject: BehaviorSubject<Strategy[]> = new BehaviorSubject<Strategy[]>([]);
  // Мои закрытые стратегии
  closedMyStrategiesSubject: BehaviorSubject<Strategy[]> = new BehaviorSubject<Strategy[]>([]);
  // Мои активные инвестиции
  activeMyAccountsSubject: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  // Мои закрытые инвестиции
  closedMyAccountsSubject: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);

  constructor(
    private http: HttpClient,
    private createInstanceService: CreateInstanceService,
    private commandService: CommandService
  ) { }

  // Получение списка активных стратегий
  getActiveMyStrategies(pagination?: Paginator): Observable<Strategy[]> {
    const options: StrategiesSearchOptions = new StrategiesSearchOptions();
    options.Filter = {
      ActiveStrategies: true,
      MyStrategies: true
    };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    this.http.post(`${CONFIG.baseApiUrl}/strategies.search`, options).subscribe((response: any) => {
      const strategies: Strategy[] = [];

      response.Strategies.forEach((s: any) => {
        strategies.push(this.createInstanceService.createStrategy(s));
      });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      this.activeMyStrategiesSubject.next(strategies);
    });

    return this.activeMyStrategiesSubject.asObservable();
  }

  // Получение списка закрытых стратегий
  getClosedMyStrategies(pagination?: Paginator): Observable<Strategy[]> {
    const options: StrategiesSearchOptions = new StrategiesSearchOptions();
    options.Filter = {
      ActiveStrategies: false,
      MyStrategies: true
    };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    this.http.post(`${CONFIG.baseApiUrl}/strategies.search`, options).subscribe((response: any) => {
      const strategies: Strategy[] = [];

      response.Strategies.forEach((s: any) => {
        strategies.push(this.createInstanceService.createStrategy(s));
      });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      this.closedMyStrategiesSubject.next(strategies);
    });

    return this.closedMyStrategiesSubject.asObservable();
  }

  // Получение конкретной стратегии
  getStrategy(id: number): Observable<Strategy> {
    return this.http.post(`${CONFIG.baseApiUrl}/strategies.search`, {}).pipe(map((response: any) => {
      return this.createInstanceService.createStrategy(response.Strategies.find(s => s.ID.toString() === id.toString()));
    }));
  }
}
