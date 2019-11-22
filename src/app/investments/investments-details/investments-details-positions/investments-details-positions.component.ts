import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TableHeaderRow } from '@app/models/table-header-row';
import { Account, Paginator, Position, TableColumn } from '@app/models';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';

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
  positions: Position[] = [];
  account: Account;
  id: number;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'symbol', label: 'Инструмент'}),
      new TableColumn({ property: 'type', label: 'Тип'}),
      new TableColumn({ property: 'volume', label: 'Объем' }),
      new TableColumn({ property: 'price', label: 'Цена открытия' }),
      new TableColumn({ property: 'currentPrice', label: 'Текущая цена' }),
      new TableColumn({ property: 'profit', label: 'Прибыль, USD' }),
      new TableColumn({ property: 'swap', label: 'Своп, USD' }),
      new TableColumn({ property: 'totalProfit', label: 'Итого прибыль, USD' }),
    ]),
  ];
  totalFields: string[] = ['profit', 'swap', 'totalProfit'];
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

        // this.dataService.getAccountStatement(this.id)
        //   .pipe(takeUntil(this.destroy$))
        //   .subscribe((response: any) => {
        //     this.account = response.account;
        //   });
      });
  }

  getPositions(): void {
    this.dataService.getAccountPositions(this.route.parent.params['_value'].id, this.paginator)
      .pipe(takeUntil(this.destroy$))
      .subscribe((positions: Position[]) => {
        this.positions = positions;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
