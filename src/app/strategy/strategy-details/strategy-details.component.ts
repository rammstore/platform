import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Strategy } from '@app/models';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { BsModalRef } from 'ngx-bootstrap';
import { Observable, of, Subject, VirtualTimeScheduler } from 'rxjs';
import { catchError, take, takeUntil, tap } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';
import { BrandService } from '@app/services/brand.service';
import { StrategyService } from '@app/services/strategy.service';
import { SectionEnum } from "@app/enum/section.enum";
import { NotificationsService } from "@app/services/notifications.service";
import { ActionEnum } from "@app/enum/action.enum";
import { SettingsService } from '@app/services/settings.service';

@Component({
  selector: 'app-strategy-details',
  templateUrl: './strategy-details.component.html',
  providers: [StrategyService],
  styleUrls: ['./strategy-details.component.scss']
})
export class StrategyDetailsComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();
  strategy$: Observable<Strategy>;
  update$: Observable<any>;

  // component data
  modalRef: BsModalRef;
  links: ContentTabLink[];
  args: any;
  functionality: object;
  functionality$: Observable<object>;
  id: number = 0;
  sectionEnum: SectionEnum = SectionEnum.strategy;

  //tabs names
  myIinvestment: string;
  yield: string;
  investments: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private brandService: BrandService,
    private notificationsService: NotificationsService,
    private strategyService: StrategyService,
    private settingsService: SettingsService
  ) {
  }

  ngOnInit(): void {
    this.functionality$ = this.brandService.functionality;

    this.id = parseInt(this.route.params['_value'].id);

    this.dataService.update$
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => {
        if (item) {
          this.strategy$ = this.getStrategyById(this.args)
            .pipe(
              tap(() => {
                this.dataService._update$.next(null);
              })
            );
        }
      });


    this.getStrategy();
  }

  parseAction(event: ActionEnum) {
    switch (event) {
      case ActionEnum.investment:
      case ActionEnum.cancel: {
        this.getStrategy();
        break;
      }
    }
  }

  private getStrategy(): void {
    if (this.id) {
      this.args = {
        strategyId: this.id
      };

      this.strategy$ = this.getStrategyById(this.args)
        .pipe(
          tap((strategy) => {
            this.strategiesDetailsLinks(strategy)
          })
        );

    } else {
      this.args = {
        link: this.route.params['_value'].id
      };
      this.strategy$ = this.getStrategyByLink(this.args)
        .pipe(
          tap((item) => this.strategiesLinks())
        );
    }
  }

  private getStrategyByLink(args): Observable<any> {
    return this.dataService.getStrategyByLinkAsObservable(args)
      .pipe(
        take(1),
        tap((strategy) => {
          this.strategyService.strategy = strategy;
        })
      )
  }

  private getStrategyById(args): Observable<any> {
    return this.dataService.getStrategyById(args)
      .pipe(
        take(1),
        tap((strategy) => {
          this.strategyService.strategy = strategy;
        })
      );
  }

  strategiesDetailsLinks(strategy: Strategy) {
    switch (true) {
      case this.settingsService.isMobile:
        this.links = [
          new ContentTabLink('common.yield.mobile', '/strategies/details/' + strategy.id),
          new ContentTabLink('common.table.label.symbols', '/strategies/details/' + strategy.id + '/symbols')
        ];

        if (strategy.account && strategy.account.id) {
          this.links.push(new ContentTabLink('common.table.label.myInvestment.mobile', '/strategies/details/' + strategy.id + '/my-investment'));
        }

        if (strategy.partnerInfo || strategy.traderInfo) {
          this.links.push(new ContentTabLink('common.investments.mobile', '/strategies/details/' + strategy.id + '/investments'));
        }
        break;

      default:
        this.links = [
          new ContentTabLink('common.yield', '/strategies/details/' + strategy.id),
          new ContentTabLink('common.table.label.symbols', '/strategies/details/' + strategy.id + '/symbols')
        ];

        if (strategy.account && strategy.account.id) {
          this.links.push(new ContentTabLink('common.table.label.myInvestment', '/strategies/details/' + strategy.id + '/my-investment'));
        }

        if (strategy.partnerInfo || strategy.traderInfo) {
          this.links.push(new ContentTabLink('common.investments', '/strategies/details/' + strategy.id + '/investments'));
          this.links.push(new ContentTabLink('common.offers', `/strategies/details/${strategy.id}/offers`));

        }
        
        if(strategy.youTubeVideoId){
          this.links.push(new ContentTabLink('Video', '/strategies/details/' + strategy.id + '/video'));
        }

        break;
    }
  }

  strategiesLinks() {
    this.links = [
      new ContentTabLink('common.yield', '/strategies/link/' + this.args.link),
      new ContentTabLink('common.table.label.symbols', '/strategies/link/' + this.args.link + '/symbols')
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.strategyService.getStrategyAsSubject.complete();
  }
}
