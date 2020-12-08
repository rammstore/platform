import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Strategy } from '@app/models';
import { DataService } from '@app/services/data.service';
import { StrategyService } from '@app/services/strategy.service';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-strategy-details-video',
  templateUrl: './strategy-details-video.component.html',
  styleUrls: ['./strategy-details-video.component.scss']
})
export class StrategyDetailsVideoComponent implements OnInit {

  strategy: Strategy;
  strategy$: Observable<Strategy>;

  args: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private strategyService: StrategyService
  ) { }

  ngOnInit() {
    this.getStrategy();
  }

  private getStrategy() {
    this.strategy = this.strategyService.strategy;

    if (this.strategy) {
      this.strategy$ = of(this.strategy);
    }
    else {
      this.args = {
        strategyId: this.route.parent.params['_value'].id,
      };

      this.strategy$ = this.getStrategyById(this.args)
      .pipe(
        tap((strategy: Strategy)=>{
          console.log(strategy.getYouTubeLink())
        })
      );
    }
  }

  private getStrategyById(args: any): Observable<Strategy> {
    return this.dataService.getStrategyById(args);
  }

}
