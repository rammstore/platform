import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthData } from '@app/user/auth-data';
import { StorageService } from '@app/services/storage.service';
import { BsModalRef } from 'ngx-bootstrap';
import { StrategyService } from '@app/services/strategy.service';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';
import { Account } from '@app/models';
import { AccountService } from '@app/services/account.service';

@Component({
  selector: 'app-manage-account-resume',
  templateUrl: './manage-account-resume.component.html',
  styleUrls: ['./manage-account-resume.component.scss']
})
export class ManageAccountResumeComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  form: FormGroup;
  authData: AuthData;
  account: Account;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private accountService: AccountService,
    public modalRef: BsModalRef
  ) { }

  ngOnInit(): void {
    this.storageService.getAuthData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((authData: AuthData) => {
        this.authData = authData;
      });
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      amount: [0.00, [Validators.required, Validators.min(0), Validators.max(this.authData.getWallets()[0].getEquity()), Validators.pattern('^\d*(\.\d{0,2})?$')]],
      goal: [100, [Validators.required, Validators.min(0)]],
      protection: [50, [Validators.required, Validators.min(0), Validators.max(99)]]
    });
  }

  resume(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.accountService.resume(this.account.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // this.account.resume();
        this.modalRef.hide();
      });
  }

  cancel(): void {
    this.modalRef.hide();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
