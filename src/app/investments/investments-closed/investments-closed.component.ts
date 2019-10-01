import { Component, OnDestroy, OnInit } from '@angular/core';
import { Strategy, TableColumn } from '@app/models';
import { StrategyService } from '@app/services/strategy.service';
import { TableHeaderRow } from '@app/models/table-header-row';
import { DatePipe, PercentPipe } from '@angular/common';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';

@Component({
  selector: 'app-investments-closed',
  templateUrl: './investments-closed.component.html',
  styleUrls: ['./investments-closed.component.scss']
})
export class InvestmentsClosedComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  strategies: Strategy[];

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'name', label: 'Стратегия' }),
      new TableColumn({ property: 'account.id', label: 'Инвестиция'}),
      new TableColumn({ property: 'dtCreated', label: 'Создана', pipe: { pipe: DatePipe, args: ['yyyy-MM-dd hh:mm:ss'] }}),
      new TableColumn({ property: '', label: 'Закрыта'}),
      new TableColumn({ property: 'age', label: 'Возраст' }),
      new TableColumn({ property: 'account.protection', label: 'Защита', pipe: { pipe: PercentPipe }}),
      new TableColumn({ property: 'account.intervalPnL', label: 'Прибыль, USD' }),
      new TableColumn({ property: 'investmentDetails', label: '' })
    ]),
  ];

  constructor(
    private strategyService: StrategyService
  ) { }

  ngOnInit(): void {
    this.strategyService.getClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((strategies: Strategy[]) => {
        this.strategies = strategies;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
