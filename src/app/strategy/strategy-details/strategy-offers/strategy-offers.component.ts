import {Component, OnInit} from '@angular/core';
import {DataService} from "@app/services/data.service";
import {ActivatedRoute} from "@angular/router";
import {takeUntil} from "rxjs/internal/operators";
import {Subject} from "rxjs";
import {Strategy} from "@app/models";

@Component({
  selector: 'app-strategy-offers',
  templateUrl: './strategy-offers.component.html',
  styleUrls: ['./strategy-offers.component.scss']
})
export class StrategyOffersComponent implements OnInit {
  destroy$ = new Subject();
  args: any;
  strategy: Strategy;

  constructor(
    public dataService: DataService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.args = {
      strategyId: this.route.parent.params['_value'].id
    };

    this.dataService.getStrategy(this.args)
      .pipe(takeUntil(this.destroy$))
      .subscribe((strategy: Strategy) => {
        this.strategy = strategy;
      });
  }

}
