import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, Paginator, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { PercentPipe } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { DataService } from '@app/services/data.service';
import { CustomDatePipe } from '@app/pipes/custom-date.pipe';
import { BrandService } from '@app/services/brand.service';
import { SettingsService } from '@app/services/settings.service';

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
  accounts$: Observable<Account[]>;
  functionality: object;
  args: any;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'strategy.name', label: 'common.strategy' }),
      new TableColumn({ property: 'id', label: 'common.investment', colored: true }),
      new TableColumn({ property: 'dtCreated', label: 'common.table.label.created', pipe: { pipe: CustomDatePipe }, colored: true }),
      new TableColumn({ property: 'dtClosed', label: 'common.table.label.closed', pipe: { pipe: CustomDatePipe }, colored: true }),
      new TableColumn({ property: 'age', label: 'common.age', colored: true }),
      new TableColumn({
        property: 'intervalPnL',
        hint: 'account.label.profit.hint',
        label: 'common.table.label.yield',
        pipe: { pipe: CustomCurrencyPipe },
        colored: true
      }),
      new TableColumn({ property: 'investmentDetails', label: '' })
    ])
  ];

  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private dataService: DataService,
    private brandService: BrandService,
    public settingsService: SettingsService
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
            pipe: { pipe: PercentPipe },
            colored: true
          }));
        }
      });

    this.args = {
      field: 'DTClosed',
      direction: 'Desc',
      paginator: this.paginator
    }

    this.accounts$ = this.getClosedAccounts(this.args);
  }

  getClosedAccounts(args: any): Observable<any> {
    return this.dataService.getClosedMyAccounts(args);
  }

  getAccounts(): void {
    this.accounts$ = this.getClosedAccounts(this.args)
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
