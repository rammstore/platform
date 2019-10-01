import { Component, OnDestroy, OnInit } from '@angular/core';
import { Strategy, TableColumn } from '@app/models';
import { StrategyService } from '@app/services/strategy.service';
import { TableHeaderRow } from '@app/models/table-header-row';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';

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
  strategies: Strategy[];

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'name', label: 'Стратегия', rowspan: 2}),
      new TableColumn({ label: 'Доходность стратегии', colspan: 2}),
      new TableColumn({ label: 'Инвестиция', colspan: 3})
    ]),
    new TableHeaderRow([
      new TableColumn({ property: '', label: 'в месяц' }),
      new TableColumn({ property: 'yieldChart', label: 'Всего' }),
      new TableColumn({ property: 'age', label: 'Возраст, недель' }),
      new TableColumn({ property: 'account', label: 'Моя инвестиция, USD' }),
      new TableColumn({ property: 'manage', label: '' })
    ]),
  ];

  constructor(
    private strategyService: StrategyService
  ) { }

  ngOnInit(): void {
    this.strategyService.getActive()
      .pipe(takeUntil(this.destroy$))
      .subscribe((strategies: Strategy[]) => {
        this.strategies = strategies;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
