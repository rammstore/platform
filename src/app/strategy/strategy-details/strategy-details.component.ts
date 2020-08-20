import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Strategy} from '@app/models';
import {ContentTabLink} from '@app/components/content-tabs/content-tab-link';
import {BsModalRef} from 'ngx-bootstrap';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';
import {DataService} from '@app/services/data.service';
import {BrandService} from '@app/services/brand.service';

@Component({
  selector: 'app-strategy-details',
  templateUrl: './strategy-details.component.html',
  styleUrls: ['./strategy-details.component.scss']
})
export class StrategyDetailsComponent implements OnInit, OnDestroy {
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
  methodName: string;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private brandService: BrandService
  ) {
  }

  ngOnInit(): void {
    this.brandService.functionality
      .pipe(takeUntil(this.destroy$))
      .subscribe((f: object) => {
        this.functionality = f;
      });

    this.id = parseInt(this.route.params['_value'].id);
    if(this.id) {
      this.args = {
        strategyId: this.id
      };
      this.dataService.getStrategyByID(this.args)
      .pipe(takeUntil(this.destroy$))
      .subscribe((strategy: Strategy) => {
        this.strategy = strategy;
        this.strategiesDetailsLinks();
      });
      this.methodName = 'getStrategyByID';
    } else {
      this.args = {
        link: this.route.params['_value'].id
      };
      this.dataService.getStrategyByLink(this.args)
        .pipe(takeUntil(this.destroy$))
        .subscribe((strategy: Strategy) => {
          this.strategy = strategy;
          this.strategiesLinks();
        });
        this.methodName = 'getStrategyByLink';
    }

  }

  strategiesDetailsLinks() {
    this.links = [
      new ContentTabLink('common.yield', '/strategies/details/' + this.strategy.id),
      new ContentTabLink('common.table.label.symbols', '/strategies/details/' + this.strategy.id + '/symbols'),
      new ContentTabLink('common.table.label.myInvestment', '/strategies/details/' + this.strategy.id + '/my-investment')
    ];

    if (this.strategy.isMy()) {
      this.links.push(new ContentTabLink('common.investments', '/strategies/details/' + this.strategy.id + '/investments'));
    }
    if (this.strategy.isMyStrategy) {
      this.links.push(new ContentTabLink('common.offers', `/strategies/details/${this.strategy.id}/offers`));
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
  }
}
