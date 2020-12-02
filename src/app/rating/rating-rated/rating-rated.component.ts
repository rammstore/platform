import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { PercentPipe } from '@angular/common';
import { DataService } from '@app/services/data.service';
import { takeUntil, tap } from 'rxjs/operators';
import { SectionEnum } from "@app/enum/section.enum";
import { ArgumentsService } from '@app/services/arguments.service';
import { SettingsService } from '@app/services/settings.service';
import { iUpdateOptions } from '@app/interfaces/update';

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
  key: string;
  update$: Observable<any>;

  // table settings
  tableHeader: TableHeaderRow[];

  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private dataService: DataService,
    private argumentsService: ArgumentsService,
    public settingsService: SettingsService
  ) {
  }

  ngOnInit(): void {
    this.setTableHeader();

    // this.key = "rating-rated";

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

    // debugger
    this.update$ = this.dataService.update$
      .pipe(
        tap((data: iUpdateOptions) => {
          // debugger
          if (data && data.updateStatus == "update") {
            if (data.accountId) {
              // update strategy after investment was set on pause/resume
              this.getAccountById(data.accountId)
                .pipe(takeUntil(this.destroy$))
                .subscribe((response) => {
                  // debugger
                  (this.strategies || []).filter((strategy: Strategy) => {
                    if (strategy.account && strategy.account.id == data.accountId) {
                      strategy = Object.assign(strategy, response.strategy);
                      strategy.account = response.account;
                    }
                  });

                  this.strategies$ = of(this.strategies);

                  this.dataService._update$.next(null);
                });
            }
            else if (data.strategyId) {
              // update strategy after strategy was set on pause/resume
              this.getStrategyById(data.strategyId)
                .pipe(takeUntil(this.destroy$))
                .subscribe((updatedStrategy: Strategy) => {
                  // debugger
                  (this.strategies || []).filter((itemToUpdate: Strategy) => {
                    if (itemToUpdate.id == updatedStrategy.id) {
                      itemToUpdate = Object.assign(itemToUpdate, updatedStrategy);
                    }
                  });

                  this.strategies$ = of(this.strategies);

                  this.dataService._update$.next(null);
                });
            }
          }
          else if (data && data.updateStatus == "close") {
            if (data.accountId) {
              // update strategy after investrment was closed
              (this.strategies || []).filter((strategy: Strategy) => {
                if (strategy.account && strategy.account.id == data.accountId) {
                  strategy.account = null;

                  this.strategies$ = of(this.strategies);

                  this.setTableHeader();
                }
              });
            }
            else if (data.strategyId) {
              // update strategy after this strategy was closed
              (this.strategies || []).filter((strategy: Strategy) => {
                if (strategy.account && strategy.id == data.strategyId) {
                  this.getStrategyById(data.strategyId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((strategyById: Strategy) => {
                      strategy = Object.assign(strategy, strategyById);
                      // debugger
                      this.strategies$ = of(this.strategies);
                    })

                  this.setTableHeader();
                }
              });
            }
          }
        })
      );
  }

  setTableHeader(): void {
    this.tableHeader = [
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
  }

  getAccountById(accountId: number): Observable<any> {
    let args: any = {
      accountId: accountId
    }

    return this.dataService.getAccountById(args);
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.dataService._update$.next(null);
  }
}
