import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Paginator, Strategy, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { PercentPipe } from '@angular/common';
import { DataService } from '@app/services/data.service';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { SectionEnum } from "@app/enum/section.enum";
import { EntityInterface } from '@app/interfaces/entity.interface';
import { CreateInstanceService } from '@app/services/create-instance.service';
import { WalletService } from '@app/services/wallet.service';
import { ArgumentsService } from '@app/services/arguments.service';

@Component({
  selector: 'app-rating-all',
  templateUrl: './rating-all.component.html',
  styleUrls: ['./rating-all.component.scss']
})
export class RatingAllComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  strategies$: Observable<Strategy[]>;
  // component data
  strategies: Strategy[];
  searchText: string = '';
  args: any;
  section: SectionEnum = SectionEnum.rating;
  all: any;
  ratingAll$: Observable<any>;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'nameRating', label: 'common.strategy', fontSize: 20 }),
      new TableColumn({
        property: 'profit',
        label: 'common.table.label.yieldCommon',
        pipe: { pipe: PercentPipe, args: ['1.0-2'] },
        fontSize: 24
      }),
      new TableColumn({ property: 'strategy.yieldChart', label: 'common.chart' }),
      new TableColumn({ property: 'accounts', label: 'common.table.label.investors', fontSize: 16 }),
      new TableColumn({ property: 'age', label: 'common.age', fontSize: 16 }),
      new TableColumn({
        property: 'strategy.investmentInfo',
        label: 'common.table.label.myInvestmentUSD',
        colored: true
      }),
      new TableColumn({ property: 'manage', label: 'common.table.label.manage' })
    ]),
  ];
  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private dataService: DataService,
    private createInstanceService: CreateInstanceService,
    private walletService: WalletService,
    private argumentsService: ArgumentsService
  ) {
  }

  ngOnInit(): void {
    this.ratingAll$ = this.argumentsService.ratingAll$
      .pipe(
        tap((argument) => {
          this.args = {
            searchMode: argument.searchMode,
            dealsMin: argument.dealsMin,
            ageMin: argument.ageMin,
            yieldMin: argument.yieldMin,
            field: argument.field,
            direction: argument.direction,
            paginator: this.paginator
          };

          this.strategies$ = this.getStrategies();
        })
      );
  }

  getStrategies(): Observable<any> {
    this.args.searchText = this.searchText;
    return this.dataService.getBestRating<EntityInterface>(this.args)
      .pipe(
        take(1),
        tap(item => {
          this.walletService.walletSubject.next(this.createInstanceService.createWallet(item.Wallets[0]));
          console.log('ratind-all', item)
        }),
        map(({ Strategies }) => Strategies.map((item) => this.createInstanceService.createStrategy(item)))
      );
  }

  getRating() {
    this.args.searchText = this.searchText;
    this.strategies$ = this.getStrategies();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
