import { Component, OnInit } from '@angular/core';
import { Strategy } from '@app/models';
import { StrategyService } from '@app/services/strategy.service';

@Component({
  selector: 'app-investments-closed',
  templateUrl: './investments-closed.component.html',
  styleUrls: ['./investments-closed.component.scss']
})
export class InvestmentsClosedComponent implements OnInit {
  strategies: Strategy[];

  constructor(
    private strategyService: StrategyService
  ) { }

  ngOnInit() {
    this.strategyService.getClosed().subscribe((strategies: Strategy[]) => {
      this.strategies = strategies;
    });
  }

}
