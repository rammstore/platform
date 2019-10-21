import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Strategy, Wallet } from '@app/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';
import { WalletService } from '@app/services/wallet.service';

@Component({
  selector: 'app-manage-strategy-resume',
  templateUrl: './manage-strategy-resume.component.html',
  styleUrls: ['./manage-strategy-resume.component.scss']
})
export class ManageStrategyResumeComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  form: FormGroup;
  wallet: Wallet;
  strategy: Strategy;

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private dataService: DataService,
    public modalRef: BsModalRef
  ) { }

  ngOnInit(): void {
    this.walletService.getWallet()
      .pipe(takeUntil(this.destroy$))
      .subscribe((wallet: Wallet) => {
        this.wallet = wallet;
        this.buildForm();
      });
  }

  buildForm(): void {
    this.form = this.fb.group({
      amount: [0, [Validators.required, Validators.min(0), Validators.max(this.wallet.balance), Validators.pattern('^[0-9]+([\\,\\.][0-9]{1,2})?$')]],
      goal: [100, [Validators.required, Validators.min(0)]],
      protection: [50, [Validators.required, Validators.min(0), Validators.max(99)]]
    });
  }

  resume(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    this.dataService.resumeStrategy(this.strategy.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
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
