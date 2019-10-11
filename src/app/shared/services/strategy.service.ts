import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/index';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../../../config';
import { map } from 'rxjs/internal/operators';
import { Account, ChartOptions, Offer, Paginator, Strategy } from '../models';
import { AccountService } from '@app/services/account.service';
import { CreateInstanceService } from '@app/services/create-instance.service';
import { Command } from '@app/models/command';
import { CommandService } from '@app/services/command.service';

class StrategiesSearchOptions {
  Filter: { IsActive?: boolean, Value?: string };
  Pagination: { CurrentPage?: number, PerPage?: number };
}

@Injectable({
  providedIn: 'root'
})
export class StrategyService {
  // Активные стратегии
  activeStrategiesSubject: BehaviorSubject<Strategy[]> = new BehaviorSubject<Strategy[]>([]);
  // Закрытые стратегии
  closedStrategiesSubject: BehaviorSubject<Strategy[]> = new BehaviorSubject<Strategy[]>([]);

  constructor(
    private http: HttpClient,
    private createInstanceService: CreateInstanceService,
    private commandService: CommandService,
    private accountService: AccountService
  ) { }

  // Получение списка активных стратегий
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

  // Получение списка закрытых стратегий
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

  // Получение конкретной стратегии
  get(id: number): Observable<Strategy> {
    const options: object = {
      Filter: { ID: id }
    };

    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.search`, options).pipe(map((response: any) => {
      return this.createInstanceService.createStrategy(response.Strategies.find(s => s.ID.toString() === id.toString()));
    }));
  }

  // Получение графика для стратегий
  getChart(chartOptions: ChartOptions): Observable<any> {
    const options: any = {
      StrategyID: chartOptions.strategyID,
      MaxPoints: chartOptions.maxPoints,
      chartType: chartOptions.chartType,
      chartSize: chartOptions.chartSize
    };

    return this.http.post(`${CONFIG.baseApiUrl}/charts.get`, options);
  }

  // Создание новой стратегии
  add(strategy: object) {
    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.add`, strategy).pipe(map((response: any) => {
      console.log(response);
    }));
  }

  // Постановка стратегии на паузу
  pause(strategyId: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.pause`, {StrategyID: strategyId}).pipe(
      map((response: any) => {
        this.updateStrategy(strategyId, new Command(response.CommandID, strategyId));
      })
    );
  }

  // Возобновление стратегии
  resume(strategyId: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.resume`, {StrategyID: strategyId}).pipe(
      map((response: any) => {
        this.updateStrategy(strategyId, new Command(response.CommandID, strategyId));
      })
    );
  }

  // Закрытие стратегии
  close(strategyId: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.close`, {StrategyID: strategyId}).pipe(
      map((response: any) => {
        this.updateStrategy(strategyId, new Command(response.CommandID, strategyId));
      })
    );
  }

  // Инвестировать в стратегию (Создать инвестицию)
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

  // Получение статуса команды и запрос обновленной стратегии после завершения обработки изменений
  // Работает с активными стратегиями, так как закрытые изменять нельзя
  updateStrategy(strategyId: number, command: Command): void {
    const interval = setInterval(() => {
      this.commandService.checkStrategyCommand(command).subscribe((commandStatus: number) => {
        if (commandStatus !== 0) {
          clearInterval(interval);
          this.get(strategyId).subscribe((strategy: Strategy) => {
            if (strategy.isActive()) {
              Object.assign(this.activeStrategiesSubject.value.find((s: Strategy) => s.id === strategy.id), strategy);
            } else {
              this.activeStrategiesSubject.value.splice(this.activeStrategiesSubject.value.findIndex((s: Strategy) => s.id === strategy.id), 1);
            }
            this.accountService.getActive().subscribe();
          });
        }
      });
    }, 1000);
  }
}
