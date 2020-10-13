import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { PercentPipe } from '@angular/common';
import { DataService } from '@app/services/data.service';
import {filter, map, takeUntil} from 'rxjs/operators';
import { SectionEnum } from "@app/enum/section.enum";

@Component({
  selector: 'app-rating-all',
  templateUrl: './rating-all.component.html',
  styleUrls: ['./rating-all.component.scss']
})
export class RatingAllComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  strategies$: Observable<Strategy[]>;
  // component data
  strategies: Strategy[];
  searchText: string = '';
  args: any;
  section: SectionEnum = SectionEnum.rating;
  all: any;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'nameRating', label: 'common.strategy', fontSize: 20 }),
      new TableColumn({
        property: 'profit',
        label: 'common.table.label.yieldCommon',
        pipe: { pipe: PercentPipe, args: ['1.0-2'] },
        fontSize: 24
      }),
      new TableColumn({ property: 'strategy.yieldChart', label: 'common.chart' }),
      new TableColumn({ property: 'accounts', label: 'common.table.label.investors', fontSize: 16 }),
      new TableColumn({ property: 'age', label: 'common.age', fontSize: 16 }),
      new TableColumn({
        property: 'strategy.investmentInfo',
        label: 'common.table.label.myInvestmentUSD',
        colored: true
      }),
      new TableColumn({ property: 'manage', label: 'common.table.label.manage' })
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
    this.dataService.getOptionsRatings()
      .pipe(
        takeUntil(this.destroy$),
        map(({Ratings}) => Ratings)
      )
      .subscribe((ratings: any) => {
        if (ratings ) {
          this.all = ratings.filter(item => item.Name === 'All')[0];
          console.log('all', this.all);
          this.args = {
            searchMode: this.all.Filter.SearchMode,
            dealsMin: this.all.Filter.DealsMin,
            ageMin: this.all.Filter.AgeMin,
            yieldMin: this.all.Filter.YieldMin,
            field: this.all.OrderBy.Field,
            direction: this.all.OrderBy.Direction,
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
    console.log('all', this.strategies$);

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
