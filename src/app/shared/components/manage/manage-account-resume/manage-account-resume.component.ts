import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { Account, Wallet } from '@app/models';
import { DataService } from '@app/services/data.service';
import { WalletService } from '@app/services/wallet.service';
import { BrandService } from '@app/services/brand.service';
import { KeyedWrite } from '@angular/compiler';

@Component({
  selector: 'app-manage-account-resume',
  templateUrl: './manage-account-resume.component.html',
  styleUrls: ['./manage-account-resume.component.scss']
})
export class ManageAccountResumeComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();
  successful$ = new Subject();

  // component data
  form: FormGroup;
  wallet: Wallet;
  account: Account;
  key: string;
  functionality: object;
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
      amount: [0.00, [Validators.required, Validators.min(0), Validators.max(this.wallet.balance), Validators.pattern('^[0-9]+([\\,\\.][0-9]{1,2})?$')]],
      factor: [{ value: this.account.factor, disabled: this.account.isSecured() && this.account.isMy() }, [Validators.min(0.1), Validators.max(10), Validators.required, Validators.pattern('[0-9]+(\\.[0-9]?)?')]],
      target: [Math.round(this.account.target * 100), [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*')]],
      protection: [Math.round(this.account.protection * 100), [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern('^[0-9]*')]]
    });
  }

  resume(): void {
    this.updateStatus = "update";
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const queries: any[] = [this.dataService.resumeAccount(this.account.id, this.updateStatus, this.key)];

    const values = this.form.getRawValue();
    values.protection = values.protection / 100;
    values.target = values.target ? values.target / 100 : null;

    const newObj = {
      protection: undefined,
      target: undefined,
      factor: undefined
    };

    if (values.amount) {
      queries.push(this.dataService.fundAccount(this.account.id, values.amount, this.updateStatus, this.key));
    }

    if (values.protection !== this.account.protection) {
      newObj.protection = values.protection;
    }
    if (values.target !== this.account.target) {
      newObj.target = values.target;
    }
    if (values.factor !== this.account.factor) {
      newObj.factor = values.factor;
    }

    if (newObj.protection || newObj.target || newObj.factor) {
      queries.push(this.dataService.changeAccountProfile(this.account.id, newObj, this.updateStatus, this.key));
    }

    forkJoin(queries).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.successful$.next(true);
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
