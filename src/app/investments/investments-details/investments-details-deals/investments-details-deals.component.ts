import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Deal, Paginator, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/internal/operators';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '@app/services/data.service';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { CustomDatePipe } from '@app/pipes/custom-date.pipe';
import { RefreshService } from '@app/services/refresh.service';

@Component({
  selector: 'app-investments-details-deals',
  templateUrl: './investments-details-deals.component.html',
  styleUrls: ['./investments-details-deals.component.scss']
})
export class InvestmentsDetailsDealsComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  emptyDataText: string;
  // component data
  deals: Deal[];
  id: number;
  totals: object;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'dtCreated', label: 'common.table.label.time', pipe: { pipe: CustomDatePipe } }),
      new TableColumn({ property: 'id', label: 'common.table.label.deal' }),
      new TableColumn({ property: 'symbol', label: 'common.table.label.symbol' }),
      new TableColumn({ property: 'type', label: 'common.type' }),
      new TableColumn({ property: 'entry', label: 'common.table.label.entry' }),
      new TableColumn({ property: 'volume', label: 'common.table.label.volume' }),
      new TableColumn({ property: 'price', label: 'common.table.label.price' }),
      new TableColumn({ property: 'yield', label: 'common.table.label.yieldUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'commission', label: 'common.table.label.commissionUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'swap', label: 'common.table.label.swapUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'totalProfit', label: 'common.table.label.yieldTotalUSD', pipe: { pipe: CustomCurrencyPipe } })
    ]),
  ];
  // totalFields: string[] = ['yield', 'commission', 'swap', 'totalProfit'];
  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private refreshService: RefreshService
  ) { }



  ngOnInit() {
    this.emptyDataText = "common.table.label.no-data";
    this.route.parent.params.subscribe((params) => {
      this.id = params['id'];
      this.getDeals();
    });

    this.refreshService.refresh$
      .pipe(map((item) => item == 'deals'))
      .subscribe((status) => {
        this.emptyDataText = "table.cell.loading";
        if (status) {
          this.deals = [];
          this.getDeals();
        }
      });
  }

  getDeals(): void {
    this.dataService.getAccountDeals(this.id, this.paginator)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: { deals: Deal[], totals: object }) => {
        this.totals = result.totals;

        result.deals.forEach((deal: Deal) => {
          if (deal.volume) {
            deal.volume = Math.abs(deal.volume);
          }
        });
        
        this.deals = result.deals;
        this.emptyDataText = "common.table.label.no-data";
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
