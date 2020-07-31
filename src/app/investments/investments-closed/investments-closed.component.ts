import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, Paginator, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { PercentPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { DataService } from '@app/services/data.service';
import { CustomDatePipe } from '@app/pipes/custom-date.pipe';
import { BrandService } from '@app/services/brand.service';
import { log } from 'util';

@Component({
  selector: 'app-investments-closed',
  templateUrl: './investments-closed.component.html',
  styleUrls: ['./investments-closed.component.scss']
})
export class InvestmentsClosedComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  accounts: Account[];
  functionality: object;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({property: 'strategy.name', label: 'common.strategy'}),
      new TableColumn({property: 'id', label: 'common.investment', colored: true}),
      new TableColumn({property: 'dtCreated', label: 'common.table.label.created', pipe: {pipe: CustomDatePipe}, colored: true}),
      new TableColumn({property: 'dtClosed', label: 'common.table.label.closed', pipe: {pipe: CustomDatePipe}, colored: true}),
      new TableColumn({property: 'age', label: 'common.age', colored: true}),
      new TableColumn({
        property: 'intervalPnL',
        hint: 'account.label.profit.hint',
        label: 'common.table.label.yield',
        pipe: {pipe: CustomCurrencyPipe},
        colored: true}),
      new TableColumn({property: 'investmentDetails', label: ''})
    ])
  ];

  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private dataService: DataService,
    private brandService: BrandService
  ) {
  }

  ngOnInit(): void {
    this.brandService.functionality
      .pipe(takeUntil(this.destroy$))
      .subscribe((f: object) => {
        this.functionality = f;

        if (this.functionality['protectionShow'] && this.tableHeader[0].columns[5].property !== 'protection') {
          this.tableHeader[0].columns.splice(5, 0, new TableColumn({
            property: 'protection',
            label: 'common.protection',
            pipe: {pipe: PercentPipe},
            colored: true
          }));
        }
      });
    this.getAccounts();
  }

  getAccounts(): void {
    this.dataService.getClosedMyAccounts(this.paginator)
      .pipe(takeUntil(this.destroy$))
      .subscribe((accounts: Account[]) => {
        if (accounts && accounts.length) {
          this.accounts = accounts;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
