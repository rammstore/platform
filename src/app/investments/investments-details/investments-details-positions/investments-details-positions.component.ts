import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TableHeaderRow } from '@app/models/table-header-row';
import { Account, Deal, Paginator, Position, TableColumn } from '@app/models';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';

@Component({
  selector: 'app-investments-details-positions',
  templateUrl: './investments-details-positions.component.html',
  styleUrls: ['./investments-details-positions.component.scss']
})
export class InvestmentsDetailsPositionsComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  positions: Position[];
  account: Account;
  id: number;
  totals: object;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'symbol', label: 'common.table.label.symbol'}),
      new TableColumn({ property: 'type', label: 'common.type'}),
      new TableColumn({ property: 'volume', label: 'common.table.label.volume' }),
      new TableColumn({ property: 'price', label: 'common.table.label.priceOpen' }),
      new TableColumn({ property: 'currentPrice', label: 'common.table.label.priceCurrent' }),
      new TableColumn({ property: 'profit', label: 'common.table.label.yieldUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'swap', label: 'common.table.label.swapUSD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'totalProfit', label: 'common.table.label.yieldTotalUSD', pipe: { pipe: CustomCurrencyPipe } }),
    ]),
  ];
  // totalFields: string[] = ['profit', 'swap', 'totalProfit'];
  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.route.parent.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.id = params['id'];
        this.getPositions();
      });
  }

  getPositions(): void {
    this.dataService.getAccountPositions(this.route.parent.params['_value'].id, this.paginator)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: {positions: Position[], totals: object}) => {
        this.totals = result.totals;
        result.positions.forEach((position: Position) => {
          if (position.volume) {
            position.volume = Math.abs(position.volume);
          }
        });

        this.positions = result.positions;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
