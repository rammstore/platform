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
  selector: 'app-strategy-resume',
  templateUrl: './strategy-resume.component.html',
  styleUrls: ['./strategy-resume.component.scss']
})
export class StrategyResumeComponent implements OnInit, OnDestroy {
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
      amount: [0, [Validators.required, Validators.min(0), Validators.max(this.authData.getWallets()[0].getEquity())]],
      goal: [100, [Validators.required, Validators.min(0)]],
      protection: [50, [Validators.required, Validators.min(0), Validators.max(99)]]
    });
  }

  resume(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.strategyService.resume(this.strategy.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.strategy.resume();
        this.modalRef.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
