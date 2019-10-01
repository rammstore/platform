import { Component, OnInit } from '@angular/core';
import { Account, Deal, Strategy, TableColumn } from '@app/models';
import { ActivatedRoute } from '@angular/router';
import { StrategyService } from '@app/services/strategy.service';
import { InvestmentsService } from '@app/services/investments.service';
import { TableHeaderRow } from '@app/models/table-header-row';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-investments-details',
  templateUrl: './investments-details.component.html',
  styleUrls: ['./investments-details.component.scss']
})
export class InvestmentsDetailsComponent implements OnInit {
  investment: Account;
  strategy: Strategy;
  deals: Deal[];
  tableHeader: TableHeaderRow[] = [
    new TableHeaderRow([
      new TableColumn({ property: 'dtCreated', label: 'Время', pipe: { pipe: DatePipe, args: ['yyyy-MM-dd hh:mm:ss'] }}),
      new TableColumn({ property: 'id', label: 'Сделка'}),
      new TableColumn({ property: 'Symbol', label: 'Инструмент' }),
      new TableColumn({ property: 'type', label: 'Тип' }),
      new TableColumn({ property: 'entry', label: 'Направление' }),
      new TableColumn({ property: 'volume', label: 'Объем' }),
      new TableColumn({ property: 'price', label: 'Цена' }),
      new TableColumn({ property: 'yield', label: 'Прибыль, USD' }),
      new TableColumn({ property: 'comission', label: 'Комиссия, USD' }),
      new TableColumn({ property: 'swap', label: 'Своп, USD' }),
      new TableColumn({ property: 'totalProfit', label: 'Итого прибыль, USD' })
    ]),
  ];
  totalFields: string[] = ['yield', 'comission', 'swap', 'totalProfit'];

  constructor(
    private route: ActivatedRoute,
    private strategyService: StrategyService,
    private investmentService: InvestmentsService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: object) => {
      this.investment = data['investment'];

      this.strategyService.get(this.investment.strategy.id).subscribe((strategy: Strategy) => {
        this.strategy = strategy;
        console.log(this.strategy);
      });

      this.investmentService.getDeals(this.investment.id).subscribe((deals: Deal[]) => {
        this.deals = deals;
        console.log(deals);
      });
    });
  }

}
