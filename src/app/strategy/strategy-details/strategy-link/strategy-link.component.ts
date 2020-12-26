import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { Strategy } from "@app/models";
import { BsModalRef } from "ngx-bootstrap";
import { ContentTabLink } from "@app/components/content-tabs/content-tab-link";
import { ActivatedRoute } from "@angular/router";
import { DataService } from "@app/services/data.service";
import { BrandService } from "@app/services/brand.service";
import { takeUntil } from "rxjs/internal/operators";
import { StrategyService } from "@app/services/strategy.service";
import {SectionEnum} from "@app/enum/section.enum";

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
  strategy: Strategy;
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
      this.dataService.getStrategyByLink(this.args)
        .pipe(takeUntil(this.destroy$))
        .subscribe((strategy: Strategy) => {
          strategy.link = item.id;

          this.strategyService.strategy = strategy;
          this.strategy = strategy;
          this.strategiesLinks();
        });
      // this.methodName = 'getStrategyByLink';
    })

  }


  strategiesLinks() {
    this.links = [
      new ContentTabLink('common.yield', '/strategies/link/' + this.strategy.link),
      new ContentTabLink('common.table.label.symbols', '/strategies/link/' + this.strategy.link + '/symbols'),
      new ContentTabLink('common.table.label.myInvestment', '/strategies/link/' + this.strategy.link + '/my-investment')
    ];

    if (this.strategy.isMy()) {
      this.links.push(new ContentTabLink('common.investments', '/strategies/link/' + this.strategy.link + '/investments'));
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
