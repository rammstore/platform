import { Component, OnInit } from '@angular/core';
import { Strategy } from '../../shared/models/strategy';
import { StrategyService } from '../../shared/services/strategy.service';

@Component({
  selector: 'app-strategy-closed',
  templateUrl: './strategy-closed.component.html',
  styleUrls: ['./strategy-closed.component.scss']
})
export class StrategyClosedComponent implements OnInit {
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
