import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Paginator, Strategy, Wallet } from '@app/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';
import { WalletService } from '@app/services/wallet.service';
import { BrandService } from '@app/services/brand.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-strategy-invest',
  templateUrl: './manage-strategy-invest.component.html',
  styleUrls: ['./manage-strategy-invest.component.scss']
})
export class ManageStrategyInvestComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();
  onClose: Subject<boolean> = new Subject();
  // component data
  form: FormGroup;
  wallet: Wallet;
  strategy: Strategy;
  securityMinBalance: number;
  functionality: object;
  @Input() methodArgs: any;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private walletService: WalletService,
    public modalRef: BsModalRef,
    private brandService: BrandService,
    private router: Router
  ) { }

  get isSpecText(): boolean {
    return (location.href.includes('/link/') && this.strategy && this.strategy.isMyStrategy);
  }

  ngOnInit(): void {
    this.brandService.functionality
      .pipe(takeUntil(this.destroy$))
      .subscribe((f: object) => {
        this.functionality = f;
      });

    this.securityMinBalance = this.dataService.accountSpecAsset.securityMinBalance;
    this.walletService.getWallet()
      .pipe(takeUntil(this.destroy$))
      .subscribe((wallet: Wallet) => {
      this.wallet = wallet;
      this.buildForm();
    });
  }

  buildForm(): void {
    this.form = this.fb.group({
      amount: [(this.wallet.balance / 10).toFixed(2), [Validators.required, Validators.min(this.securityMinBalance), Validators.max(this.wallet.balance), Validators.pattern('^[0-9]+([\\,\\.][0-9]{1,2})?$')]],
      factor: [1, [Validators.min(0.1), Validators.max(10), Validators.required, Validators.pattern('[0-9]+(\\.[0-9]?)?')]],
      target: [this.functionality['TargetChangeAllow'] ? 100 : 0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*')]],
      protection: [this.functionality['ProtectionChangeAllow'] ? 50 : 0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern('^[0-9]*')]]
    });
  }

  cancel(): void {
    this.onClose.next(false);
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

    if(this.strategy.publicOffer) {
      values.offerId = this.strategy.publicOffer ? this.strategy.publicOffer.id : null;

      this.dataService.addAccountPublicOffer(this.strategy.id, values).subscribe(() => {
        this.onClose.next(true);
        this.modalRef.hide();
        this.getSwitch();
      });
    }

    if (this.methodArgs && this.methodArgs.link){
      this.dataService.addAccountPrivateOffer(this.methodArgs.link, values).subscribe(() => {
        this.onClose.next(true);
        this.modalRef.hide();
        this.getSwitch();
      });
    }
  }

  getSwitch() {
    switch (true) {
      case this.router.url.includes('strategies'):
        this.dataService.getActiveMyStrategies({
          searchMode: 'MyActiveStrategies',
          paginator: new Paginator({
            perPage: 10,
            currentPage: 1
          })
        });
        break;

      case this.router.url.includes('rating/popular'):
        this.dataService.getRating({
          field: 'Accounts',
          searchText: '',
          paginator: new Paginator({
            perPage: 10,
            currentPage: 1
          })
        });
        break;

      case this.router.url.includes('rating/all'):
        this.dataService.getRating({
          field: 'Yield',
          searchText: '',
          paginator: new Paginator({
            perPage: 10,
            currentPage: 1
          })
        });
        break;

      case this.router.url.includes('rating'):
        this.dataService.getRating({
          field: 'Yield',
          ageMin: 30,
          yieldMin: 0,
          paginator: new Paginator({
            perPage: 10,
            currentPage: 1
          })
        });
        break;
    }
  }

  setMoney(amount: number): void {
    this.form.get('amount').setValue(amount);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
