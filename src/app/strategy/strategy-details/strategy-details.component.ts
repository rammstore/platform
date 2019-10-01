import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Strategy } from '@app/models';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { StrategyPauseComponent } from '../strategy-pause/strategy-pause.component';
import { StrategyFundComponent } from '../strategy-fund/strategy-fund.component';
import { StrategyResumeComponent } from '../strategy-resume/strategy-resume.component';
import { Subject } from 'rxjs/index';
import { map, takeUntil } from 'rxjs/internal/operators';

@Component({
  selector: 'app-strategy-details',
  templateUrl: './strategy-details.component.html',
  styleUrls: ['./strategy-details.component.scss']
})
export class StrategyDetailsComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  strategy: Strategy;
  modalRef: BsModalRef;
  links: ContentTabLink[];

  constructor(private route: ActivatedRoute,
              private modalService: BsModalService) {
  }

  ngOnInit(): void {
    this.route.data
      .pipe(
        takeUntil(this.destroy$),
        map((data: object) => data['strategy'])
      )
      .subscribe((strategy: Strategy) => {
        this.strategy = strategy;

        this.links = [
          new ContentTabLink('Доходность', '/strategies/details/' + this.strategy.id),
          new ContentTabLink('Инструменты', '/strategies/details/' + this.strategy.id + '/symbols')
        ];

        if (this.strategy.accountsCount > 0) {
          this.links.push(new ContentTabLink('Инвестиции', '/strategies/details/' + this.strategy.id + '/investments'));
        }
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
