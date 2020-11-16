import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '@app/services/data.service';
import { Paginator, Account, TableColumn, Strategy } from '@app/models';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TableHeaderRow } from '@app/models/table-header-row';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { CustomDatePipe } from '@app/pipes/custom-date.pipe';
import { StrategyService } from '@app/services/strategy.service';
import { SettingsService } from '@app/services/settings.service';

@Component({
  selector: 'app-strategy-details-investments-closed',
  templateUrl: './strategy-details-investments-closed.component.html',
  styleUrls: ['./strategy-details-investments-closed.component.scss']
})
export class StrategyDetailsInvestmentsClosedComponent implements OnInit {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  // destroy$ = new Subject();

  // component data
  accounts: Account[];
  accounts$: Observable<Account[]>;

  args: any;
  strategy: Strategy;
  
  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'account.id', label: 'common.investment'}),
      new TableColumn({ property: 'dtCreated', label: 'common.table.label.created', pipe: { pipe: CustomDatePipe }}),
      new TableColumn({ property: 'dtClosed', label: 'common.table.label.closed', pipe: { pipe: CustomDatePipe }}),
      new TableColumn({ property: 'age', label: 'common.age', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'profitCurrentIntervalGross', label: 'common.table.label.yieldTotalUSD', pipe: { pipe: CustomCurrencyPipe } })
    ]),
  ];

  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private dataService: DataService,
    private strategyService: StrategyService,
    public settingsService: SettingsService
  ) { }

  ngOnInit() {
    this.strategy = this.strategyService.strategy;

    this.args = {
      strategyId: this.strategy.id,
      paginator: this.paginator
    }

    this.accounts$ = this.getInvestmentsClosedAccounts(this.args);
  }

  getAccounts() {
    this.accounts$ = this.getInvestmentsClosedAccounts(this.args);
  }

  private getInvestmentsClosedAccounts(args: any): Observable<any> {
    return this.dataService.getInvestmentsClosedAccounts(args);
  }
}
