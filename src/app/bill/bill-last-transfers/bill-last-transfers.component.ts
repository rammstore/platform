import { Component, Input, OnInit } from '@angular/core';
import { WalletTransfer } from '@app/models';
import { WalletService } from '@app/services/wallet.service';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';

declare type FilterValue = 'all' | 'internal' | 'external';

@Component({
  selector: 'app-bill-last-transfers',
  templateUrl: './bill-last-transfers.component.html',
  styleUrls: ['./bill-last-transfers.component.scss']
})
export class BillLastTransfersComponent implements OnInit {
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

  constructor(
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.walletService.getDeals(this.walletID)
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
