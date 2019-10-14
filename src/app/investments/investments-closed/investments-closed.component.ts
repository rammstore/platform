import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';
import { AccountService } from '@app/services/account.service';

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
      new TableColumn({ property: 'age', label: 'Возраст, недель' }),
      new TableColumn({ property: 'protection', label: 'Защита', pipe: { pipe: PercentPipe }}),
      new TableColumn({ property: 'intervalPnL', label: 'Прибыль', pipe: { pipe: CurrencyPipe, args: ['', '', '1.2-2'] } }),
      new TableColumn({ property: 'investmentDetails', label: '' })
    ]),
  ];

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.accountService.getClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((accounts: Account[]) => {
        this.accounts = accounts;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
