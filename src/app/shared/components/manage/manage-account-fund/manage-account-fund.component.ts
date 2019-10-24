import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/internal/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Account, Wallet } from '@app/models';
import { Subject } from 'rxjs';
import { DataService } from '@app/services/data.service';
import { WalletService } from '@app/services/wallet.service';

@Component({
  selector: 'app-manage-account-fund',
  templateUrl: './manage-account-fund.component.html',
  styleUrls: ['./manage-account-fund.component.scss']
})
export class ManageAccountFundComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  account: Account;
  form: FormGroup;
  wallet: Wallet;

  constructor(
    public modalRef: BsModalRef,
    private walletService: WalletService,
    private dataService: DataService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.walletService.getWallet().subscribe((wallet: Wallet) => {
      this.wallet = wallet;
      this.buildForm();
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      amount: [
        ((this.wallet.getAvailableMoney() / 10).toFixed(2)),
        [Validators.min(0), Validators.max(this.wallet.getAvailableMoney()), Validators.pattern('^[0-9]+([\\,\\.][0-9]{1,2})?$')]
      ]
    });
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.dataService.fundAccount(this.account.id, this.form.get('amount').value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modalRef.hide();
      });
  }

  setAllMoney(): void {
    this.form.get('amount').setValue(this.wallet.getAvailableMoney());
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
