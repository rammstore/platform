import { Component, OnDestroy, OnInit } from '@angular/core';
import { Strategy } from '../../shared/models/strategy';
import { StrategyService } from '../../shared/services/strategy.service';
import { TableHeaderRow } from '@app/models/table-header-row';
import { Paginator, TableColumn } from '@app/models';
import { DatePipe, PercentPipe } from '@angular/common';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';

@Component({
  selector: 'app-strategy-closed',
  templateUrl: './strategy-closed.component.html',
  styleUrls: ['./strategy-closed.component.scss']
})
export class StrategyClosedComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  strategies: Strategy[];

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'id', label: 'ID'}),
      new TableColumn({ property: 'name', label: 'Название' }),
      new TableColumn({ property: 'offer.fee', label: 'Вознаграждение', pipe: { pipe: PercentPipe }}),
      new TableColumn({ property: 'dtCreated', label: 'Создана', pipe: { pipe: DatePipe, args: ['yyyy-MM-dd hh:mm:ss'] }}),
      new TableColumn({ property: 'dtClosed', label: 'Закрыта' }),
      new TableColumn({ property: 'age', label: 'Возраст' })
    ]),
  ];
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
    this.strategyService.getClosed(this.paginator)
      .pipe(takeUntil(this.destroy$))
      .subscribe((strategies: Strategy[]) => {
        this.strategies = strategies;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
