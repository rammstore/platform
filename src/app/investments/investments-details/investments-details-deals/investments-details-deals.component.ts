import { Component, OnDestroy, OnInit } from '@angular/core';
import { Deal, Paginator, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '@app/services/data.service';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { CustomDatePipe } from '@app/pipes/custom-date.pipe';

@Component({
  selector: 'app-investments-details-deals',
  templateUrl: './investments-details-deals.component.html',
  styleUrls: ['./investments-details-deals.component.scss']
})
export class InvestmentsDetailsDealsComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  deals: Deal[] = [];
  id: number;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'dtCreated', label: 'Время', pipe: { pipe: CustomDatePipe }}),
      new TableColumn({ property: 'id', label: 'Сделка'}),
      new TableColumn({ property: 'Symbol', label: 'Инструмент' }),
      new TableColumn({ property: 'type', label: 'Тип' }),
      new TableColumn({ property: 'entry', label: 'Направление' }),
      new TableColumn({ property: 'volume', label: 'Объем' }),
      new TableColumn({ property: 'price', label: 'Цена' }),
      new TableColumn({ property: 'yield', label: 'Прибыль, USD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'commission', label: 'Комиссия, USD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'swap', label: 'Своп, USD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'totalProfit', label: 'Итого прибыль, USD', pipe: { pipe: CustomCurrencyPipe } })
    ]),
  ];
  totalFields: string[] = ['yield', 'commission', 'swap', 'totalProfit'];
  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params) => {
      this.id = params['id'];
      this.getDeals();
    });
  }

  getDeals(): void {
    this.dataService.getAccountDeals(this.id, this.paginator)
      .pipe(takeUntil(this.destroy$))
      .subscribe((deals: Deal[]) => {
        deals.forEach((deal: Deal) => {
          if (deal.volume) {
            deal.volume = Math.abs(deal.volume);
          }
        });
        this.deals = deals;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
