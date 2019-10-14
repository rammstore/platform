import { Component, OnDestroy, OnInit } from '@angular/core';
import { StrategyService } from '@app/services/strategy.service';
import { Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';

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

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'name', label: 'Название'}),
      new TableColumn({ property: 'account.equity', label: 'Средства', pipe: { pipe: CurrencyPipe, args: ['', '', '1.2-2'] }}),
      new TableColumn({ property: 'accountsCount', label: 'Инвесторы'}),
      new TableColumn({ property: 'offer.fee', label: 'Вознаграждение', pipe: { pipe: PercentPipe }}),
      new TableColumn({ property: 'account.intervalPnL', label: 'Прибыль', pipe: { pipe: CurrencyPipe, args: ['', '', '1.2-2'] } }),
      new TableColumn({ property: 'manage', label: '' })
    ]),
  ];
  totalFields: string[] = ['accountsCount', 'account.intervalPnL'];
  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private strategyService: StrategyService
  ) { }

  ngOnInit(): void {
    this.getStrategies();
  }

  getStrategies(): void {
    this.strategyService.getActive(this.paginator)
      .pipe(takeUntil(this.destroy$))
      .subscribe((strategies: Strategy[]) => {
        this.strategies = strategies;
      });
  }

  getIntervalPnL(): number {
    let sum: number = 0;

    this.strategies.forEach((strategy: Strategy) => {
      sum = sum + strategy.account.intervalPnL;
    });

    return sum;
  }

  getInvestors(): number {
    let sum: number = 0;

    this.strategies.forEach((strategy: Strategy) => {
      sum = sum + strategy.accountsCount;
    });

    return sum;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
