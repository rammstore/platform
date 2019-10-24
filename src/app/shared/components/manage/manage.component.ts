import { Component, Input, OnInit } from '@angular/core';
import { Account, Strategy } from '@app/models';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ManageAccountChangeProfileComponent } from './manage-account-change-profile/manage-account-change-profile.component';
import { ManageAccountFundComponent } from './manage-account-fund/manage-account-fund.component';
import { ManageAccountPauseComponent } from './manage-account-pause/manage-account-pause.component';
import { ManageAccountResumeComponent } from './manage-account-resume/manage-account-resume.component';
import { ManageAccountWithdrawComponent } from './manage-account-withdraw/manage-account-withdraw.component';
import { ManageStrategyCloseComponent } from './manage-strategy-close/manage-strategy-close.component';
import { ManageStrategyPauseComponent } from './manage-strategy-pause/manage-strategy-pause.component';
import { ManageStrategyResumeComponent } from './manage-strategy-resume/manage-strategy-resume.component';
import { ManageStrategyDownloadScriptComponent } from '@app/components/manage/manage-strategy-download-script/manage-strategy-download-script.component';
import { ManageStrategyInvestComponent } from '@app/components/manage/manage-strategy-invest/manage-strategy-invest.component';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  @Input() data: Strategy | Account;
  dataType: string;
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    switch (true) {
      case (this.data instanceof Strategy):
        this.dataType = 'strategy';
        break;
      case (this.data instanceof Account):
        this.dataType = 'account';
    }
  }

  openAccountChangeProfileDialog(): void {
    let accountTemp: Account = new Account({});
    if (this.dataType === 'strategy') {
      Object.assign(accountTemp, this.data['account']);
      this.data['account'].strategy = null;
      accountTemp.strategy = new Strategy(this.data);
    }
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      account: this.dataType === 'strategy' ? accountTemp : this.data
    };

    this.modalRef = this.modalService.show(ManageAccountChangeProfileComponent, options);
  }

  openAccountCloseDialog(): void {
    const options: ModalOptions = new ModalOptions();

    options.initialState = {
      account: this.data['account'] || this.data,
      forClose: true
    };

    this.modalRef = this.modalService.show(ManageAccountWithdrawComponent, options);
  }

  openAccountFundDialog(): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      account: this.data['account'] || this.data,
      strategy: this.data['strategy'] || this.data
    };

    this.modalRef = this.modalService.show(ManageAccountFundComponent, options);
  }

  openAccountPauseDialog(): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      account: this.data['account'] || this.data
    };

    this.modalRef = this.modalService.show(ManageAccountPauseComponent, options);
  }

  openAccountResumeDialog(): void {
    const options: ModalOptions = new ModalOptions();
    let accountTemp: Account = new Account({});
    if (this.dataType === 'strategy') {
      Object.assign(accountTemp, this.data['account']);
      this.data['account'].strategy = null;
      accountTemp.strategy = new Strategy(this.data);
    }
    options.initialState = {
      account: this.dataType === 'strategy' ? accountTemp : this.data
    };

    this.modalRef = this.modalService.show(ManageAccountResumeComponent, options);
  }

  openAccountWithdrawDialog(): void {
    const options: ModalOptions = new ModalOptions();
    if (this.dataType === 'strategy') {
      this.data['account'].strategy = new Strategy({
        id: this.data.id,
        status: this.data.status
      });
    }

    options.initialState = {
      account: this.data['account'] || this.data
    };

    this.modalRef = this.modalService.show(ManageAccountWithdrawComponent, options);
  }

  openStrategyCloseDialog(): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: this.data['strategy'] || this.data
    };

    this.modalRef = this.modalService.show(ManageStrategyCloseComponent, options);
  }

  openStrategyDownloadScriptDialog(): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: this.data
    };

    this.modalRef = this.modalService.show(ManageStrategyDownloadScriptComponent, options);
  }

  openStrategyPauseDialog(): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: this.data['strategy'] || this.data
    };

    this.modalRef = this.modalService.show(ManageStrategyPauseComponent, options);
  }

  openStrategyResumeDialog(): void {
    const options: ModalOptions = new ModalOptions();
    let strategyTemp: Strategy = new Strategy({});
    if (this.dataType === 'account') {
      Object.assign(strategyTemp, this.data['strategy']);
      this.data['strategy'].account = null;
      strategyTemp.account = new Account(this.data);
    }
    options.initialState = {
      strategy: this.dataType === 'account' ? strategyTemp : this.data
    };

    this.modalRef = this.modalService.show(ManageStrategyResumeComponent, options);
  }

  openStrategyInvestDialog(): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: this.data
    };

    this.modalRef = this.modalService.show(ManageStrategyInvestComponent, options);
  }
}
