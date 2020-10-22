import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Strategy } from '@app/models';
import * as Highcharts from 'highcharts';
import { Observable, pipe, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';
import { StrategyService } from "@app/services/strategy.service";

@Component({
  selector: 'app-strategy-details-symbols',
  templateUrl: './strategy-details-symbols.component.html',
  styleUrls: ['./strategy-details-symbols.component.scss']
})
export class StrategyDetailsSymbolsComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();
  strategy$: Observable<Strategy>;
  // component data
  strategy: Strategy;
  chartOptions: any;
  args: any;
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private strategyService: StrategyService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {

    if (!this.strategyService.strategy) {
      this.id = parseInt(this.route.parent.params['_value'].id);
      if (this.id) {
        this.args = {
          strategyId: this.id
        };

        this.strategy$ = this.getStrategyById(this.args)
          .pipe(
            tap((strategy) => {
              this.getCharts(strategy.id);
            })
          );
      }
    } else {
      this.strategy$ = this.strategyService.strategy$
        .pipe(
          tap((strategy) => {
            this.getCharts(strategy.id);
          })
        );
    }
  }

  getCharts(id: number) {
    this.dataService.getSymbolsChart(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((strategySymbolsStat: object[]) => {
        if (strategySymbolsStat.length) {
          this.chartOptions = {
            credits: {
              enabled: false
            },
            title: {
              text: ''
            },
            legend: {
              enabled: false
            },
            tooltip: {
              useHTML: true,
              headerFormat: '',
              pointFormatter: function () {
                return `<div class="arearange-tooltip-header">${Highcharts.numberFormat((this.y * 100), 2, '.')}%</div>`;
              }
            },
            series: [{
              type: 'pie',
              data: strategySymbolsStat
            }]
          };

          Highcharts.chart('symbolsChartContainer', this.chartOptions);
        }
      });
  }

  private getStrategyById(args): Observable<any> {
    return this.dataService.getStrategyById(args)
      .pipe(
        take(1),
        tap((strategy) => {
          this.strategy = strategy;
        })
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
