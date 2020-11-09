import { Component, OnDestroy, OnInit } from '@angular/core';
import { Strategy } from '@app/models/strategy';
import { TableHeaderRow } from '@app/models/table-header-row';
import { Paginator, TableColumn } from '@app/models';
import { PercentPipe } from '@angular/common';
import {Observable, Subject} from 'rxjs';
import {map, take, takeUntil} from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { CustomDatePipe } from '@app/pipes/custom-date.pipe';
import {StrategyService} from '@app/services/strategy.service';
import {SettingsService} from "@app/services/settings.service";

@Component({
  selector: 'app-strategy-closed',
  templateUrl: './strategy-closed.component.html',
  styleUrls: ['./strategy-closed.component.scss']
})
export class StrategyClosedComponent implements OnInit, OnDestroy {
  // component data
  strategies: Strategy[];
  strategies$: Observable<Strategy[]>;

  destroy$ = new Subject();
  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'id', label: 'ID' }),
      new TableColumn({ property: 'name', label: 'common.table.label.name' }),
      new TableColumn({ property: 'publicOffer.feeRate', label: 'common.fee', pipe: { pipe: PercentPipe } }),
      new TableColumn({ property: 'dtCreated', label: 'common.table.label.created', pipe: { pipe: CustomDatePipe } }),
      new TableColumn({ property: 'dtClosed', label: 'common.table.label.closed', pipe: { pipe: CustomDatePipe } }),
      new TableColumn({ property: 'age', label: 'common.age' }),
      new TableColumn({ property: 'traderInfo.feePaid', label: 'common.table.label.feePaidUSD', pipe: { pipe: CustomCurrencyPipe } })
    ]),
  ];
  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private dataService: DataService,
    private strategyService: StrategyService,
    public settingsService: SettingsService
  ) {
  }

  ngOnInit(): void {
    this.getStrategies();

    this.strategyService.update$
      .pipe(take(1))
      .subscribe(item => {
        this.getStrategies();
      });
  }

  getStrategies(): void {
    this.strategies$ = this.dataService.getClosedMyStrategies({
      searchMode: 'MyClosedStrategies',
      paginator: this.paginator
    }).pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
