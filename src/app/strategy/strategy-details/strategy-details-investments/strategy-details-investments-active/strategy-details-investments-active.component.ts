import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '@app/services/data.service';
import { Paginator, Account, TableColumn } from '@app/models';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TableHeaderRow } from '@app/models/table-header-row';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { CustomDatePipe } from '@app/pipes/custom-date.pipe';

@Component({
  selector: 'app-strategy-details-investments-active',
  templateUrl: './strategy-details-investments-active.component.html',
  styleUrls: ['./strategy-details-investments-active.component.scss']
})
export class StrategyDetailsInvestmentsActiveComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  accounts: Account[];

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'account.id', label: 'common.investment'}),
      new TableColumn({ property: 'dtCreated', label: 'common.date', pipe: { pipe: CustomDatePipe }}),
      new TableColumn({ property: 'equity', label: 'common.table.label.equityUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'profitCurrentIntervalGross', label: 'common.table.label.grossPLUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'feePaid', label: 'common.table.label.feePaidUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'totalCommissionTrader', label: 'common.table.label.commissionPaidUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'feeToPay', label: 'common.table.label.feeToPayUSD', pipe: { pipe: CustomCurrencyPipe } })
    ]),
  ];
  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.getAccounts();
  }

  getAccounts() {
    this.dataService.getStrategyAccounts(parseInt(this.router.url.split('/')[3], 10), true, this.paginator)
      .pipe(takeUntil(this.destroy$))
      .subscribe((accounts: Account[]) => {
        this.accounts = accounts;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
