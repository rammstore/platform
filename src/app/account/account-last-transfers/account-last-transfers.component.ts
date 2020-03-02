import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Paginator, TableColumn, WalletTransfer } from '@app/models';
import { WalletService } from '@app/services/wallet.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { TableHeaderRow } from '@app/models/table-header-row';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { CustomDatePipe } from '@app/pipes/custom-date.pipe';

declare type FilterValue = 'all' | 'internal' | 'external';

@Component({
  selector: 'app-account-last-transfers',
  templateUrl: './account-last-transfers.component.html',
  styleUrls: ['./account-last-transfers.component.scss']
})
export class AccountLastTransfersComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  @Input() walletID: number;
  transfers: WalletTransfer[];
  filter: {value: FilterValue, name: string} = {
    value: 'all',
    name: 'Все'
  };

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'id', label: '#'}),
      new TableColumn({ property: 'dtCreated', label: 'Дата', pipe: { pipe: CustomDatePipe }}),
      new TableColumn({ property: 'walletTransferAmount', label: 'Сумма, USD', pipe: { pipe: CustomCurrencyPipe }}),
      new TableColumn({ property: 'type', label: 'Тип'}),
      new TableColumn({ property: 'accountID', label: 'Счет'}),
      new TableColumn({ property: 'walletTransferStrategy', label: 'Стратегия'})
    ])
  ];
  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.getDeals();
  }

  getDeals(): void {
    this.walletService.getDeals(this.walletID, this.paginator)
      .pipe(takeUntil(this.destroy$))
      .subscribe((transfers: WalletTransfer[]) => {
        this.transfers = transfers;
      });
  }

  changeFilter(filter: FilterValue): void {
    switch (filter) {
      case 'all':
        this.filter = { name: 'Все', value: filter};
        break;
      case 'internal':
        this.filter = { name: 'Внутренние', value: filter};
        break;
      case 'external':
        this.filter = { name: 'Внешние', value: filter};
        break;
    }
  }

  isTransferVisible(transfer: WalletTransfer): boolean {
    switch (this.filter.value) {
      case 'all':
        return true;
        break;
      case 'internal':
        return !transfer.isExternal();
        break;
      case 'external':
        return transfer.isExternal();
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
