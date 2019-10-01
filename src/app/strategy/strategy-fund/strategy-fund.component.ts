import { Component, OnDestroy, OnInit } from '@angular/core';
import { Strategy } from '../../shared/models/strategy';
import { BsModalRef } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthData } from '../../shared/user/auth-data';
import { StorageService } from '../../shared/services/storage.service';
import { StrategyService } from '../../shared/services/strategy.service';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';

@Component({
  selector: 'app-strategy-fund',
  templateUrl: './strategy-fund.component.html',
  styleUrls: ['./strategy-fund.component.scss']
})
export class StrategyFundComponent implements OnInit, OnDestroy {
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
