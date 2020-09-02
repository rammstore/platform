import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Account, Offer, Strategy} from '@app/models';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {ManageAccountChangeProfileComponent} from './manage-account-change-profile/manage-account-change-profile.component';
import {ManageAccountFundComponent} from './manage-account-fund/manage-account-fund.component';
import {ManageAccountPauseComponent} from './manage-account-pause/manage-account-pause.component';
import {ManageAccountResumeComponent} from './manage-account-resume/manage-account-resume.component';
import {ManageAccountWithdrawComponent} from './manage-account-withdraw/manage-account-withdraw.component';
import {ManageStrategyCloseComponent} from './manage-strategy-close/manage-strategy-close.component';
import {ManageStrategyPauseComponent} from './manage-strategy-pause/manage-strategy-pause.component';
import {ManageStrategyResumeComponent} from './manage-strategy-resume/manage-strategy-resume.component';
import {ManageStrategyDownloadScriptComponent} from '@app/components/manage/manage-strategy-download-script/manage-strategy-download-script.component';
import {ManageStrategyInvestComponent} from '@app/components/manage/manage-strategy-invest/manage-strategy-invest.component';
import {SectionEnum} from "@app/enum/section.enum";

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  @Input() data: any;
  dataType: string;
  modalRef: BsModalRef;
  @Input() methodName: string;
  @Input() methodArgs: any;
  @Input() hideInvestmentsButton: boolean;
  @Output() click: EventEmitter<any> = new EventEmitter<any>();
  @Input() section: SectionEnum = SectionEnum.default;

  constructor(
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    if (this.data.name === "Import001") {
      console.log(this.data);
    }

    switch (true) {
      case (this.data instanceof Strategy): {
        this.dataType = 'strategy';
        break;
      }
      case (this.data instanceof Account): {
        this.dataType = 'account';
        break;
      }
      case (this.data instanceof Offer): {
        this.dataType = 'offer';
        break;
      }
    }
  }

  get isStrategyDetail(): boolean {
    return this.section === SectionEnum.strategy && this.dataType === 'strategy' && this.data.isMyStrategy && this.data.account && this.data.account.id && !this.data.account.isSecurity;
  }
  get isRatingPage(): boolean {
    return this.section === SectionEnum.rating && this.dataType === 'strategy' && this.data.isMyStrategy && this.data.account && this.data.account.id && !this.data.account.isSecurity;
  }
  get isInvestOtherStrategy(): boolean {
    return this.dataType === 'account' && !this.data.isMyStrategy;
  }

  get isInvestStrategy(): boolean {
    return this.dataType === 'account' && this.data.strategy.isMyStrategy && this.data.id && !this.data.isSecurity;
  }

  openAccountChangeProfileDialog(): void {
    this.modalRef = this.modalService.show(ManageAccountChangeProfileComponent, this.getAccountDialogOptions());
  }

  openAccountCloseDialog(): void {
    const options: ModalOptions = this.getAccountDialogOptions();
    options.initialState['forClose'] = true;
    this.modalRef = this.modalService.show(ManageAccountWithdrawComponent, options);
  }

  openAccountFundDialog(): void {
    this.modalRef = this.modalService.show(ManageAccountFundComponent, this.getAccountDialogOptions());
  }

  openAccountPauseDialog(data?: any): void {
    this.modalRef = this.modalService.show(ManageAccountPauseComponent, this.getAccountDialogOptions());
    this.changeInvestment(this.modalRef, data, () => {
      data.status = 4;
    });
  }

  openAccountResumeDialog(data?): void {
    this.modalRef = this.modalService.show(ManageAccountResumeComponent, this.getAccountDialogOptions());
    this.changeInvestment(this.modalRef, data, () => {
      data.status = 1;
    });
  }

  private changeInvestment(modalRef, data, callback) {
    if (modalRef.content.successful$ && data) {
      modalRef.content.successful$.subscribe(result => {
        if (result === true) {
          callback();
        }
      });
    }
  }

  openAccountWithdrawDialog(): void {
    this.modalRef = this.modalService.show(ManageAccountWithdrawComponent, this.getAccountDialogOptions());
  }

  openStrategyCloseDialog(): void {
    this.modalRef = this.modalService.show(ManageStrategyCloseComponent, this.getStrategyDialogOptions());
  }

  openStrategyDownloadScriptDialog(): void {
    this.modalRef = this.modalService.show(ManageStrategyDownloadScriptComponent, this.getStrategyDialogOptions());
  }

  onClick(data: any) {
    this.click.emit(data);
  }

  openStrategyPauseDialog(): void {
    this.modalRef = this.modalService.show(ManageStrategyPauseComponent, this.getStrategyDialogOptions());
  }

  openStrategyResumeDialog(): void {
    this.modalRef = this.modalService.show(ManageStrategyResumeComponent, this.getStrategyDialogOptions());
  }

  openStrategyInvestDialog(): void {
    this.modalRef = this.modalService.show(ManageStrategyInvestComponent, this.getStrategyDialogOptions());
  }

  // Приведение инвестиции с вложенной стратегией к стратегии с вложенной инвестицией
  swapStrategy(): Strategy {
    let strategy: Strategy = new Strategy({});
    Object.assign(strategy, this.data['strategy']);
    this.data['strategy'].account = null;
    strategy.account = new Account(this.data);
    return strategy;
  }

  // Приведение стратегии с вложенной инвестицией к инвестиции с вложенной стратегией
  swapAccount(): Account {
    let account: Account = new Account({});
    Object.assign(account, this.data['account']);
    this.data['account'].strategy = null;
    account.strategy = new Strategy(this.data);
    return account;
  }

  // Настройка параметров диалогов стратегий
  getStrategyDialogOptions(): ModalOptions {
    const options: ModalOptions = new ModalOptions();
    let data: Strategy = new Strategy({});

    if (this.data instanceof Account) {
      data = this.swapStrategy();
    } else {
      Object.assign(data, this.data);
    }

    options.initialState = {
      strategy: data,
      methodName: this.methodName,
      methodArgs: this.methodArgs
    };

    return options;
  }

  // Настройка параметров диалогов инвестиций
  getAccountDialogOptions(): ModalOptions {
    const options: ModalOptions = new ModalOptions();
    let data: Account = new Account({});

    if (this.data instanceof Strategy) {
      data = this.swapAccount();
    } else {
      Object.assign(data, this.data);
    }

    options.initialState = {
      account: data,
      methodName: this.methodName,
      methodArgs: this.methodArgs
    };

    return options;
  }
}
