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
  // component data
  strategy: Strategy;
  modalRef: BsModalRef;
  links: ContentTabLink[];
  args: any;
  functionality: object;
  functionality$: Observable<object>;
  id: number = 0;
  methodName: string;
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

    // if (this.settingsService.isMobile) {
    //   this.myIinvestment = "common.table.label.myInvestment.mobile";
    //   this.yield = "common.yield.mobile";
    //   this.investments = "common.investments.mobile";
    // }
    // else {
    //   this.myIinvestment = "common.table.label.myInvestment";
    //   this.yield = "common.yield";
    //   this.investments = "common.investments";
    // }

    this.getStrategies();

    this.dataService.update$
      .pipe(takeUntil(this.destroy$))
      .subscribe((item) => {
        if (item.status === 'update') {
          this.getStrategies();
        }
      });
  }

  parseAction(event: ActionEnum) {
    switch (event) {
      case ActionEnum.investment:
      case ActionEnum.cancel: {
        this.getStrategies();
        break;
      }
    }
  }

  private getStrategies(): void {
    if (this.id) {
      this.args = {
        strategyId: this.id
      };

      this.strategy$ = this.getStrategyById(this.args)
        .pipe(
          tap((item) => this.strategiesDetailsLinks()),
          catchError(item => {
            item.status === 404 ? this.notificationsService.open('empty.strategy.null', {
              type: 'error',
              autoClose: true,
              duration: 5000
            }) : '';

            return of();
          })
        );

    } else {
      this.args = {
        link: this.route.params['_value'].id
      };
      this.strategy$ = this.getStrategyByLink(this.args).pipe(
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
          this.strategy = strategy;
        })
      )
  }

  private getStrategyById(args): Observable<any> {
    return this.dataService.getStrategyById(args)
      .pipe(
        take(1),
        tap((strategy) => {
          this.strategyService.strategy = strategy;
          this.strategy = strategy;
        })
      );
  }

  strategiesDetailsLinks() {
    switch (true) {
      case this.settingsService.isMobile:
        this.links = [
          new ContentTabLink('common.yield.mobile', '/strategies/details/' + this.strategy.id),
          new ContentTabLink('common.table.label.symbols', '/strategies/details/' + this.strategy.id + '/symbols')
        ];

        if (this.strategy.account && this.strategy.account.id) {
          this.links.push(new ContentTabLink('common.table.label.myInvestment.mobile', '/strategies/details/' + this.strategy.id + '/my-investment'));
        }

        if (this.strategy.partnerInfo || this.strategy.traderInfo) {
          this.links.push(new ContentTabLink('common.investments.mobile', '/strategies/details/' + this.strategy.id + '/investments'));
        }
        break;

      default:
        this.links = [
          new ContentTabLink('common.yield', '/strategies/details/' + this.strategy.id),
          new ContentTabLink('common.table.label.symbols', '/strategies/details/' + this.strategy.id + '/symbols')
        ];

        if (this.strategy.account && this.strategy.account.id) {
          this.links.push(new ContentTabLink('common.table.label.myInvestment', '/strategies/details/' + this.strategy.id + '/my-investment'));
        }

        if (this.strategy.partnerInfo || this.strategy.traderInfo) {
          this.links.push(new ContentTabLink('common.investments', '/strategies/details/' + this.strategy.id + '/investments'));
          this.links.push(new ContentTabLink('common.offers', `/strategies/details/${this.strategy.id}/offers`));

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
