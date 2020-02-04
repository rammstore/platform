import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Paginator, Strategy, Wallet } from '@app/models';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';
import { WalletService } from '@app/services/wallet.service';
import { StrategyAddScriptComponent } from './strategy-add-script/strategy-add-script.component';
import { BrandService } from '@app/services/brand.service';

@Component({
  selector: 'app-strategy-add',
  templateUrl: './strategy-add.component.html',
  styleUrls: ['./strategy-add.component.scss']
})
export class StrategyAddComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  currentStep: number = 1;
  formStep1: FormGroup;
  formStep2: FormGroup;
  wallet: Wallet;
  accountMinBalance: number;
  functionality: object;
  @Input() methodName: string;
  @Input() methodArgs: any;

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private dataService: DataService,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    private brandService: BrandService
  ) { }

  ngOnInit(): void {
    this.functionality = this.brandService.functionality;
    this.accountMinBalance = this.dataService.accountSpecAsset.accountMinBalance;
    this.buildFormStep1();
    this.walletService.getWallet()
      .pipe(takeUntil(this.destroy$))
      .subscribe((wallet: Wallet) => {
        this.wallet = wallet;
      });
  }

  buildFormStep1(): void {
    this.formStep1 = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[0-9a-zA-Z_!,.? ]*$')]],
      fee: [25, [Validators.min(0), Validators.max(50)]],
      commission: [0, [Validators.min(0), Validators.max(100)]]
      // isShared: [true]
    });

    this.formStep1.get('name').setErrors({isUniq: true});
  }

  buildFormStep2(): void {
    this.formStep2 = this.fb.group({
      money: [(Math.round(this.wallet.balance / 10)), [Validators.min(this.accountMinBalance), Validators.max(this.wallet.balance), Validators.required, Validators.pattern('^[0-9]+([\\,\\.][0-9]{1,2})?$')]],
      target: [100, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*')]],
      protection: [0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern('^[0-9]*')]]
    });
  }

  submitStep1(): void {
    this.formStep1.markAllAsTouched();

    if (!this.formStep1.valid) {
      return;
    }

    this.currentStep = 2;
    this.buildFormStep2();
  }

  submitStep2(): void {
    this.formStep2.markAllAsTouched();

    if (!this.formStep2.valid) {
      return;
    }

    const strategy: object = {
      Name: this.formStep1.get('name').value,
      FeeRate: this.formStep1.get('fee').value / 100,
      CommissionRate: this.formStep1.get('commission').value,
      // Shared: this.formStep1.get('isShared').value,
      Protection: this.formStep2.get('protection').value / 100,
      Target: this.formStep2.get('target').value / 100,
      Money: this.formStep2.get('money').value,
    };

    this.dataService.addStrategy(strategy, this.methodName, this.methodArgs)
      .pipe(takeUntil(this.destroy$))
      .subscribe((newStrategy: Strategy) => {
        this.modalRef.hide();
        this.openAddStrategyScriptDialog(newStrategy);
        // this.dataService.getActiveMyStrategies({
        //   paginator: new Paginator({
        //     perPage: 10,
        //     currentPage: 1
        //   })
        // });
      });
  }

  back(): void {
    this.currentStep = 1;
  }

  setMoney(amount: number): void {
    this.formStep2.get('money').setValue(amount);
  }

  isStrategyNameUniq(name: string, isSubmitClicked: boolean = false): void {
    this.dataService.isStrategyNameUniq(name)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isUniq: boolean) => {
        if (isUniq) {
          this.formStep1.get('name').setErrors(null);
          if (isSubmitClicked) {
            this.submitStep1();
          }
        } else {
          this.formStep1.get('name').setErrors({isUniq: true});
        }
      });
  }

  openAddStrategyScriptDialog(strategy: Strategy) {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: strategy
    };

    this.modalRef = this.modalService.show(StrategyAddScriptComponent, options);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
