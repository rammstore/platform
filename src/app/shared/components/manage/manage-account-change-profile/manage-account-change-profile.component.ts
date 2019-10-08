import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthData } from '@app/user/auth-data';
import { StorageService } from '@app/services/storage.service';
import { BsModalRef } from 'ngx-bootstrap';
import { Strategy } from '@app/models/strategy';
import { StrategyService } from '@app/services/strategy.service';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';
import { AccountService } from '@app/services/account.service';
import { Account } from '@app/models';

@Component({
  selector: 'app-manage-account-change-profile',
  templateUrl: './manage-account-change-profile.component.html',
  styleUrls: ['./manage-account-change-profile.component.scss']
})
export class ManageAccountChangeProfileComponent implements OnInit, OnDestroy {
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
      factor: [this.account.factor, [Validators.min(-1000), Validators.max(1000)]],
      target: [Math.round(this.account.target * 100), [Validators.required, Validators.min(0.001)]],
      protection: [this.account.protection * 100, [Validators.required, Validators.min(0), Validators.max(99.999)]]
    });
  }

  changeProfile(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    if (!this.form.get('factor').value) {
      this.form.get('factor').setErrors({incorrect: true});
      return;
    }

    const values = this.form.getRawValue();
    values.protection = values.protection / 100;
    values.target = values.target ? values.target / 100 : null;

    this.accountService.changeProfile(this.account.id, values)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // this.account.resume();
        this.modalRef.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
