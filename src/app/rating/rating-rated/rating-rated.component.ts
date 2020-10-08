import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { PercentPipe } from '@angular/common';
import { DataService } from '@app/services/data.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SectionEnum } from "@app/enum/section.enum";
import { BrandService } from '@app/services/brand.service';

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

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'nameRating', label: 'common.strategy', fontSize: 20 }),
      new TableColumn({ property: 'profit', label: 'common.table.label.yieldCommon', pipe: { pipe: PercentPipe, args: ['1.0-2'] }, fontSize: 24 }),
      new TableColumn({ property: 'strategy.yieldChart', label: 'common.chart' }),
      new TableColumn({ property: 'accounts', label: 'common.table.label.investors', fontSize: 16 }),
      new TableColumn({ property: 'age', label: 'common.age', fontSize: 16 }),
      new TableColumn({
        property: 'strategy.investmentInfo',
        hint: 'account.label.profit.hint',
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
  ) { }

  ngOnInit(): void {
    this.dataService.getOptionsRatings()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        if (result) {
          this.rating = result.Ratings.filter(item => item.Name === 'Rating')[0];
          console.log('rating', this.rating);
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
          
          this.getRating();
        }
      });
  }

  getRating() {
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
