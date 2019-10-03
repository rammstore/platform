import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/internal/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthData } from '@app/user/auth-data';
import { StrategyService } from '@app/services/strategy.service';
import { StorageService } from '@app/services/storage.service';
import { BsModalRef } from 'ngx-bootstrap';
import { Strategy } from '@app/models';
import { Subject } from 'rxjs/index';

@Component({
  selector: 'app-strategy-manage-fund',
  templateUrl: './strategy-manage-fund.component.html',
  styleUrls: ['./strategy-manage-fund.component.scss']
})
export class StrategyManageFundComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // strategy data
  strategy: Strategy;
  form: FormGroup;
  authData: AuthData;

  constructor(
    public modalRef: BsModalRef,
    private storageService: StorageService,
    private strategyService: StrategyService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.storageService.getAuthData().subscribe((authData: AuthData) => {
      this.authData = authData;
    });
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      amount: [
        (Math.round(this.authData.getWallets()[0].getEquity() / 10)),
        [Validators.min(0), Validators.max(this.authData.getWallets()[0].getEquity())]
      ]
    });
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.strategyService.fund(this.strategy.account.id, this.form.get('amount').value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.strategy.account.equity = this.strategy.account.equity + this.form.get('amount').value;
        this.strategy.account.balance = this.strategy.account.balance + this.form.get('amount').value;
        this.authData.getWallets()[0].balance = this.authData.getWallets()[0].balance - this.form.get('amount').value;
        this.storageService.setAuthData(JSON.stringify(this.authData));
        this.modalRef.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
