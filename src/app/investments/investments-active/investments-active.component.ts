import { Component, OnInit } from '@angular/core';
import { Strategy, TableColumn } from '@app/models';
import { StrategyService } from '@app/services/strategy.service';
import { TableHeaderRow } from '@app/models/table-header-row';

@Component({
  selector: 'app-investments-active',
  templateUrl: './investments-active.component.html',
  styleUrls: ['./investments-active.component.scss']
})
export class InvestmentsActiveComponent implements OnInit {
  strategies: Strategy[];
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'name', label: 'Стратегия', rowspan: 2}),
      new TableColumn({ label: 'Доходность стратегии', colspan: 2}),
      new TableColumn({ label: 'Инвестиция', colspan: 3})
    ]),
    new TableHeaderRow([
      new TableColumn({ property: 'monthly', label: 'в месяц' }),
      new TableColumn({ property: 'profit', label: 'Всего' }),
      new TableColumn({ property: 'age', label: 'Возраст, недель' }),
      new TableColumn({ property: 'account', label: 'Моя инвестиция, USD' }),
      new TableColumn({ property: 'manage', label: '' })
    ]),
  ];

  constructor(
    private strategyService: StrategyService
  ) { }

  ngOnInit() {
    this.strategyService.getActive().subscribe((strategies: Strategy[]) => {
      this.strategies = strategies;
    });
  }

}
