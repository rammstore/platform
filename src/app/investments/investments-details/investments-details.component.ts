import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, Strategy } from '@app/models';
import { ActivatedRoute } from '@angular/router';
import { StrategyService } from '@app/services/strategy.service';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/index';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';

@Component({
  selector: 'app-investments-details',
  templateUrl: './investments-details.component.html',
  styleUrls: ['./investments-details.component.scss']
})
export class InvestmentsDetailsComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  account: Account;
  strategy: Strategy;
  links: ContentTabLink[] = [];

  constructor(
    private route: ActivatedRoute,
    private strategyService: StrategyService
  ) { }

  ngOnInit(): void {
    this.route.data
      .pipe(
        takeUntil(this.destroy$),
        map((data: object) => data['investment'])
      )
      .subscribe((account: Account) => {
        this.account = account;

        this.links = [
          new ContentTabLink('Позиции', `/investments/details/${this.account.id}`),
          new ContentTabLink('Сделки', `/investments/details/${this.account.id}/deals`)
        ];

        this.strategyService.get(this.account.strategy.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((strategy: Strategy) => {
            this.strategy = strategy;
          });

      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
