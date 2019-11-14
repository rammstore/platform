import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { Wallet } from '@app/models';
import { takeUntil } from 'rxjs/internal/operators';
import { WalletService } from '@app/services/wallet.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  wallet: Wallet;

  constructor(
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.walletService.getWallet()
      .pipe(takeUntil(this.destroy$))
      .subscribe((wallet: Wallet) => {
        this.wallet = wallet;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
