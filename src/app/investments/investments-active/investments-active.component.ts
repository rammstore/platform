import { Component, OnDestroy, OnInit } from '@angular/core';
import { Account, Paginator, TableColumn } from '@app/models';
import { TableHeaderRow } from '@app/models/table-header-row';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { PercentPipe } from '@angular/common';
import { DataService } from '@app/services/data.service';

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
  args: any;

  // table settings
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ label: 'Стратегия', colspan: 3, fontSize: 20}),
      new TableColumn({ label: 'Инвестиция', colspan: 3, colored: true})
    ]),
    new TableHeaderRow([
      new TableColumn({ property: 'strategy.name', label: 'Название' }),
      new TableColumn({ property: 'strategy.profit', label: 'Доходность', pipe: { pipe: PercentPipe, args: ['1.0-2'] }, fontSize: 24}),
      new TableColumn({ property: 'yieldChart', label: 'График' }),
      new TableColumn({ property: 'age', label: 'Возраст, недель', colored: true, fontSize: 16 }),
      new TableColumn({ property: 'investmentInfo', label: 'Моя инвестиция, USD', colored: true }),
      new TableColumn({ property: 'manage', label: 'Управление' })
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
    this.args = {
      paginator: this.paginator,
      orderBy: 'Strategy.Yield'
    };

    this.getAccounts();
  }

  getAccounts(): void {
    this.dataService.getActiveMyAccounts(this.args)
      .pipe(takeUntil(this.destroy$))
      .subscribe((accounts: Account[]) => {
        this.accounts = accounts;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
