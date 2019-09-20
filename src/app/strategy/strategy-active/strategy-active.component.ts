import { Component, OnInit } from '@angular/core';
import { StrategyService } from '@app/services/strategy.service';
import { Strategy } from '@app/models';

@Component({
  selector: 'app-strategy-active',
  templateUrl: './strategy-active.component.html',
  styleUrls: ['./strategy-active.component.scss']
})
export class StrategyActiveComponent implements OnInit {
  strategies: Strategy[];

  constructor(
    private strategyService: StrategyService
  ) { }

  ngOnInit() {
    // this.strategies = this.strategyService.getActive();
    this.strategyService.getActive().subscribe((strategies: Strategy[]) => {
      this.strategies = strategies;
    });
  }

  getIntervalPnL(): number {
    let sum: number = 0;

    this.strategies.forEach((strategy: Strategy) => {
      sum = sum + strategy.account.intervalPnL;
    });

    return sum;
  }
}
