import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs/index';
import { Account, Deal, Paginator, Position } from '@app/models';
import { CONFIG } from '../../../config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import { CreateInstanceService } from '@app/services/create-instance.service';
import { Command } from '@app/models/command';
import { CommandService } from '@app/services/command.service';
import { StrategyService } from '@app/services/strategy.service';

class AccountsSearchOptions {
  Filter: { MyActiveAccounts?: boolean, Value?: string };
  Pagination: { CurrentPage?: number, PerPage?: number };
  OrderBy: { Field?: string, Direction?: string };
}

class DealsSearchOptions {
  Filter: { AccountID: number };
  Pagination: { CurrentPage?: number, PerPage?: number };
  OrderBy: { Field?: string, Direction?: string };
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  // Активные инвестиции
  activeAccountsSubject: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  // Закрытые инвестиции
  closedAccountsSubject: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);

  constructor(
    private http: HttpClient,
    private createInstanceService: CreateInstanceService,
    private commandService: CommandService,
    private strategyService: StrategyService
  ) { }

  // Получение инвестиции по ID
  get(id: number): Observable<Account> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.get`, { AccountID: id }).pipe(map((response: any) => {
      return this.createInstanceService.createAccount(response);
    }));
  }


  getActive(pagination?: Paginator): Observable<Account[]> {
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

      this.activeAccountsSubject.next(accounts.filter((a: Account) => a.isActive()));
    });

    return this.activeAccountsSubject.asObservable();
  }

  getClosed(pagination?: Paginator): Observable<Account[]> {
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

      response.Accounts
        .filter((a: any) => a.Status === 6)
        .forEach((account: any) => {
          accounts.push(new Account(this.createInstanceService.createAccount(account)));
        });

      if (pagination) {
        pagination.totalItems = response.Pagination.TotalRecords;
        pagination.totalPages = response.Pagination.TotalPages;
      }

      this.closedAccountsSubject.next(accounts.filter((a: Account) => !a.isActive()));
    });

    return this.closedAccountsSubject.asObservable();
  }

  fund(accountID: number, amount: number) {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.fund`, {AccountID: accountID, Amount: amount}).pipe(
      map((response: any) => {
        this.updateAccount(accountID, new Command(response.CommandBalanceID, accountID));
      })
    );
  }

  pause(id: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.pause`, {AccountID: id}).pipe(
      map((response: any) => {
        this.updateAccount(id, new Command(response.CommandID, id));
      })
    );
  }

  resume(id: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.resume`, {AccountID: id}).pipe(
      map((response: any) => {
        this.updateAccount(id, new Command(response.CommandID, id));
      })
    );
  }

  changeProfile(id: number, valueObj: {[key: string]: number}): Observable<any> {
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

  withdraw(id: number, amount: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.withdraw`, { AccountID: id, Amount: amount }).pipe(
      map((response: any) => {
        this.updateAccount(id, new Command(response.CommandBalanceID, id));
      })
    );
  }

  getDeals(id: number, pagination?: Paginator): Observable<Deal[]> {
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

  getPositions(id: number, pagination?: Paginator): Observable<Position[]> {
    const options: DealsSearchOptions = new DealsSearchOptions();

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

  close(id: number): Observable<any> {
    return this.http.post(`${CONFIG.baseApiUrl}/accounts.close`, { AccountID: id }).pipe(
      map((response: any) => {
        this.updateAccount(id, new Command(response.CommandID, id));
      })
    );
  }

  // Получение статуса команды и запрос обновленной стратегии после завершения обработки изменений
  // Работает с активными стратегиями, так как закрытые изменять нельзя
  updateAccount(accountId: number, command: Command): void {
    const interval = setInterval(() => {
      this.commandService.checkAccountCommand(command).subscribe((commandStatus: number) => {
        if (commandStatus !== 0) {
          clearInterval(interval);
          this.getActive().subscribe();
          this.strategyService.getActive().subscribe();
        }
      });
    }, 1000);
  }
}
