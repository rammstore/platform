import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, Deal, Strategy, TableColumn } from '@app/models';
import { ActivatedRoute } from '@angular/router';
import { StrategyService } from '@app/services/strategy.service';
import { AccountService } from '@app/services/account.service';
import { TableHeaderRow } from '@app/models/table-header-row';
import { DatePipe } from '@angular/common';
import { map, takeUntil } from 'rxjs/internal/operators';
import { Subject } from 'rxjs/index';

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
  investment: Account;
  strategy: Strategy;
  deals: Deal[];

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'dtCreated', label: 'Время', pipe: { pipe: DatePipe, args: ['yyyy-MM-dd hh:mm:ss'] }}),
      new TableColumn({ property: 'id', label: 'Сделка'}),
      new TableColumn({ property: 'Symbol', label: 'Инструмент' }),
      new TableColumn({ property: 'type', label: 'Тип' }),
      new TableColumn({ property: 'entry', label: 'Направление' }),
      new TableColumn({ property: 'volume', label: 'Объем' }),
      new TableColumn({ property: 'price', label: 'Цена' }),
      new TableColumn({ property: 'yield', label: 'Прибыль, USD' }),
      new TableColumn({ property: 'comission', label: 'Комиссия, USD' }),
      new TableColumn({ property: 'swap', label: 'Своп, USD' }),
      new TableColumn({ property: 'totalProfit', label: 'Итого прибыль, USD' })
    ]),
  ];
  totalFields: string[] = ['yield', 'comission', 'swap', 'totalProfit'];

  constructor(
    private route: ActivatedRoute,
    private strategyService: StrategyService,
    private investmentService: AccountService
  ) { }

  ngOnInit(): void {
    this.route.data
      .pipe(
        takeUntil(this.destroy$),
        map((data: object) => data['investment'])
      )
      .subscribe((investment: Account) => {
        this.investment = investment;

        this.strategyService.get(this.investment.strategy.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((strategy: Strategy) => {
            this.strategy = strategy;
          });

        this.investmentService.getDeals(this.investment.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((deals: Deal[]) => {
            this.deals = deals;
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
