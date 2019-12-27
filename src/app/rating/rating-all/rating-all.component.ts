import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { PercentPipe } from '@angular/common';
import { DataService } from '@app/services/data.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-rating-all',
  templateUrl: './rating-all.component.html',
  styleUrls: ['./rating-all.component.scss']
})
export class RatingAllComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  strategies: Strategy[];
  searchText: string = '';
  args: any;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'nameRating', label: 'Стратегия', fontSize: 20}),
      new TableColumn({ property: 'monthlyYield', label: 'Доходность в месяц', pipe: { pipe: PercentPipe, args: ['1.0-2'] }, fontSize: 24}),
      new TableColumn({ property: 'strategy.yieldChart', label: 'Всего' }),
      new TableColumn({ property: 'accountsCount', label: 'Инвесторы'}),
      new TableColumn({ property: 'age', label: 'Возраст, недель', fontSize: 20 }),
      new TableColumn({ property: 'strategy.investmentInfo', label: 'Моя инвестиция, USD', colored: true }),
      new TableColumn({ property: 'manage', label: '' })
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
    this.args = {
      ratingType: 1,
      paginator: this.paginator,
      searchText: this.searchText
    };
    this.getRating();
  }

  getRating(): void {
    this.dataService.getRating(this.args)
      .pipe(takeUntil(this.destroy$))
      .subscribe((strategies: Strategy[]) => {
        this.strategies = strategies;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
