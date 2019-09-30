import { Component, OnInit } from '@angular/core';
import { Strategy, TableColumn } from '@app/models';
import { StrategyService } from '@app/services/strategy.service';
import { TableHeaderRow } from '@app/models/table-header-row';
import { DatePipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-investments-closed',
  templateUrl: './investments-closed.component.html',
  styleUrls: ['./investments-closed.component.scss']
})
export class InvestmentsClosedComponent implements OnInit {
  strategies: Strategy[];

  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'name', label: 'Стратегия' }),
      new TableColumn({ property: 'account.id', label: 'Инвестиция'}),
      new TableColumn({ property: 'dtCreated', label: 'Создана', pipe: { pipe: DatePipe, args: ['yyyy-MM-dd hh:mm:ss'] }}),
      new TableColumn({ property: '', label: 'Закрыта'}),
      new TableColumn({ property: 'age', label: 'Возраст' }),
      new TableColumn({ property: 'account.protection', label: 'Защита', pipe: { pipe: PercentPipe }}),
      new TableColumn({ property: 'account.intervalPnL', label: 'Прибыль, USD' }),
      new TableColumn({ property: 'investmentDetails', label: '' })
    ]),
  ];

  constructor(
    private strategyService: StrategyService
  ) { }

  ngOnInit() {
    this.strategyService.getClosed().subscribe((strategies: Strategy[]) => {
      this.strategies = strategies;
    });
  }

}
