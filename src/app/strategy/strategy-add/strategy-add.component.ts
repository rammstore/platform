import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Strategy, Wallet } from '@app/models';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';
import { WalletService } from '@app/services/wallet.service';
import { StrategyAddScriptComponent } from './strategy-add-script/strategy-add-script.component';
import { BrandService } from '@app/services/brand.service';
import { NotificationsService } from "@app/services/notifications.service";
import { debug } from "util";

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
  formStep3: FormGroup;
  wallet: Wallet;
  accountMinBalance: number;
  functionality: object;
  onClose: Subject<boolean> = new Subject<boolean>();
  titleStep: string = '';
  updateStatus: string;
  key: string;

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private dataService: DataService,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    private cdr: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private brandService: BrandService
  ) {
  }

  ngOnInit(): void {
    this.dataService._strategyPage$.next()

    this.brandService.functionality
      .pipe(takeUntil(this.destroy$))
      .subscribe((f: object) => {
        this.functionality = f;
      });

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
      name: ['', [Validators.required, Validators.pattern('^[0-9a-zA-Z_!,.? ]*$')]]
    });

    this.formStep1.get('name').setErrors({ isUniq: true });
  }

  buildFormStep2(): void {
    this.formStep2 = this.fb.group({
      money: [(Math.round(this.wallet.balance / 10)), [Validators.min(this.accountMinBalance), Validators.max(this.wallet.balance), Validators.required, Validators.pattern('^[0-9]+([\\,\\.][0-9]{1,2})?$')]],
      target: [this.functionality['TargetChangeAllow'] ? 100 : 0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*')]],
      protection: [this.functionality['ProtectionChangeAllow'] ? 50 : 0, [Validators.required, Validators.min(0), Validators.max(99), Validators.pattern('^[0-9]*')]]
    });
  }

  buildFormStep3(): void {
    this.formStep3 = this.fb.group({
      fee: [25, [Validators.required, Validators.min(0), Validators.max(50), Validators.pattern('^[0-9]*')]],
      commission: [0, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]*')]]
    });
  }

  submitStep1(): void {
    this.formStep1.markAllAsTouched();

    if (!this.formStep1.valid) {
      return;
    }

    this.currentStep = 2;
    if (!this.formStep2) {
      this.buildFormStep2();
    }
  }

  submitStep2(): void {
    this.formStep2.markAllAsTouched();

    if (!this.formStep2.valid) {
      return;
    }

    this.currentStep = 3;
    if (!this.formStep3) {
      this.buildFormStep3();
    }
  }

  submitStep3(status: boolean): void {
    this.formStep3.markAllAsTouched();

    if (!this.formStep3.valid) {
      return;
    }

    const strategy: any = {
      Name: this.formStep1.get('name').value,
      FeeRate: Number(this.formStep3.get('fee').value / 100),
      CommissionRate: Number(this.formStep3.get('commission').value),
      // Shared: this.formStep1.get('isShared').value,
      Protection: this.formStep2.get('protection').value / 100,
      Target: this.formStep2.get('target').value / 100,
      Money: this.formStep2.get('money').value,
    };

    this.dataService.addStrategy(strategy, this.updateStatus, this.key)
      .pipe(take(1))
      .subscribe(
        (newStrategy: Strategy) => {

          if (status) {
            this.dataService.addOffer(newStrategy.id, strategy.FeeRate, strategy.CommissionRate).subscribe((item) => {
              this.modalRef.hide();

              this.dataService.setPublicOffer(newStrategy.id, item.OfferID).subscribe();

              this.openAddStrategyScriptDialog(newStrategy);

              this.initializeUpdateSubject(newStrategy.id, this.updateStatus, this.key);
            });
          } else {
            this.initializeUpdateSubject(newStrategy.id, this.updateStatus, this.key);

            this.modalRef.hide();

            this.openAddStrategyScriptDialog(newStrategy);
          }
        },
        error => {
          // this.notificationsService.open('Error');
        }
      );
  }

  initializeUpdateSubject(id: number, updateStatus: string, key: string): void {
    this.dataService._update$.next({
      strategyId: id,
      updateStatus: updateStatus,
      key: key
    });
  }


  back(): void {
    this.currentStep = 1;
  }

  skip(): void {
    this.onClose.next(true);
    this.modalRef.hide();
    //this.openAddStrategyScriptDialog(newStrategy);
  }

  setMoney(amount: number): void {
    this.formStep2.get('money').setValue(amount);
  }

  isStrategyNameUniq(name: string, isSubmitClicked: boolean = false): void {
    this.dataService.isStrategyNameUniq(name)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isUniq: boolean) => {
        if (isUniq && isSubmitClicked) {
          this.submitStep1();
        }
        if (!isUniq) {
          this.formStep1.get('name').setErrors({ isUniq: true });
        }
      });
  }

  openAddStrategyScriptDialog(strategy: Strategy) {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: strategy
    };

    this.modalRef = this.modalService.show(StrategyAddScriptComponent, options);
    this.modalRef.content.onClose.subscribe(result => {
      this.onClose.next(true);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
