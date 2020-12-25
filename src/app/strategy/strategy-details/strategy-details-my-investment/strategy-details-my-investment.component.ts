import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Account, Offer, Strategy } from '@app/models';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '@app/services/data.service';
import { BrandService } from '@app/services/brand.service';
import { map, takeUntil } from 'rxjs/operators';
import { StrategyService } from "@app/services/strategy.service";

@Component({
  selector: 'app-strategy-details-my-investment',
  templateUrl: './strategy-details-my-investment.component.html',
  styleUrls: ['./strategy-details-my-investment.component.scss']
})
export class StrategyDetailsMyInvestmentComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  account$: Observable<Account>;
  offer$: Observable<Offer>;
  strategy: Strategy;
  args: any;
  functionality: object;
  accountId: number;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private strategyService: StrategyService,
    private brandService: BrandService
  ) {
  }

  ngOnInit() {
    this.brandService.functionality
      .pipe(takeUntil(this.destroy$))
      .subscribe((f: object) => {
        this.functionality = f;
      });
    this.args = {
      strategyId: this.route.parent.params['_value'].id,
    };

    this.strategy = this.strategyService.strategy;

    if (!this.strategy) {
      debugger
      this.getStrategyById(this.args)
        .pipe(takeUntil(this.destroy$))
        .subscribe((item) => {
          this.offer$ = of(item.account.offer);
          this.accountId = item.account.id;
        });

      this.getAccountStatement({ accountId: this.accountId });
    } else {
      debugger
      this.offer$ = of(this.strategy.account.offer);
      this.getAccountStatement({ accountId: this.strategy.account.id });
    }
  }

  getStrategyById(args: any): Observable<Strategy> {
    return this.dataService.getStrategyById(args);
  }

  getAccountStatement(args: any): void {
    this.account$ = this.getAccount(args);
  }

  getAccount(args: any): Observable<Account> {
    return this.dataService.getAccountById(args)
      .pipe(
        map((response: any) => {
          if (response) {
            const account = response.account;
            account.strategy = response.strategy;

            return account;
          }
        })
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
