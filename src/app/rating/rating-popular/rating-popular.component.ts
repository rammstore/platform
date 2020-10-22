import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { PercentPipe } from '@angular/common';
import { DataService } from '@app/services/data.service';
import {map, takeUntil} from 'rxjs/operators';
import { SectionEnum } from "@app/enum/section.enum";

@Component({
  selector: 'app-rating-popular',
  templateUrl: './rating-popular.component.html',
  styleUrls: ['./rating-popular.component.scss']
})
export class RatingPopularComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();
  strategies$: Observable<Strategy[]>;
  // component data
  strategies: Strategy[];
  searchText: string = '';
  args: any;
  section: SectionEnum = SectionEnum.rating;
  popular: any;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'nameRating', label: 'common.strategy', fontSize: 20 }),
      new TableColumn({ property: 'profit', label: 'common.table.label.yieldCommon', pipe: { pipe: PercentPipe, args: ['1.0-2'] }, fontSize: 24 }),
      new TableColumn({ property: 'strategy.yieldChart', label: 'common.chart' }),
      new TableColumn({ property: 'accounts', label: 'common.table.label.investors', fontSize: 16 }),
      new TableColumn({ property: 'age', label: 'common.age', fontSize: 16 }),
      new TableColumn({ property: 'strategy.investmentInfo', label: 'common.table.label.myInvestmentUSD', colored: true }),
      new TableColumn({ property: 'manage', label: 'common.table.label.manage' })
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
    this.dataService.getOptionsRatings()
      .pipe(
        takeUntil(this.destroy$),
        map(({Ratings}) => Ratings)
      )
      .subscribe((ratings: any) => {
        if (ratings) {
          this.popular = ratings.filter(item => item.Name === 'Popular')[0];
          console.log('Popular', this.popular);
          this.args = {
            searchMode: this.popular.Filter.SearchMode,
            dealsMin: this.popular.Filter.DealsMin,
            ageMin: this.popular.Filter.AgeMin,
            yieldMin: this.popular.Filter.YieldMin,
            field: this.popular.OrderBy.Field,
            direction: this.popular.OrderBy.Direction,
            paginator: this.paginator,
            searchText: this.searchText
          };

          this.getRating();
        }
      });
  }

  getRating() {
    this.args.searchText = this.searchText;
    this.strategies$ = this.dataService.getRating(this.args);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
