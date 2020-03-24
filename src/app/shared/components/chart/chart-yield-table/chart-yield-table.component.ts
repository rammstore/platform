import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChartOptions, Strategy } from '@app/models';
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
  @Input() strategy: Strategy;
  chartOptions: any;
  @Input() containerID: string;

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {
    if (!this.strategy.chart) {
      this.strategy.chart = [{Yield: 0}, {Yield: 0}];
    }

    this.chartOptions = {
      chart: {
        zoomType: 'x',
        backgroundColor: 'transparent'
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
        gridLineWidth: 0,
        tickWidth: 0,
        lineWidth: 0
      },
      yAxis: {
        labels: {
          enabled: false
        },
        title: {
          enabled: false
        },
        gridLineWidth: 0
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
        data: this.getChartDataValues(),
        color: '#00a651',
        fillColor: 'rgba(0, 166, 81, .1)',
        negativeColor: '#ec151d',
        negativeFillColor: 'rgba(236, 21, 29, .1)'
      }]
    };

    let containerID: string = `yieldChartContainer${this.strategy.id}`;

    if (this.containerID) {
      containerID = this.containerID;
    }

    setTimeout(() => {
      Highcharts.chart(containerID, this.chartOptions);
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  getChartDataValues() {
    const data: object[] = [];
    this.strategy.chart.forEach((d, i) => data.push([i, d.Yield]));
    return data;
  }

  getWeeksAmount(chart: any): number {
    const days: number = Math.round((new Date(chart[chart.length - 1].DT).getTime() - new Date(chart[0].DT).getTime()) / (1000 * 3600 * 24));
    switch (true) {
      case (days <= 180):
        return Math.round((new Date(chart[chart.length - 1].DT).getTime() - new Date(chart[0].DT).getTime()) / (1000 * 3600 * 24 * 7));
      case (days > 180 && days <= 720):
        return Math.round((new Date(chart[chart.length - 1].DT).getTime() - new Date(chart[0].DT).getTime()) / (1000 * 3600 * 24 * 30));
      case(days > 720):
        return Math.round((new Date(chart[chart.length - 1].DT).getTime() - new Date(chart[0].DT).getTime()) / (1000 * 3600 * 24 * 365));
    }
  }

  getXAxisColor(chart: any): string {
    const days: number = Math.round((new Date(chart[chart.length - 1].DT).getTime() - new Date(chart[0].DT).getTime()) / (1000 * 3600 * 24));
    switch (true) {
      case (days <= 180):
        return '#e1dddd';
      case (days > 180 && days <= 720):
        return 'rgb(28, 117, 186, .5)';
      case(days > 720):
        return 'rgba(247, 163, 92, .5)';
    }
  }
}
