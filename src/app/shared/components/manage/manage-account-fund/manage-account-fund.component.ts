import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/internal/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthData } from '@app/user/auth-data';
import { StorageService } from '@app/services/storage.service';
import { BsModalRef } from 'ngx-bootstrap';
import { Account, Strategy } from '@app/models';
import { Subject } from 'rxjs/index';
import { AccountService } from '@app/services/account.service';

@Component({
  selector: 'app-manage-account-fund',
  templateUrl: './manage-account-fund.component.html',
  styleUrls: ['./manage-account-fund.component.scss']
})
export class ManageAccountFundComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // strategy data
  account: Account;
  form: FormGroup;
  authData: AuthData;
  strategy: Strategy;

  constructor(
    public modalRef: BsModalRef,
    private storageService: StorageService,
    private accountService: AccountService,
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
        ((this.authData.getWallets()[0].balance / 10).toFixed(2)),
        [Validators.min(0), Validators.max(this.authData.getWallets()[0].balance), Validators.pattern('^[0-9]+([\\,\\.][0-9]{1,2})?$')]
      ]
    });
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.accountService.fund(this.account.id, this.form.get('amount').value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // this.account.equity = this.account.equity + this.form.get('amount').value;
        // this.account.balance = this.account.balance + this.form.get('amount').value;
        this.authData.getWallets()[0].balance = this.authData.getWallets()[0].balance - this.form.get('amount').value;
        this.storageService.setAuthData(JSON.stringify(this.authData));
        this.modalRef.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
