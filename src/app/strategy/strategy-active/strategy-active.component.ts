import { Component, OnDestroy, OnInit } from '@angular/core';
import { Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { PercentPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { DataService } from '@app/services/data.service';

@Component({
  selector: 'app-strategy-active',
  templateUrl: './strategy-active.component.html',
  styleUrls: ['./strategy-active.component.scss']
})
export class StrategyActiveComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  strategies: Strategy[];
  args: any;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'name', label: 'common.table.label.name'}),
      new TableColumn({ property: 'account.equity', label: 'common.table.label.equityUSD', pipe: { pipe: CustomCurrencyPipe }}),
      new TableColumn({ property: 'accountsCount', label: 'common.table.label.investors'}),
      new TableColumn({ property: 'offer.fee', label: 'common.fee', pipe: { pipe: PercentPipe }}),
      new TableColumn({ property: 'feePaid', label: 'common.table.label.feePaidUSD', pipe: { pipe: CustomCurrencyPipe }}),
      new TableColumn({ property: 'account.intervalPnL', label: 'common.table.label.yieldUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'feeToPay', label: 'common.table.label.feeToPayUSD', pipe: { pipe: CustomCurrencyPipe }}),
      new TableColumn({ property: 'manage', label: '' })
    ]),
  ];
  totalFields: string[] = ['account.equity', 'accountsCount', 'account.intervalPnL', 'feePaid', 'feeToPay'];
  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.args = {
      paginator: this.paginator
    };

    this.getStrategies();
  }

  getStrategies(): void {
    this.dataService.getActiveMyStrategies(this.args)
      .pipe(takeUntil(this.destroy$))
      .subscribe((strategies: Strategy[]) => {
        this.strategies = strategies;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
