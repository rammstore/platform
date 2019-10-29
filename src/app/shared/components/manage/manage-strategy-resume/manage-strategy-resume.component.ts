import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Strategy, Wallet } from '@app/models';
import { forkJoin, Subject } from 'rxjs';
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
    console.log(this.strategy);
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
      factor: [{value: this.strategy.account.factor, disabled: true}, [Validators.min(-1000), Validators.max(1000)]],
      target: [this.strategy.account.target * 100, [Validators.required, Validators.min(0)]],
      protection: [this.strategy.account.protection * 100, [Validators.required, Validators.min(0), Validators.max(99)]]
    });
  }

  resume(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }
    const queries: any[] = [this.dataService.resumeStrategy(this.strategy.id)];

    const values = this.form.getRawValue();
    values.protection = values.protection / 100;
    values.target = values.target ? values.target / 100 : null;

    if (values.amount) {
      queries.push(this.dataService.fundAccount(this.strategy.account.id, values.amount, this.strategy.id));
    }

    if (values.protection !== this.strategy.account.protection || values.target !== this.strategy.account.target) {
      queries.push(this.dataService.changeAccountProfile(this.strategy.account.id, values, this.strategy.id));
    }

    forkJoin(queries).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.modalRef.hide();
    });
  }

  cancel(): void {
    this.modalRef.hide();
  }

  setAllMoney(): void {
    this.form.get('amount').setValue(this.wallet.getAvailableMoney());
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
