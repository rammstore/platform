import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Strategy } from '@app/models';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { StrategyPauseComponent } from '../strategy-pause/strategy-pause.component';
import { StrategyFundComponent } from '../strategy-fund/strategy-fund.component';
import { StrategyResumeComponent } from '../strategy-resume/strategy-resume.component';

@Component({
  selector: 'app-strategy-details',
  templateUrl: './strategy-details.component.html',
  styleUrls: ['./strategy-details.component.scss']
})
export class StrategyDetailsComponent implements OnInit {
  strategy: Strategy;
  modalRef: BsModalRef;
  links: ContentTabLink[];

  constructor(
    private route: ActivatedRoute,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: object) => {
      this.strategy = data['strategy'];

      this.links = [
        new ContentTabLink('Доходность', '/strategies/details/' + this.strategy.id),
        new ContentTabLink('Инструменты', '/strategies/details/' + this.strategy.id + '/symbols'),
        new ContentTabLink('Инвестиции', '/strategies/details/' + this.strategy.id + '/investments')
      ];
    });

  }

  openFundDialog(): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: this.strategy
    };

    this.modalRef = this.modalService.show(StrategyFundComponent, options);
  }

  openPauseDialog(): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: this.strategy
    };

    this.modalRef = this.modalService.show(StrategyPauseComponent, options);
  }

  openResumeDialog(): void {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      strategy: this.strategy
    };

    this.modalRef = this.modalService.show(StrategyResumeComponent, options);
  }
}
