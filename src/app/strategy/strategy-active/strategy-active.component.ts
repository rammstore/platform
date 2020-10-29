import { Component, OnDestroy, OnInit } from '@angular/core';
import { Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { PercentPipe } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { DataService } from '@app/services/data.service';
import {SectionEnum} from "@app/enum/section.enum";

@Component({
  selector: 'app-strategy-active',
  templateUrl: './strategy-active.component.html',
  styleUrls: ['./strategy-active.component.scss']
})
export class StrategyActiveComponent implements OnInit {
  // component data
  strategies$: Observable<Strategy[]>;
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
      searchMode: 'MyActiveStrategies',
      paginator: this.paginator
    };

    this.strategies$ = this.getActiveStrategy(this.args);
  }

  getActiveStrategy(args: any): Observable<any>{
    return this.dataService.getActiveMyStrategies(args);
  }

  getStrategies(): void {
    this.strategies$ = this.getActiveStrategy(this.args);
  }
}
