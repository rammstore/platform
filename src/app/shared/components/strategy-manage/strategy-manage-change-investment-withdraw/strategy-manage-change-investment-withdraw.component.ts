import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, Strategy } from '@app/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { Subject } from 'rxjs/index';
import { InvestmentsService } from '@app/services/investments.service';
import { takeUntil } from 'rxjs/internal/operators';
import { StrategyManagePauseComponent } from '@app/components/strategy-manage/strategy-manage-pause/strategy-manage-pause.component';

@Component({
  selector: 'app-strategy-manage-change-investment-withdraw',
  templateUrl: './strategy-manage-change-investment-withdraw.component.html',
  styleUrls: ['./strategy-manage-change-investment-withdraw.component.scss']
})
export class StrategyManageChangeInvestmentWithdrawComponent implements OnInit, OnDestroy {
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  strategy: Strategy;
  account: Account;
  form: FormGroup;

  constructor(
    public modalRef: BsModalRef,
    private fb: FormBuilder,
    private investmentsService: InvestmentsService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.account = this.strategy.account;
    this.buildForm();
  }

  buildForm(): void {
    this.form = this.fb.group({
      withdrawType: [''],
      amount: [0, [Validators.min(0.01), Validators.max(this.account.equity), Validators.required]]
    });
  }

  openPauseDialog(): void {
    this.modalRef.hide();

    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: this.strategy
    };

    this.modalRef = this.modalService.show(StrategyManagePauseComponent, options);
  }

  withdraw(): void {
    if (this.form.get('amount').value < 0.01 && this.form.get('amount').value > this.account.equity) {
      return;
    }

    this.investmentsService.withdraw(this.account.id, this.form.get('amount').value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.account.equity = this.account.equity - this.form.get('amount').value;
        this.modalRef.hide();
      });
  }

  close(): void {
    this.investmentsService.close(this.account.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.account.equity = 6;
        this.account.equity = 0;
        this.modalRef.hide();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
