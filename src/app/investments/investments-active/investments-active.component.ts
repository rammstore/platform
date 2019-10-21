import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { Subject } from 'rxjs/index';
import { takeUntil } from 'rxjs/internal/operators';
import { AccountService } from '@app/services/account.service';
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'app-investments-active',
  templateUrl: './investments-active.component.html',
  styleUrls: ['./investments-active.component.scss']
})
export class InvestmentsActiveComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  accounts: Account[];

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'strategy.name', label: 'Стратегия', rowspan: 2}),
      new TableColumn({ label: 'Доходность стратегии', colspan: 2}),
      new TableColumn({ label: 'Инвестиция', colspan: 3})
    ]),
    new TableHeaderRow([
      new TableColumn({ property: 'strategy.profit', label: 'в месяц', pipe: { pipe: PercentPipe }}),
      new TableColumn({ property: 'yieldChart', label: 'Всего' }),
      new TableColumn({ property: 'age', label: 'Возраст, недель' }),
      new TableColumn({ property: 'investmentInfo', label: 'Моя инвестиция, USD' }),
      new TableColumn({ property: 'manage', label: '' })
    ]),
  ];

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.accountService.getActive()
      .pipe(takeUntil(this.destroy$))
      .subscribe((accounts: Account[]) => {
        this.accounts = accounts;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
