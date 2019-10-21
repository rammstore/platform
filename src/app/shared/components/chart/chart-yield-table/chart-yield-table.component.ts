import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Account, ChartOptions } from '@app/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import * as Highcharts from 'highcharts';
import { DataService } from '@app/services/data.service';

@Component({
  selector: 'app-chart-yield-table',
  templateUrl: './chart-yield-table.component.html',
  styleUrls: ['./chart-yield-table.component.scss']
})
export class ChartYieldTableComponent implements OnInit, OnDestroy {
  // https://blog.strongbrew.io/rxjs-best-practices-in-angular/#avoiding-memory-leaks
  // here we will unsubscribe from all subscriptions
  destroy$ = new Subject();

  // component data
  @Input() account: Account;
  chartOptions: any;
  @Input() containerID: string;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.getStrategyChart(new ChartOptions(this.account.strategy.id, 10, 'yield', 'small'))
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {

        this.chartOptions = {
          chart: {
            zoomType: 'x'
          },
          credits: {
            enabled: false
          },
          title: {
            text: ''
          },
          xAxis: {
            labels: {
              enabled: false
            },
            title: {
              enabled: false
            },
            gridLineWidth: 1,
            tickAmount: response.Chart.length / 5
          },
          yAxis: {
            labels: {
              enabled: false
            },
            title: {
              enabled: false
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            enabled: false
          },
          plotOptions: {
            series: {
              enableMouseTracking: false,
              marker: {
                enabled: false
              }
            }
          },
          type: 'area',
          series: [{
            type: 'area',
            data: this.getChartDataValues(response.Chart),
            color: '#00a651',
            fillColor: 'rgba(0, 166, 81, .1',
            negativeColor: '#ec151d',
            negativeFillColor: 'rgba(236, 21, 29, .1)'
          }]
        };

        let containerID: string = `yieldChartContainer${this.account.strategy.id}`;

        if (this.containerID) {
          containerID = this.containerID;
        }

        Highcharts.chart(containerID, this.chartOptions);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  getChartDataValues(chartData: any[]) {
    const data: object[] = [];
    chartData.forEach(d => data.push([new Date(d.DT).getTime(), d.Yield]));
    return data;
  }
}
