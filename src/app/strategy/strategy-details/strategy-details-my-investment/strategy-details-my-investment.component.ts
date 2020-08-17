import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Account } from '@app/models';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '@app/services/data.service';
import { BrandService } from '@app/services/brand.service';
import { takeUntil } from 'rxjs/operators';

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
  account: Account;
  args: any;
  functionality: object;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private brandService: BrandService
  ) { }

  ngOnInit() {
    this.brandService.functionality
      .pipe(takeUntil(this.destroy$))
      .subscribe((f: object) => {
        this.functionality = f;
      });
    this.args = {accountId: this.route.parent.params['_value'].id};
    this.dataService.getStrategyByID(this.args);
    this.getAccountStatement();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  getAccountStatement(): void {
    this.dataService.getAccountStatement(this.args)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.account = response.account;
        this.account.strategy = response.strategy;
      });
  }

}
