import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Account, Offer, Strategy } from '@app/models';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '@app/services/data.service';
import { BrandService } from '@app/services/brand.service';
import { takeUntil } from 'rxjs/operators';
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
  loadStatus: boolean = false;

  // component data
  account: Account;
  args: any;
  functionality: object;
  offer: Offer = null;
  strategy: Strategy;
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
      this.dataService.getStrategyByID(this.args)
        .pipe(takeUntil(this.destroy$))
        .subscribe((item) => {
          this.offer = item.account.offer;
          this.accountId = item.account.id;
        });

      this.getAccountStatement({
        accountId: this.accountId
      });
    } else {
      this.offer = this.strategy.account.offer;
      this.getAccountStatement({
        accountId: this.strategy.account.id
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  getAccountStatement(json: any): void {
    this.dataService.getAccountStatement(json)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.loadStatus = true;
        if (response.account) {
          this.account = response.account;
          this.account.strategy = response.strategy;
        }
      });
  }

}
