import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Strategy, Wallet } from '@app/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';
import { WalletService } from '@app/services/wallet.service';

@Component({
  selector: 'app-manage-strategy-invest',
  templateUrl: './manage-strategy-invest.component.html',
  styleUrls: ['./manage-strategy-invest.component.scss']
})
export class ManageStrategyInvestComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  form: FormGroup;
  wallet: Wallet;
  strategy: Strategy;
  securityMinBalance: number;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private walletService: WalletService,
    public modalRef: BsModalRef
  ) { }

  ngOnInit(): void {
    this.securityMinBalance = this.dataService.accountSpecAsset.securityMinBalance;
    this.walletService.getWallet()
      .pipe(takeUntil(this.destroy$))
      .subscribe((wallet: Wallet) => {
      this.wallet = wallet;
      this.buildForm();
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      amount: [(this.wallet.balance / 10).toFixed(2), [Validators.required, Validators.min(this.securityMinBalance), Validators.max(this.wallet.balance), Validators.pattern('^[0-9]+([\\,\\.][0-9]{1,2})?$')]],
      factor: [1, [Validators.min(0.1), Validators.max(10), Validators.required, Validators.pattern('[0-9]+(\\.[0-9]?)?')]],
      target: [100, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*')]],
      protection: [50, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern('^[0-9]*')]]
    });
  }

  cancel(): void {
    this.modalRef.hide();
  }

  invest(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const values: any = this.form.getRawValue();
    values.protection = values.protection / 100;
    values.target = values.target ? values.target / 100 : null;

    this.dataService.addAccount(this.strategy.id, values).subscribe(() => {
      this.modalRef.hide();
    });
  }

  setMoney(amount: number): void {
    this.form.get('amount').setValue(amount);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
