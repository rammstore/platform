import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from "rxjs";
import {
  Account,
  AccountsSearchOptions,
  Paginator,
  Strategy,
  StrategiesSearchOptions,
  Command,
  Deal, Position, DealsSearchOptions, PositionsSearchOptions, ChartOptions
} from "@app/models";
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

  //
  // Методы работы со стратегиями
  //

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

  // Создание новой стратегии
  addStrategy(strategy: object) {
    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.add`, strategy).pipe(map((response: any) => {
      response.Strategy.Account = response.Account;
      this.activeMyStrategiesSubject.value.push(this.createInstanceService.createStrategy(response.Strategy));
    }));
  }

  // Постановка стратегии на паузу
  pauseStrategy(strategyId: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.pause`, {StrategyID: strategyId}).pipe(
      map((response: any) => {
        this.updateStrategy(strategyId, new Command(response.CommandID, strategyId));
      })
    );
  }

  // Возобновление стратегии
  resumeStrategy(strategyId: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.resume`, {StrategyID: strategyId}).pipe(
      map((response: any) => {
        this.updateStrategy(strategyId, new Command(response.CommandID, strategyId));
      })
    );
  }

  // Закрытие стратегии
  closeStrategy(strategyId: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/myStrategies.close`, {StrategyID: strategyId}).pipe(
      map((response: any) => {
        this.updateStrategy(strategyId, new Command(response.CommandID, strategyId));
      })
    );
  }

  // Получение статуса команды стратегии и запрос обновленного списка стратегий после завершения обработки изменений
  // Работает с активными стратегиями, так как закрытые изменять нельзя
  updateStrategy(strategyId: number, command: Command): void {
    const interval = setInterval(() => {
      this.commandService.checkStrategyCommand(command).subscribe((commandStatus: number) => {
        if (commandStatus !== 0) {
          clearInterval(interval);
          this.getActiveMyStrategies().subscribe();
          this.getActiveMyAccounts().subscribe();
        }
      });
    }, 1000);
  }

  // Получение графика для стратегий
  getStrategyChart(chartOptions: ChartOptions): Observable<any> {
    const options: any = {
      StrategyID: chartOptions.strategyID,
      MaxPoints: chartOptions.maxPoints,
      chartType: chartOptions.chartType,
      chartSize: chartOptions.chartSize
    };

    return this.http.post(`${CONFIG.baseApiUrl}/charts.get`, options);
  }

  //
  // Методы работы со инвестициями
  //

  // Получение инвестиции по ID
  getAccount(id: number): Observable<Account> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.get`, { AccountID: id }).pipe(map((response: any) => {
      return this.createInstanceService.createAccount(response);
    }));
  }

  // Получение списка активных инвестиций
  getActiveMyAccounts(pagination?: Paginator): Observable<Account[]> {
    const options: AccountsSearchOptions = new AccountsSearchOptions();
    options.Filter = { MyActiveAccounts: true };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    this.http.post(`${CONFIG.baseApiUrl}/accounts.search`, options).subscribe((response: any) => {
      const accounts: Account[] = [];

      response.Accounts.forEach((account: any) => {
        accounts.push(new Account(this.createInstanceService.createAccount(account)));
      });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      this.activeMyAccountsSubject.next(accounts.filter((a: Account) => a.isActive()));
    });

    return this.activeMyAccountsSubject.asObservable();
  }

  // Получение списка закрытых инвестиций
  getClosedMyAccounts(pagination?: Paginator): Observable<Account[]> {
    const options: AccountsSearchOptions = new AccountsSearchOptions();
    options.Filter = { MyActiveAccounts: false };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    this.http.post(`${CONFIG.baseApiUrl}/accounts.search`, options).subscribe((response: any) => {
      const accounts: Account[] = [];

      response.Accounts
        .filter((a: any) => a.Status === 6)
        .forEach((account: any) => {
          accounts.push(new Account(this.createInstanceService.createAccount(account)));
        });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      this.closedMyAccountsSubject.next(accounts.filter((a: Account) => !a.isActive()));
    });

    return this.closedMyAccountsSubject.asObservable();
  }

  // Инвестировать в стратегию (Создать инвестицию)
  addAccount(id: number, data: object): Observable<any> {
    const options: any = {
      StrategyID: id,
      Factor: data['factor'],
      Protection: data['protection'],
      Target: data['target'],
      Money: data['amount']
    };

    return this.http.post(`${CONFIG.baseApiUrl}/accounts.add`, options);
  }

  // Пополнить инвестицию
  fundAccount(accountID: number, amount: number) {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.fund`, {AccountID: accountID, Amount: amount}).pipe(
      map((response: any) => {
        this.updateAccount(accountID, new Command(response.CommandBalanceID, accountID));
      })
    );
  }

  // Приостановить инвестицию
  pauseAccount(id: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.pause`, {AccountID: id}).pipe(
      map((response: any) => {
        this.updateAccount(id, new Command(response.CommandID, id));
      })
    );
  }

  // Возобновить инвестицию
  resumeAccount(id: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.resume`, {AccountID: id}).pipe(
      map((response: any) => {
        this.updateAccount(id, new Command(response.CommandID, id));
      })
    );
  }

  // Изменить профиль инвестиции
  changeAccountProfile(id: number, valueObj: {[key: string]: number}): Observable<any> {
    return forkJoin([
      this.http.post(`${CONFIG.baseApiUrl}/accounts.setFactor`, {AccountID: id, Factor: valueObj['factor']}),
      this.http.post(`${CONFIG.baseApiUrl}/accounts.setProtection`, {AccountID: id, Protection: valueObj['protection']}),
      this.http.post(`${CONFIG.baseApiUrl}/accounts.setTarget`, {AccountID: id, Target: valueObj['target']})
    ]).pipe(
      map((response: any) => {
        this.updateAccount(id, new Command(response.CommandID, id));
      })
    );
  }

  // Вывести средства из инвестиции
  withdrawFromAccount(id: number, amount: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.withdraw`, { AccountID: id, Amount: amount }).pipe(
      map((response: any) => {
        this.updateAccount(id, new Command(response.CommandBalanceID, id));
      })
    );
  }

  // Закрыть инвестицию
  closeAccount(id: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.close`, { AccountID: id }).pipe(
      map((response: any) => {
        this.updateAccount(id, new Command(response.CommandID, id));
      })
    );
  }

  // Получение статуса команды и запрос обновленного списка дынных после завершения обработки изменений
  updateAccount(accountId: number, command: Command): void {
    const interval = setInterval(() => {
      this.commandService.checkAccountCommand(command).subscribe((commandStatus: number) => {
        if (commandStatus !== 0) {
          clearInterval(interval);
          this.getActiveMyStrategies().subscribe();
          this.getActiveMyAccounts().subscribe();
        }
      });
    }, 1000);
  }

  // Получение списка сделок по инвестиции
  getAccountDeals(id: number, pagination?: Paginator): Observable<Deal[]> {
    const options: DealsSearchOptions = new DealsSearchOptions();
    options.Filter = { AccountID: id };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    return this.http.post(`${CONFIG.baseApiUrl}/deals.search`, options).pipe(map((response: any) => {
      const deals: Deal[] = [];

      response.Deals.forEach((deal: any) => {
        deals.push(this.createInstanceService.createDeal(deal));
      });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      return deals;
    }));
  }

  // Получение списка позиций по инвестиции
  getAccountPositions(id: number, pagination?: Paginator): Observable<Position[]> {
    const options: PositionsSearchOptions = new PositionsSearchOptions();
    options.Filter = { AccountID: id };

    if (pagination) {
      options.Pagination = {
        CurrentPage: pagination.currentPage,
        PerPage: pagination.perPage
      };
    }

    return this.http.post(`${CONFIG.baseApiUrl}/positions.search`, options).pipe(map((response: any) => {
      const positions: Position[] = [];

      if (response.Positions.length) {
        response.Positions.forEach((position: any) => {
          positions.push(this.createInstanceService.createPosition(position));
        });

        if (pagination) {
          pagination.totalItems = response.Pagination.TotalRecords;
          pagination.totalPages = response.Pagination.TotalPages;
        }
      }

      return positions;
    }));
  }
}
