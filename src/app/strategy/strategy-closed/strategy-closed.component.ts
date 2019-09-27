import { Component, OnInit } from '@angular/core';
import { Strategy } from '../../shared/models/strategy';
import { StrategyService } from '../../shared/services/strategy.service';
import { TableHeaderRow } from '@app/models/table-header-row';
import { TableColumn } from '@app/models';
import { DatePipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-strategy-closed',
  templateUrl: './strategy-closed.component.html',
  styleUrls: ['./strategy-closed.component.scss']
})
export class StrategyClosedComponent implements OnInit {
  strategies: Strategy[];

  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'id', label: 'ID'}),
      new TableColumn({ property: 'name', label: 'Название' }),
      new TableColumn({ property: 'offer.fee', label: 'Вознаграждение', pipe: { pipe: PercentPipe }}),
      new TableColumn({ property: 'dtCreated', label: 'Создана', pipe: { pipe: DatePipe, args: ['yyyy-MM-dd hh:mm:ss'] }}),
      new TableColumn({ property: '', label: 'Закрыта' }),
      new TableColumn({ property: 'age', label: 'Возраст' }),
      new TableColumn({ property: '', label: 'Выплаченное вознаграждение, USD' })
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
