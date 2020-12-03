import { Component, OnDestroy, OnInit } from '@angular/core';
import { Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { PercentPipe } from '@angular/common';
import { Observable, of, Subject } from 'rxjs';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { DataService } from '@app/services/data.service';
import { SectionEnum } from "@app/enum/section.enum";
import { takeUntil, tap } from 'rxjs/operators';
import { SettingsService } from "@app/services/settings.service";
import { iUpdateOptions } from '@app/interfaces/update';

@Component({
  selector: 'app-strategy-active',
  templateUrl: './strategy-active.component.html',
  styleUrls: ['./strategy-active.component.scss']
})
export class StrategyActiveComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  // component data
  strategies$: Observable<Strategy[]>;
  strategies: Strategy[];
  args: any;
  key: string;
  update$: Observable<any>;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'name', label: 'common.table.label.name' }),
      new TableColumn({ property: 'account.equity', label: 'common.table.label.equityUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'accounts', label: 'common.table.label.investors' }),
      new TableColumn({ property: 'publicOffer.feeRate', label: 'common.fee', pipe: { pipe: PercentPipe } }),
      new TableColumn({ property: 'traderInfo.feePaid', label: 'common.table.label.feePaidUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'account.intervalPnL', hint: 'account.label.profit.hint', label: 'common.table.label.yieldUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'traderInfo.feeToPay', label: 'common.table.label.feeToPayUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'manage', label: '' })
    ]),
  ];

  totalFields: string[] = ['account.equity', 'accounts', 'account.intervalPnL', 'traderInfo.feePaid', 'traderInfo.feeToPay'];

  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  sectionEnum: SectionEnum = SectionEnum.strategy;

  constructor(
    private dataService: DataService,
    public settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    this.key = "strategy-active";
    this.dataService.strategyPage = this.key;
    this.args = {
      searchMode: 'MyActiveStrategies',
      paginator: this.paginator
    };

    this.strategies$ = this.getActiveStrategy(this.args);

    this.update$ = this.dataService.update$
      .pipe(
        tap((data: iUpdateOptions) => {
          if (data && data.updateStatus == "update" && data.key == "strategy-active") {
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
                    }
                  });

                  this.strategies$ = of(this.strategies);
                });
            }

            this.dataService._update$.next(null);
          }
          else if (data && data.updateStatus == "strategy-created" && data.key == "strategy-active" && data.strategyId) {
            this.getStrategies();
          }
          else if (data && data.updateStatus == "close" && data.strategyId) {
            this.strategies = (this.strategies || []).filter((strategy: Strategy) => strategy.id != data.strategyId);

            this.strategies$ = of(this.strategies);
          }
        })
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  getStrategyById(strategyId: number): Observable<Strategy> {
    return this.dataService.getStrategyById({
      strategyId: strategyId
    });
  }

  getAccountById(accountId: number): Observable<any> {
    let args: any = {
      accountId: accountId
    }
    return this.dataService.getAccountById(args);
  }

  getActiveStrategy(args: any): Observable<any> {
    return this.dataService.getActiveMyStrategies(args)
      .pipe(
        tap((strategies) => this.strategies = strategies)
      );
  }

  getStrategies(): void {
    this.strategies$ = this.getActiveStrategy(this.args);
  }


}
