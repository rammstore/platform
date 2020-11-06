import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Strategy, Wallet } from '@app/models';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';
import { WalletService } from '@app/services/wallet.service';
import { BrandService } from '@app/services/brand.service';

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
  functionality: object;
  key: string;

  updateStatus: string;

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private dataService: DataService,
    public modalRef: BsModalRef,
    private brandService: BrandService
  ) { }

  ngOnInit(): void {
    this.brandService.functionality
      .pipe(takeUntil(this.destroy$))
      .subscribe((f: object) => {
        this.functionality = f;
      });

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
      factor: [{value: this.strategy.account.factor, disabled: this.strategy.isSecured() && this.strategy.isMy()}, [Validators.min(0.1), Validators.max(10), Validators.required, Validators.pattern('[0-9]+(\\.[0-9]?)?')]],
      target: [Math.round(this.strategy.account.target * 100), [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*')]],
      protection: [Math.round(this.strategy.account.protection * 100), [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern('^[0-9]*')]]
    });
  }

  resume(): void {
    this.updateStatus = "update";
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }
    
    const queries: any[] = [this.dataService.resumeStrategy(this.strategy.id, this.updateStatus, this.key)];

    const values = this.form.getRawValue();
    values.protection = values.protection / 100;
    values.target = values.target ? values.target / 100 : null;

    if (values.amount) {
      queries.push(this.dataService.fundAccount(this.strategy.account.id, values.amount, this.updateStatus, this.key));
    }

    const newObj = {
      protection: undefined,
      target: undefined,
      factor: undefined
    };

    if (values.protection !== this.strategy.account.protection) {
      newObj.protection = values.protection;
    }
    if (values.target !== this.strategy.account.target) {
      newObj.target = values.target;
    }
    if (values.factor !== this.strategy.account.factor) {
      newObj.factor = values.factor;
    }

    if (newObj.protection || newObj.target || newObj.factor) {
      queries.push(this.dataService.changeAccountProfile(this.strategy.account.id, newObj, this.updateStatus, this.key));
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
