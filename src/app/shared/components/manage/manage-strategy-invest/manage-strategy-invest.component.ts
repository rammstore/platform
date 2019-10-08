import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthData } from '@app/user/auth-data';
import { StorageService } from '@app/services/storage.service';
import { BsModalRef } from 'ngx-bootstrap';
import { Strategy } from '@app/models/strategy';
import { StrategyService } from '@app/services/strategy.service';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';

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
  authData: AuthData;
  strategy: Strategy;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private strategyService: StrategyService,
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
      amount: [Math.round(this.authData.getWallets()[0].getEquity() / 10), [Validators.required, Validators.min(0), Validators.max(this.authData.getWallets()[0].getEquity())]],
      factor: [1, [Validators.min(-1000), Validators.max(1000)]],
      target: [100, [Validators.required, Validators.min(0)]],
      protection: [50, [Validators.required, Validators.min(0), Validators.max(99)]]
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

    this.strategyService.invest(this.strategy.id, values).subscribe((r) => {
      console.log(r);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
