import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartOptions, Strategy } from '@app/models';
import { StrategyService } from '@app/services/strategy.service';
import * as Highcharts from 'highcharts';
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'app-strategy-details-profitability',
  templateUrl: './strategy-details-profitability.component.html',
  styleUrls: ['./strategy-details-profitability.component.scss']
})
export class StrategyDetailsProfitabilityComponent implements OnInit {
  strategy: Strategy;
  chartOptions: any;

  constructor(
    private route: ActivatedRoute,
    private strategyService: StrategyService,
    private percentPipe: PercentPipe
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: object) => {
      this.strategy = data['strategy'];
      this.strategyService.getChart(new ChartOptions(this.strategy.id)).subscribe(response => {

        this.chartOptions = {
          chart: {
            zoomType: 'x'
          },
          title: {
            text: ''
          },
          xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
              day: '%e<br>%b',
              month: '%y<br>%b'
            }
          },
          yAxis: {
            labels: {
              format: '{value}%'
            },
            title: {
              text: ''
            }
          },
          legend: {
            enabled: false
          },
          tooltip: {
            useHTML: true,
            formatter: function() {
              console.log(this);
              return `<div class="arearange-tooltip-header ${this.y < 0 ? 'negative' : ''} ${this.y > 0 ? 'positive' : ''}">${Highcharts.numberFormat((this.y), 2, '.')}%</div><div>${Highcharts.dateFormat('%A, %e %b %Y г., %H:%M', this.x)}</div>`;
            }
          },
          type: 'arearange',
          series: [{
            type: 'area',
            data: this.getChartDataValues(response.Chart),
            zones: [{
              value: 0,
              color: '#ec151d',
              fillColor: 'rgba(236, 21, 29, .1)'
            }, {
              color: '#00a651',
              fillColor: 'rgba(0, 166, 81, .1'
            }]
          }]
        };

        Highcharts.chart('yieldChartContainer', this.chartOptions);
      });
    });
  }

  getChartDataValues(chartData: any[]) {
    const data: object[] = [];
    chartData.forEach(d => data.push([new Date(d.DT).getTime(), d.Yield]));
    return data;
  }

}
