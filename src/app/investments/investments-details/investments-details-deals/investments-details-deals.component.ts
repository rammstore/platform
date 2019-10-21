import { Component, OnDestroy, OnInit } from '@angular/core';
import { Deal, Paginator, TableColumn } from '@app/models';
import { DatePipe } from '@angular/common';
import { TableHeaderRow } from '@app/models/table-header-row';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '@app/services/data.service';

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
  deals: Deal[];
  id: number;

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
        this.deals = deals;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
