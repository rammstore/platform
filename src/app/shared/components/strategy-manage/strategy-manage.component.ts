import { Component, Input } from '@angular/core';
import { Strategy } from '@app/models';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { StrategyManageFundComponent } from '@app/components/strategy-manage/strategy-manage-fund/strategy-manage-fund.component';
import { StrategyManagePauseComponent } from '@app/components/strategy-manage/strategy-manage-pause/strategy-manage-pause.component';
import { StrategyManageResumeComponent } from '@app/components/strategy-manage/strategy-manage-resume/strategy-manage-resume.component';
import { StrategyManageCloseComponent } from '@app/components/strategy-manage/strategy-manage-close/strategy-manage-close.component';
import { StrategyManageChangeInvestmentWithdrawComponent } from '@app/components/strategy-manage/strategy-manage-change-investment-withdraw/strategy-manage-change-investment-withdraw.component';
import { StrategyManageChangeInvestmentProfileComponent } from '@app/components/strategy-manage/strategy-manage-change-investment-profile/strategy-manage-change-investment-profile.component';
import { StrategyManageDownloadScriptComponent } from '@app/components/strategy-manage/strategy-manage-download-script/strategy-manage-download-script.component';

@Component({
  selector: 'app-strategy-manage',
  templateUrl: './strategy-manage.component.html',
  styleUrls: ['./strategy-manage.component.scss']
})
export class StrategyManageComponent {
  @Input() strategy: Strategy;
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService
  ) { }

  openFundDialog(strategy: Strategy): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: strategy
    };

    this.modalRef = this.modalService.show(StrategyManageFundComponent, options);
  }

  openPauseDialog(strategy: Strategy): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: strategy
    };

    this.modalRef = this.modalService.show(StrategyManagePauseComponent, options);
  }

  openResumeDialog(strategy: Strategy): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: strategy
    };

    this.modalRef = this.modalService.show(StrategyManageResumeComponent, options);
  }

  openCloseDialog(strategy: Strategy): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: strategy
    };

    this.modalRef = this.modalService.show(StrategyManageCloseComponent, options);
  }

  openWithDrawDialog(strategy: Strategy): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: strategy
    };

    this.modalRef = this.modalService.show(StrategyManageChangeInvestmentWithdrawComponent, options);
  }

  openChangeInvestmentProfileDialog(strategy: Strategy): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: strategy
    };

    this.modalRef = this.modalService.show(StrategyManageChangeInvestmentProfileComponent, options);
  }

  openDownloadScriptDialog(strategy: Strategy): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: strategy
    };

    this.modalRef = this.modalService.show(StrategyManageDownloadScriptComponent, options);
  }
}
