import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { Observable, of, Subject } from 'rxjs';
import { filter, map, subscribeOn, take, takeUntil, tap } from 'rxjs/internal/operators';
import { PercentPipe } from '@angular/common';
import { DataService } from '@app/services/data.service';
import { SettingsService } from '@app/services/settings.service';
import { iUpdateOptions } from '@app/interfaces/update';

@Component({
  selector: 'app-investments-active',
  templateUrl: './investments-active.component.html',
  styleUrls: ['./investments-active.component.scss']
})
export class InvestmentsActiveComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  accounts$: Observable<Account[]>;
  accounts: Account[];
  args: any;
  strategy$: Observable<Strategy>;
  key: string;
  update$: Observable<any>;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ label: 'common.strategy', colspan: 3, fontSize: 20 }),
      new TableColumn({ label: 'common.investment', colspan: 3, colored: true })
    ]),
    new TableHeaderRow([
      new TableColumn({ property: 'strategy.name', label: 'common.table.label.name' }),
      new TableColumn({
        property: 'strategy.profit',
        label: 'common.yield',
        pipe: { pipe: PercentPipe, args: ['1.0-2'] },
        fontSize: 24
      }),
      new TableColumn({ property: 'yieldChart', label: 'common.chart' }),
      new TableColumn({ property: 'age', label: 'common.age', colored: true, fontSize: 16 }),
      new TableColumn({
        property: 'investmentInfo',
        hint: 'account.label.profit.hint',
        label: 'common.table.label.myInvestmentUSD', colored: true
      }),
      new TableColumn({ property: 'manage', label: 'common.table.label.manage' })
    ]),
  ];

  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private dataService: DataService,
    public settingsService: SettingsService
  ) {
  }

  ngOnInit(): void {
    this.key = "investments-active";
    this.args = {
      searchMode: 'MyActiveAccounts',
      field: 'ID',
      direction: 'Desc',
      paginator: this.paginator
    };
    this.update$ = this.dataService.update$
      .pipe(
        tap((data: iUpdateOptions) => {
          // debugger
          if (data && data.updateStatus == "update") {
            if (data.strategyId) {
              this.getStrategyById(data.strategyId)
                .pipe(take(1))
                .subscribe((strategy: Strategy) => {
                  (this.accounts || []).filter((item) => {
                    if (item.strategy.id == strategy.id) {
                      item.strategy.status = strategy.status;
                    }
                  });

                  this.accounts$ = of(this.accounts);
                  this.dataService._update$.next(null);
                });
            }
            else if (data.accountId) {
              this.getAccountById(data.accountId)
                .pipe(take(1))
                .subscribe((data: any) => {
                  (this.accounts || []).filter((item: Account) => {
                    if (item.id == data.account.id) {
                      const accountStrategy = item.strategy;
                      // debugger
                      item = Object.assign(item, data.account);
                      item.isMyAccount = null;
                      item.strategy = accountStrategy;
                    }

                    this.accounts$ = of(this.accounts);
                    this.dataService._update$.next(null);
                  });
                })
            }
          }
          else if (data && data.updateStatus == "close") {
            if (data.strategyId) {
              this.accounts = (this.accounts || []).filter((item: Account) => item.strategy.id != data.strategyId);
            }
            else if (data.accountId) {
              this.accounts = (this.accounts || []).filter((item: Account) => item.id != data.accountId);
            }
            // debugger
            this.accounts$ = of(this.accounts);
          }
        })
      );

    this.accounts$ = this.getActiveAccounts(this.args);
  }

  getStrategyById(strategyId: number): Observable<Strategy> {
    let args = {
      strategyId: strategyId
    }

    return this.dataService.getStrategyById(args);
  }

  getAccountById(accountId: number): Observable<Account> {
    let args = {
      accountId: accountId
    }
    return this.dataService.getAccountById(args);
  }

  getActiveAccounts(args: any): Observable<any> {
    return this.dataService.getActiveMyAccounts(args)
      .pipe(
        tap(item => this.accounts = item)
      );
  }

  getAccounts(): void {
    this.accounts$ = this.getActiveAccounts(this.args)
  }

  ngOnDestroy(): void {
    this.dataService._update$.next(null);
    this.destroy$.next(true);
  }
}
