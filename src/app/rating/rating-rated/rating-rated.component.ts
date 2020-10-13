import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {Paginator, Strategy, TableColumn} from '@app/models';
import {TableHeaderRow} from '@app/models/table-header-row';
import {PercentPipe} from '@angular/common';
import {DataService} from '@app/services/data.service';
import {map, take, takeUntil, tap} from 'rxjs/operators';
import {SectionEnum} from "@app/enum/section.enum";
import {EntityInterface} from "@app/interfaces/entity.interface";

@Component({
  selector: 'app-rating-rated',
  templateUrl: './rating-rated.component.html',
  styleUrls: ['./rating-rated.component.scss']
})
export class RatingRatedComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  strategies$: Observable<Strategy[]>;
  // component data
  strategies: Strategy[];
  searchText: string = '';
  args: any;
  section: SectionEnum = SectionEnum.rating;
  rating: any;
  optionsRatings$: Observable<any>;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({property: 'nameRating', label: 'common.strategy', fontSize: 20}),
      new TableColumn({
        property: 'profit',
        label: 'common.table.label.yieldCommon',
        pipe: {pipe: PercentPipe, args: ['1.0-2']},
        fontSize: 24
      }),
      new TableColumn({property: 'strategy.yieldChart', label: 'common.chart'}),
      new TableColumn({property: 'accounts', label: 'common.table.label.investors', fontSize: 16}),
      new TableColumn({property: 'age', label: 'common.age', fontSize: 16}),
      new TableColumn({
        property: 'strategy.investmentInfo',
        hint: 'account.label.profit.hint',
        label: 'common.table.label.myInvestmentUSD',
        colored: true
      }),
      new TableColumn({property: 'manage', label: 'common.table.label.manage'})
    ]),
  ];
  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
    this.optionsRatings$ = this.dataService.getOptionsRatings()
      .pipe(
        takeUntil(this.destroy$),
        map(({Ratings}) => Ratings),
        map(ratings => {
          if (ratings) {
            this.rating = ratings.filter(item => item.Name === 'Rating')[0];
            this.args = {
              searchMode: this.rating.Filter.SearchMode,
              dealsMin: this.rating.Filter.DealsMin,
              ageMin: this.rating.Filter.AgeMin,
              yieldMin: this.rating.Filter.YieldMin,
              field: this.rating.OrderBy.Field,
              direction: this.rating.OrderBy.Direction,
              paginator: this.paginator,
              searchText: this.searchText
            };
          }
          return {
            ratings,
            args: this.args
          };
        }),
        tap(({args}) => this.strategies$ = this.getStrategies(args))
      );
  }

  getRating() {
    this.args.searchText = this.searchText;
    this.strategies$ = this.getStrategies(this.args);
  }

  private getStrategies(args): Observable<any> {
    return this.dataService.getBestRating<EntityInterface>(args)
      .pipe(
        take(1),
        // map(({Strategies}) => Strategies),
        map(({Strategies}) => Strategies.map((item) => new Strategy(item))),
        tap(item => console.log('best strategy', item)));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
