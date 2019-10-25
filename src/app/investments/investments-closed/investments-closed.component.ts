import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, Paginator, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { DatePipe, PercentPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { CustomCurrencyPipe } from '@app/pipes/custom-currency.pipe';
import { DataService } from '@app/services/data.service';

@Component({
  selector: 'app-investments-closed',
  templateUrl: './investments-closed.component.html',
  styleUrls: ['./investments-closed.component.scss']
})
export class InvestmentsClosedComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  accounts: Account[];

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'strategy.name', label: 'Стратегия' }),
      new TableColumn({ property: 'id', label: 'Инвестиция'}),
      new TableColumn({ property: 'dtCreated', label: 'Создана', pipe: { pipe: DatePipe, args: ['yyyy-MM-dd hh:mm:ss'] }}),
      new TableColumn({ property: 'dtClosed', label: 'Закрыта', pipe: { pipe: DatePipe, args: ['yyyy-MM-dd hh:mm:ss'] }}),
      new TableColumn({ property: 'age', label: 'Возраст' }),
      new TableColumn({ property: 'protection', label: 'Защита', pipe: { pipe: PercentPipe }}),
      new TableColumn({ property: 'intervalPnL', label: 'Прибыль, USD', pipe: { pipe: CustomCurrencyPipe } }),
      new TableColumn({ property: 'investmentDetails', label: '' })
    ]),
  ];

  paginator: Paginator = new Paginator({
    perPage: 10,
    currentPage: 1
  });

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getAccounts();
  }

  getAccounts(): void {
    this.dataService.getClosedMyAccounts(this.paginator)
      .pipe(takeUntil(this.destroy$))
      .subscribe((accounts: Account[]) => {
        this.accounts = accounts;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
