import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Strategy } from '@app/models';
import * as Highcharts from 'highcharts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { DataService } from '@app/services/data.service';

@Component({
  selector: 'app-strategy-details-symbols',
  templateUrl: './strategy-details-symbols.component.html',
  styleUrls: ['./strategy-details-symbols.component.scss']
})
export class StrategyDetailsSymbolsComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  strategy: Strategy;
  chartOptions: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.route.parent.data
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: object) => {
        this.strategy = data['strategy'];
        this.dataService.getSymbolsChart(this.strategy.id).subscribe((strategySymbolsStat: object[]) => {
          this.chartOptions = {
            title: {
              text: ''
            },
            legend: {
              enabled: false
            },
            tooltip: {
              useHTML: true,
              headerFormat: '',
              pointFormatter: function() {
                return `<div class="arearange-tooltip-header">${Highcharts.numberFormat((this.y * 100), 2, '.')}%</div>`;
              }
            },
            series: [{
              type: 'pie',
              data: strategySymbolsStat
            }]
          };

          Highcharts.chart('symbolsChartContainer', this.chartOptions);
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
