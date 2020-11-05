import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { PercentPipe } from '@angular/common';
import { DataService } from '@app/services/data.service';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { SectionEnum } from "@app/enum/section.enum";
import { ArgumentsService } from '@app/services/arguments.service';

@Component({
  selector: 'app-rating-rated',
  templateUrl: './rating-rated.component.html',
  styleUrls: ['./rating-rated.component.scss']
})
export class RatingRatedComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  strategies$: Observable<Strategy[]>;
  strategies: Strategy[];
  // component data
  searchText: string = '';
  args: any;
  section: SectionEnum = SectionEnum.rating;
  ratingRated$: Observable<any>;

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
    private dataService: DataService,
    private argumentsService: ArgumentsService
  ) {
  }

  ngOnInit(): void {
    this.ratingRated$ = this.argumentsService.ratingRated$
      .pipe(
        tap((argument) => {
          this.args = {
            searchMode: argument.searchMode,
            dealsMin: argument.dealsMin,
            ageMin: argument.ageMin,
            yieldMin: argument.yieldMin,
            field: argument.field,
            direction: argument.direction,
            paginator: this.paginator
          };

          this.strategies$ = this.getStrategies();
        })
      );

    this.dataService.update$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data.status == "update") {
          if (data.accountId) {
            this.getAccountById(data.accountId)
              .pipe(takeUntil(this.destroy$))
              .subscribe((response) => {
                (this.strategies || []).filter((strategy: Strategy) => {
                  if (strategy.account && strategy.account.id == data.accountId) {
                    strategy.account = response.account;
                  }
                });

                this.strategies$ = of(this.strategies);
              });
          }
          else if (data.strategyId) {
            this.getStrategyById(data.strategyId)
              .pipe(takeUntil(this.destroy$))
              .subscribe((strategy: Strategy) => {
                (this.strategies || []).filter((item: Strategy) => {
                  if (item.id == data.strategyId) {
                    item.status = strategy.status;
                debugger
                  }
                });
                
                this.strategies$ = of(this.strategies);
              });
          }

        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  getAccountById(accountId: number): Observable<any> {
    return this.dataService.getAccountById(accountId);
  }

  getStrategyById(strategyId: number): Observable<Strategy> {
    let args = {
      strategyId: strategyId
    }

    return this.dataService.getStrategyById(args);
  }

  getStrategies(): Observable<any> {
    return this.dataService.getBestRating(this.args)
      .pipe(
        tap((strategies) => this.strategies = strategies)
      );
  }

  getRating() {
    this.args.searchText = this.searchText;
    this.strategies$ = this.getStrategies();
  }

  search() {
    this.args.searchText = this.searchText;
    this.args.paginator.currentPage = 1;
    this.strategies$ = this.getStrategies();
  }
}
