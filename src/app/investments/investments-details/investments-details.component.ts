import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Account, Offer, Strategy } from '@app/models';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { from, Observable, of, Subject } from 'rxjs';
import { ContentTabLink } from '@app/components/content-tabs/content-tab-link';
import { DataService } from '@app/services/data.service';
import { BrandService } from '@app/services/brand.service';
import { catchError, map, takeUntil, tap } from 'rxjs/operators';
import { SectionEnum } from "@app/enum/section.enum";
import { RefreshService } from '@app/services/refresh.service';
import { StatementInterface } from "@app/interfaces/statement.interface";
import { NotificationsService } from "@app/services/notifications.service";
import * as moment from 'moment';
import { iUpdateOptions } from '@app/interfaces/update';

@Component({
  selector: 'app-investments-details',
  templateUrl: './investments-details.component.html',
  styleUrls: ['./investments-details.component.scss']
})
export class InvestmentsDetailsComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();
  currentDate: any;
  // component data
  // account: Account;
  source$: Observable<StatementInterface>;
  // strategy: Strategy;
  // publicOffer: Offer;
  links: ContentTabLink[] = [];
  args: any;
  functionality: object;
  sectionEnum: SectionEnum = SectionEnum.statement;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private brandService: BrandService,
    private refreshService: RefreshService,
    private notificationsService: NotificationsService,
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

    this.dataService.update$
      .pipe(takeUntil(this.destroy$))
      .subscribe((item: iUpdateOptions) => {
        if (item) {
          this.getAccountStatement();

          this.dataService._update$.next(null);
        }
      });

    this.getAccountStatement();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  onClick() {
    let key = "";
    if (this.router.url.includes('/deals')) {
      key = "deals"
    }
    else {
      key = "positions";
    }

    this.currentDate = moment.utc().format("yyyy-MM-DD HH:mm:ss");
    this.refreshService.refresh = key;
  }

  getAccountStatement(): void {
    this.source$ = this.getStatement();
  }

  getStatement(): Observable<any> {
    const args = {
      accountId: this.route.params['_value'].id
    };

    return this.dataService.getAccountStatement(args)
      .pipe(
        tap((response: any) => {
          this.currentDate = moment.utc().format("yyyy-MM-DD HH:mm:ss");

          this.links = [
            new ContentTabLink('investment.positions.title', '/investments/details/' + response.account.id),
            new ContentTabLink('investment.deals.title', '/investments/details/' + response.account.id + '/deals')
          ];
        }),
        map((response: any) => {
          if (response) {
            const account = response.account;
            account.strategy = response.strategy;

            let object = {
              strategy: response.strategy,
              account: account
            };

            return object;
          }
        })
      );
  }
}
