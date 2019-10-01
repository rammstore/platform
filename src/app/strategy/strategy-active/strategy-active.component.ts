import { Component, OnInit, TemplateRef } from '@angular/core';
import { StrategyService } from '@app/services/strategy.service';
import { Strategy } from '@app/models';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { StrategyFundComponent } from '../strategy-fund/strategy-fund.component';
import { StrategyPauseComponent } from '../strategy-pause/strategy-pause.component';
import { StrategyResumeComponent } from '../strategy-resume/strategy-resume.component';

@Component({
  selector: 'app-strategy-active',
  templateUrl: './strategy-active.component.html',
  styleUrls: ['./strategy-active.component.scss']
})
export class StrategyActiveComponent implements OnInit {
  strategies: Strategy[];
  modalRef: BsModalRef;

  constructor(
    private strategyService: StrategyService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.strategyService.getActive().subscribe((strategies: Strategy[]) => {
      this.strategies = strategies;
    });
  }

  getIntervalPnL(): number {
    let sum: number = 0;

    this.strategies.forEach((strategy: Strategy) => {
      sum = sum + strategy.account.intervalPnL;
    });

    return sum;
  }

  getInvestors(): number {
    let sum: number = 0;

    this.strategies.forEach((strategy: Strategy) => {
      sum = sum + strategy.accountsCount;
    });

    return sum;
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
