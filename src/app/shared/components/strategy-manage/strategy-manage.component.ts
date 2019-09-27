import { Component, Input, OnInit } from '@angular/core';
import { Strategy } from '@app/models';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { StrategyFundComponent } from '../../../strategy/strategy-fund/strategy-fund.component';
import { StrategyPauseComponent } from '../../../strategy/strategy-pause/strategy-pause.component';
import { StrategyResumeComponent } from '../../../strategy/strategy-resume/strategy-resume.component';

@Component({
  selector: 'app-strategy-manage',
  templateUrl: './strategy-manage.component.html',
  styleUrls: ['./strategy-manage.component.scss']
})
export class StrategyManageComponent implements OnInit {
  @Input() strategy: Strategy;
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService
  ) { }

  ngOnInit() {
  }

  openFundDialog(strategy: Strategy): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: strategy
    };

    this.modalRef = this.modalService.show(StrategyFundComponent, options);
  }

  openPauseDialog(strategy: Strategy): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: strategy
    };

    this.modalRef = this.modalService.show(StrategyPauseComponent, options);
  }

  openResumeDialog(strategy: Strategy): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: strategy
    };

    this.modalRef = this.modalService.show(StrategyResumeComponent, options);
  }
}
