import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Strategy } from "@app/models";
import { BsModalRef } from "ngx-bootstrap";
import { ContentTabLink } from "@app/components/content-tabs/content-tab-link";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "@app/services/data.service";
import { BrandService } from "@app/services/brand.service";
import { take, takeUntil, tap } from "rxjs/internal/operators";
import { StrategyService } from "@app/services/strategy.service";
import { SectionEnum } from "@app/enum/section.enum";

@Component({
  selector: 'app-strategy-link',
  templateUrl: './strategy-link.component.html',
  providers: [StrategyService],
  styleUrls: ['./strategy-link.component.scss']
})
export class StrategyLinkComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  // strategy: Strategy;
  strategy$: Observable<Strategy>;
  modalRef: BsModalRef;
  links: ContentTabLink[];
  args: any;
  functionality: object;
  id: number = 0;
  // methodName: string;

  sectionEnum = SectionEnum;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private brandService: BrandService,
    private strategyService: StrategyService
  ) {
  }

  ngOnInit(): void {
    this.brandService.functionality
      .pipe(takeUntil(this.destroy$))
      .subscribe((f: object) => {
        this.functionality = f;
      });

    this.activatedRoute.params.subscribe((item) => {
      this.args = {
        link: item.id
      };

      this.strategy$ = this.getStrategyByLink(this.args);
    });

    this.dataService.update$
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => {
        if (item) {
          this.strategy$ = this.getStrategyByLink(this.args);
        }
      });
  }

  private getStrategyByLink(args: any): Observable<Strategy> {
    return this.dataService.getStrategyByLink(args)
      .pipe(
        take(1),
        tap((strategy: Strategy) => {
          strategy.link = args.link;
          this.strategyService.strategy = strategy;
          this.strategiesLinks(strategy);
        })
      );
  }

  strategiesLinks(strategy: Strategy) {
    this.links = [
      new ContentTabLink('common.yield', '/strategies/link/' + strategy.link),
      new ContentTabLink('common.table.label.symbols', '/strategies/link/' + strategy.link + '/symbols')
    ];

    if(strategy.account && strategy.account.id){
      this.links.push(new ContentTabLink('common.table.label.myInvestment', '/strategies/link/' + strategy.link + '/my-investment'));
    }

    if (strategy.isMy()) {
      this.links.push(new ContentTabLink('common.investments', '/strategies/link/' + strategy.link + '/investments'));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
