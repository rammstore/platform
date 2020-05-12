import { Component, OnDestroy, OnInit } from '@angular/core';
import { Strategy } from '@app/models/strategy';
import { TableHeaderRow } from '@app/models/table-header-row';
import { Paginator, TableColumn } from '@app/models';
import { PercentPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { CustomDatePipe } from '@app/pipes/custom-date.pipe';

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
      new TableColumn({ property: 'name', label: 'common.table.label.name' }),
      new TableColumn({ property: 'offer.fee', label: 'common.fee', pipe: { pipe: PercentPipe }}),
      new TableColumn({ property: 'dtCreated', label: 'common.table.label.created', pipe: { pipe: CustomDatePipe }}),
      new TableColumn({ property: 'dtClosed', label: 'common.table.label.closed', pipe: { pipe: CustomDatePipe } }),
      new TableColumn({ property: 'age', label: 'common.age' }),
      new TableColumn({ property: 'feePaid', label: 'common.table.label.feePaidUSD', pipe: { pipe: CustomCurrencyPipe }})
    ]),
  ];
  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getStrategies();
  }

  getStrategies(): void {
    this.dataService.getClosedMyStrategies(this.paginator)
      .pipe(takeUntil(this.destroy$))
      .subscribe((strategies: Strategy[]) => {
        this.strategies = strategies;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
