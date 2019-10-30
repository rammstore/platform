import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Strategy } from '@app/models';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';

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

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
    this.dataService.getStrategy(this.route.params['_value'].id)
      .pipe(takeUntil(this.destroy$))
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
