import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Account } from '@app/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { ManageStrategyPauseComponent } from '@app/components/manage/manage-strategy-pause/manage-strategy-pause.component';
import { DataService } from '@app/services/data.service';
import { ManageAccountPauseComponent } from '@app/components/manage/manage-account-pause/manage-account-pause.component';

@Component({
  selector: 'app-manage-account-withdraw',
  templateUrl: './manage-account-withdraw.component.html',
  styleUrls: ['./manage-account-withdraw.component.scss']
})
export class ManageAccountWithdrawComponent implements OnInit, AfterViewInit, OnDestroy {
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  account: Account;
  form: FormGroup;
  @Input() forClose: boolean = false;
  @Input() methodName: string;
  @Input() methodArgs: any;
  @ViewChild('withdrawRadio', {static: false}) withdrawRadio: ElementRef;

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private dataService: DataService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    if (this.account.isSecured() && this.account.strategy.isMy()) {
      this.withdrawRadio.nativeElement.disabled = !this.account.strategy.isPaused();
    } else {
      this.withdrawRadio.nativeElement.disabled = !this.account.isPaused();
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      withdrawType: [this.forClose ? 'close' : ''],
      amount: [0, [Validators.min(0.01), Validators.max(this.account.availableToWithDraw), Validators.required, Validators.pattern('^[0-9]+([\\,\\.][0-9]{1,2})?$')]]
    });
  }

  openStrategyPauseDialog(): void {
    this.modalRef.hide();

    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: this.account.strategy
    };

    this.modalRef = this.modalService.show(ManageStrategyPauseComponent, options);
  }

  openAccountPauseDialog(): void {
    this.modalRef.hide();

    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      account: this.account
    };

    this.modalRef = this.modalService.show(ManageAccountPauseComponent, options);
  }

  withdraw(): void {
    if (this.form.get('amount').value < 0.01 && this.form.get('amount').value > this.account.availableToWithDraw) {
      return;
    }

    this.dataService.withdrawFromAccount(this.account.id, this.form.get('amount').value, this.methodName, this.methodArgs)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modalRef.hide();
      });
  }

  close(): void {
    this.dataService.closeAccount(this.account.id, this.methodName, this.methodArgs)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modalRef.hide();
      });
  }

  setAllMoney(): void {
    this.form.get('amount').setValue(this.account.availableToWithDraw);
  }

  getTitleText(): string {
    let title = 'Вывод средств';
    if (this.form.get('withdrawType').value === 'close') {
      if (this.account.strategy.isMy() && this.account.isSecured()) {
        title = 'Закрытие стратегии';
      } else {
        title = 'Закрытие инвестиции';
      }
    }
    return title;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
