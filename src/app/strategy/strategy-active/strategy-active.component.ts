import { Component, OnDestroy, OnInit } from '@angular/core';
import { Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { PercentPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { DataService } from '@app/services/data.service';
import {SectionEnum} from "@app/enum/section.enum";

@Component({
  selector: 'app-strategy-active',
  templateUrl: './strategy-active.component.html',
  styleUrls: ['./strategy-active.component.scss']
})
export class StrategyActiveComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  strategies: Strategy[];
  args: any;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'name', label: 'common.table.label.name'}),
      new TableColumn({ property: 'account.equity', label: 'common.table.label.equityUSD', pipe: { pipe: CustomCurrencyPipe }}),
      new TableColumn({ property: 'accounts', label: 'common.table.label.investors'}),
      new TableColumn({ property: 'publicOffer.feeRate', label: 'common.fee', pipe: { pipe: PercentPipe }}),
      new TableColumn({ property: 'traderInfo.feePaid', label: 'common.table.label.feePaidUSD', pipe: { pipe: CustomCurrencyPipe }}),
      new TableColumn({ property: 'account.intervalPnL', hint: 'account.label.profit.hint', label: 'common.table.label.yieldUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'traderInfo.feeToPay', label: 'common.table.label.feeToPayUSD', pipe: { pipe: CustomCurrencyPipe }}),
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
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.args = {
      paginator: this.paginator
    };

    this.getStrategies();
  }

  getStrategies(): void {
    this.dataService.getActiveMyStrategies(this.args)
      .pipe(takeUntil(this.destroy$))
      .subscribe((strategies: Strategy[]) => {
        this.strategies = strategies;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
