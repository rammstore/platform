import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Paginator, TableColumn, WalletTransfer } from '@app/models';
import { WalletService } from '@app/services/wallet.service';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';
import { TableHeaderRow } from '@app/models/table-header-row';
import { DatePipe } from '@angular/common';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';

declare type FilterValue = 'all' | 'internal' | 'external';

@Component({
  selector: 'app-bill-last-transfers',
  templateUrl: './bill-last-transfers.component.html',
  styleUrls: ['./bill-last-transfers.component.scss']
})
export class BillLastTransfersComponent implements OnInit, OnDestroy {
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
      new TableColumn({ property: 'accountID', label: 'Счет'}),
      new TableColumn({ property: 'dtCreated', label: 'Дата', pipe: { pipe: DatePipe, args: ['yyyy-MM-dd hh:mm:ss'] }}),
      new TableColumn({ property: 'amount', label: 'Сумма', pipe: { pipe: CustomCurrencyPipe }}),
      new TableColumn({ property: 'type', label: 'Тип'})
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
