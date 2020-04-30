import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { PercentPipe } from '@angular/common';
import { DataService } from '@app/services/data.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-rating-popular',
  templateUrl: './rating-popular.component.html',
  styleUrls: ['./rating-popular.component.scss']
})
export class RatingPopularComponent implements  OnInit, OnDestroy {
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
      new TableColumn({ property: 'nameRating', label: 'common.strategy', fontSize: 20}),
      new TableColumn({ property: 'profit', label: 'common.table.label.yieldCommon', pipe: { pipe: PercentPipe, args: ['1.0-2'] }, fontSize: 24}),
      new TableColumn({ property: 'strategy.yieldChart', label: 'common.chart' }),
      new TableColumn({ property: 'accountsCount', label: 'common.table.label.investors', fontSize: 16}),
      new TableColumn({ property: 'age', label: 'common.age', fontSize: 16 }),
      new TableColumn({ property: 'strategy.investmentInfo', label: 'common.table.label.myInvestmentUSD', colored: true }),
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
      ratingType: 2,
      paginator: this.paginator,
      searchText: this.searchText
    };
    this.getRating();
  }

  getRating(): void {
    this.args.searchText = this.searchText;
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
