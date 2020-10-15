import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, Offer, Strategy } from '@app/models';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { DataService } from '@app/services/data.service';
import { BrandService } from '@app/services/brand.service';
import { takeUntil } from 'rxjs/operators';
import { SectionEnum } from "@app/enum/section.enum";

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
  publicOffer: Offer;
  links: ContentTabLink[] = [];
  args: any;
  functionality: object;
  sectionEnum: SectionEnum = SectionEnum.statement;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private brandService: BrandService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.brandService.functionality
      .pipe(takeUntil(this.destroy$))
      .subscribe((f: object) => {
        this.functionality = f;
      });
    this.args = { accountId: this.route.params['_value'].id };
    this.getAccountStatement();

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  getAccountStatement(): void {
    this.dataService.getAccountStatement(this.args)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.strategy = response.strategy;
        response.account.isMyStrategy = response.strategy.isMyStrategy;
        this.account = response.account;
        this.account.currentDate = new Date();
        this.account.strategy = response.strategy;
        this.publicOffer = this.strategy.publicOffer ? this.strategy.publicOffer : this.strategy.linkOffer;

        this.links = [
          new ContentTabLink('investment.positions.title', '/investments/details/' + this.account.id),
          new ContentTabLink('investment.deals.title', '/investments/details/' + this.account.id + '/deals')
        ];
      });
  }
}
