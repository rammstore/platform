import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Account } from '@app/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { Subject } from 'rxjs/index';
import { AccountService } from '@app/services/account.service';
import { takeUntil } from 'rxjs/internal/operators';
import { ManageStrategyPauseComponent } from '@app/components/manage/manage-strategy-pause/manage-strategy-pause.component';

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
  @ViewChild('withdrawRadio', {static: false}) withdrawRadio: ElementRef;

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private accountService: AccountService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterViewInit(): void {
    this.withdrawRadio.nativeElement.disabled = !this.account.strategy.isPaused();
  }

  buildForm(): void {
    this.form = this.fb.group({
      withdrawType: [this.forClose ? 'close' : ''],
      amount: [0, [Validators.min(0.01), Validators.max(this.account.availableToWithDraw), Validators.required, Validators.pattern('^\d*(\.\d{0,2})?$')]]
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

  withdraw(): void {
    if (this.form.get('amount').value < 0.01 && this.form.get('amount').value > this.account.availableToWithDraw) {
      return;
    }

    this.accountService.withdraw(this.account.id, this.form.get('amount').value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modalRef.hide();
      });
  }

  close(): void {
    this.accountService.close(this.account.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.modalRef.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
